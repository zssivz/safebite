const admin = require('firebase-admin');
const serviceAccount = require('./google-services (12).json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Dapatkan referensi koleksi Firestore yang ingin digunakan
const firestore = admin.firestore();
const datasetRef = firestore.collection('datasets');
const usersRef = firestore.collection('users');

module.exports = db;
