export interface SensorData {
  stationName: string;
  currentMonth: {
    extT: number | 0;
    hr: number | 0;
    o3: number | 0;
    no2: number | 0;
    pm25: number | 0;
    pm10: number | 0;
  };
  lastMonth: {
    extT: number | null;
    hr: number | null;
    o3: number | null;
    no2: number | null;
    pm25: number | null;
    pm10: number | null;
  };
  date: string,
}
  