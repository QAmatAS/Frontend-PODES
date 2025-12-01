# 🔌 API Service Guide - Frontend PODES Batu 2024

Panduan lengkap untuk komunikasi dengan Backend API.

---

## Overview

Frontend berkomunikasi dengan backend melalui service layer yang dibungkus dalam file `services/api.js`. Service ini menggunakan **Axios** untuk HTTP requests.

---

## File: `services/api.js`

### Configuration

```javascript
import axios from 'axios';

// Base URL - ambil dari environment variable atau default ke localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Axios instance dengan konfigurasi default
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,           // 10 detik timeout
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Environment Variable

Untuk mengubah URL API, buat file `.env` di root project:

```env
VITE_API_URL=http://localhost:5001/api
```

Untuk production:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## Service Methods

### podesService

Object utama yang berisi semua method untuk komunikasi API.

```javascript
export const podesService = {
  getAllVillages,
  getVillagesComparison,
  getMetadata,
  healthCheck
};

// Alternative exports
export const villageAPI = podesService;
export default podesService;
```

---

### getAllVillages

Mengambil data semua desa dengan opsi filtering.

```javascript
/**
 * Get all villages data with optional filtering
 * @param {Object} params - Query parameters
 * @param {string} params.kecamatan - Filter by kecamatan
 * @param {string} params.desa - Filter by desa
 * @param {string} params.category - Filter by category
 * @param {string} params.indicator - Filter by indicator
 * @returns {Promise<Array>} Array of village objects
 */
getAllVillages: async (params = {}) => {
  try {
    const response = await api.get('/villages', { params });
    return response.data?.data ?? [];
  } catch (error) {
    console.error('Error fetching villages:', error);
    throw error;
  }
}
```

**Contoh Penggunaan:**

```javascript
import { podesService } from './services/api';

// Get all villages
const allVillages = await podesService.getAllVillages();

// Get villages filtered by kecamatan
const batuVillages = await podesService.getAllVillages({ 
  kecamatan: 'Batu' 
});

// Get villages with specific indicator
const sdData = await podesService.getAllVillages({ 
  indicator: 'jumlah_sd',
  category: 'Pendidikan'
});

// Combined filters
const filtered = await podesService.getAllVillages({
  kecamatan: 'Batu',
  indicator: 'jumlah_sd',
  category: 'Pendidikan'
});
```

**Response Structure:**
```javascript
// API mengembalikan:
{
  success: true,
  data: [...],        // Array of villages
  count: 24,
  filters: {...},
  kpis: {...},
  rankingData: [...],
  indicatorType: 'quantitative'
}

// Service mengembalikan hanya data array:
[
  { id_desa: 1, nama_desa: 'Oro-oro Ombo', ... },
  { id_desa: 2, nama_desa: 'Temas', ... },
  ...
]
```

---

### getVillagesComparison

Mengambil data untuk perbandingan desa berdasarkan ID.

```javascript
/**
 * Get villages comparison data by IDs
 * @param {Array<number>} ids - Array of village IDs
 * @returns {Promise<Array>} Array of village objects for comparison
 */
getVillagesComparison: async (ids) => {
  try {
    const response = await api.get('/villages/compare', { 
      params: { ids: ids.join(',') } 
    });
    return response.data?.data ?? [];
  } catch (error) {
    console.error('Error fetching villages comparison:', error);
    throw error;
  }
}
```

**Contoh Penggunaan:**

```javascript
// Compare 3 villages
const comparisonData = await podesService.getVillagesComparison([1, 2, 5]);
```

**Response:**
```javascript
[
  { id_desa: 1, nama_desa: 'Oro-oro Ombo', jumlah_sd: 5, ... },
  { id_desa: 2, nama_desa: 'Temas', jumlah_sd: 6, ... },
  { id_desa: 5, nama_desa: 'Sisir', jumlah_sd: 7, ... }
]
```

---

### getMetadata

Mengambil metadata untuk membangun UI filter.

```javascript
/**
 * Get metadata for filters
 * @returns {Promise<Object>} Metadata object
 */
getMetadata: async () => {
  try {
    const response = await api.get('/villages/metadata');
    return response.data ?? {};
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw error;
  }
}
```

**Contoh Penggunaan:**

```javascript
const metadata = await podesService.getMetadata();

// Destructure yang dibutuhkan
const { 
  kecamatans,           // ['Semua Kecamatan', 'Batu', 'Bumiaji', 'Junrejo']
  desas,                // Array nama desa
  categoryIndicators,   // Mapping kategori ke indikator
  categories,           // Array nama kategori
  totalVillages,        // 24
  totalKecamatan        // 3
} = metadata.data;
```

**Response Structure:**
```javascript
{
  success: true,
  data: {
    totalVillages: 24,
    totalKecamatan: 3,
    kecamatans: ['Semua Kecamatan', 'Batu', 'Bumiaji', 'Junrejo'],
    desas: ['Beji', 'Bulukerto', ...],
    categoryIndicators: {
      'Pendidikan': { 'jumlah_tk': 'Jumlah TK', ... },
      'Kesehatan': { ... },
      ...
    },
    categories: ['Pendidikan', 'Kesehatan', ...],
    villages: [...],    // Full village data
    dataFields: [...]   // Available fields
  }
}
```

---

### healthCheck

Mengecek status server backend.

```javascript
/**
 * Check backend server health
 * @returns {Promise<Object>} Health status
 */
