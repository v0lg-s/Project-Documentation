const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://short-video-platform-a60a7-default-rtdb.firebaseio.com/"
});

const db = admin.database();

// Controlled batch write for scalability
async function batchWriteViews(videoId, totalWrites, batchSize) {
    console.log(`🚀 Starting batch write: ${totalWrites} records in batches of ${batchSize}`);
    let written = 0;
    console.time('totalBatchWrite');

    while (written < totalWrites) {
        const batchTasks = [];
        const currentBatchSize = Math.min(batchSize, totalWrites - written);

        for (let i = 0; i < currentBatchSize; i++) {
            const viewId = `testview_${Date.now()}_${written + i}`;
            const viewData = {
                user_id: `user_${Math.floor(Math.random() * 1000)}`,
                timestamp: new Date().toISOString(),
                duration: Math.floor(Math.random() * 60) + 5
            };
            const ref = db.ref(`Views/${videoId}/view_events/${viewId}`);
            batchTasks.push(ref.set(viewData));
        }

        console.time(`batch_${written / batchSize + 1}`);
        await Promise.all(batchTasks);
        console.timeEnd(`batch_${written / batchSize + 1}`);
        written += currentBatchSize;
        console.log(`✅ Batch ${written / batchSize} completed (${written}/${totalWrites})`);
    }

    console.timeEnd('totalBatchWrite');
    console.log(`🎉 Completed ${totalWrites} concurrent writes.`);
    process.exit(0);
}

batchWriteViews('video_001', 5000, 100) // videoId, totalWrites, batchSize
    .catch(err => {
        console.error("❌ Error during concurrent writes test:", err);
        process.exit(1);
    });
