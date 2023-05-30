const express = require('express');
const { db } = require('./firebase');

const app = express();
app.use(express.json());

// Endpoint untuk registrasi pengguna
app.post('/register', async (req, res) => {
  try {
    const { nama, umur, number_of_allergen, list_of_allergen, halal } = req.body;

    // Lakukan validasi data pengguna
    if (!nama || !umur || !number_of_allergen || !list_of_allergen || !halal) {
      return res.status(400).json({ error: 'Data pengguna tidak lengkap' });
    }

    // Simpan data pengguna ke Firestore
    const userRef = db.collection('users').doc();
    await userRef.set({
      nama,
      umur,
      number_of_allergen,
      list_of_allergen,
      halal
    });

    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (error) {
    console.error('Error saat registrasi pengguna:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat melakukan registrasi' });
  }
});

// Endpoint untuk fitur deteksi gambar
app.post('/detect', async (req, res) => {
  try {
    const { image } = req.body;

    // Lakukan deteksi gambar menggunakan model machine learning

    // Ambil data produk dari Firestore berdasarkan hasil deteksi

    res.status(200).json({ productData: /* data produk dari Firestore */ });
  } catch (error) {
    console.error('Error saat mendeteksi gambar:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mendeteksi gambar' });
  }
});

// Endpoint untuk fitur histori
app.get('/history', async (req, res) => {
  try {
    // Ambil histori pengguna dari Firestore

    res.status(200).json({ history: /* data histori dari Firestore */ });
  } catch (error) {
    console.error('Error saat mengambil histori:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil histori' });
  }
});

// Jalankan server
const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