healthCheck: async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error fetching health status:', error);
    throw error;
  }
}
```

**Contoh Penggunaan:**

```javascript
try {
  const health = await podesService.healthCheck();
  console.log('Server status:', health.status);  // 'OK'
  console.log('Data count:', health.dataCount);  // 24
} catch (error) {
  console.log('Server is down');
}
```

---

## Usage Patterns

### Di AnalysisPage

```javascript
import { podesService } from '../services/api';

const AnalysisPage = () => {
  const [data, setData] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch data dan metadata secara paralel
      const [allVillages, meta] = await Promise.all([
        podesService.getAllVillages(),
        podesService.getMetadata().catch(() => null)
      ]);
      
      setData(Array.isArray(allVillages) ? allVillages : []);
      setMetadata(meta);
    } catch (err) {
      setError('Gagal memuat data. Pastikan server backend berjalan.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ...
};
```

### Di ComparisonView

```javascript
import { podesService } from '../services/api';

const ComparisonView = ({ selectedVillageIds }) => {
  const [comparisonData, setComparisonData] = useState([]);

  const fetchComparison = async () => {
    if (selectedVillageIds.length < 2) return;
    
    try {
      const data = await podesService.getVillagesComparison(selectedVillageIds);
      setComparisonData(data);
    } catch (error) {
      console.error('Comparison fetch failed:', error);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [selectedVillageIds]);

  // ...
};
```

---

## Error Handling

### Recommended Pattern

```javascript
const fetchWithErrorHandling = async () => {
  try {
    const data = await podesService.getAllVillages();
    return { data, error: null };
  } catch (error) {
    // Handle specific errors
    if (error.code === 'ECONNREFUSED') {
      return { 
        data: [], 
        error: 'Backend server tidak berjalan. Jalankan backend di port 5001.' 
      };
    }
    if (error.code === 'ETIMEDOUT') {
      return { 
        data: [], 
        error: 'Request timeout. Coba lagi.' 
      };
    }
    if (error.response?.status === 404) {
      return { 
        data: [], 
        error: 'Data tidak ditemukan.' 
      };
    }
    // Generic error
    return { 
      data: [], 
      error: 'Terjadi kesalahan. Coba lagi.' 
    };
  }
};
```

### Display Error to User

```jsx
const [error, setError] = useState('');

// In render
{error && (
  <Alert 
    severity="error"
    action={
      <Button color="inherit" size="small" onClick={fetchData}>
        Coba Lagi
      </Button>
    }
  >
    {error}
  </Alert>
)}
```

---

## Testing API

### Dengan Browser Console

```javascript
// Import service
const { podesService } = await import('./services/api.js');

// Test getAllVillages
const villages = await podesService.getAllVillages();
console.log('Villages:', villages);

// Test dengan filter
const filtered = await podesService.getAllVillages({ kecamatan: 'Batu' });
console.log('Filtered:', filtered);

// Test metadata
const meta = await podesService.getMetadata();
console.log('Metadata:', meta);
```

### Dengan curl (Terminal)

```bash
# Health check
curl http://localhost:5001/api/health

# Get all villages
curl http://localhost:5001/api/villages

# Get with filter
curl "http://localhost:5001/api/villages?kecamatan=Batu"

# Get metadata
curl http://localhost:5001/api/villages/metadata

# Compare villages
curl "http://localhost:5001/api/villages/compare?ids=1,2,3"
```

---

## Troubleshooting

### CORS Error

**Gejala:** Error "Access to XMLHttpRequest... blocked by CORS policy"

**Solusi:** Pastikan backend sudah mengaktifkan CORS:
```javascript
// Di backend server.js
app.use(cors());
```

### Network Error

**Gejala:** Error "Network Error" atau "ECONNREFUSED"

**Solusi:**
1. Pastikan backend running: `npm run dev` di folder Backend-PODES
2. Pastikan port benar (default 5001)
3. Cek firewall tidak memblokir

### Timeout Error

**Gejala:** Request timeout setelah 10 detik

**Solusi:**
1. Cek koneksi network
2. Tingkatkan timeout di api.js jika data besar:
```javascript
const api = axios.create({
  timeout: 30000,  // 30 detik
});
```

### Data Kosong

**Gejala:** `getAllVillages()` return array kosong

**Solusi:**
1. Cek backend berhasil load data (lihat console backend)
2. Cek response di Network tab browser
3. Pastikan file `data_podes_2024.json` tidak kosong

---

*API Service guide terakhir diperbarui: Desember 2024*
