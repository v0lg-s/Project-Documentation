// firebase_tests_node.js
// Script completo de pruebas de Firebase Realtime Database en Node.js para tu short video platform

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Descarga tu JSON de credenciales y colócalo en el mismo directorio

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://short-video-platform-a60a7-default-rtdb.firebaseio.com/" // Reemplaza con tu URL de Realtime Database
});

const db = admin.database();

// Escritura de un comentario
async function addComment(videoId, commentId, commentData) {
    console.time('addComment');
    await db.ref(`Comments/${videoId}/comments/${commentId}`).set(commentData);
    console.timeEnd('addComment');
    console.log(`Comentario ${commentId} agregado a ${videoId}`);
}

// Lectura de comentarios de un video
async function readComments(videoId) {
    console.time('readComments');
    const snapshot = await db.ref(`Comments/${videoId}/comments`).once('value');
    console.timeEnd('readComments');
    console.log(`Comentarios de ${videoId}:`, snapshot.val());
}

// Inserción de una vista en un video
async function addView(videoId, viewId, viewData) {
    console.time('addView');
    await db.ref(`Views/${videoId}/view_events/${viewId}`).set(viewData);
    console.timeEnd('addView');
    console.log(`Vista ${viewId} agregada a ${videoId}`);
}

// Lectura de vistas de un video
async function readViews(videoId) {
    console.time('readViews');
    const snapshot = await db.ref(`Views/${videoId}/view_events`).once('value');
    console.timeEnd('readViews');
    console.log(`Vistas de ${videoId}: total ${snapshot.numChildren()} vistas`);
}

// Prueba de concurrencia con lecturas paralelas
async function concurrentReads(videoId, count) {
    console.time('concurrentReads');
    const tasks = [];
    for (let i = 0; i < count; i++) {
        tasks.push(db.ref(`Views/${videoId}/view_events`).once('value'));
    }
    await Promise.all(tasks);
    console.timeEnd('concurrentReads');
    console.log(`${count} lecturas concurrentes realizadas en Views/${videoId}/view_events`);
}

// Ejecución ordenada de las pruebas
async function runTests() {
    console.log('Iniciando pruebas Firebase Realtime Database...');

    // Prueba de escritura
    await addComment('video_001', 'comment_003', {
        user_id: 'user_005',
        text: 'Comentario de prueba automatizado',
        timestamp: new Date().toISOString()
    });

    // Prueba de lectura
    await readComments('video_001');

    // Prueba de inserción de vista
    await addView('video_001', 'view_004', {
        user_id: 'user_006',
        timestamp: new Date().toISOString(),
        duration: 35
    });

    // Prueba de lectura de vistas
    await readViews('video_001');

    // Prueba de concurrencia (20 lecturas en paralelo)
    await concurrentReads('video_001', 20);

    console.log('Pruebas completadas.');
    process.exit(0);
}

runTests().catch((error) => {
    console.error('Error en las pruebas:', error);
    process.exit(1);
});
