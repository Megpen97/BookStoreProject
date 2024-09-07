import React, { useState } from 'react';  
import axios from 'axios';  
import { Book } from '../types/DataTypes';  
import { Link } from 'react-router-dom';  
import { FaSearch } from 'react-icons/fa';  
import useAuth from '../hooks/useAuth';  
import { OverlayTrigger, Tooltip } from 'react-bootstrap'; // Assuming you are using react-bootstrap  

const SearchBooks: React.FC = () => {  
  const { signOut } = useAuth();  

  const [query, setQuery] = useState<string>('');  
  const [books, setBooks] = useState<Book[]>([]);  
  const [loading, setLoading] = useState<boolean>(false);  
  const [error, setError] = useState<string | null>(null);  

  const handleSearch = async (e: React.FormEvent) => {  
    e.preventDefault();  
    setLoading(true);  
    setError(null);  

    try {  
      const token = localStorage.getItem('authToken');  
      if (!token) {  
        throw new Error('No authentication token found');  
      }  

      const response = await axios.get(`/api/book/search/${query}`, {  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json',  
        },  
        params: {  
          query: query,  
        },  
      });  

      setBooks(response.data.books || []);  
    } catch (err) {  
      if (err instanceof Error) {  
        setError(`Error fetching data: ${err.message}`);  
      }  
    } finally {  
      setLoading(false);  
    }  
  };  

  return (  
    <div className='bg-white'>  
      <nav className='navbar shadow-sm bg-success d-flex justify-content-between align-items-center'>  
        <Link to={'/bookshelf'}>  
          <button className='navbar-brand mx-5 rounded text-white m-3 shadow-sm'>Bookshelf</button>  
        </Link>  
        <div className='d-flex ms-auto align-items-center'>  
          <Link to={'/search'} style={{ cursor: 'pointer', fontSize: '25px' }} className='navbar-item mx-2 rounded bg-secondary shadow-sm text-white m-3 d-flex align-items-center bg-success'>  
            <FaSearch className='me-2 bg-success'/>  
          </Link>  
          <button className='navbar-item mx-2 rounded bg-danger shadow-sm' onClick={signOut}>Sign Out</button>  
        </div>  
      </nav>  

      <div className='container mt-4'>  
        <form onSubmit={handleSearch} className='d-flex'>  
          <input  
            type="text"  
            value={query}  
            onChange={(e) => setQuery(e.target.value)}  
            placeholder="Search for books"  
            className='form-control me-2'  
            required  
          />  
          <button type="submit" className='btn btn-primary'>Search</button>  
        </form>  

        {loading && <p className='mt-4'>Loading...</p>}  
        {error && <p className='mt-4 text-danger'>{error}</p>}  

        <div className='container mt-4'>  
          <div className='row'>  
            {books.length > 0 ? (  
              books.map((book) => (  
                <div className='col-md-3 mb-4' key={book.id}>  
                  <Link to={`/book/${book.id}`}>  
                    <div className="card">   
                      <div className='card-body shadow'>  
                        <img src={book.imageLinks?.thumbnail} alt={`${book.title}`} className='card-img-top'/>  
                      </div>  
                    </div>  
                  </Link>  
                  <div>  
                    <OverlayTrigger  
                      placement="bottom"  
                      overlay={  
                        <Tooltip id={`tooltip-${book.id}`}>  
                          <strong>{book.title}</strong>  
                        </Tooltip>  
                      }  
                    >  
                      <p className='m-2 fw-bold text-truncate'>{book.title}</p>  
                    </OverlayTrigger>  
                  </div>  
                  <p className='m-2 text-truncate'>{book.authors?.join(", ")}</p>   
                </div>  
              ))  
            ) : (  
              <p>No books found</p>  
            )}  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
};  

export default SearchBooks;