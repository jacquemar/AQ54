import React from 'react';

interface SensorDataCardProps {
  title: string;
  image: string;
  extT: string; 
  hr: string;   
  o3: string;   
  no2: string;  
  pm10: string; 
  pm25: string; 
  statusMessage: string;
  date: string;
}

const SensorDataCard: React.FC<SensorDataCardProps> = ({
  title,
  image,
  extT,
  hr,
  o3,
  no2,
  pm25,
  pm10,
  statusMessage,
  date,
}) => {
  return (
    <div className="flex flex-col items-center dark:border-strokedark dark:bg-boxdark bg-gray-2 border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <img
        className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
        src={image}
        alt="Sensor Data"
      />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <div className='flex flex-row justify-between'>   
        <h5 className="mb-2 text-2xl font-bold capitalize tracking-tight text-gray-900 dark:text-white">{title}</h5>
        <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-3 rounded dark:bg-green-900 dark:text-green-300">{date}</span>
        </div>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{statusMessage}</p>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between text-sm">
            <span>Température Extérieure (ExtT):</span> <span className='font-bold'>{extT} °C</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Humidité Relative (Hr):</span> <span className='font-bold'>{hr} %</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Ozone (O3):</span> <span className='font-bold'>{o3} µg/m³</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Dioxyde d'azote (NO2):</span> <span className='font-bold'>{no2} µg/m³</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Particules PM2.5:</span> <span className='font-bold' >{pm25} µg/m³</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Particules PM10:</span> <span className='font-bold'>{pm10} µg/m³</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorDataCard;
