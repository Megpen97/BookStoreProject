import { Routes, Route } from 'react-router-dom';  
import SignIn from './components/SignIn';  
import Bookshelf from './components/Bookshelf';   
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {  
  return (  
    <Routes>  
      {/* <Route path="/" element={<Dashboard />} />   */}
      <Route path="/signin" element={<SignIn />} />  
      <Route path="/bookshelf/" element={
        <ProtectedRoute children={<Bookshelf />} />  
      } /> 
    </Routes>  
  );  
};  

export default App;