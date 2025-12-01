# 🔧 Troubleshooting Guide - Dashboard PODES Batu 2024

Panduan lengkap untuk mengatasi masalah umum saat development.

---

## Quick Diagnostics

### Checklist Awal

```bash
# 1. Cek Node.js version
node --version   # Harus >= 18.0.0

# 2. Cek apakah dependencies terinstall
# Frontend
cd Frontend-PODES && npm list --depth=0

# Backend
cd Backend-PODES && npm list --depth=0

# 3. Cek apakah port tidak digunakan
netstat -an | findstr "3000 5001"
```

---

## Backend Issues

### 🔴 Error: Cannot find module 'express'

**Gejala:**
```
Error: Cannot find module 'express'
    at Function.Module._resolveFilename
```

**Penyebab:** Dependencies belum terinstall.

**Solusi:**
```bash
cd Backend-PODES
npm install
```

---

### 🔴 Error: Port 5001 already in use

**Gejala:**
```
Error: listen EADDRINUSE: address already in use :::5001
```

**Penyebab:** Ada proses lain yang menggunakan port 5001.

**Solusi Windows:**
```powershell
# Cari proses yang menggunakan port 5001
netstat -ano | findstr :5001

# Kill proses (ganti PID dengan hasil di atas)
taskkill /PID <PID> /F

# Atau gunakan port lain
set PORT=5002 && npm start
```

**Solusi Linux/Mac:**
```bash
# Cari dan kill
lsof -i :5001
kill -9 <PID>
```

---

### 🔴 Error: data_podes_2024.json not found

**Gejala:**
```
Error: ENOENT: no such file or directory, open './data/data_podes_2024.json'
```

**Penyebab:** File data tidak ada atau path salah.

**Solusi:**
1. Pastikan file ada di `Backend-PODES/data/data_podes_2024.json`
2. Cek struktur folder:
```
Backend-PODES/
├── data/
│   ├── data_podes_2024.json  ← File harus ada di sini
│   └── kelurahan.geojson
├── server.js
└── ...
```

---

### 🔴 API Returns Empty Array

**Gejala:** API `/api/villages` mengembalikan `[]` kosong.

**Debug:**
```javascript
// Di server.js, tambahkan log saat load data
const loadData = () => {
  try {
    const rawData = fs.readFileSync(DATA_PATH, 'utf8');
    console.log('Raw data length:', rawData.length);
    
    villagesData = JSON.parse(rawData);
    console.log('Parsed villages count:', villagesData.length);
    console.log('Sample village:', villagesData[0]);
  } catch (error) {
    console.error('Failed to load data:', error);
  }
};
```

**Penyebab umum:**
1. File JSON kosong
2. JSON invalid (syntax error)
3. File encoding bukan UTF-8

**Solusi:**
```bash
# Validate JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('./data/data_podes_2024.json')))"
```

---

### 🔴 Error: SyntaxError in JSON

**Gejala:**
```
SyntaxError: Unexpected token X in JSON at position Y
```

**Penyebab:** File JSON tidak valid.

**Debug:**
```bash
# Online validator: https://jsonlint.com/
# Atau gunakan jq (jika terinstall)
cat data/data_podes_2024.json | jq .
```

**Masalah umum dalam JSON:**
- Trailing comma: `{ "a": 1, }` ← salah
- Single quotes: `{ 'a': 1 }` ← salah, gunakan double quotes
- Unquoted keys: `{ a: 1 }` ← salah
- Comments: `{ /* comment */ }` ← JSON tidak support comments

---

## Frontend Issues

### 🔴 Error: ENOSPC / npm install stuck

**Gejala:** npm install lambat atau stuck.

**Solusi:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules dan reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

---

### 🔴 Error: Vite localhost refused to connect

**Gejala:** Browser menampilkan "localhost refused to connect" saat akses http://localhost:3000

**Debug:**
```bash
# Cek Vite running
npm run dev
# Lihat output, port berapa yang digunakan

# Default Vite port adalah 5173, bukan 3000
# Akses: http://localhost:5173
```

