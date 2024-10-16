import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Smart188 from '../components/Tables/Smart188';
import Smart189 from '../components/Tables/Smart189';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Tableaux" />
      <div className="flex flex-col gap-10">
        <Smart188 />
        <Smart189 />

      </div>
    </>
  );
};

export default Tables;
