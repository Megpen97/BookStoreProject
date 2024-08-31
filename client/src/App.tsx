import { Routes, Route } from 'react-router-dom';  
import SignIn from './components/SignIn';  
import Dashboard from './components/Dashboard';  

const App = () => {  
  return (  
    <Routes>  
      <Route path="/" element={<Dashboard />} />  
      <Route path="/signin" element={<SignIn />} />  
      <Route path="/dashboard" element={<Dashboard />} />  
      
    </Routes>  
  );  
};  

export default App;