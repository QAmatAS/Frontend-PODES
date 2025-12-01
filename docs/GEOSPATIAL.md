# 🗺️ Geospatial & Map Guide - Dashboard PODES Batu 2024

Panduan lengkap untuk komponen peta interaktif menggunakan Leaflet.

---

## Overview

Dashboard menggunakan **Leaflet** (via react-leaflet) untuk menampilkan peta choropleth interaktif yang menunjukkan data indikator per desa di Kota Batu.

### Libraries Used

| Library | Version | Purpose |
|---------|---------|---------|
| leaflet | ^1.9.4 | Core mapping library |
| react-leaflet | ^5.1.0 | React wrapper for Leaflet |

---

## File Structure

```
Frontend-PODES/
├── src/
│   └── components/
│       └── GeospatialMap.jsx     # Main map component
└── public/
    └── kelurahan.geojson         # GeoJSON data

Backend-PODES/
└── data/
    └── kelurahan.geojson         # Same GeoJSON file
```

---

## GeoJSON Data

### Location

File GeoJSON: `public/kelurahan.geojson`

### Structure

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "WADMKC": "Batu",           // Nama kecamatan
        "WADMKD": "Oro-oro Ombo"    // Nama desa/kelurahan
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[lng, lat], [lng, lat], ...]]
      }
    },
    // ... 23 more features (total 24 desa)
  ]
}
```

### Properties Explained

| Property | Description | Example |
|----------|-------------|---------|
| WADMKC | Nama Kecamatan (Wilayah Administratif Kecamatan) | "Batu", "Bumiaji", "Junrejo" |
| WADMKD | Nama Desa/Kelurahan (Wilayah Administratif Desa) | "Oro-oro Ombo", "Temas" |

### Villages List

Kota Batu memiliki 24 desa/kelurahan dalam 3 kecamatan:

**Kecamatan Batu (8 desa):**
- Oro-oro Ombo, Temas, Sisir, Ngaglik, Pesanggrahan, Songgokerto, Sumberejo, Sidomulyo

**Kecamatan Bumiaji (9 desa):**
- Tulungrejo, Sumbergondo, Punten, Gunungsari, Bumiaji, Pandanrejo, Giripurno, Bulukerto, Sumberbrantas

**Kecamatan Junrejo (7 desa):**
- Tlekung, Junrejo, Mojorejo, Torongrejo, Beji, Pendem, Dadaprejo

---

## Component: GeospatialMap

### Import

```javascript
import GeospatialMap from '../components/GeospatialMap';
```

### Basic Usage

```jsx
<GeospatialMap
  data={villageData}              // Array of village data
  selectedIndicator="jumlah_sd"   // Indicator field to visualize
  indicatorLabel="Jumlah SD/Sederajat"      // Display label
  colorScheme="blue"              // Color scheme
  title="Distribusi Jumlah SD/Sederajat"    // Map title
/>
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| data | Array | Yes | - | Array of village objects from API |
| selectedIndicator | string | Yes | - | Field name to visualize (e.g., 'jumlah_sd') |
| indicatorLabel | string | No | selectedIndicator | Human-readable label |
| colorScheme | string | No | 'blue' | Color scheme: 'blue', 'green', 'red', 'orange' |
| title | string | No | '' | Map title shown at top |
| height | string | No | '500px' | Map container height |

### Data Format

```javascript
// data prop harus berisi array seperti ini:
const villageData = [
  {
    id_desa: 1,
    nama_desa: 'Oro-oro Ombo',    // HARUS match dengan WADMKD di GeoJSON
    kecamatan: 'Batu',
    jumlah_sd: 5,
    jumlah_tk: 3,
    // ... indicator lainnya
  },
  // ...
];
```

**PENTING:** Field `nama_desa` harus EXACT MATCH dengan property `WADMKD` di GeoJSON. Case-sensitive!

---

## How Choropleth Works

### 1. Data Joining

```javascript
// Pseudocode di dalam GeospatialMap
const onEachFeature = (feature, layer) => {
  // Get village name from GeoJSON
  const villageName = feature.properties.WADMKD;
  
  // Find matching data
  const villageData = data.find(d => d.nama_desa === villageName);
  
  // Get indicator value
  const value = villageData?.[selectedIndicator] || 0;
  
  // Apply color based on value
  layer.setStyle({
    fillColor: getColor(value),
    fillOpacity: 0.7
  });
};
```

