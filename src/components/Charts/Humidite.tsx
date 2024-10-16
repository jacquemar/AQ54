import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subDays, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DataPoint {
  x: number;
  y: number;
}

interface ChartSeries {
  name: string;
  data: DataPoint[];
}

const HumiditeChart: React.FC = () => {
  const [series, setSeries] = useState<ChartSeries[]>([]);
  const [aggregationType, setAggregationType] = useState<'hour' | 'day'>('hour');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [stationName, setStationName] = useState<string>("SMART188");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [aggregationType, stationName, currentDate]);

  const fetchData = async () => {
    try {
      setError(null);
      let startDate: string, endDate: string;
      if (aggregationType === 'hour') {
        startDate = format(subDays(currentDate, 1), 'yyyy-MM-dd');
        endDate = format(addDays(currentDate, 1), 'yyyy-MM-dd');
      } else {
        startDate = format(subWeeks(startOfWeek(currentDate, { weekStartsOn: 1 }), 1), 'yyyy-MM-dd');
        endDate = format(addWeeks(endOfWeek(currentDate, { weekStartsOn: 1 }), 1), 'yyyy-MM-dd');
      }
      
      const response = await fetch(`http://localhost:3000/stations/${stationName}/alldata?aggregation=${aggregationType}&startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      processDataForChart(data);
    } catch (error) {
      setError(`Erreur lors de la récupération des données: ${(error as Error).message}`);
      console.error('Erreur détaillée:', error);
    }
  };

  const processDataForChart = (data: any[]) => {
    const points: DataPoint[] = data.map((item) => ({
      x: new Date(item.hour || item.day).getTime(),
      y: parseFloat(item.rh_pourcentage)
    }));
    setSeries([{
      name: 'Humidité relative (%)',
      data: points
    }]);
  };

  const handleDateChange = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => 
      direction === 'next' 
        ? (aggregationType === 'hour' ? addDays(prevDate, 1) : addWeeks(prevDate, 1))
        : (aggregationType === 'hour' ? subDays(prevDate, 1) : subWeeks(prevDate, 1))
    );
  };

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 350,
      type: 'area',
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      background:'#FFFFFF',
    },
    colors: ['#3C50E0'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        format: aggregationType === 'hour' ? 'HH:mm' : 'dd MMM',
        style: {
          colors:'#64748B',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'Humidité relative (%)',
        style: {
          fontSize: '14px',
          fontWeight: 500,
          color:'#64748B',
        },
      },
      min: 0,
      max: 100,
      tickAmount: 10,
      labels: {
        formatter: function(value: number) {
          return `${value.toFixed(1)}%`;
        },
        style: {
          colors:'#64748B',
        },
      },
    },
    grid: {
      borderColor:'#E2E8F0',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      x: {
        format: aggregationType === 'hour' ? 'dd MMM HH:mm' : 'dd MMM yyyy',
      },
      theme:'light',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
  };

  return (
    <div className="rounded-sm border border-stroke dark:border-strokedark dark:bg-boxdark  p-4 shadow-default">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center">
        <select 
  value={aggregationType} 
  onChange={(e) => {
    const value = e.target.value;
    if (value === 'hour' || value === 'day') {
      setAggregationType(value);
    }
  }}
  className="mr-2 rounded bg-orange-600 border-gray-300 p-2 text-white text-sm"
>
  <option value="hour">Heure</option>
  <option value="day">Jour</option>
</select>
          <select
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            className="rounded border-gray-300 p-2 bg-slate-300 text-black text-sm"
          >
            <option value="SMART188">SMART188</option>
            <option value="SMART189">SMART189</option>
          </select>
        </div>
        <div className="flex items-center">
        <span className="flex w-3 h-3 me-3 bg-green-500 rounded-full"></span>

          <button onClick={() => handleDateChange('prev')} className="mr-2 rounded bg-primary px-3 py-1 text-sm text-white">Précédent</button>
          <span className="text-sm font-medium">
            {aggregationType === 'hour' 
              ? format(currentDate, 'dd MMM yyyy', { locale: fr })
              : `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'dd MMM', { locale: fr })} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'dd MMM yyyy', { locale: fr })}`
            }
          </span>
          <button onClick={() => handleDateChange('next')} className="ml-2 rounded bg-primary px-3 py-1 text-sm text-white">Suivant</button>
        </div>
      </div>

      <div className="mb-2">
        <h3 className="text-xl font-bold text-black dark:text-white">
          Humidité Relative {stationName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {aggregationType === 'hour' ? 'Données horaires' : 'Données journalières'}
        </p>
      </div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : series.length > 0 ? (
        <div id="temperatureChart">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
          />
        </div>
      ) : (
        <p className={'text-gray-800'}>Chargement des données...</p>
      )}
    </div>
  );
};

export default HumiditeChart;