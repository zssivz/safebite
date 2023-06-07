const csv = require('csv-parser');
const fs = require('fs');
const admin = require('firebase-admin');

// Inisialisasi Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();
const datasetRef = firestore.collection('datasets');

const dataset = [];

fs.createReadStream('./dataset.csv')
  .pipe(csv())
  .on('data', (row) => {
    dataset.push(row);
  })
  .on('end', () => {
    console.log('Dataset berhasil dibaca:', dataset);

    const batchSize = 500; // Jumlah maksimal tulisan per batch
    const totalBatches = Math.ceil(dataset.length / batchSize);

    let currentBatch = 0;

    function commitNextBatch() {
      const start = currentBatch * batchSize;
      const end = Math.min((currentBatch + 1) * batchSize, dataset.length);
      const batch = firestore.batch();

      for (let i = start; i < end; i++) {
        const data = dataset[i];
        const docRef = datasetRef.doc();
        batch.set(docRef, data);
      }

      batch.commit()
        .then(() => {
          console.log(`Batch ${currentBatch + 1}/${totalBatches} berhasil dimasukkan ke dalam Firestore`);

          currentBatch++;

          if (currentBatch < totalBatches) {
            commitNextBatch(); // Melanjutkan ke batch berikutnya
          } else {
            console.log('Semua batch berhasil dimasukkan ke dalam Firestore');
          }
        })
        .catch((error) => {
          console.error('Terjadi kesalahan saat memasukkan batch:', error);
        });
    }

    commitNextBatch();
  });
