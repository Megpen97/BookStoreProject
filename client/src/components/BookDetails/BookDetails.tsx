import React, { useEffect, useState } from 'react';  
import { useParams, useNavigate } from 'react-router-dom';  
import { Book } from '../../types/DataTypes';  
import { Dropdown } from 'react-bootstrap';  
import { FaTrash, FaBookmark } from 'react-icons/fa';
import axios from 'axios';  
import './BookDetails.css';  // We'll create this CSS file next
import Header from '../Header/Header';
import LoadingScreen from '../LoadingScreen/LoadingScreen';

interface ExtendedBook extends Book {
  pageCount?: number;
  averageRating?: number;
  ratingsCount?: number;
}

const BookDetails: React.FC = () => {  
  const { bookId } = useParams<{ bookId: string }>();  
  const navigate = useNavigate();
  const [book, setBook] = useState<ExtendedBook | null>(null);  
  const [loading, setLoading] = useState<boolean>(true);  
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {  
    const fetchBookDetails = async () => {  
      try {  
        const token = localStorage.getItem('authToken');  // Fetch token from localStorage  
        if (!token) {  
          throw new Error('No authentication token found');  
        }  

        console.log('Fetching book details with token:', token);  
        const response = await axios.get(`/api/book/${bookId}`, {  
          headers: {  
            'Authorization': `Bearer ${token}`,  
            'Content-Type': 'application/json',  
          },  
        });  

        console.log('API Response:', response.data);  

        if (response.data.book) {  
          setBook(response.data.book);  
        } else {  
          throw new Error('Book data not found in response');  
        }  
      } catch (err) {  
        if (err instanceof Error) {  
          setError(`Error fetching data: ${err.message}`);  
        }  
      } finally {  
        setLoading(false);  
      }  
    };  

    fetchBookDetails();  
  }, [bookId]);  // Dependency array ensures this runs once when bookId changes  

  const updateShelf = async (shelf: 'wantToRead' | 'currentlyReading' | 'read') => {  
    if (!book) {  
      return;  
    }  

    try {  
      const token = localStorage.getItem('authToken');  
      if (!token) {  
        throw new Error("No authentication token found");  
      }  

      const response = await axios.put(`/api/bookshelf/${book.id}/${shelf}`, { shelf }, {  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        }  
      });  

      if (response.status === 200) {  
        setBook({ ...book, shelf });  
      } else {  
        console.error("Error updating shelf:", response.statusText);  
      }  
    } catch (err) {  
      console.error("Error updating shelf:", err);  
    }  
  };  

  const removeBook = async () => {  
    if (!window.confirm("Are you sure you want to remove this book from the shelf?")) {  
      return;  
    }  
  
    setError(null);  
    try {  
      const token = localStorage.getItem('authToken');  
      if (!token) {  
        throw new Error('No authentication token found');  
      }  
  
      await axios.delete(`/api/bookshelf/${bookId}`, { // Use bookId to delete the book  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json',  
        },  
      });  
  
      // Navigate to bookshelf or other relevant page after deleting  
      navigate('/bookshelf');  
    } catch (err) {  
      if (err instanceof Error) {  
        setError(`Error deleting book: ${err.message}`);  
      }  
    }  
  };  

  if (loading) {
    return (
      <div className="min-vh-100 bg-light book-details-container">
        <Header />
        <LoadingScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-light book-details-container">
        <Header />
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-vh-100 bg-light book-details-container">
        <Header />
        <div className="container py-5">
          <div className="alert alert-warning" role="alert">
            No book details available
          </div>
        </div>
      </div>
    );
  }

  return (  
    <div className='min-vh-100 bg-light book-details-container'>  
      <Header />

      <div className='container py-5'>  
        {/* Enhanced Book Details Card */}
        <div className='card border-0 shadow-sm rounded-3 overflow-hidden book-card'>
          <div className='row g-0'>
            {/* Enhanced Book Cover Column */}
            <div className='col-md-4 bg-light p-4 book-cover-section'>
              <div className='position-relative'>
                <div className='book-cover-container'>
                  <img 
                    src={book?.imageLinks?.thumbnail} 
                    alt={`${book?.title} cover`} 
                    className='img-fluid rounded-3 shadow mx-auto d-block book-cover'
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                  />
                </div>
                {book?.shelf && (
                  <div className='position-absolute top-0 end-0 m-2'>
                    <div className='badge bg-primary p-2 d-flex align-items-center gap-1'>
                      <FaBookmark size={12} />
                      <span>{book.shelf.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enhanced Actions */}
              <div className='mt-4 d-flex flex-column gap-3'>
                <Dropdown className='w-100'>  
                  <Dropdown.Toggle 
                    variant="primary" 
                    id="dropdown-basic" 
                    className='w-100 shadow-sm d-flex align-items-center justify-content-center gap-2 shelf-button'
                  >  
                    <FaBookmark />
                    {book?.shelf ? (
                      book.shelf === 'wantToRead' ? 'Want to Read' :
                      book.shelf === 'currentlyReading' ? 'Currently Reading' :
                      book.shelf === 'read' ? 'Read' : 'Add to Shelf'
                    ) : "Add to Shelf"}  
                  </Dropdown.Toggle>  
                  <Dropdown.Menu className='w-100'>  
                    <Dropdown.Item onClick={() => updateShelf("wantToRead")} className='py-2'>Want to Read</Dropdown.Item>  
                    <Dropdown.Item onClick={() => updateShelf("currentlyReading")} className='py-2'>Currently Reading</Dropdown.Item>  
                    <Dropdown.Item onClick={() => updateShelf("read")} className='py-2'>Read</Dropdown.Item>  
                  </Dropdown.Menu>  
                </Dropdown>  
                <button 
                  className='btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 remove-button'
                  onClick={removeBook}
                >  
                  <FaTrash /> Remove from Shelf
                </button>  
              </div>

              {/* Book Stats */}
              <div className='mt-4 p-3 bg-white rounded-3 shadow-sm'>
                <div className='d-flex justify-content-around text-center'>
                  <div>
                    <div className='text-primary fw-bold'>{book?.pageCount || '-'}</div>
                    <small className='text-muted'>Pages</small>
                  </div>
                  <div className='border-start border-end px-3'>
                    <div className='text-primary fw-bold'>{book?.averageRating || '-'}</div>
                    <small className='text-muted'>Rating</small>
                  </div>
                  <div>
                    <div className='text-primary fw-bold'>{book?.ratingsCount || '-'}</div>
                    <small className='text-muted'>Reviews</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Info Column */}
            <div className='col-md-8 p-4'>
              <div className='d-flex flex-column h-100'>
                <h1 className='display-6 mb-2'>{book?.title}</h1>
                <p className='text-muted mb-4'>By {book?.authors?.join(", ")}</p>
                
                <div className='mb-4'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <p className='mb-1'><strong>Publisher:</strong></p>
                      <p className='text-muted'>{book?.publisher}</p>
                    </div>
                    <div className='col-md-6'>
                      <p className='mb-1'><strong>Published Date:</strong></p>
                      <p className='text-muted'>{book?.publishedDate}</p>
                    </div>
                  </div>
                  
                  <div className='mt-3'>
                    <p className='mb-1'><strong>Categories:</strong></p>
                    <div className='d-flex flex-wrap gap-2'>
                      {book?.categories?.map((category, index) => (
                        <span key={index} className='badge bg-light text-dark'>{category}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className='mt-auto'>
                  <h5 className='mb-3'>Description</h5>
                  <p className='text-muted'>{book?.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
  );  
};  

export default BookDetails;