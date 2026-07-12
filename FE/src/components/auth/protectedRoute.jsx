import React from 'react'
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const loading = useSelector((state) => state.auth.loading);

    if (loading) {
        return <div>Loading...</div>;
    }



  return isAuthenticated ? (
    <>
     <Outlet/> 
    </>
  ) : null;
}

export default ProtectedRoute
