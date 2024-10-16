import { useEffect, useState } from 'react';
import { MonthlyData } from '../../types/monthlyData';
import Loader from '../../common/Loader/index';

const SMART189: React.FC = () => {
  const [datas, setDatas] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const [itemsPerPage] = useState(10); // Nombre d'éléments par page

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/stations/current-month?stations=SMART189');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      const data = await response.json();
      setDatas(data);
    } catch (error) {
      if (error instanceof Error) { 
        setError(error.message); 
      } else {
        setError('Une erreur inconnue est survenue'); 
      }
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  // Fonction de rafraîchissement des données
  const refreshData = () => {
    fetchData();
    setCurrentPage(1);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  // Logique de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = datas.slice(indexOfFirstItem, indexOfLastItem);

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(datas.length / itemsPerPage);

  return (
    <div className="rounded-sm border mt-10 border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className='flex flex-row justify-between'>
      <h2 className="text-2xl font-bold text-center text-black dark:text-white mb-6">
        DONNÉES MENSUEL DU CAPTEUR SMART189 
      </h2>
      <button
        onClick={refreshData}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Rafraîchir
      </button></div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Capteur 📡</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Date</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Temperature Ext <span className='font-thin text-red-300 text-sm'>(°C)</span></th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Hr <span className='font-thin text-red-300 text-sm'>(%)</span> </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">O3 <span className='font-thin text-red-300 text-sm'>(µg/m³)</span></th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">No2 <span className='font-thin text-red-300 text-sm'>(µg/m³)</span></th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Pm10 <span className='font-thin text-red-300 text-sm'>(µg/m³)</span></th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Pm25 <span className='font-thin text-red-300 text-sm'>(µg/m³)</span></th>
            </tr>
          </thead>
          <tbody>
            {currentData && currentData.length > 0 ? (
              currentData.map((data, index) => (
                <tr key={index}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{data.station_name}</h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {new Date(data.timestamp).toLocaleString('fr-FR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">
                      {data.extt !== null ? data.extt : 'N/A'}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">
                      {data.rh !== null ? parseFloat(data.rh).toFixed(2) : 'N/A'}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">
                      {data.o3 !== null ? parseFloat(data.o3).toFixed(2) : 'N/A'}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">
                      {data.no2 !== null ? parseFloat(data.no2).toFixed(2) : 'N/A'}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">
                      {data.pm10 !== null ? parseFloat(data.pm10).toFixed(2) : 'N/A'}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">
                      {data.pm25 !== null ? parseFloat(data.pm25).toFixed(2) : 'N/A'}
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-5 text-center">
                  Aucune donnée disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 rounded-md ${
                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SMART189;
