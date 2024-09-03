import { Routes, Route } from 'react-router-dom';  
import SignIn from './components/SignIn';  
import Dashboard from './components/Dashboard';  
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {  
  return (  
    <Routes>  
      {/* <Route path="/" element={<Dashboard />} />   */}
      <Route path="/signin" element={<SignIn />} />  
      <Route path="/bookshelf/:userId" element={
        <ProtectedRoute element={<Dashboard />} />  
      } /> 
    </Routes>  
  );  
};  

export default App;