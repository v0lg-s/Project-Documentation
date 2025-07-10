// precargar_datos_firebase.js

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://short-video-platform-a60a7-default-rtdb.firebaseio.com/"
});

const db = admin.database();

async function precargarVistas(videoId, cantidad) {
    console.time("precargarVistas");
    const updates = {};
    for (let i = 0; i < cantidad; i++) {
        const viewId = `view_${String(i).padStart(5, '0')}`;
        updates[`Views/${videoId}/view_events/${viewId}`] = {
            user_id: `user_${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString(),
            duration: Math.floor(Math.random() * 60) + 5 // 5 a 65 segundos
        };
    }
    await db.ref().update(updates);
    console.timeEnd("precargarVistas");
    console.log(`${cantidad} vistas insertadas en ${videoId}`);
}

async function precargarLikes(videoId, cantidad) {
    console.time("precargarLikes");
    const updates = {};
    for (let i = 0; i < cantidad; i++) {
        const reactionId = `reaction_${String(i).padStart(5, '0')}`;
        updates[`Reactions/${videoId}/reactions/${reactionId}`] = {
            user_id: `user_${Math.floor(Math.random() * 1000)}`,
            type: "like",
            timestamp: new Date().toISOString()
        };
    }
    updates[`Reactions/${videoId}/likes_count`] = cantidad;
    await db.ref().update(updates);
    console.timeEnd("precargarLikes");
    console.log(`${cantidad} likes insertados en ${videoId}`);
}

async function run() {
    const videoId = "video_001";
    const cantidad = 5000; // o 10000 si deseas más carga

    await precargarVistas(videoId, cantidad);
    await precargarLikes(videoId, cantidad);

    console.log("Precarga completada.");
    process.exit(0);
}

run().catch(err => {
    console.error("Error al precargar datos:", err);
    process.exit(1);
});
