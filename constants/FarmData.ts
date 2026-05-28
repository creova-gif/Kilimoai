export interface ZoneData {
  id: number;
  nameEn: string;
  nameSw: string;
  cropEn: string;
  cropSw: string;
  area: string;
  centerLat: number;
  centerLng: number;
  coordinates: { latitude: number; longitude: number }[];
  // Metrics
  productivity: 'High' | 'Average' | 'Low';
  productivitySw: 'Juu' | 'Wastani' | 'Chini';
  ndvi: number;
  ph: number;
  moisture: string;
  nitrogen: { statusEn: string; statusSw: string; value: string; color: string };
  phosphorus: { statusEn: string; statusSw: string; value: string; color: string };
  potassium: { statusEn: string; statusSw: string; value: string; color: string };
  // Messages & Alerts
  messageEn: string;
  messageSw: string;
  alertType?: 'warning' | 'info';
}

export const ZONES: ZoneData[] = [
  {
    id: 42,
    nameEn: 'Zone 42 - Cornfield',
    nameSw: 'Ukanda 42 - Shamba la Mahindi',
    cropEn: 'Corn',
    cropSw: 'Mahindi',
    area: '4.5 ha',
    coordinates: [
      { latitude: -6.8270, longitude: 37.6680 },
      { latitude: -6.8265, longitude: 37.6695 },
      { latitude: -6.8280, longitude: 37.6698 },
      { latitude: -6.8285, longitude: 37.6682 },
    ],
    centerLat: -6.8275, centerLng: 37.6688,
    productivity: 'High',
    productivitySw: 'Juu',
    ndvi: 0.82,
    ph: 6.2,
    moisture: '68%',
    nitrogen: { statusEn: 'Optimal', statusSw: 'Safi', value: '85%', color: '#22d15a' },
    phosphorus: { statusEn: 'Optimal', statusSw: 'Safi', value: '78%', color: '#22d15a' },
    potassium: { statusEn: 'Optimal', statusSw: 'Safi', value: '80%', color: '#22d15a' },
    messageEn: 'High Productivity Zone',
    messageSw: 'Ukanda wenye Uzalishaji wa Juu',
  },
  {
    id: 12,
    nameEn: 'Zone 12 - Wheatfield',
    nameSw: 'Ukanda 12 - Shamba la Ngano',
    cropEn: 'Wheat',
    cropSw: 'Ngano',
    area: '6.2 ha',
    coordinates: [
      { latitude: -6.8265, longitude: 37.6695 },
      { latitude: -6.8260, longitude: 37.6710 },
      { latitude: -6.8275, longitude: 37.6715 },
      { latitude: -6.8280, longitude: 37.6698 },
    ],
    centerLat: -6.8268, centerLng: 37.6705,
    productivity: 'Low',
    productivitySw: 'Chini',
    ndvi: 0.45,
    ph: 5.5,
    moisture: '52%',
    nitrogen: { statusEn: 'Low (-15%)', statusSw: 'Chini (-15%)', value: '40%', color: '#D97706' },
    phosphorus: { statusEn: 'Optimal', statusSw: 'Safi', value: '70%', color: '#22d15a' },
    potassium: { statusEn: 'Optimal', statusSw: 'Safi', value: '65%', color: '#22d15a' },
    messageEn: 'Low Nitrogen detected. Apply Urea.',
    messageSw: 'Nitrojeni iko chini. Weka mbolea ya Urea.',
    alertType: 'warning',
  },
  {
    id: 8,
    nameEn: 'Zone 8 - Ricefield',
    nameSw: 'Ukanda 8 - Shamba la Mpunga',
    cropEn: 'Rice',
    cropSw: 'Mpunga',
    area: '1.2 ha',
    coordinates: [
      { latitude: -6.8285, longitude: 37.6682 },
      { latitude: -6.8280, longitude: 37.6698 },
      { latitude: -6.8295, longitude: 37.6695 },
      { latitude: -6.8300, longitude: 37.6680 },
    ],
    centerLat: -6.8290, centerLng: 37.6688,
    productivity: 'Average',
    productivitySw: 'Wastani',
    ndvi: 0.68,
    ph: 6.8,
    moisture: '82%',
    nitrogen: { statusEn: 'Optimal', statusSw: 'Safi', value: '75%', color: '#22d15a' },
    phosphorus: { statusEn: 'Optimal', statusSw: 'Safi', value: '82%', color: '#22d15a' },
    potassium: { statusEn: 'Optimal', statusSw: 'Safi', value: '74%', color: '#22d15a' },
    messageEn: 'High moisture level ideal for rice.',
    messageSw: 'Unyevu wa juu unaofaa kwa mpunga.',
    alertType: 'info',
  },
  {
    id: 5,
    nameEn: 'Zone 5 - Veggie Patch',
    nameSw: 'Ukanda 5 - Kiriba cha Mboga',
    cropEn: 'Vegetables',
    cropSw: 'Mboga',
    area: '1.2 ha',
    coordinates: [
      { latitude: -6.8280, longitude: 37.6698 },
      { latitude: -6.8275, longitude: 37.6715 },
      { latitude: -6.8290, longitude: 37.6712 },
      { latitude: -6.8295, longitude: 37.6695 },
    ],
    centerLat: -6.8285, centerLng: 37.6705,
    productivity: 'Low',
    productivitySw: 'Chini',
    ndvi: 0.55,
    ph: 7.2,
    moisture: '40%',
    nitrogen: { statusEn: 'Optimal', statusSw: 'Safi', value: '68%', color: '#22d15a' },
    phosphorus: { statusEn: 'Optimal', statusSw: 'Safi', value: '66%', color: '#22d15a' },
    potassium: { statusEn: 'Deficient (-22%)', statusSw: 'Pungufu (-22%)', value: '25%', color: '#DC2626' },
    messageEn: 'Potassium deficiency. Boost suggested.',
    messageSw: 'Upungufu wa Potasiamu. Ongeza mbolea.',
    alertType: 'warning',
  },
];
