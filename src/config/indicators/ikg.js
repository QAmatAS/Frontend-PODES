// IKG (Indeks Kesulitan Geografis) Indicators Configuration
// Centralized configuration for IKG category indicators

const IKG_INDICATORS = [
  {
    id: 'ikg_total',
    key: 'ikg_total',
    title: 'IKG Total',
    label: 'IKG Total',
    dataKey: 'ikg_total',
    description: 'Indeks Kesulitan Geografis Total mengukur tingkat kesulitan akses dan pembangunan di suatu wilayah',
    icon: '📊',
    type: 'quantitative'
  },
  {
    id: 'ikg_pelayanan_dasar',
    key: 'ikg_pelayanan_dasar',
    title: 'IKG Pelayanan Dasar',
    label: 'IKG Pelayanan Dasar',
    dataKey: 'ikg_pelayanan_dasar',
    description: 'Indeks kesulitan akses ke layanan dasar seperti pendidikan dan kesehatan',
    icon: '🏥',
    type: 'quantitative'
  },
  {
    id: 'ikg_infrastruktur',
    key: 'ikg_infrastruktur',
    title: 'IKG Infrastruktur',
    label: 'IKG Infrastruktur',
    dataKey: 'ikg_infrastruktur',
    description: 'Indeks kesulitan terkait kondisi infrastruktur seperti jalan, jembatan, dan utilitas',
    icon: '🏗️',
    type: 'quantitative'
  },
  {
    id: 'ikg_aksesibilitas',
    key: 'ikg_aksesibilitas',
    title: 'IKG Aksesibilitas',
    label: 'IKG Aksesibilitas',
    dataKey: 'ikg_aksesibilitas',
    description: 'Indeks kesulitan aksesibilitas dari geografis dan transportasi',
    icon: '🛣️',
    type: 'quantitative'
  }
];

export default IKG_INDICATORS;
