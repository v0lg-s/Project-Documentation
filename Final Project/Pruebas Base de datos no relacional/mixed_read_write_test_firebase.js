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
        tasks.push(db.ref(`Views/${videoId}/view_events`).orderByKey().limitToLast(100).once('value'));
    }
    await Promise.all(tasks);
    console.timeEnd('concurrentReads');
    console.log(`✅ ${count} concurrent reads completed.`);
}

async function concurrentWrites(videoId, count) {
    console.time('concurrentWrites');
    const tasks = [];
    for (let i = 0; i < count; i++) {
        const viewId = `mixed_view_${Date.now()}_${i}`;
        const data = {
            user_id: `user_${Math.floor(Math.random() * 10000)}`,
            timestamp: new Date().toISOString(),
            duration: Math.floor(Math.random() * 60) + 5
        };
        tasks.push(db.ref(`Views/${videoId}/view_events/${viewId}`).set(data));
    }
    await Promise.all(tasks);
    console.timeEnd('concurrentWrites');
    console.log(`✅ ${count} concurrent writes completed.`);
}

async function runMixedTest() {
    console.log("🚀 Starting Mixed Read + Write Test...");

    console.time('totalMixedTest');
    await Promise.all([
        concurrentReads('video_001', 500),  
        concurrentWrites('video_001', 500)  
    ]);
    console.timeEnd('totalMixedTest');

    console.log("🎉 Mixed Read + Write Test completed successfully.");
    process.exit(0);
}

runMixedTest().catch(err => {
    console.error("❌ Error during Mixed Read + Write Test:", err);
    process.exit(1);
});
