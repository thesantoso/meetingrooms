# Meeting Room Booking App �

Aplikasi pemesanan ruang meeting yang mudah digunakan, dibuat dengan React Native dan Expo. Aplikasi ini memungkinkan pengguna untuk memesan ruang meeting, melihat jadwal, dan mengelola reservasi dengan interface yang bersih dan intuitif.

## ✨ Fitur Utama

- **Halaman Welcome** - Selamat datang yang ramah untuk pengguna baru
- **Login Sistem** - Autentikasi pengguna yang aman
- **Dashboard Home** - Lihat ringkasan meeting dan profil pengguna
- **Pesan Ruangan** - Form pemesanan ruang meeting yang lengkap
- **Jadwal Ruangan** - Melihat semua jadwal meeting yang tersedia
- **UI Modern** - Desain dengan tema soft dan warna yang nyaman di mata

## 🚀 Cara Menjalankan Aplikasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Server Development

```bash
npx expo start
```

### 3. Buka Aplikasi di Device

Setelah server berjalan, Anda bisa membuka aplikasi di:

- **📱 Mobile (Expo Go)**: Scan QR code yang muncul di terminal
- **🌐 Web Browser**: Buka http://localhost:8081
- **📲 iOS Simulator**: Tekan `i` di terminal
- **🤖 Android Emulator**: Tekan `a` di terminal

## 🛠️ Teknologi yang Digunakan

- **React Native** - Framework mobile app
- **Expo Router** - File-based routing system
- **TypeScript** - Type safety dan developer experience
- **React Native Safe Area Context** - Layout yang aman di semua device
- **DateTimePicker Community** - Native date/time picker

## 📂 Struktur Aplikasi

```
app/
├── index.tsx              # Welcome Screen
├── login.tsx              # Halaman Login
├── modal.tsx              # Modal components
├── _layout.tsx            # Root navigation
└── (tabs)/
    ├── index.tsx          # Home Dashboard
    ├── pesan.tsx          # Form Pesan Ruangan
    ├── jadwal.tsx         # Jadwal Ruangan
    └── _layout.tsx        # Tab navigation

components/
├── ui/                    # Reusable UI components
│   ├── FormInput.tsx
│   ├── PrimaryButton.tsx
│   ├── Dropdown.tsx
│   └── ...
└── ...

constants/
└── theme.ts               # Color theme & styles
```

## 🎨 Theme & Design

Aplikasi menggunakan tema soft dengan palet warna yang lembut:

- **Primary Blue**: #6B73FF
- **Light Background**: #F8F9FF
- **Minimal Shadows**: Design yang bersih tanpa shadow berlebihan

## 📝 Flow Navigasi

1. **Welcome Screen** → Halaman pembuka aplikasi
2. **Login** → Autentikasi pengguna
3. **Tabbed Interface**:
   - Home (Dashboard & jadwal)
   - Pesan Ruangan (Form booking)
   - Jadwal Ruangan (Lihat semua jadwal)

## 🔧 Development

Project ini menggunakan [Expo Router](https://docs.expo.dev/router/introduction) dengan file-based routing. Edit file di dalam folder **app** untuk mengembangkan fitur baru.

Untuk development yang optimal:

- Gunakan TypeScript untuk type safety
- Follow struktur component yang sudah ada
- Manfaatkan theme system di `constants/theme.ts`

## 📞 Support

Jika ada pertanyaan atau issue, silakan hubungi tim development atau buat issue di repository ini.

---

_Dibuat dengan ❤️ menggunakan React Native & Expo_
