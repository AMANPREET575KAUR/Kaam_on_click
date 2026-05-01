const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: "https://kaam-on-click-default-rtdb.firebaseio.com"
  });
}

// Write notification to Firebase when new job is posted
async function notifyProviders(job) {
  try {
    const db = admin.database();
    const notifRef = db.ref(`notifications/${job.state}/${job.id}`);
    await notifRef.set({
      jobId: job.id,
      serviceType: job.serviceType,
      city: job.city,
      state: job.state,
      budgetMin: job.budgetMin,
      budgetMax: job.budgetMax,
      postedAt: new Date().toISOString(),
      read: false
    });
    console.log(`✅ Firebase notified for job ${job.id} in ${job.state}`);
  } catch (err) {
    console.error("❌ Firebase notification error:", err.message);
  }
}

module.exports = { notifyProviders };