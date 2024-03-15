const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.clearFirestoreCollectionDaily = functions.pubsub.schedule('0 0 * * *')
  .timeZone('Etc/UTC') // Specify the timezone, or adjust it to your needs
  .onRun(async (context) => {
    const firestore = admin.firestore();
    const collectionRef = firestore.collection('balance'); // Replace with your collection name
    const batch = firestore.batch();

    // Retrieve all documents from the collection
    const snapshot = await collectionRef.get();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit the batch
    await batch.commit();
    console.log('Collection cleared');
  });
