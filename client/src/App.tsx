import { Routes, Route } from 'react-router-dom';  
import SignIn from './components/SignIn';  
import Bookshelf from './components/Bookshelf';   
import ProtectedRoute from './routes/ProtectedRoute';
import BookDetails from './components/BookDetails';
import SearchBooks from './components/SearchBooks';

const App = () => {  
  return (  
    <Routes>  
      {/* <Route path="/" element={<Dashboard />} />   */}
      <Route path="/signin" element={<SignIn />} />  
      <Route path="/bookshelf/" element={
        <ProtectedRoute children={<Bookshelf />} />  
      } /> 
      <Route path='/book/:bookId' element={
        <ProtectedRoute children={<BookDetails />} /> } />
      <Route path='/' />
      <Route path="/search" element={
        <ProtectedRoute children={<SearchBooks />} /> 
      } /> 
    </Routes>  
  );  
};  

export default App;