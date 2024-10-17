import React, { useEffect, useState } from 'react';
import TempExt from '../../components/Charts/TempExt';
import Smart188 from '../../components/Tables/Smart188';
import Humidite from '../../components/Charts/Humidite';
import DioxydeAzote from '../../components/Charts/DioxydeAzote';
import OzoneChart from '../../components/Charts/Ozone';
import Pm10 from '../../components/Charts/Pm10';
import Pm25 from '../../components/Charts/Pm25';
import SensorDataCard from '../../components/SensorDataCard';
import { SensorData } from '../../types/sensorData';
import SMART189 from '../../components/Tables/Smart189';

 // Obtenir les dates pour les mois en cours
 const getCurrentDateString = () => {
  const date = new Date();
  return `${date.getMonth() + 1}/${date.getFullYear()}`; // Format MM/YYYY
};
// Obtenir les dates pour les mois passé
const getLastMonthDateString = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return `${date.getMonth() + 1}/${date.getFullYear()}`; // Format MM/YYYY
};

const ECommerce: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]); 

  // Fonction pour récupérer les données mensuelles
  const fetchMonthlyAverages = async () => {
    try {
      const response = await fetch('http://localhost:3000/stations/monthly-averages');
      const data = await response.json();
      if (Array.isArray(data)) {
        const formattedData = data.map((item: any) => ({
          stationName: item.stationName,
          currentMonth: {
            extT: parseFloat(item.data.currentMonth[0].avg_temperature),
            hr: parseFloat(item.data.currentMonth[0].avg_rh),
            o3: parseFloat(item.data.currentMonth[0].avg_o3),
            no2: parseFloat(item.data.currentMonth[0].avg_no2),
            pm25: parseFloat(item.data.currentMonth[0].avg_pm25),
            pm10: parseFloat(item.data.currentMonth[0].avg_pm10),
          },
          lastMonth: {
            extT: item.data.lastMonth[0].avg_temperature ? parseFloat(item.data.lastMonth[0].avg_temperature) : null,
            hr: item.data.lastMonth[0].avg_rh ? parseFloat(item.data.lastMonth[0].avg_rh) : null, 
            o3: item.data.lastMonth[0].avg_o3 ? parseFloat(item.data.lastMonth[0].avg_o3) : null,
            no2: item.data.lastMonth[0].avg_no2 ? parseFloat(item.data.lastMonth[0].avg_no2) : null,
            pm25: item.data.lastMonth[0].avg_pm25 ? parseFloat(item.data.lastMonth[0].avg_pm25) : null,
            pm10: item.data.lastMonth[0].avg_pm10 ? parseFloat(item.data.lastMonth[0].avg_pm10) : null,
          },
          date: getCurrentDateString(),
        }));
        setSensorData(formattedData);
      } else {
        console.error('Les données ne sont pas au format attendu:', data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des moyennes mensuelles :', error);
    }
  };

  useEffect(() => {
    fetchMonthlyAverages();
  }, []);

  const formatValue = (value: number | null): string => {
    if (value === null) {
      return 'N/A';
    }
    return value.toFixed(2);
  };
  
  

  return (
    <>  
   <div className="flex flex-row gap-4 scrollbar-hide overflow-x-auto md:gap-6 xl:gap-7.5 whitespace-nowrap">
        
        {sensorData.length > 0 ? (
          <>
          
          {sensorData.map((sensor, index) => (
              <div key={`current-${index}`} className="min-w-[300px] shrink-0 overflow-hidden">
                <SensorDataCard
                  title={`${sensor.stationName}`} 
                  image='https://i.pinimg.com/564x/e3/2d/42/e32d42075d6f4d93bf1a3f27e96d4689.jpg'
                  extT={formatValue(sensor.currentMonth.extT)} 
                  hr={formatValue(sensor.currentMonth.hr)} 
                  o3={formatValue(sensor.currentMonth.o3)} 
                  no2={formatValue(sensor.currentMonth.no2)} 
                  pm10={formatValue(sensor.currentMonth.pm10)} 
                  pm25={formatValue(sensor.currentMonth.pm25)} 
                  statusMessage='Le temps est très humide, pensez à vous couvrir'
                  date={getCurrentDateString()}
                />
              </div>
            ))}

          {/* Affichage des données du mois passé */}
          {sensorData.map((sensor, index) => (
              <div key={`last-${index}`} className="min-w-[300px] shrink-0 overflow-hidden">
                <SensorDataCard
                  title={`${sensor.stationName}`} 
                  image='https://img.freepik.com/photos-gratuite/rayons-soleil-ciel-nuageux_23-2148824930.jpg'
                  extT={formatValue(sensor.lastMonth.extT)}
                  hr={formatValue(sensor.lastMonth.hr)} 
                  o3={formatValue(sensor.lastMonth.o3)} 
                  no2={formatValue(sensor.lastMonth.no2)} 
                  pm10={formatValue(sensor.lastMonth.pm10)} 
                  pm25={formatValue(sensor.lastMonth.pm25)} 
                  statusMessage= "l'air est très sec"
                  date={getLastMonthDateString()}
                />
              </div>
            ))}
        </>
        ) : (
          <p>Aucune donnée disponible</p> // Message
        )}
      </div>

      {/* Section des graphiques */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
        <TempExt />
        <Humidite />
        <OzoneChart />
        <DioxydeAzote/>
        <Pm10/>
        <Pm25/>
      </div>

      {/* Section des tableaux */}
      <div className="col-span-12 mt-8 xl:col-span-8">
        <Smart188/>
        <SMART189/>
      </div>
    </>
  );
};



export default ECommerce;
