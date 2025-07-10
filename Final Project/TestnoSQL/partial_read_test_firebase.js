const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://short-video-platform-a60a7-default-rtdb.firebaseio.com/"
});

const db = admin.database();

async function readLastNViews(videoId, limit) {
    console.time(`readLast_${limit}`);
    const snapshot = await db.ref(`Views/${videoId}/view_events`)
        .orderByKey()
        .limitToLast(limit)
        .once('value');
    console.timeEnd(`readLast_${limit}`);
    const data = snapshot.val();
    const count = data ? Object.keys(data).length : 0;
    console.log(`✅ Retrieved ${count} views with limit ${limit} from ${videoId}`);
}

async function run() {
    console.log("🚀 Starting Partial Read (Pagination) Test...");

    await readLastNViews('video_001', 1000);
    await readLastNViews('video_001', 10000);
    await readLastNViews('video_001', 100000);

    process.exit(0);
}

run().catch(err => {
    console.error("❌ Error during partial read test:", err);
    process.exit(1);
});
