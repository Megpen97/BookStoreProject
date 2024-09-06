import { Navigate, useLocation } from 'react-router-dom';  
import useAuth from '../hooks/useAuth';
interface ProtectedRouteProps {  
  children: JSX.Element;  
}  

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {  
  const { user } = useAuth();  
  const location = useLocation();  

  console.log('User state in ProtectedRoute:', user);  

  if (!user) {  
    console.log("Not authenticated, redirecting to login");  
    return <Navigate to="/signin" state={{ from: location }} replace />;  
  }  

  return user ? (  
    children  
  ) : (  
    <Navigate to="/signin" state={{ from: location }} replace />  
  );  
};  

export default ProtectedRoute;