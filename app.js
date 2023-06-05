const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const app = express();
const admin = require('firebase-admin');
const tf = require('@tensorflow/tfjs-node');
require('@tensorflow/tfjs-node');

// Inisialisasi konfigurasi proyek Firebase
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://safebitecapstone-d3dc2.firebaseio.com'
});

// Dapatkan referensi koleksi Firestore yang ingin digunakan
const firestore = admin.firestore();
const datasetRef = firestore.collection('datasets');
const usersRef = firestore.collection('users');

// Tambahkan middleware body-parser untuk membaca data JSON dari request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Memuat model saat aplikasi dimulai
const loadModel = async () => {
  model = await tf.loadLayersModel('./model.json');
  return model;
};

// PREFERENSI ALLERGEN
// Deklarasikan variabel global untuk menyimpan preferensi allergen
let preferensiAllergen = [];

// Endpoint untuk mengambil data preferensi allergen
app.get('/api/preferensi/allergen', (req, res) => {
  // Mengembalikan preferensi allergen yang telah disimpan
  res.send(JSON.stringify(preferensiAllergen));
});

// Endpoint untuk menyimpan data preferensi allergen
app.post('/api/preferensi/allergen', (req, res) => {
  // Mendapatkan data preferensi allergen dari request body
  const dataPreferensiAllergen = req.body.preferensiAllergen;

  // Menyimpan data preferensi allergen ke variabel global
  preferensiAllergen = dataPreferensiAllergen;

  // Mengirim response berhasil
  res.send('Preferensi allergen berhasil disimpan');
});

// PREFERENSI HALAL/NETRAL
// Deklarasikan variabel global untuk menyimpan preferensi halal
let preferensiHalal = '';

// Mengambil data preferensi halal yang dipilih oleh user
app.get('/api/preferensi/halal', (req, res) => {
  // Mengembalikan preferensi halal yang telah disimpan
  res.send(JSON.stringify(preferensiHalal));
});

// Menyimpan data preferensi halal yang dipilih oleh user
app.post('/api/preferensi/halal', (req, res) => {
  // Mendapatkan data preferensi halal dari request body
  const dataPreferensiHalal = req.body.preferensiHalal;

  // Menyimpan data preferensi halal ke variabel global
  preferensiHalal = dataPreferensiHalal;

  // Mengirim response berhasil
  res.send('Preferensi halal berhasil disimpan');
});

// AMBIL TEXT HASIL OCR
// Endpoint untuk mengambil teks dari hasil OCR ML Kit
app.post('/api/ocr', (req, res) => {
  // Implementasikan logika untuk mengambil teks dari hasil OCR ML Kit
  const ocrText = req.body.text;
  // Mengirimkan teks hasil scan ke endpoint /api/deteksi
  async function fetchDeteksi() {
    try {
      const response = await fetch('http://localhost:3000/api/deteksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ocrText })
      });
      const data = await response.json();
      res.send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan saat meminta deteksi.');
    }
  }
  fetchDeteksi();
});

// DETEKSI INGREDIENTS
// Endpoint untuk mendeteksi informasi pada teks hasil OCR
app.post('/api/deteksi', async (req, res) => {
  // Dapatkan teks dari request body
  const text = req.body.text;

  // Memuat model
  const model = await loadModel();

  // Implementasikan logika deteksi informasi pada teks menggunakan model machine learning

  // Pra-pemrosesan Input
  const Ingredients = text; // Sesuaikan dengan properti yang sesuai dengan data input
  const potentialAllergies = 0; // Sesuaikan dengan properti yang sesuai dengan data input
  const potentialDiseases = 0; // Sesuaikan dengan properti yang sesuai dengan data input
  const halalHaram = preferensiHalal === 'halal' ? 1 : 0; // Sesuaikan dengan properti yang sesuai dengan data input

  const input = [
    parseFloat(Ingredients),
    parseFloat(potentialAllergies),
    parseFloat(potentialDiseases),
    parseFloat(halalHaram),
  ];

  // Prediksi dengan Model Machine Learning
  const prediction = model.predict(tf.tensor([input]));
  const hasilDeteksi = prediction.toString();

  // Menyimpan hasil deteksi ke Firestore
  datasetRef.add({ text, hasilDeteksi })
    .then(() => {
      res.send(hasilDeteksi);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Terjadi kesalahan saat menyimpan hasil deteksi.');
    });
});

// HASIL DETEKSI
// Deklarasikan variabel global untuk menyimpan hasil deteksi
let hasilDeteksi = '';

// Mengambil hasil proses deteksi
app.get('/api/hasil', (req, res) => {
  // Mengembalikan hasil deteksi yang telah disimpan
  res.send(JSON.stringify(hasilDeteksi));
});

// Menyimpan hasil proses deteksi
app.post('/api/hasil', (req, res) => {
  // Mendapatkan hasil deteksi dari request body
  const dataHasilDeteksi = req.body.hasilDeteksi;

  // Menyimpan hasil deteksi ke variabel global
  hasilDeteksi = dataHasilDeteksi;

  // Mengirim response berhasil
  res.send('Hasil deteksi berhasil disimpan');
});

// Menjalankan server pada port
const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
