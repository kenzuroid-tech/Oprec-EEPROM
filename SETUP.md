# 🤖 PANDUAN SETUP — Polinema Robotics Open Recruitment Website

## Prasyarat
- Akun Google (untuk Firebase)
- Akun Google AI Studio (untuk Gemini API)
- Browser modern

---

## 1. Setup Firebase

### 1.1 Buat Firebase Project
1. Buka [https://console.firebase.google.com](https://console.firebase.google.com)
2. Klik **"Add project"**
3. Nama project: `oprec-polinema-robotics` (atau sesuai keinginan)
4. Aktifkan Google Analytics (opsional)
5. Klik **"Create project"**

### 1.2 Aktifkan Firestore Database
1. Di sidebar kiri, klik **"Firestore Database"**
2. Klik **"Create database"**
3. Pilih **"Start in test mode"** (untuk development)
4. Pilih lokasi server: `asia-southeast2 (Jakarta)` (paling dekat)
5. Klik **"Enable"**

### 1.3 Aktifkan Firebase Authentication
1. Di sidebar kiri, klik **"Authentication"**
2. Klik **"Get started"**
3. Di tab **"Sign-in method"**, aktifkan **"Email/Password"**
4. Klik **"Save"**

### 1.4 Dapatkan Firebase Config
1. Di Firebase Console, klik ⚙️ (Settings) > **"Project settings"**
2. Scroll ke bawah ke bagian **"Your apps"**
3. Klik ikon web **`</>`**
4. Daftarkan app dengan nama apapun
5. Salin config yang muncul, contoh:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXX...",
  authDomain: "oprec-pr.firebaseapp.com",
  projectId: "oprec-pr",
  storageBucket: "oprec-pr.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

### 1.5 Update Firebase Config di Website
Buka file: `js/firebase-config.js`

Ganti bagian ini:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",          // ← ganti
  authDomain: "YOUR_PROJECT.firebaseapp.com",  // ← ganti
  projectId: "YOUR_PROJECT_ID",   // ← ganti
  storageBucket: "YOUR_PROJECT.appspot.com",   // ← ganti
  messagingSenderId: "YOUR_SENDER_ID",         // ← ganti
  appId: "YOUR_APP_ID"            // ← ganti
};
```

---

## 2. Setup Gemini API

### 2.1 Dapatkan API Key
1. Buka [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Klik **"Create API Key"**
3. Pilih project Firebase yang tadi dibuat (atau buat baru)
4. Salin API key yang muncul

### 2.2 Update AI Config
Buka file: `js/ai.js`

Ganti baris ini:
```javascript
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";  // ← ganti dengan API key kamu
```

> ⚠️ **Penting**: Untuk production, jangan expose API key di client-side. Gunakan Firebase Functions sebagai proxy.

---

## 3. Setup Admin Pertama

### 3.1 Buat Akun Admin Pertama Manual
1. Di Firebase Console > **Authentication** > **Users**
2. Klik **"Add user"**
3. Masukkan email dan password admin utama
4. Salin UID yang muncul

### 3.2 Tambahkan Data Admin ke Firestore
1. Di Firebase Console > **Firestore Database**
2. Klik **"Start collection"** > Nama: `admin_users`
3. Document ID: isi dengan UID dari step sebelumnya
4. Tambahkan fields:
   - `nama` (string): nama admin
   - `email` (string): email admin
   - `divisi` (string): `Super Admin`
   - `role` (string): `admin`

### 3.3 Login ke Admin Panel
1. Buka `admin/login.html`
2. Login dengan email & password yang tadi dibuat
3. Setelah login, kamu bisa tambah akun anggota lain via menu **"Akun Anggota"**

---

## 4. Firestore Security Rules

Setelah development selesai, perbarui security rules di Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Peserta bisa baca/tulis data sendiri
    match /pendaftar/{docId} {
      allow create: if true;
      allow read: if true;
      allow update, delete: if request.auth != null;
    }
    
    // Soal tes hanya admin yang bisa ubah
    match /soal_tes/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Hasil tes bisa ditulis siapa saja, dibaca semua
    match /hasil_tes/{docId} {
      allow read, write: if true;
    }
    
    // Wawancara hanya admin
    match /wawancara/{docId} {
      allow read, write: if request.auth != null;
    }
    
    // Pertanyaan wawancara hanya admin
    match /pertanyaan_wawancara/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Admin users hanya admin
    match /admin_users/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 5. Struktur Folder

```
Oprec PR/
├── index.html               ← Landing page utama
├── register.html            ← Form pendaftaran (link QR)
├── student/
│   ├── login.html           ← Login mahasiswa (NIM + password)
│   ├── test.html            ← Tes tulis online
│   └── status.html          ← Cek status rekrutmen
├── admin/
│   ├── login.html           ← Login admin
│   ├── dashboard.html       ← Dashboard + generate QR
│   ├── peserta.html         ← Manajemen peserta
│   ├── soal.html            ← Buat soal tes
│   ├── wawancara.html       ← Form wawancara + AI
│   └── anggota.html         ← Buat akun anggota
├── css/
│   ├── style.css            ← Global design system
│   └── admin.css            ← Admin panel styles
└── js/
    ├── firebase-config.js   ← Firebase setup
    ├── ai.js                ← Gemini AI integration
    └── utils.js             ← Shared utilities
```

---

## 6. Alur Rekrutmen

```
Mahasiswa Scan QR
      ↓
Isi Form Pendaftaran → Firebase (status: 'daftar')
      ↓
Admin ubah status ke 'tes_tulis'
      ↓
Mahasiswa Login → Kerjakan Tes Tulis
      ↓
AI Nilai Essay → Generate Resume Tes
      ↓
Status otomatis → 'wawancara' (jika lolos) / 'ditolak'
      ↓
Admin/Anggota isi Form Wawancara
      ↓
AI Generate Resume Wawancara + Rekomendasi Divisi
      ↓
Status → 'diterima' / 'ditolak'
      ↓
Mahasiswa cek status di portal
```

---

## 7. Tips & Catatan

- **QR Code**: Generate dari Dashboard Admin → tombol "Generate QR Code" → download atau salin link
- **Soal Tes**: Minimal 5 soal PG + 2 essay untuk pengalaman terbaik
- **Pertanyaan Wawancara**: Buat minimal 5-8 pertanyaan umum + spesifik per divisi
- **Gemini Free Tier**: 15 request/menit, cukup untuk development. Untuk production pakai tier berbayar.
- **Hosting**: Upload semua file ke Firebase Hosting (`firebase deploy`) atau cukup buka dengan browser local untuk testing.

---

## Kontak & Support
Untuk pertanyaan teknis, hubungi developer website.