### 2. Color Scale

```javascript
// Simplified color scale logic
const getColor = (value, min, max, scheme) => {
  // Normalize value to 0-1
  const normalized = (value - min) / (max - min);
  
  // Color schemes
  const schemes = {
    blue: ['#f7fbff', '#08306b'],   // Light to dark blue
    green: ['#f7fcf5', '#00441b'],
    red: ['#fff5f0', '#67000d'],
    orange: ['#fff5eb', '#7f2704']
  };
  
  // Interpolate color
  return interpolateColor(schemes[scheme], normalized);
};
```

### 3. Legend

Legend dibuat berdasarkan range nilai:

```javascript
// Generate 5 breaks untuk legend
const breaks = [
  min,
  min + range * 0.25,
  min + range * 0.5,
  min + range * 0.75,
  max
];
```

---

## Customization

### Custom Color Scheme

```jsx
// Tambahkan color scheme baru di GeospatialMap.jsx
const colorSchemes = {
  blue: ['#f7fbff', '#6baed6', '#08306b'],
  green: ['#f7fcf5', '#74c476', '#00441b'],
  red: ['#fff5f0', '#fc9272', '#67000d'],
  orange: ['#fff5eb', '#fd8d3c', '#7f2704'],
  purple: ['#fcfbfd', '#9e9ac8', '#3f007d'],  // NEW
};

// Usage
<GeospatialMap colorScheme="purple" ... />
```

### Map Center & Zoom

```javascript
// Di dalam GeospatialMap.jsx
// Center of Kota Batu
const BATU_CENTER = [-7.8711, 112.5275];
const DEFAULT_ZOOM = 12;

<MapContainer
  center={BATU_CENTER}
  zoom={DEFAULT_ZOOM}
  // ...
/>
```

### Base Map Tiles

```javascript
// Default: OpenStreetMap
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; OpenStreetMap contributors'
/>

// Alternative: CartoDB Light (lebih bersih untuk choropleth)
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
  attribution='&copy; OpenStreetMap contributors &copy; CARTO'
/>

// Alternative: Esri WorldImagery (satellite)
<TileLayer
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  attribution='&copy; Esri'
/>
```

---

## Popup/Tooltip

### Current Implementation

```javascript
// Popup saat click
layer.bindPopup(`
  <div>
    <h4>${villageName}</h4>
    <p>Kecamatan: ${kecamatan}</p>
    <p>${indicatorLabel}: ${value}</p>
  </div>
`);

// Tooltip saat hover
layer.bindTooltip(`${villageName}: ${value}`, {
  permanent: false,
  direction: 'top'
});
```

### Custom Popup

```jsx
// Rich popup dengan styling
const createPopup = (villageName, data, indicator, label) => `
  <div style="min-width: 200px;">
    <h3 style="margin: 0 0 10px 0; color: #1565c0;">
      ${villageName}
    </h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 5px; border-bottom: 1px solid #eee;">
          Kecamatan
        </td>
        <td style="padding: 5px; border-bottom: 1px solid #eee; text-align: right;">
          ${data.kecamatan}
        </td>
      </tr>
      <tr>
        <td style="padding: 5px;">
          ${label}
        </td>
        <td style="padding: 5px; text-align: right; font-weight: bold; color: #2196f3;">
          ${data[indicator]}
        </td>
      </tr>
    </table>
  </div>
`;
```

---

## Events

### Handle Click Events

```javascript
const onEachFeature = (feature, layer) => {
  layer.on({
    click: (e) => {
      const villageName = feature.properties.WADMKD;
      console.log('Clicked:', villageName);
      // Trigger external handler
      onVillageClick?.(villageName);
    },
    mouseover: (e) => {
      e.target.setStyle({
        weight: 3,
        color: '#333',
        fillOpacity: 0.9
      });
    },
    mouseout: (e) => {
      e.target.setStyle({
        weight: 1,
        color: '#fff',
        fillOpacity: 0.7
      });
    }
  });
};
```

### Zoom to Village

```javascript
// Zoom ke desa tertentu
const zoomToVillage = (villageName) => {
  const layer = geojsonLayer.current.getLayers().find(
    l => l.feature.properties.WADMKD === villageName
  );
  if (layer) {
    map.fitBounds(layer.getBounds());
  }
};
```

