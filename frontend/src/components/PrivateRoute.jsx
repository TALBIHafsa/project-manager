import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { user } = useAuth();
    
    // If user exists, render the child component (Outlet)
    // Otherwise, redirect to Login
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;