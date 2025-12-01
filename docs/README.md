# 📚 Dokumentasi Frontend PODES Batu 2024

> **Aplikasi Dashboard Visualisasi Data PODES Batu 2024**

Dokumentasi ini ditujukan untuk developer yang akan melanjutkan pengembangan sistem. Bacalah dengan teliti sebelum melakukan modifikasi apapun.

---

## 📁 Daftar Isi

1. [Gambaran Umum Sistem](#1-gambaran-umum-sistem)
2. [Struktur Folder](#2-struktur-folder)
3. [Cara Menjalankan](#3-cara-menjalankan)
4. [Arsitektur Aplikasi](#4-arsitektur-aplikasi)
5. [Halaman Utama](#5-halaman-utama)
6. [Komponen Penting](#6-komponen-penting)
7. [Sistem Konfigurasi](#7-sistem-konfigurasi)
8. [Cara Menambah Fitur Baru](#8-cara-menambah-fitur-baru)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Gambaran Umum Sistem

Frontend ini adalah **Single Page Application (SPA)** yang menampilkan visualisasi data PODES Kota Batu 2024 dalam bentuk dashboard interaktif.

### Teknologi yang Digunakan:

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 19.1.1 | UI Library |
| Vite | 7.1.2 | Build tool & dev server |
| Material-UI (MUI) | 7.3.2 | Component library |
| Axios | 1.12.2 | HTTP client untuk API |
| React Router | 7.9.1 | Client-side routing |
| Leaflet | 1.9.4 | Peta interaktif |
| ApexCharts | 5.3.5 | Visualisasi chart |
| ECharts | 5.6.0 | Visualisasi chart alternatif |
| Recharts | 3.2.1 | Chart library tambahan |

### Fitur Utama:
- 📊 Dashboard dengan KPI Cards
- 📈 Visualisasi chart (Donut, Bar, Ranking)
- 🗺️ Peta geospasial interaktif
- 🔍 Filter berdasarkan kategori, indikator, kecamatan, desa
- ⚖️ Perbandingan antar desa
- 📋 Tabel data lengkap
- 📱 Responsive design (desktop & mobile)

---

## 2. Struktur Folder

```
Frontend-PODES/
├── index.html              # HTML entry point
├── vite.config.js          # Konfigurasi Vite
├── package.json            # Dependencies & scripts
├── eslint.config.js        # Linting rules
│
├── public/
│   ├── kelurahan.geojson   # Data geospasial untuk peta
│   └── Logo-BPS.png        # Logo BPS
│
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Root component + Theme
│   ├── App.css             # Global styles
│   ├── index.css           # Reset & base styles
│   │
│   ├── pages/              # Halaman utama
│   │   ├── LandingPage.jsx     # Halaman landing
│   │   ├── Dashboard.jsx       # Dashboard overview
│   │   └── AnalysisPage.jsx    # Halaman analisis utama
│   │
│   ├── components/         # Komponen reusable
│   │   ├── AppHeader.jsx       # Header navigasi
│   │   ├── FilterSidebar.jsx   # Sidebar filter
│   │   ├── KPICards.jsx        # Kartu KPI
│   │   ├── GeospatialMap.jsx   # Peta Leaflet
│   │   ├── ComparisonView.jsx  # Perbandingan desa
│   │   ├── charts/             # Komponen chart
│   │   ├── table/              # Komponen tabel
│   │   └── ...
│   │
│   ├── services/           # API communication
│   │   └── api.js              # Axios instance & service
│   │
│   ├── config/             # Konfigurasi indikator
│   │   ├── categories.config.js    # Mapping kategori
│   │   ├── indicators/             # Config per kategori
│   │   ├── selectors/              # Helper selectors
│   │   └── ...
│   │
│   ├── analysis/           # Modul analisis
│   │   ├── IndicatorsSummary.jsx   # Ringkasan indikator
│   │   ├── IndicatorPanel.jsx      # Panel detail
│   │   ├── universal/              # Komponen universal
│   │   ├── charts/                 # Chart untuk analisis
│   │   ├── tables/                 # Tabel untuk analisis
│   │   └── hooks/                  # Custom hooks
│   │
│   ├── theme/              # Styling & colors
│   │   └── environmentPalette.js   # Color palette
│   │
│   ├── styles/             # CSS tambahan
│   │   ├── viz-fixes.css       # Fix untuk chart
│   │   └── leaflet-custom.css  # Custom Leaflet styles
│   │
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions
│   ├── adapters/           # Data adapters
│   └── constants/          # Konstanta
│
└── docs/                   # Dokumentasi
```

---

## 3. Cara Menjalankan

### Prasyarat:
- Node.js versi 18 atau lebih baru
- npm (sudah termasuk dengan Node.js)
- Backend server sudah berjalan di port 5001

### Langkah-langkah:

```bash
# 1. Masuk ke folder frontend
cd Frontend-PODES

# 2. Install dependencies (hanya perlu sekali)
npm install

# 3. Jalankan development server
npm run dev
```

### Hasil yang Diharapkan:
```
  VITE v7.1.2  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
  ➜  press h + enter to show help
```

### Scripts Tersedia:

| Script | Command | Deskripsi |
|--------|---------|-----------|
| `dev` | `npm run dev` | Development server dengan HMR |
| `build` | `npm run build` | Build untuk production |
| `preview` | `npm run preview` | Preview hasil build |
| `lint` | `npm run lint` | Cek linting dengan ESLint |

### Environment Variables:

Buat file `.env` di root folder (opsional):

```env
# URL Backend API (default: http://localhost:5001/api)
VITE_API_URL=http://localhost:5001/api
```

---

## 4. Arsitektur Aplikasi

### Diagram Komponen:

```
┌──────────────────────────────────────────────────────────┐
│                        App.jsx                           │
│  (Theme Provider, Error Boundary, Page Navigation)       │
└─────────────────────────┬────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  LandingPage  │ │   Dashboard   │ │ AnalysisPage  │
│   (landing)   │ │  (dashboard)  │ │  (analysis)   │
└───────────────┘ └───────────────┘ └───────┬───────┘
                                            │
                  ┌─────────────────────────┼─────────────────────────┐
                  │                         │                         │
                  ▼                         ▼                         ▼
          ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
          │ FilterSidebar│          │  KPICards   │          │   Charts    │
          │   (filter)   │          │   (metrics) │          │   (viz)     │
          └─────────────┘          └─────────────┘          └─────────────┘
```

### Data Flow:

```
┌─────────────┐     API Call      ┌─────────────────┐
│   Backend   │ ◄──────────────── │  services/api.js│
│  (Port 5001)│ ────────────────► │   (Axios)       │
└─────────────┘     JSON Response └────────┬────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │  AnalysisPage   │
                                  │ (State: data,   │
                                  │  filters, etc)  │
                                  └────────┬────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
            ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
            │  KPICards   │        │   Charts    │        │   Tables    │
            │ (via props) │        │ (via props) │        │ (via props) │
            └─────────────┘        └─────────────┘        └─────────────┘
```

### State Management:

Aplikasi menggunakan **React Hooks** untuk state management:

| State | Location | Purpose |
|-------|----------|---------|
| `data` | AnalysisPage | Data desa dari API |
| `filters` | AnalysisPage | Filter aktif (category, indicator, kecamatan, desa) |
| `viewMode` | AnalysisPage | Mode tampilan (analisis / peta) |
| `loading` | AnalysisPage | Status loading |
| `error` | AnalysisPage | Error messages |
| `metadata` | AnalysisPage | Metadata untuk filters |

---

## 5. Halaman Utama

### 5.1 Landing Page (`pages/LandingPage.jsx`)

**Fungsi:** Halaman pertama yang dilihat user, berisi overview dan navigasi.

**Fitur:**
- Hero section dengan gradient background
- Feature cards (Dashboard Interaktif, Analisis Real-time, dll)
- CTA button ke dashboard/analysis

**Props:**
```jsx
<LandingPage setCurrentPage={setCurrentPage} />
```

---

### 5.2 Dashboard (`pages/Dashboard.jsx`)

**Fungsi:** Overview singkat data PODES.

**Fitur:**
- Quick stats cards
- Navigasi ke analysis page
- Loading skeleton

---

### 5.3 Analysis Page (`pages/AnalysisPage.jsx`)

**Fungsi:** Halaman utama untuk analisis data dengan filtering.

**Ini adalah halaman PALING KOMPLEKS. Pahami dengan baik sebelum modifikasi.**

**State Utama:**
```javascript
const [data, setData] = useState([]);           // Data desa
const [loading, setLoading] = useState(true);   // Loading state
const [error, setError] = useState('');         // Error message
const [metadata, setMetadata] = useState(null); // Metadata
const [viewMode, setViewMode] = useState('analisis'); // 'analisis' | 'peta'

const [filters, setFilters] = useState({
  category: 'Pendidikan',    // Kategori aktif
  indicator: 'Semua',        // Indikator ('Semua' = semua indikator)
  kecamatan: '',             // Filter kecamatan
  desa: ''                   // Filter desa
});
```

**Alur Utama:**
1. Component mount → `fetchData()` dipanggil
2. Data & metadata di-fetch dari API
3. Data di-filter berdasarkan `filters` state
4. `filteredData` di-pass ke child components
5. User interaksi dengan filter → state berubah → re-render

**Mode Tampilan:**
- **Mode Analisis:** Menampilkan charts, KPI, ranking, tabel
- **Mode Peta:** Menampilkan peta geospasial

---

## 6. Komponen Penting

### 6.1 FilterSidebar (`components/FilterSidebar.jsx`)

**Fungsi:** Sidebar untuk filtering data.

**Props:**
```jsx
<FilterSidebar
  open={boolean}                    // Drawer terbuka/tertutup
  onClose={() => {}}               // Handler close
  mobile={boolean}                 // Mode mobile?
  filters={object}                 // Filter values
  onChange={(key, value) => {}}    // Handler perubahan filter
  onReset={() => {}}               // Handler reset
  categories={array}               // Daftar kategori
  getIndicatorsForCategory={fn}    // Fungsi ambil indikator
  kecamatanList={array}           // Daftar kecamatan
  desaList={array}                // Daftar desa
  viewMode={string}               // Mode tampilan
  onViewModeChange={(mode) => {}} // Handler ubah mode
/>
```

---

### 6.2 KPICards (`components/KPICards.jsx`)

**Fungsi:** Menampilkan ringkasan KPI dalam bentuk cards.

**Props:**
```jsx
<KPICards
  analysisData={{
    type: 'quantitative' | 'qualitative' | 'summary',
    kpis: {
      total: number,
      max: number,
      min: number,
      // atau untuk summary:
      total_villages: number,
      total_kecamatan: number,
      category: string,
      indicators_count: number
    }
  }}
  totalVillages={number}
  loading={boolean}
/>
```

---

### 6.3 GeospatialMap (`components/GeospatialMap.jsx`)

**Fungsi:** Menampilkan peta interaktif dengan Leaflet.

**Fitur:**
- Choropleth coloring berdasarkan indikator
- Popup info saat klik desa
- Tooltip saat hover
- Zoom controls
- Layer control

**Data Source:** `public/kelurahan.geojson`

---

### 6.4 ComparisonView (`components/ComparisonView.jsx`)

**Fungsi:** Membandingkan data antar desa.

**Props:**
```jsx
<ComparisonView
  villages={array}           // Data desa (untuk selection)
  dataset={array}           // Dataset filtered
  currentCategory={string}  // Kategori aktif
/>
```

**Fitur:**
- Pilih 2-4 desa untuk dibandingkan
- Tabel perbandingan per indikator
- Grouped bar chart

---

### 6.5 IndicatorsSummary (`analysis/IndicatorsSummary.jsx`)

**Fungsi:** Menampilkan ringkasan semua indikator dalam bentuk accordion.

**Props:**
```jsx
<IndicatorsSummary
  categoryKey={string}    // 'Pendidikan', 'Kesehatan', dll
  data={array}           // Data lengkap (semua desa)
  filteredData={array}   // Data yang sudah difilter
/>
```

**Digunakan untuk:** Tampilan ketika indicator = "Semua"

---

## 7. Sistem Konfigurasi

### 7.1 Categories Config (`config/categories.config.js`)

**Fungsi:** Mapping kategori ke indikator. INI FILE PALING PENTING untuk menambah indikator baru.

**Struktur:**
```javascript
export const CATEGORIES_CONFIG = {
  pendidikan: {
    key: 'Pendidikan',           // Key untuk matching
    title: 'Pendidikan',         // Label display
    defaultOpenIndicator: 'tk',  // Accordion default terbuka
    indicators: [
      {
        key: 'tk',                        // Key unik
        label: 'Jumlah TK',               // Label display
        dataKey: 'jumlah_tk',             // Field di data JSON
        accessor: (row) => row.jumlah_tk || 0,  // Fungsi akses data
        colorTokens: {
          ranking: '#14b8a6',             // Warna chart ranking
          distribusi: '#d946ef'           // Warna chart distribusi
        },
        icon: '🎓'                        // Icon emoji
      },
      // ... more indicators
    ]
  },
  // ... more categories
};
```

### 7.2 Helper Functions

**`getCategoryConfig(categoryKey)`**
```javascript
import { getCategoryConfig } from './config/categories.config';

const config = getCategoryConfig('Pendidikan');
// Returns: { key, title, indicators: [...] }
```

**`getIndicatorsForCategory(categoryKey)`**
```javascript
import { getIndicatorsForCategory } from './config/selectors';

const indicators = getIndicatorsForCategory('Pendidikan');
// Returns: { 'tk': 'Jumlah TK', 'sd': 'Jumlah SD/Sederajat', ... }
```

---

### 7.3 Color Palette (`theme/environmentPalette.js`)

**Fungsi:** Mapping warna untuk kategori kualitatif.

```javascript
export const ENVIRONMENT_PALETTES = {
  status_tps: {
    'Ada': '#2ecc71',              // Hijau
    'Tidak Ada': '#d35400',        // Orange
    'Tidak Terdefinisi': '#95a5a6' // Abu-abu
  },
  // ... more palettes
};
```

---

## 8. Cara Menambah Fitur Baru

### 8.1 Menambah Indikator Baru

**Langkah 1:** Pastikan data sudah ada di backend (lihat dokumentasi backend).

**Langkah 2:** Edit `config/categories.config.js`:

```javascript
// Di dalam CATEGORIES_CONFIG, tambahkan di kategori yang sesuai:
pendidikan: {
  // ... existing
  indicators: [
    // ... existing indicators
    {
      key: 'smk',                           // Key unik
      label: 'Jumlah SMK',                  // Label display
      dataKey: 'jumlah_smk',                // Field di JSON
      accessor: (row) => row.jumlah_smk || 0,
      colorTokens: {
        ranking: CHART_COLORS.purple,
        distribusi: CHART_COLORS.pink
      },
      icon: '🏭'
    }
  ]
}
```

**Langkah 3:** Restart dev server, indikator akan muncul otomatis.

---

### 8.2 Menambah Kategori Baru

**Langkah 1:** Buat file config baru di `config/indicators/`:

```javascript
// config/indicators/ekonomi.js
const EKONOMI_INDICATORS = [
  {
    key: 'pasar',
    label: 'Jumlah Pasar',
    dataKey: 'jumlah_pasar',
    icon: '🏪'
  },
  // ...
];

export default EKONOMI_INDICATORS;
```

**Langkah 2:** Import dan daftarkan di `categories.config.js`:

```javascript
import EKONOMI_INDICATORS from './indicators/ekonomi.js';

export const CATEGORIES_CONFIG = {
  // ... existing categories
  
  ekonomi: {
    key: 'Ekonomi',
    title: 'Ekonomi',
    defaultOpenIndicator: 'pasar',
    indicators: EKONOMI_INDICATORS.map(indicator => ({
      ...indicator,
      colorTokens: {
        ranking: CHART_COLORS.green,
        distribusi: CHART_COLORS.teal
      },
      accessor: (row) => row[indicator.dataKey] || 0
    }))
  }
};
```

**Langkah 3:** Update backend untuk include kategori baru di `getCategoryIndicators()`.

---

### 8.3 Menambah Halaman Baru

**Langkah 1:** Buat file page baru di `pages/`:

```jsx
// pages/ReportPage.jsx
import React from 'react';
import { Container, Typography } from '@mui/material';

const ReportPage = ({ setCurrentPage }) => {
  return (
    <Container>
      <Typography variant="h4">Halaman Report</Typography>
      {/* Content here */}
    </Container>
  );
};

export default ReportPage;
```

**Langkah 2:** Tambahkan di `App.jsx`:

```jsx
import ReportPage from './pages/ReportPage';

// Di dalam render:
{currentPage === 'report' && <ReportPage setCurrentPage={setCurrentPage} />}
```

**Langkah 3:** Tambahkan navigasi di header/sidebar.

---

## 9. Troubleshooting

### Error: "Failed to fetch" / "Network Error"

**Penyebab:** Backend tidak berjalan atau URL salah.

**Solusi:**
1. Pastikan backend running di port 5001
2. Cek URL di `services/api.js`
3. Cek browser console untuk error detail

---

### Error: "Cannot read property 'map' of undefined"

**Penyebab:** Data belum ter-load atau format salah.

**Solusi:**
1. Tambahkan null check: `data?.map(...)`
2. Cek API response di Network tab
3. Pastikan initial state tidak undefined

---

### Chart Tidak Muncul

**Penyebab:** Data kosong atau format salah.

**Solusi:**
1. Cek data di console: `console.log(chartData)`
2. Pastikan format sesuai dengan yang diharapkan chart
3. Cek CSS visibility di DevTools

---

### Peta Tidak Muncul

**Penyebab:** GeoJSON tidak ter-load atau Leaflet CSS missing.

**Solusi:**
1. Pastikan `public/kelurahan.geojson` ada
2. Cek import CSS di `main.jsx`: `import './styles/leaflet-custom.css'`
3. Cek console untuk error Leaflet

---

### Filter Tidak Bekerja

**Penyebab:** Key tidak match antara filter dan data.

**Solusi:**
1. Console.log filters dan data
2. Pastikan key di filter sama dengan field di data
3. Cek logic filtering di `filteredData` useMemo

---

### Build Error: "Out of memory"

**Penyebab:** Node kehabisan memory saat build.

**Solusi:**
```bash
# Tingkatkan memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

### ESLint Error Banyak

**Solusi:**
```bash
# Auto-fix yang bisa di-fix
npm run lint -- --fix

# Atau disable rule specific di file
// eslint-disable-next-line react-hooks/exhaustive-deps
```

---

## 📞 Kontak

Jika ada pertanyaan atau kesulitan, hubungi tim PKL BPS Kota Batu.

---

*Dokumentasi ini terakhir diperbarui: Desember 2025*
