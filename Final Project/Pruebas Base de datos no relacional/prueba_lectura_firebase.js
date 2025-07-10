const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://short-video-platform-a60a7-default-rtdb.firebaseio.com/"
});

const db = admin.database();

async function readViews(videoId) {
    console.time('readViews');
    const snapshot = await db.ref(`Views/${videoId}/view_events`).once('value');
    console.timeEnd('readViews');
    const data = snapshot.val();
    const count = data ? Object.keys(data).length : 0;
    console.log(`✅ Se leyeron ${count} vistas en ${videoId}`);
}

async function run() {
    console.log("Iniciando prueba de lectura de vistas...");
    await readViews('video_001');
    process.exit(0);
}

run().catch(err => {
    console.error("Error en la prueba:", err);
    process.exit(1);
});
