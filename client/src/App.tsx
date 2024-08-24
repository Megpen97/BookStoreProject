import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';  
import { AuthProvider } from './contexts/AuthContext';  
import SignIn from './components/SignIn';  
import ProtectedRoute from './routes/ProtectedRoute';  
import Dashboard from './components/Dashboard'; // Example protected component  
// import Home from './components/Home'; // Example public component  

const App = () => {  
  return (  
    <AuthProvider>  
      <Router>  
        <Routes>  
          <Route path="/signin" element={<SignIn />} />  
          {/* <Route path="/home" element={<Home />} />   */}
          {/* Use ProtectedRoute to guard the Dashboard component */}  
          <Route   
            path="/dashboard"   
            element={<ProtectedRoute element={Dashboard} />}   
          />  
          <Route path="*" element={<Navigate to="/home" />} />  
        </Routes>  
      </Router>  
    </AuthProvider>  
  );  
};  

export default App;