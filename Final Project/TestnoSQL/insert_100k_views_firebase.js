const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://short-video-platform-a60a7-default-rtdb.firebaseio.com/" 
});

const db = admin.database();

async function insertViews(videoId, totalViews, batchSize) {
    console.log(`🚀 Starting insertion of ${totalViews} views in batches of ${batchSize}...`);
    let inserted = 0;
    console.time('totalInsertion');

    while (inserted < totalViews) {
        const tasks = [];
        const currentBatch = Math.min(batchSize, totalViews - inserted);

        for (let i = 0; i < currentBatch; i++) {
            const viewId = `view_${Date.now()}_${inserted + i}`;
            const viewData = {
                user_id: `user_${Math.floor(Math.random() * 10000)}`,
                timestamp: new Date().toISOString(),
                duration: Math.floor(Math.random() * 60) + 5
            };
            const ref = db.ref(`Views/${videoId}/view_events/${viewId}`);
            tasks.push(ref.set(viewData));
        }

        console.time(`batch_${Math.floor(inserted / batchSize) + 1}`);
        await Promise.all(tasks);
        console.timeEnd(`batch_${Math.floor(inserted / batchSize) + 1}`);
        inserted += currentBatch;
        console.log(`✅ Inserted ${inserted}/${totalViews} views`);
    }

    console.timeEnd('totalInsertion');
    console.log(`🎉 Completed insertion of ${totalViews} views successfully.`);
    process.exit(0);
}

// Insert 100,000 views in batches of 500
insertViews('video_002', 100000, 500)
    .catch(err => {
        console.error("❌ Error inserting views:", err);
        process.exit(1);
    });
