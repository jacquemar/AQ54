
export interface MonthlyData {
    station_name: string;  // Nom de la station (ex: SMART188)
    timestamp: string;     // Date et heure de l'enregistrement au format ISO
    extt: string;          // Température extérieure
    rh: string;            // Humidité relative
    o3: string;            // Concentration d'ozone (O3)
    no2: string;           // Concentration de dioxyde d'azote (NO2)
    pm25: string;          // Particules fines (PM2.5)
    pm10: string;          // Particules fines (PM10)
  }
  