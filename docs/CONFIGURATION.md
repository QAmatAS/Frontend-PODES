# ⚙️ Configuration Guide - Frontend PODES Batu 2024

Panduan lengkap untuk sistem konfigurasi indikator dan kategori.

---

## Daftar Isi

1. [Overview](#overview)
2. [Categories Config](#categories-config)
3. [Indicator Config Files](#indicator-config-files)
4. [Color System](#color-system)
5. [Selectors](#selectors)
6. [Step-by-Step: Menambah Indikator](#step-by-step-menambah-indikator)
7. [Step-by-Step: Menambah Kategori](#step-by-step-menambah-kategori)

---

## Overview

Sistem konfigurasi di project ini bersifat **config-driven**, artinya menambah indikator atau kategori baru TIDAK PERLU mengubah kode komponen. Cukup update file konfigurasi.

**File Utama:**
```
src/config/
├── categories.config.js      # Config utama kategori & indikator
├── indicatorKeyMap.js        # Mapping key ke label
├── indicators/               # Config per kategori
│   ├── pendidikan.js
│   ├── kesehatan.js
│   ├── lingkungan_konektivitas.js
│   ├── lingkungan_kebencanaan.js
│   └── ikg.js
├── selectors/               # Helper functions
│   ├── index.js
│   └── getIndicatorsForCategory.js
├── infra/                   # Config infrastruktur
└── table/                   # Config tabel
```

---

## Categories Config

**File:** `src/config/categories.config.js`

Ini adalah file konfigurasi PALING PENTING. Semua kategori dan indikator didefinisikan di sini.

### Struktur Dasar

```javascript
export const CATEGORIES_CONFIG = {
  // Key kategori (lowercase, no spaces)
  pendidikan: {
    key: 'Pendidikan',              // Key untuk matching (case-sensitive)
    title: 'Pendidikan',            // Label display
    defaultOpenIndicator: 'tk',     // Accordion mana yang default terbuka
    indicators: [
      {
        key: 'tk',                  // Key unik indikator
        label: 'Jumlah TK',         // Label display
        dataKey: 'jumlah_tk',       // Field name di JSON data
        accessor: (row) => row.jumlah_tk || 0,  // Fungsi akses data
        colorTokens: {
          ranking: '#14b8a6',       // Warna chart ranking
          distribusi: '#d946ef'     // Warna chart distribusi
        },
        icon: '🎓'                  // Icon emoji
      },
      // ... more indicators
    ]
  }
};
```

### CHART_COLORS

Konstanta warna yang tersedia:

```javascript
export const CHART_COLORS = {
  teal: '#14b8a6',
  magenta: '#d946ef', 
  purple: '#a855f7',
  blue: '#3b82f6',
  green: '#10b981',
  orange: '#f59e0b',
  red: '#ef4444',
  pink: '#ec4899',
  indigo: '#6366f1',
  cyan: '#06b6d4'
};
```

### COMPARISON_CONFIG

Config khusus untuk fitur perbandingan desa:

```javascript
export const COMPARISON_CONFIG = {
  pendidikan: {
    key: 'pendidikan',
    title: 'Pendidikan',
    icon: '📚',
    indicators: [
      {
        key: 'tk',
        label: 'Jumlah TK',
        dataKey: 'jumlah_tk',
        accessor: (row) => row.jumlah_tk || 0,
        color: CHART_COLORS.teal
      }
    ]
  },
  
  // Untuk kategori kualitatif:
  lingkungan_konektivitas: {
    key: 'lingkungan_konektivitas',
    title: 'Infrastruktur & Konektivitas',
    icon: '🌐',
    hasQualitativeData: true,        // Flag untuk data kualitatif
    comparisonMode: 'table-only',    // Hanya tampilkan tabel, bukan chart
    indicators: [
      {
        key: 'kualitas_sinyal_seluler',
        label: 'Kualitas Sinyal Seluler',
        dataKey: 'kekuatan_sinyal',
        type: 'qualitative',         // Tipe data
        accessor: (row) => row.kekuatan_sinyal || '-',
        color: CHART_COLORS.blue
      }
    ]
  }
};
```

### Helper Functions

```javascript
// Ambil config kategori
export const getCategoryConfig = (categoryKey) => {...}

// Ambil config comparison
export const getComparisonConfig = (categoryKey) => {...}

// Ambil semua key kategori
export const getCategoryKeys = () => {...}

// Cek apakah kategori punya indikator kuantitatif
export const hasQuantitativeIndicators = (categoryKey) => {...}

// Ambil mapping indikator (backward compatibility)
export const getIndicatorsMapping = (categoryKey) => {...}
```

---

## Indicator Config Files

Untuk organisasi yang lebih baik, config indikator dipisah per kategori.

### Pendidikan (`indicators/pendidikan.js`)

```javascript
const PENDIDIKAN_INDICATORS = [
  {
    key: 'tk',
    label: 'Jumlah TK',
    dataKey: 'jumlah_tk',
    icon: '🎓'
  },
  {
    key: 'sd',
    label: 'Jumlah SD/Sederajat',
    dataKey: 'jumlah_sd',
    icon: '📚'
  },
  {
    key: 'smp',
    label: 'Jumlah SMP/Sederajat',
    dataKey: 'jumlah_smp',
    icon: '🏫'
  },
  {
    key: 'sma',
    label: 'Jumlah SMA/Sederajat',
    dataKey: 'jumlah_sma',
    icon: '🎯'
  }
];

export default PENDIDIKAN_INDICATORS;
```

### Lingkungan Kebencanaan (`indicators/lingkungan_kebencanaan.js`)

```javascript
const LINGKUNGAN_KEBENCANAAN_INDICATORS = [
  {
    key: 'sistem_peringatan_dini',
    label: 'Sistem Peringatan Dini',
    dataKey: 'status_peringatan_dini',
    type: 'qualitative',     // Penting! Tandai sebagai kualitatif
    icon: '⚠️'
  },
  {
    key: 'alat_keselamatan',
    label: 'Alat Keselamatan',
    dataKey: 'status_alat_keselamatan',
    type: 'qualitative',
    icon: '🦺'
  }
  // ... more
];

export default LINGKUNGAN_KEBENCANAAN_INDICATORS;
```

### IKG (`indicators/ikg.js`)

```javascript
const IKG_INDICATORS = [
  {
    key: 'ikg_total',
    label: 'IKG Total',
    dataKey: 'ikg_total',
    type: 'quantitative',
    icon: '📊'
  },
  {
    key: 'ikg_pelayanan_dasar',
    label: 'IKG Pelayanan Dasar',
    dataKey: 'ikg_pelayanan_dasar',
    type: 'quantitative',
    icon: '🏥'
  }
  // ... more
];

export default IKG_INDICATORS;
```

---

## Color System

### Environment Palette (`theme/environmentPalette.js`)

Untuk indikator kualitatif, warna didefinisikan per kategori nilai:

```javascript
export const ENVIRONMENT_PALETTES = {
  // Indikator dengan nilai Ada/Tidak Ada
  status_peringatan_dini: {
    'Ada': '#2ecc71',              // Hijau
    'Tidak Ada': '#d35400',        // Orange
    'Tidak Terdefinisi': '#95a5a6' // Abu-abu
  },

  // Indikator dengan nilai multiple
  status_tps3r: {
    'Tidak ada': '#95a5a6',
    'Ada, digunakan': '#2ecc71',
    'Ada, tidak digunakan': '#f1c40f',
    'Tidak Terdefinisi': '#95a5a6'
  },

  // Indikator dengan gradient
  kebiasaan_pemilahan_sampah: {
    'Sebagian Besar Keluarga': '#1abc9c',
    'Semua Keluarga': '#3498db',
    'Sebagian Kecil Keluarga': '#9b59b6',
    'Tidak Terdefinisi': '#95a5a6'
  }
};
```

### Helper Functions

```javascript
// Ambil palette untuk indikator
export const getPalette = (indicatorKey) => {...}

// Ambil warna untuk nilai kategori tertentu
export const getCategoryColor = (indicatorKey, categoryValue) => {...}

// Generate array warna untuk chart
export const getEnvColor = (indicatorKey) => {...}
```

---

## Selectors

### getIndicatorsForCategory

**File:** `config/selectors/getIndicatorsForCategory.js`

Fungsi utama untuk mengambil indikator berdasarkan kategori:

```javascript
import { getIndicatorsForCategory } from './config/selectors';

// Returns: { 'tk': 'Jumlah TK', 'sd': 'Jumlah SD/Sederajat', ... }
const indicators = getIndicatorsForCategory('Pendidikan');

// Iterate
Object.entries(indicators).forEach(([key, label]) => {
  console.log(`${key}: ${label}`);
});
```

### getCategoryIndicatorKeys

```javascript
import { getCategoryIndicatorKeys } from './config/selectors';

// Returns: ['tk', 'sd', 'smp', 'sma']
const keys = getCategoryIndicatorKeys('Pendidikan');
```

---

## Step-by-Step: Menambah Indikator

### Skenario: Menambah "Jumlah SMK" ke Kategori Pendidikan

**Langkah 1:** Pastikan data ada di backend (`data_podes_2024.json`):
```json
{
  "id_desa": 1,
  "nama_desa": "Oro-oro Ombo",
  "jumlah_smk": 2   // Field baru
}
```

**Langkah 2:** Update `config/indicators/pendidikan.js`:
```javascript
const PENDIDIKAN_INDICATORS = [
  // ... existing indicators
  {
    key: 'smk',
    label: 'Jumlah SMK',
    dataKey: 'jumlah_smk',
    icon: '🏭'
  }
];
```

**Langkah 3:** Jika perlu, update `categories.config.js` untuk colorTokens:
```javascript
pendidikan: {
  indicators: [
    // ... existing
    {
      key: 'smk',
      label: 'Jumlah SMK',
      dataKey: 'jumlah_smk',
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

**Langkah 4:** Update COMPARISON_CONFIG jika diperlukan:
```javascript
COMPARISON_CONFIG.pendidikan.indicators.push({
  key: 'smk',
  label: 'Jumlah SMK',
  dataKey: 'jumlah_smk',
  accessor: (row) => row.jumlah_smk || 0,
  color: CHART_COLORS.purple
});
```

**Langkah 5:** Restart dev server. Selesai!

---

## Step-by-Step: Menambah Kategori

### Skenario: Menambah Kategori "Ekonomi"

**Langkah 1:** Buat file config baru `config/indicators/ekonomi.js`:
```javascript
const EKONOMI_INDICATORS = [
  {
    key: 'pasar',
    label: 'Jumlah Pasar',
    dataKey: 'jumlah_pasar',
    type: 'quantitative',
    icon: '🏪'
  },
  {
    key: 'toko',
    label: 'Jumlah Toko/Warung',
    dataKey: 'jumlah_toko',
    type: 'quantitative',
    icon: '🏬'
  },
  {
    key: 'koperasi',
    label: 'Jumlah Koperasi',
    dataKey: 'jumlah_koperasi',
    type: 'quantitative',
    icon: '🤝'
  }
];

export default EKONOMI_INDICATORS;
```

**Langkah 2:** Import dan daftarkan di `categories.config.js`:
```javascript
// Di bagian import
import EKONOMI_INDICATORS from './indicators/ekonomi.js';

// Di CATEGORIES_CONFIG
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

**Langkah 3:** Tambahkan COMPARISON_CONFIG:
```javascript
export const COMPARISON_CONFIG = {
  // ... existing
  
  ekonomi: {
    key: 'ekonomi',
    title: 'Ekonomi',
    icon: '💰',
    indicators: [
      {
        key: 'pasar',
        label: 'Jumlah Pasar',
        dataKey: 'jumlah_pasar',
        accessor: (row) => row.jumlah_pasar || 0,
        color: CHART_COLORS.green
      },
      // ... more
    ]
  }
};
```

**Langkah 4:** Update backend `villageController.js`:
```javascript
const getCategoryIndicators = () => {
  return {
    // ... existing
    "Ekonomi": {
      "jumlah_pasar": "Jumlah Pasar",
      "jumlah_toko": "Jumlah Toko/Warung",
      "jumlah_koperasi": "Jumlah Koperasi"
    }
  };
};
```

**Langkah 5:** Tambahkan data di `data_podes_2024.json`:
```json
{
  "id_desa": 1,
  "nama_desa": "Oro-oro Ombo",
  "jumlah_pasar": 1,
  "jumlah_toko": 25,
  "jumlah_koperasi": 2
}
```

**Langkah 6:** Update selector jika diperlukan di `getIndicatorsForCategory.js`.

**Langkah 7:** Restart kedua server (backend & frontend). Kategori baru akan muncul di dropdown!

---

## Tips & Best Practices

### 1. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Category key (config) | lowercase, underscore | `lingkungan_kebencanaan` |
| Category key (display) | Title Case | `Lingkungan & Kebencanaan` |
| Indicator key | lowercase, underscore | `jumlah_sd` |
| Data field | lowercase, underscore | `jumlah_sd` |

### 2. Accessor Functions

Selalu gunakan default value untuk menghindari `undefined`:

```javascript
// ✅ Good
accessor: (row) => row.jumlah_sd || 0

// ❌ Bad
accessor: (row) => row.jumlah_sd
```

### 3. Color Assignment

- Gunakan warna yang kontras untuk indikator dalam kategori yang sama
- Gunakan warna semantic untuk nilai kualitatif (hijau = positif, merah = negatif)
- Jangan gunakan warna yang sama untuk ranking dan distribusi

### 4. Testing

Setelah menambah config, selalu test:
1. Dropdown menampilkan indikator baru
2. Chart render dengan benar
3. Tabel menampilkan kolom baru
4. Filter bekerja dengan indikator baru
5. Comparison view menampilkan indikator baru

---

*Configuration guide terakhir diperbarui: Desember 2025*
