# Meeting Room Booking App �

Aplikasi pemesanan ruang meeting yang mudah digunakan, dibuat dengan React Native dan Expo. Aplikasi ini memungkinkan pengguna untuk memesan ruang meeting, melihat jadwal, dan mengelola reservasi dengan interface yang bersih dan intuitif.

## ✨ Fitur Utama

- **Halaman Welcome** - Selamat datang yang ramah untuk pengguna baru
- **Login Sistem** - Autentikasi pengguna yang aman dengan form validation
- **Dashboard Home** - Lihat ringkasan meeting dan profil pengguna dengan real-time data
- **Pesan Ruangan** - Form pemesanan dengan NumberInput component dan date/time picker
- **Jadwal Ruangan** - Filter meeting berdasarkan ruangan dan tanggal
- **Clean Architecture** - Separation of concerns dengan custom hooks dan services
- **UI Modern** - Desain dengan tema soft dan komponen yang reusable

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
- **Custom Hooks** - Business logic separation dengan reusable hooks
- **Clean Architecture** - Modular design pattern untuk maintainability

## 📂 Struktur Aplikasi (Clean Architecture)

```
📁 app/                     # Screens & Navigation
├── index.tsx              # Welcome Screen
├── login.tsx              # Halaman Login
├── modal.tsx              # Modal components
├── _layout.tsx            # Root navigation
└── (tabs)/
    ├── index.tsx          # Home Dashboard
    ├── pesan.tsx          # Form Pesan Ruangan (dengan NumberInput)
    ├── jadwal.tsx         # Jadwal Ruangan (dengan filter)
    └── _layout.tsx        # Tab navigation

📁 components/ui/          # Reusable UI Components
├── AlertModal.tsx         # Success/Error modal
├── Card.tsx              # Container component
├── DateTimePickerInput.tsx # Date/time picker
├── Dropdown.tsx          # Select component
├── FormInput.tsx         # Text input dengan validation
├── NumberInput.tsx       # Number stepper component
└── PrimaryButton.tsx     # Action button

📁 hooks/                  # Custom Hooks (Business Logic)
├── useAuth.ts            # Authentication logic
├── useBooking.ts         # Form booking management
├── useForm.ts            # Generic form handler
├── useMeetings.ts        # Meeting data fetching
├── useMeetingFilter.ts   # Advanced filtering logic
└── useRoomFilter.ts      # Room filtering

📁 services/               # API Layer
└── api.ts                # API calls & external services

📁 types/                  # TypeScript Definitions
└── index.ts              # Interface & type definitions

📁 utils/                  # Utility Functions
├── formatters.ts         # Date/time/duration formatters
├── validation.ts         # Form validation rules
└── index.ts              # Utility exports

📁 constants/              # App Constants
├── dates.ts              # Date filter presets
├── numberInputPresets.ts # NumberInput configurations
├── rooms.ts              # Room options & mappings
└── theme.ts              # Color theme & styles
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

## 🛠️ Panduan Pengembangan & Clean Architecture

### Clean Architecture Benefits

- **Separation of Concerns**: UI, business logic, dan data layer terpisah
- **Testability**: Logic dalam hooks dapat ditest dengan mudah
- **Reusability**: Custom hooks dapat digunakan di multiple screens
- **Maintainability**: Perubahan logic tidak mempengaruhi UI components

### Menambah Custom Hook Baru

```typescript
// hooks/useNewFeature.ts
export function useNewFeature() {
  const [data, setData] = useState([]);

  // Business logic here
  const processData = () => {
    // Your logic
  };

  return { data, processData };
}
```

### Menambah Screen Baru

1. Buat file TSX di folder `app/`
2. Import custom hooks untuk business logic
3. Gunakan komponen UI dari folder `components/ui/`
4. Follow clean architecture pattern

### Menambah Komponen UI

1. Buat file di `components/ui/`
2. Export dari index untuk reusability
3. Gunakan TypeScript untuk type safety
4. Support theming dari `constants/theme.ts`

### Best Practices

- **Hooks**: Business logic dan state management
- **Components**: Pure UI, receive props dari hooks
- **Services**: API calls dan external dependencies
- **Utils**: Pure functions untuk formatting/validation
- **Constants**: Static data dan configurations

Project ini menggunakan [Expo Router](https://docs.expo.dev/router/introduction) dengan file-based routing dan clean architecture pattern untuk maintainability yang optimal.

## 📞 Support

Jika ada pertanyaan atau issue, silakan hubungi tim development atau buat issue di repository ini.

---

_Dibuat dengan ❤️ menggunakan React Native & Expo_
