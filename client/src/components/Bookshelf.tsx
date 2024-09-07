import React, { useEffect, useState } from 'react';  
import useAuth from '../hooks/useAuth';  
import { Shelf, Book } from '../types/DataTypes';  
import { Link } from 'react-router-dom';
import { Tooltip, OverlayTrigger } from'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';  

const Bookshelf: React.FC = () => {  
  const { signOut } = useAuth();  
  const [books, setBooks] = useState<Shelf>({ wantToRead: [], currentlyReading: [], read: [] });  
  const [loading, setLoading] = useState<boolean>(true);  
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {  
    const fetchData = async () => {  
      try {  
        const token = localStorage.getItem('authToken');  // Fetch token from localStorage  
        if (!token) {  
          throw new Error('No authentication token found');  
        }  

        console.log('Fetching books with token:', token);  
        const response = await axios.get('/api/bookshelf', {  // Replace with your actual data endpoint  
          headers: {  
            'Authorization': `Bearer ${token}`,  
            'Content-Type': 'application/json',  
          },  
        });  

        console.log('API Response:', response.data);  

        if(response.data.books) {  
          setBooks(response.data.books);  
        } else {  
          throw new Error('Books data not found in response');  
        }  

      } catch (err) {  
        if (err instanceof Error) {  
          setError(`Error fetching data: ${err.message}`);  
        }  
      } finally {  
        setLoading(false);  
      }  
    };  

    fetchData();  
  }, []);  // Empty dependency array ensures this runs once on mount  

  if (loading) return <div>Loading...</div>;  
  if (error) return <div>{error}</div>;  

  const renderBooksByShelf = (shelf: keyof Shelf) => {  
    return (  
      <div className='container'>  
        <div className='row'>  
          {books[shelf].map((book: Book) => (  
            <div className='col-md-3' key={book.id}>
            <Link to={`/book/${book.id}`}> 
              <div className="card" >   
                {/* on click, navigate to book details */}
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
          ))}  
        </div>  
      </div>  
    );  
  };

  return (  
    <div className='bg-white'>  
        <div className='navbar shadow-sm bg-success d-flex justify-content-between'>  
          <Link to={'/bookshelf'}>  
            <button className='navbar-brand mx-5 rounded text-white m-3 shadow-sm'>Bookshelf</button>  
          </Link>  
          <div className='d-flex ms-auto align-items-center'>  
            <Link to={'/search'} style={{ cursor: 'pointer', fontSize: '25px' }}    className='navbar-item mx-2 rounded bg-secondary shadow-sm text-white m-3 d-flex align-items-center bg-success'>  
              <FaSearch className='me-2 bg-success'/>
            </Link>  
            <button className='navbar-item mx-2 rounded bg-danger shadow-sm' onClick={signOut}>Sign Out</button>  
          </div>  
        </div>   
      <div className=''>  
        <h2 className='m-5 border p-2 bg-light rounded text-center shadow-sm'>Currently Reading</h2>  
        <ul>  
          {renderBooksByShelf('currentlyReading')}  
        </ul>  
      </div>  
      <div className=''>  
        <h2 className='m-5 border p-2 bg-light rounded text-center shadow-sm'>Want to Read</h2>  
        <ul>  
          {renderBooksByShelf('wantToRead')}  
        </ul>  
      </div>  
      <div className=''>  
        <h2 className='m-5 border p-2 bg-light rounded text-center shadow-sm'>Read</h2>  
        <ul>  
          {renderBooksByShelf('read')}  
        </ul>  
      </div>  
    </div>  
  );  
};  

export default Bookshelf;