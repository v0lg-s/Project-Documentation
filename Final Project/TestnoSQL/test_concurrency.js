

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://short-video-platform-a60a7-default-rtdb.firebaseio.com/"

});

const db = admin.database();

async function concurrentReads(videoId, count) {
    console.time('concurrentReads');
    const tasks = [];
    for (let i = 0; i < count; i++) {
        tasks.push(db.ref(`Views/${videoId}/view_events`).once('value'));
    }
    await Promise.all(tasks);
    console.timeEnd('concurrentReads');
    console.log(`✅ ${count} concurrent reads executed on ${videoId}`);
}

async function run() {
    console.log("Starting Firebase concurrent read test...");
    await concurrentReads('video_001', 100); // You can change to 10, 50, or 100 based on your test needs
    process.exit(0);
}

run().catch(err => {
    console.error("Error during the test:", err);
    process.exit(1);
});
