// src/components/PrivateRoute.tsx
import React, { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const token = useStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  return <>{token ? children : null}</>;
};

export default PrivateRoute;
