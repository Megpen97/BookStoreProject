import React from 'react';  
import { Navigate, useLocation } from 'react-router-dom';  
import useAuth from '../hooks/useAuth';  

interface ProtectedRouteProps {  
  element: React.ComponentType;  
}  

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Component }) => {  
  const { user } = useAuth();  
  const location = useLocation();  

  // If the user is authenticated, render the Component  
  // Otherwise, redirect to the sign-in page, preserving the current location  
  return user ? (  
    <Component />  
  ) : (  
    <Navigate to="/signin" state={{ from: location }} replace />  
  );  
};  

export default ProtectedRoute;