**Solusi:**
Vite modern menggunakan port 5173 by default. Jika ingin gunakan port 3000:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    port: 3000,
    strictPort: true  // Error jika port tidak available
  }
});
```

---

### 🔴 CORS Error

**Gejala:**
```
Access to XMLHttpRequest at 'http://localhost:5001/api/villages' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Penyebab:** Backend tidak mengizinkan request dari frontend origin.

**Solusi di Backend:**
```javascript
// server.js
const cors = require('cors');

// Allow all origins (development)
app.use(cors());

// Atau specific origin (production)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000']
}));
```

---

### 🔴 Error: Network Error (Axios)

**Gejala:**
```
AxiosError: Network Error
```

**Penyebab:** 
1. Backend tidak running
2. URL salah
3. Firewall blocking

**Debug:**
```javascript
// Di browser console
fetch('http://localhost:5001/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Solusi:**
1. Pastikan backend running: `cd Backend-PODES && npm start`
2. Cek URL di `services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

---

### 🔴 Map Not Showing (Blank)

**Gejala:** Area peta kosong/blank.

**Penyebab & Solusi:**

1. **CSS Leaflet tidak di-import:**
```javascript
// Di main.jsx atau App.jsx
import 'leaflet/dist/leaflet.css';
```

2. **Container tidak punya height:**
```jsx
// Salah - height akan 0
<MapContainer style={{}}>

// Benar - berikan height eksplisit
<MapContainer style={{ height: '500px', width: '100%' }}>
```

3. **Invalid GeoJSON:**
```javascript
// Debug: cek GeoJSON loaded
fetch('/kelurahan.geojson')
  .then(r => r.json())
  .then(data => {
    console.log('Features count:', data.features.length);
    console.log('Sample feature:', data.features[0]);
  });
```

---

### 🔴 Charts Not Rendering

**Gejala:** Chart area kosong atau error.

**Debug:**
```javascript
// Cek data yang dikirim ke chart
console.log('Chart data:', data);
console.log('Data type:', typeof data);
console.log('Data length:', data?.length);
```

**Penyebab umum:**
1. Data undefined atau null
2. Data bukan array
3. Field yang diminta tidak ada

**Solusi:**
```jsx
// Defensive rendering
{data && data.length > 0 ? (
  <DistributionChart data={data} indicator={indicator} />
) : (
  <Typography>Tidak ada data</Typography>
)}
```

---

### 🔴 Module not found

**Gejala:**
```
Module not found: Can't resolve '@mui/material'
```

**Solusi:**
```bash
npm install @mui/material @emotion/react @emotion/styled
```

**Untuk semua dependencies:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

---

### 🔴 White Screen of Death

**Gejala:** Halaman blank putih, tidak ada content.

**Debug:**
1. Buka browser DevTools (F12)
2. Cek tab Console untuk error
3. Cek tab Network untuk failed requests

**Penyebab umum:**
1. JavaScript error uncaught - lihat console
2. React error boundary triggered
3. Failed import

**Quick fix:**
```jsx
// Wrap app dengan error boundary
import ErrorBoundary from './components/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Data Issues

### 🔴 Indicator Values All Zero

**Gejala:** Semua nilai indikator menunjukkan 0.

**Debug:**
```javascript
// Cek apakah field ada di data
console.log('Sample village:', data[0]);
console.log('Has jumlah_sd:', 'jumlah_sd' in data[0]);
console.log('Value:', data[0].jumlah_sd);
```

**Penyebab:**
1. Field name typo
2. Field belum ada di JSON data
3. Field ada tapi nilainya memang 0 atau null

**Solusi:**
Pastikan field di config match dengan field di JSON:
```javascript
// config/categories.config.js
indicators: [
  {
    id: 'jumlah_sd',  // Harus sama persis dengan field di JSON
    label: 'Jumlah SD/Sederajat',
    field: 'jumlah_sd'  // Exact match required
  }
]
```

---

### 🔴 Filter Not Working

**Gejala:** Klik filter tapi data tidak berubah.

**Debug:**
```javascript
// Di komponen filter
const handleFilterChange = (value) => {
  console.log('Filter changed to:', value);
  onFilterChange(value);
};

