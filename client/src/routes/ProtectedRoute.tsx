import React from 'react';  
import { Navigate, useLocation } from 'react-router-dom';  
import useAuth from '../hooks/useAuth';  

interface ProtectedRouteProps {  
  element: JSX.Element;  
}  

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {  
  const { user } = useAuth();  
  const location = useLocation();  

  // If the user is authenticated, render the element  
  // Otherwise, redirect to the sign-in page, preserving the current location  
  return user ? (  
    element  
  ) : (  
    <Navigate to="/signin" state={{ from: location }} replace />  
  );  
};  

export default ProtectedRoute;