const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://short-video-platform-a60a7-default-rtdb.firebaseio.com/" // Replace with your URL
});

const db = admin.database();

async function readViewsInChunks(videoId, chunkSize) {
    console.log(`🚀 Starting to read views in chunks of ${chunkSize} for ${videoId}...`);

    let lastKey = null;
    let totalRead = 0;
    let chunkCount = 0;

    while (true) {
        const ref = db.ref(`Views/${videoId}/view_events`).orderByKey().limitToFirst(chunkSize + 1);
        const query = lastKey ? ref.startAt(lastKey) : ref;

        console.time(`Chunk_${chunkCount + 1}`);
        const snapshot = await query.once('value');
        console.timeEnd(`Chunk_${chunkCount + 1}`);

        const data = snapshot.val();
        if (!data) break;

        const keys = Object.keys(data);

        // If continuing, remove the first key if it's a repeat
        if (lastKey) keys.shift();

        if (keys.length === 0) break;

        lastKey = keys[keys.length - 1];
        totalRead += keys.length;
        chunkCount += 1;

        console.log(`✅ Chunk ${chunkCount}: Retrieved ${keys.length} views, Total so far: ${totalRead}`);
        if (keys.length < chunkSize) break; // Last chunk
    }

    console.log(`🎉 Completed reading ${totalRead} views in ${chunkCount} chunks of ${chunkSize}.`);
    process.exit(0);
}

// Run the reading function with 5,000 chunks
readViewsInChunks('video_001', 5000)
    .catch(err => {
        console.error("❌ Error reading views in chunks:", err);
        process.exit(1);
    });
