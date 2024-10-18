import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import Tables from './pages/Tables';
import DefaultLayout from './layout/DefaultLayout';
import SignUp from './pages/Authentication/SignUp';
import { UserProvider } from './components/UserContext';
import ProtectedRoute from './pages/Authentication/ProtectedRoute';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <UserProvider>
    <Routes>
      {/* Page de connexion sans layout */}
      <Route
        path="/auth/signin"
        element={
          <>
          
            <PageTitle title="Se connecter | AQ54" />
            <SignIn />
          </>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <>
            <PageTitle title="S'inscrire | AQ54" />
            <SignUp />
          </>
        }
      />

      {/* Autres routes avec le layout par défaut */}
      <Route element={<DefaultLayout />}>
        <Route
          index
          element={
            <>
            <ProtectedRoute />
              <PageTitle title="Dashboard | AQ54" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
            <ProtectedRoute />
              <PageTitle title="Tableaux | AQ54" />
              <Tables />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
            <ProtectedRoute />
              <PageTitle title="Basic Chart | AQ54" />
              <Chart />
            </>
          }
        />
      </Route>
    </Routes>
    </UserProvider>
  );
}

export default App;
