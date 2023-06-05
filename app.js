const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const admin = require('firebase-admin');

// Inisialisasi konfigurasi proyek Firebase
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://safebitecapstone-d3dc2.firebaseio.com' 
});

// Dapatkan referensi koleksi Firestore yang ingin digunakan
const firestore = admin.firestore();
const datasetRef = firestore.collection('datasets');

// Tambahkan middleware body-parser untuk membaca data JSON dari request body
app.use(bodyParser.json());

// PREFERENSI ALLERGEN
// Deklarasikan variabel global untuk menyimpan preferensi allergen
let preferensiAllergen = [];

// Endpoint untuk mengambil data preferensi allergen
app.get('/api/preferensi/allergen', (req, res) => {
  // Mengembalikan preferensi allergen yang telah disimpan
  res.json(preferensiAllergen);
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
  res.json(preferensiHalal);
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
  // yang dikirim dari Android Studio dan mengembalikan response
  const ocrText = req.body.text;
  res.json(ocrText);
});

// Endpoint untuk melakukan proses deteksi dengan model machine learning
app.post('/api/deteksi', (req, res) => {
  // Implementasikan logika untuk proses deteksi menggunakan model machine learning
  // dengan dataset dari Firestore yang dikirim dari client dan mengembalikan response
  const dataset = req.body.dataset;
  // Proses deteksi menggunakan dataset
  const hasilDeteksi = 'Hasil deteksi';
  res.json(hasilDeteksi);
});

// HASIL DETEKSI
// Deklarasikan variabel global untuk menyimpan hasil deteksi
let hasilDeteksi = '';

// Mengambil hasil proses deteksi
app.get('/api/hasil', (req, res) => {
  // Mengembalikan hasil deteksi yang telah disimpan
  res.json(hasilDeteksi);
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
