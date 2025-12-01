# 📦 Component Reference - Frontend PODES Batu 2024

Dokumentasi lengkap semua komponen yang tersedia di aplikasi.

---

## Daftar Isi

1. [Layout Components](#1-layout-components)
2. [Page Components](#2-page-components)
3. [Filter Components](#3-filter-components)
4. [Visualization Components](#4-visualization-components)
5. [Analysis Components](#5-analysis-components)
6. [Table Components](#6-table-components)
7. [Utility Components](#7-utility-components)

---

## 1. Layout Components

### AppHeader

**File:** `components/AppHeader.jsx`

**Deskripsi:** Header navigasi yang konsisten di semua halaman.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logoHref` | string | `"/"` | URL untuk logo navigation |
| `ctaLabel` | string | `"Mulai Analisis"` | Label tombol CTA |
| `ctaHref` | string | `"/analysis"` | URL tombol CTA |
| `onCtaClick` | function | - | Handler click (override href) |
| `sticky` | boolean | `true` | Position sticky |
| `showCta` | boolean | `true` | Tampilkan tombol CTA |

**Contoh:**
```jsx
<AppHeader 
  ctaLabel="Home"
  onCtaClick={() => setCurrentPage('dashboard')}
/>
```

---

### Footer

**File:** `components/Footer.jsx`

**Deskripsi:** Footer dengan branding dan copyright.

**Props:** Tidak ada props

**Contoh:**
```jsx
<Footer />
```

---

### ErrorBoundary

**File:** `components/ErrorBoundary.jsx`

**Deskripsi:** Menangkap error di child components dan menampilkan fallback UI.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `children` | ReactNode | Child components |

**Contoh:**
```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## 2. Page Components

### LandingPage

**File:** `pages/LandingPage.jsx`

**Deskripsi:** Halaman landing dengan hero section dan feature cards.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `setCurrentPage` | function | Handler untuk navigasi |

---

### Dashboard

**File:** `pages/Dashboard.jsx`

**Deskripsi:** Dashboard overview dengan quick stats.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `setCurrentPage` | function | Handler untuk navigasi |

---

### AnalysisPage

**File:** `pages/AnalysisPage.jsx`

**Deskripsi:** Halaman utama untuk analisis data dengan filtering lengkap.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `setCurrentPage` | function | Handler untuk navigasi |

**Internal State:**

| State | Type | Description |
|-------|------|-------------|
| `data` | array | Data desa dari API |
| `loading` | boolean | Status loading |
| `error` | string | Error message |
| `metadata` | object | Metadata untuk filters |
| `viewMode` | string | 'analisis' atau 'peta' |
| `filters` | object | { category, indicator, kecamatan, desa } |

---

## 3. Filter Components

### FilterSidebar

**File:** `components/FilterSidebar.jsx`

**Deskripsi:** Sidebar dengan berbagai filter untuk data.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | boolean | Yes | Drawer open state |
| `onClose` | function | Yes | Close handler |
| `mobile` | boolean | Yes | Mode mobile |
| `filters` | object | Yes | Current filter values |
| `onChange` | function | Yes | `(key, value) => void` |
| `onReset` | function | Yes | Reset all filters |
| `categories` | array | Yes | Daftar kategori |
| `getIndicatorsForCategory` | function | Yes | Get indicators function |
| `kecamatanList` | array | Yes | Daftar kecamatan |
| `desaList` | array | Yes | Daftar desa |
| `viewMode` | string | No | Current view mode |
| `onViewModeChange` | function | No | View mode change handler |

**Contoh:**
```jsx
<FilterSidebar
  open={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  mobile={isMobile}
  filters={filters}
  onChange={handleFiltersChange}
  onReset={handleReset}
  categories={['Pendidikan', 'Kesehatan']}
  getIndicatorsForCategory={getIndicatorsForCategory}
  kecamatanList={['Batu', 'Bumiaji', 'Junrejo']}
  desaList={filteredDesaList}
  viewMode="analisis"
  onViewModeChange={setViewMode}
/>
```

---

### VillageIndicatorSelectors

**File:** `components/VillageIndicatorSelectors.jsx`

**Deskripsi:** Selector untuk memilih desa dan indikator dalam comparison view.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `villages` | array | Daftar desa available |
| `selectedVillages` | array | Desa yang dipilih |
| `onVillageSelect` | function | Handler selection |
| `indicators` | array | Daftar indikator |
| `selectedIndicators` | array | Indikator yang dipilih |
| `onIndicatorSelect` | function | Handler selection |
| `maxVillages` | number | Max desa yang bisa dipilih |

---

## 4. Visualization Components

### KPICards

**File:** `components/KPICards.jsx`

**Deskripsi:** Grid cards untuk menampilkan KPI metrics.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `analysisData` | object | Data analisis dengan type dan kpis |
| `totalVillages` | number | Total desa |
| `loading` | boolean | Loading state |

**analysisData structure:**
```javascript
// Type: summary (untuk "Semua" indicator)
{
  type: 'summary',
  kpis: {
    total_villages: 24,
    total_kecamatan: 3,
    category: 'Pendidikan',
    indicators_count: 4
  }
}

// Type: quantitative (untuk indikator numerik)
{
  type: 'quantitative',
  kpis: {
    total: 75,
    max: 7,
    min: 1,
    top: { nama_desa: 'Sisir', value: 7 }
  }
}

// Type: qualitative (untuk indikator kategorikal)
{
  type: 'qualitative',
  kpis: {
    most: 'Ada',
    mostCount: 18
  }
}
```

---

### GeospatialMap

**File:** `components/GeospatialMap.jsx`

**Deskripsi:** Peta interaktif dengan Leaflet untuk visualisasi geospasial.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | array | - | Data desa untuk coloring |
| `indicator` | string | - | Indikator untuk choropleth |
| `category` | string | - | Kategori aktif |
| `onVillageClick` | function | - | Handler klik desa |
| `height` | string | `'600px'` | Tinggi peta |

**Fitur:**
- Choropleth coloring berdasarkan indikator
- Popup detail saat klik
- Tooltip saat hover
- Legend
- Zoom controls
- Fullscreen button

---

### ComparisonView

**File:** `components/ComparisonView.jsx`

**Deskripsi:** View untuk membandingkan data antar desa.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `villages` | array | Daftar desa untuk selection |
| `dataset` | array | Dataset filtered |
| `currentCategory` | string | Kategori aktif |

**Internal State:**
- `selectedVillages`: Desa yang dipilih (max 4)
- `selectedIndicators`: Indikator yang dipilih
- `comparisonData`: Data hasil comparison

---

### Chart Components

#### DonutWithLegend

**File:** `components/charts/DonutWithLegend.jsx`

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `data` | array | `[{ label, value, color }]` |
| `title` | string | Chart title |
| `height` | number | Chart height |
| `showPercentages` | boolean | Show percentage labels |

#### BarGroupedStacked

**File:** `components/charts/BarGroupedStacked.jsx`

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `data` | array | Chart data |
| `title` | string | Chart title |
| `mode` | string | 'qualitative' atau 'numeric-bins' |
| `height` | number | Chart height |

#### RankingBarHorizontal

**File:** `components/RankingBarHorizontal.jsx`

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `data` | array | `[{ nama_desa, value }]` |
| `title` | string | Chart title |
| `color` | string | Bar color |
| `height` | number | Chart height |

---

## 5. Analysis Components

### IndicatorsSummary

**File:** `analysis/IndicatorsSummary.jsx`

**Deskripsi:** Accordion untuk menampilkan ringkasan semua indikator dalam kategori.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `categoryKey` | string | Key kategori (e.g., 'Pendidikan') |
| `data` | array | Data lengkap (semua desa) |
| `filteredData` | array | Data yang sudah difilter |

**Digunakan saat:** `filters.indicator === 'Semua'`

---

### IndicatorPanel

**File:** `analysis/IndicatorPanel.jsx`

**Deskripsi:** Panel detail untuk satu indikator dengan charts dan statistics.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `indicator` | object | Indicator config |
| `data` | array | Data desa |
| `isOpen` | boolean | Accordion open state |
| `onToggle` | function | Toggle handler |

---

### UniversalIndicatorPanel

**File:** `analysis/universal/UniversalIndicatorPanel.jsx`

**Deskripsi:** Panel universal yang dapat menangani indikator kuantitatif maupun kualitatif.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `categoryKey` | string | Key kategori |
| `indicatorKey` | string | Key indikator |
| `dataset` | array | Data desa |
| `isOpen` | boolean | Panel open state |
| `loading` | boolean | Loading state |

---

### SummaryAccordionSection

**File:** `analysis/sections/SummaryAccordionSection.jsx`

**Deskripsi:** Section accordion untuk kategori kualitatif.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `categoryKey` | string | Key kategori |
| `data` | array | Data lengkap |
| `filteredData` | array | Data filtered |
| `filters` | object | Current filters |
| `allowToggleAll` | boolean | Allow toggle all accordions |
| `accordionType` | string | 'single' atau 'multiple' |

---

## 6. Table Components

### FullDataTable

**File:** `components/table/FullDataTable.jsx`

**Deskripsi:** Tabel data lengkap dengan sorting dan pagination.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `categoryKey` | string | Key kategori |
| `rows` | array | Data desa |
| `debug` | boolean | Enable debug logging |

**Fitur:**
- Sortable columns
- Pagination
- Responsive
- Export to Excel (jika diimplementasikan)

---

### ComparisonTables

**File:** `components/ComparisonTables.jsx`

**Deskripsi:** Tabel perbandingan antar desa.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `data` | array | Comparison data |
| `indicators` | array | Indikator yang dibandingkan |
| `category` | string | Kategori aktif |

---

### DataTable

**File:** `components/DataTable.jsx`

**Deskripsi:** Generic data table component.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `columns` | array | Column definitions |
| `data` | array | Row data |
| `sortable` | boolean | Enable sorting |
| `pagination` | boolean | Enable pagination |
| `pageSize` | number | Items per page |

---

## 7. Utility Components

### LoadingSkeletons

**File:** `components/LoadingSkeletons.jsx`

**Deskripsi:** Skeleton loading placeholders.

**Exports:**
- `DashboardSkeleton` - Full dashboard skeleton
- `CardSkeleton` - Single card skeleton
- `ChartSkeleton` - Chart placeholder
- `TableSkeleton` - Table placeholder

**Contoh:**
```jsx
import { DashboardSkeleton, CardSkeleton } from './components/LoadingSkeletons';

{loading ? <DashboardSkeleton /> : <ActualContent />}
```

---

### MetricTile

**File:** `components/MetricTile.jsx`

**Deskripsi:** Single metric display tile.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | Metric label |
| `value` | string/number | Metric value |
| `icon` | ReactNode | Icon component |
| `color` | string | Theme color |
| `trend` | string | 'up', 'down', atau 'neutral' |

---

### BinaryDistributionBar

**File:** `components/BinaryDistributionBar.jsx`

**Deskripsi:** Horizontal bar untuk menampilkan distribusi binary (Ada/Tidak Ada).

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `positiveCount` | number | Jumlah "Ada" |
| `negativeCount` | number | Jumlah "Tidak Ada" |
| `positiveLabel` | string | Label positif |
| `negativeLabel` | string | Label negatif |
| `positiveColor` | string | Warna positif |
| `negativeColor` | string | Warna negatif |

---

## Import Pattern

```jsx
// Page components
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AnalysisPage from './pages/AnalysisPage';

// Layout components
import AppHeader from './components/AppHeader';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Filter components
import FilterSidebar from './components/FilterSidebar';

// Visualization components
import KPICards from './components/KPICards';
import GeospatialMap from './components/GeospatialMap';
import ComparisonView from './components/ComparisonView';

// Analysis components
import IndicatorsSummary from './analysis/IndicatorsSummary';
import UniversalIndicatorPanel from './analysis/universal/UniversalIndicatorPanel';

// Table components
import FullDataTable from './components/table/FullDataTable';

// Utility components
import { DashboardSkeleton } from './components/LoadingSkeletons';
```

---

*Component reference terakhir diperbarui: Desember 2025*
