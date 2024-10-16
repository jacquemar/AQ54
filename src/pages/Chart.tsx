import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TempExt from '../components/Charts/TempExt';
import Humidite from '../components/Charts/Humidite';
import DioxydeAzote from '../components/Charts/DioxydeAzote';
import OzoneChart from '../components/Charts/Ozone';
import Pm10 from '../components/Charts/Pm10';
import Pm25 from '../components/Charts/Pm25';


const Chart: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Graphiques" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <TempExt />
        <Humidite />
        <OzoneChart />
        <DioxydeAzote/>
        <Pm10/>
        <Pm25/>
        
      </div>
    </>
  );
};

export default Chart;
