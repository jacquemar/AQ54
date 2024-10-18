import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Loader from '../../common/Loader';
import { useUser, } from '../../components/UserContext';

const ProtectedRoute: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const { setUser } = useUser();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const decodedToken = jwtDecode<UserPayload>(token);
                if (decodedToken.exp && decodedToken.exp * 1000 > Date.now()) {
                    setUser(decodedToken);
                } else {
                    setUser(null);
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Erreur lors du décodage du token:', error);
                setUser(null);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [setUser]);

    if (loading) {
        return <Loader />;
    }

    return <Outlet />;
};

export default ProtectedRoute;