---

## Integration dengan Filter

```jsx
// Di AnalysisPage.jsx
const AnalysisPage = () => {
  const [data, setData] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState('jumlah_sd');
  const [selectedKecamatan, setSelectedKecamatan] = useState('all');

  // Filter data for map
  const mapData = useMemo(() => {
    if (selectedKecamatan === 'all') return data;
    return data.filter(d => d.kecamatan === selectedKecamatan);
  }, [data, selectedKecamatan]);

  return (
    <Grid container>
      <Grid item xs={3}>
        <FilterSidebar
          onIndicatorChange={setSelectedIndicator}
          onKecamatanChange={setSelectedKecamatan}
        />
      </Grid>
      <Grid item xs={9}>
        <GeospatialMap
          data={mapData}
          selectedIndicator={selectedIndicator}
        />
      </Grid>
    </Grid>
  );
};
```

---

## Performance Tips

### 1. Memoize GeoJSON

```javascript
// GeoJSON data jarang berubah, memoize-lah
const memoizedGeojson = useMemo(() => {
  return geojsonData;
}, []);
```

### 2. Simplify Geometry

Jika performa lambat, simplify GeoJSON:

```bash
# Using mapshaper CLI
npx mapshaper kelurahan.geojson -simplify 10% -o kelurahan_simplified.geojson
```

### 3. Lazy Load Map

```javascript
import { lazy, Suspense } from 'react';

const GeospatialMap = lazy(() => import('./components/GeospatialMap'));

// Usage
<Suspense fallback={<CircularProgress />}>
  <GeospatialMap {...props} />
</Suspense>
```

---

## Troubleshooting

### Map Not Showing

1. **CSS not imported:**
```javascript
// Di main.jsx atau App.jsx
import 'leaflet/dist/leaflet.css';
```

2. **Container height 0:**
```jsx
// Pastikan container punya height
<div style={{ height: '500px' }}>
  <GeospatialMap />
</div>
```

### GeoJSON Not Loading

1. **File path salah:**
```javascript
// Gunakan path relatif dari public folder
fetch('/kelurahan.geojson')
```

2. **CORS issue (development):**
File di `public/` folder otomatis served tanpa CORS issue.

### Data Not Matching

1. **Nama desa tidak match:**
```javascript
// Debug: log nama yang tidak match
data.forEach(d => {
  const match = geojson.features.find(
    f => f.properties.WADMKD === d.nama_desa
  );
  if (!match) {
    console.warn('No match for:', d.nama_desa);
  }
});
```

2. **Cek typo dan case:**
```javascript
// Normalize comparison
const normalizedName = d.nama_desa.toLowerCase().trim();
const match = geojson.features.find(
  f => f.properties.WADMKD.toLowerCase().trim() === normalizedName
);
```

### Marker Icon Missing

```javascript
// Fix Leaflet default marker icon issue
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
```

---

## Extending Map Features

### Add Marker Layer

```jsx
import { Marker, Popup } from 'react-leaflet';

// Di dalam MapContainer
{markers.map(marker => (
  <Marker 
    key={marker.id}
    position={[marker.lat, marker.lng]}
  >
    <Popup>{marker.name}</Popup>
  </Marker>
))}
```

### Add Circle Markers (Proportional Symbols)

```jsx
import { CircleMarker } from 'react-leaflet';

// Visualize dengan proportional circles
{data.map(village => (
  <CircleMarker
    key={village.id_desa}
    center={[village.lat, village.lng]}
    radius={Math.sqrt(village[indicator]) * 2}
    pathOptions={{ 
      color: '#2196f3',
      fillColor: '#2196f3',
      fillOpacity: 0.5 
    }}
  >
    <Popup>{village.nama_desa}: {village[indicator]}</Popup>
  </CircleMarker>
))}
```

### Map Export

```javascript
// Export map as image (requires additional library)
import { useMap } from 'react-leaflet';
import leafletImage from 'leaflet-image';

const ExportButton = () => {
  const map = useMap();
  
  const exportMap = () => {
    leafletImage(map, (err, canvas) => {
      const link = document.createElement('a');
      link.download = 'map.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };
  
  return <button onClick={exportMap}>Export Map</button>;
};
```

---

*Geospatial Guide terakhir diperbarui: Desember 2024*
