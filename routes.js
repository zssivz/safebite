const express = require('express');
const router = express.Router();
const db = require('./firebase');
const axios = require('axios');

// Mengambil semua data dari koleksi "datasets"
router.get('/datasets', async (req, res) => {
  try {
    const snapshot = await db.collection('datasets').get();
    const datasets = snapshot.docs.map((doc) => doc.data());
    res.status(200).json({ datasets });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data dari koleksi "datasets"' });
  }
});

// Menyimpan data pengguna ke koleksi "users"
router.post('/users', async (req, res) => {
  try {
    const userData = req.body;
    const newUserRef = await db.collection('users').add(userData);
    res.status(201).json({ id: newUserRef.id, message: 'Data pengguna berhasil disimpan' });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan saat menyimpan data pengguna' });
  }
});

// Pendaftaran pengguna
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Implementasikan logika pendaftaran pengguna di sini
    // Gunakan db untuk berinteraksi dengan Cloud Firestore
    const usersRef = db.collection('users');
    const userData = {
      email: email,
      password: password
    };

    const newUserRef = await usersRef.add(userData); // Menyimpan data pengguna ke dalam koleksi "users"
    const newUserSnapshot = await newUserRef.get(); // Mendapatkan snapshot dari dokumen baru
    
    const newUser = {
      id: newUserSnapshot.id,
      ...newUserSnapshot.data()
    };
    
    res.status(200).json({ message: 'Pendaftaran berhasil', user: newUser });
  } catch (error) {
    console.error('Terjadi kesalahan saat mendaftar pengguna:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mendaftar pengguna' });
  }
});

// Login pengguna
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Mengecek apakah email dan password sesuai dengan data pengguna yang ada di Cloud Firestore
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.where('email', '==', email).where('password', '==', password).get();

    if (querySnapshot.empty) {
    // Email atau password tidak valid
    res.status(401).json({ error: 'Email atau password tidak valid' });
    } else {
    // Login berhasil
    const user = querySnapshot.docs[0].data();
    res.status(200).json({ message: 'Login berhasil', user });
    }
    
    res.status(200).json({ message: 'Login berhasil' });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan saat login' });
  }
});

// Mengatur preferensi alergi pengguna
router.post('/preference/allergies', async (req, res) => {
  try {
    const { userId, allergies } = req.body;
    // Mencari dokumen pengguna berdasarkan ID
    const userRef = db.collection('users').doc(userId);

    // Memperbarui dokumen pengguna dengan preferensi alergi baru
    await userRef.update({ allergies });

    res.status(200).json({ message: 'Preferensi alergi berhasil diatur' });
    } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan saat mengatur preferensi alergi' });
    }
});

// Mengatur preferensi halal pengguna
router.post('/preference/halal', async (req, res) => {
  try {
    const { userId, halalPreference } = req.body;
    
    // Mencari dokumen pengguna berdasarkan ID
    const userRef = db.collection('users').doc(userId);
    // Memperbarui dokumen pengguna dengan preferensi halal baru
    await userRef.update({ halalPreference });
    
    res.status(200).json({ message: 'Preferensi halal berhasil diatur' });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan saat mengatur preferensi halal' });
  }
});

// Pemindaian OCR
router.post('/scan', async (req, res) => {
    try {
      const { userId, image } = req.body;
      
      // Implementasikan logika pemindaian OCR menggunakan ML Kit di sini
      
      // Mengambil teks hasil pemindaian OCR
      const scannedText = 'Teks hasil pemindaian OCR';
      
      // Menjalankan pemanggilan Cloud Run
      try {
        const cloudRunUrl = 'https://your-cloud-run-url'; // Ganti dengan URL Cloud Run yang sesuai
        const response = await axios.post(cloudRunUrl, { text: scannedText });
        const prediction = response.data.prediction; // Hasil prediksi dari model machine learning
        
        // Mengirimkan hasil prediksi ke aplikasi Android
        // Implementasikan logika pengiriman hasil prediksi ke aplikasi Android di sini
        
        res.status(200).json({ message: 'Pemanggilan model machine learning berhasil' });
      } catch (error) {
        console.error('Terjadi kesalahan saat memanggil model machine learning:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat memanggil model machine learning' });
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat melakukan pemindaian OCR:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat melakukan pemindaian OCR' });
    }
  });  

// Mengambil histori pengguna
router.get('/history/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Mengambil histori pengguna dari Cloud Firestore
    const historyRef = db.collection('history').where('userId', '==', userId);
    const snapshot = await historyRef.get();

    // Menyimpan hasil histori pengguna dalam array
    const history = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      history.push({
        id: doc.id,
        userId: data.userId,
        scanResult: data.scanResult,
        prediction: data.prediction,
        timestamp: data.timestamp,
      });
    });

    // Mengirimkan data histori pengguna ke aplikasi Android
    res.status(200).json({ history });
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil histori pengguna:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil histori pengguna' });
  }
});

module.exports = router;
