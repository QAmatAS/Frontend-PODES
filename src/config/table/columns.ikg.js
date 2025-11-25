/**
 * Column configuration for IKG (Indeks Kesulitan Geografis) category
 */
import { BASE_COLUMNS, createColumn } from './columns.common.js';

export const IKG_COLUMNS = [
  ...BASE_COLUMNS,
  createColumn('ikg_total', 'IKG Total', { isNumeric: true }),
  createColumn('ikg_pelayanan_dasar', 'IKG Pelayanan Dasar', { isNumeric: true }),
  createColumn('ikg_infrastruktur', 'IKG Infrastruktur', { isNumeric: true }),
  createColumn('ikg_aksesibilitas', 'IKG Aksesibilitas', { isNumeric: true })
];