// Di parent component
useEffect(() => {
  console.log('Filter state:', filters);
  console.log('Filtered data count:', filteredData.length);
}, [filters, filteredData]);
```

**Penyebab umum:**
1. State tidak di-update
2. Filter function salah
3. Key comparison salah (case-sensitive)

---

### 🔴 Map and Data Mismatch

**Gejala:** Ada desa di map tapi tidak ada datanya, atau sebaliknya.

**Debug:**
```javascript
// List semua nama di GeoJSON
geojson.features.forEach(f => {
  console.log('GeoJSON:', f.properties.WADMKD);
});

// List semua nama di Data
data.forEach(d => {
  console.log('Data:', d.nama_desa);
});

// Find mismatches
const geoNames = new Set(geojson.features.map(f => f.properties.WADMKD));
const dataNames = new Set(data.map(d => d.nama_desa));

dataNames.forEach(name => {
  if (!geoNames.has(name)) {
    console.warn('In data but not in GeoJSON:', name);
  }
});
```

**Solusi:**
Nama harus exact match. Cek:
- Spasi ekstra
- Case (huruf besar/kecil)
- Karakter khusus

---

## Performance Issues

### 🔴 Slow Initial Load

**Debug:**
```javascript
// Measure load time
console.time('dataLoad');
await podesService.getAllVillages();
console.timeEnd('dataLoad');
```

**Solusi:**
1. Gunakan loading skeleton
2. Lazy load components
3. Optimize API response

```javascript
// Lazy load
const GeospatialMap = React.lazy(() => import('./GeospatialMap'));

<Suspense fallback={<Skeleton height={500} />}>
  <GeospatialMap data={data} />
</Suspense>
```

---

### 🔴 Re-renders berlebihan

**Debug:**
```javascript
// Install React DevTools
// Aktifkan "Highlight updates"
// Lihat komponen mana yang re-render

// Atau tambahkan log
useEffect(() => {
  console.log('Component re-rendered');
});
```

**Solusi:**
```javascript
// Memoize expensive calculations
const chartData = useMemo(() => {
  return processData(data, indicator);
}, [data, indicator]);

// Memoize callbacks
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);

// Memoize components
const MemoizedChart = React.memo(DistributionChart);
```

---

## Environment Issues

### 🔴 Environment Variable Not Working

**Gejala:** `import.meta.env.VITE_API_URL` is undefined.

**Penyebab:**
1. File `.env` tidak di root folder
2. Variable name tidak dimulai dengan `VITE_`
3. Server belum direstart

**Solusi:**
```bash
# File harus di root: Frontend-PODES/.env
# Variable HARUS prefix VITE_
VITE_API_URL=http://localhost:5001/api

# Restart Vite setelah edit .env
npm run dev
```

---

### 🔴 Different Behavior Dev vs Production

**Debug:**
```javascript
// Cek environment
console.log('Mode:', import.meta.env.MODE);
console.log('Dev:', import.meta.env.DEV);
console.log('Prod:', import.meta.env.PROD);
console.log('API URL:', import.meta.env.VITE_API_URL);
```

**Penyebab umum:**
1. Hardcoded localhost URLs
2. `.env.production` tidak di-setup
3. Build cache outdated

**Solusi:**
```bash
# Clean build
rm -rf dist
npm run build
npm run preview  # Test production build locally
```

---

## Development Tips

### Enable Verbose Logging

```javascript
// Di development, aktifkan detailed logging
if (import.meta.env.DEV) {
  window.DEBUG = true;
}

// Gunakan dalam code
if (window.DEBUG) {
  console.log('Debug info:', data);
}
```

### React DevTools

Install extension React DevTools di browser untuk:
- Inspect component tree
- View props dan state
- Track re-renders
- Profile performance

### Network Inspection

Di browser DevTools → Network tab:
- Lihat semua API calls
- Check response status
- View response data
- Check timing

### Clear All Cache

```bash
# NPM cache
npm cache clean --force

# Delete build artifacts
rm -rf node_modules dist .vite

# Reinstall
npm install
```

---

## Getting Help

### Jika masih stuck:

1. **Check console** - Error message biasanya informatif
2. **Search error message** - Google/Stack Overflow
3. **Read documentation** - React, Vite, MUI docs
4. **Isolate problem** - Buat minimal reproduction
5. **Ask with context** - Sertakan:
   - Error message lengkap
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment (Node version, OS, browser)

---

*Troubleshooting Guide terakhir diperbarui: Desember 2024*
