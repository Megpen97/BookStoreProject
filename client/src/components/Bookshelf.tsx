import React, { useEffect, useState } from 'react';  
import { Link } from 'react-router-dom';
import { Tooltip, OverlayTrigger, Badge } from 'react-bootstrap';
import { FaBook, FaBookOpen, FaBookReader, FaBookmark } from 'react-icons/fa';
import axios from 'axios';
import './Bookshelf.css';
import Header from './Header/Header';
import LoadingScreen from './LoadingScreen/LoadingScreen';
import { Shelf, Book } from '../types/DataTypes';

interface ShelfConfig {
  title: string;
  icon: React.ReactNode;
  key: keyof Shelf;
  color: string;
}

const Bookshelf: React.FC = () => {  
  const [books, setBooks] = useState<Shelf>({ wantToRead: [], currentlyReading: [], read: [] });  
  const [loading, setLoading] = useState<boolean>(true);  
  const [error, setError] = useState<string | null>(null);
  const [activeShelf, setActiveShelf] = useState<keyof Shelf>('currentlyReading');

  const shelves: ShelfConfig[] = [
    {
      title: 'Currently Reading',
      icon: <FaBookOpen className="shelf-icon" />,
      key: 'currentlyReading',
      color: 'primary'
    },
    {
      title: 'Want to Read',
      icon: <FaBook className="shelf-icon" />,
      key: 'wantToRead',
      color: 'success'
    },
    {
      title: 'Read',
      icon: <FaBookReader className="shelf-icon" />,
      key: 'read',
      color: 'info'
    }
  ];

  useEffect(() => {  
    const fetchData = async () => {  
      try {  
        const token = localStorage.getItem('authToken');
        if (!token) {  
          throw new Error('No authentication token found');  
        }  

        const response = await axios.get('/api/bookshelf', {
          headers: {  
            'Authorization': `Bearer ${token}`,  
            'Content-Type': 'application/json',  
          },  
        });  

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
  }, []);

  const renderBookCard = (book: Book) => (
    <div className='col-md-3 mb-4' key={book.id}>
      <Link to={`/book/${book.id}`} className="text-decoration-none"> 
        <div className="book-card">   
          <div className='book-cover-wrapper'>
            <img 
              src={book.imageLinks?.thumbnail} 
              alt={`${book.title}`} 
              className='book-cover'
            />
            <div className="book-hover-info">
              <Badge bg="light" text="dark" className="mt-2">
                <FaBookmark className="me-1" />
                View Details
              </Badge>
            </div>
          </div>
          <div className="book-info">
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id={`tooltip-${book.id}`}>
                  <strong>{book.title}</strong>
                </Tooltip>
              }
            >
              <h6 className='book-title text-truncate mb-1'>{book.title}</h6>
            </OverlayTrigger>
            <p className='book-authors text-truncate text-muted mb-0'>{book.authors?.join(", ")}</p>
          </div>
        </div>
      </Link>
    </div>  
  );

  const renderBooksByShelf = (shelf: keyof Shelf) => (
    <div className="row">
      {books[shelf].map(renderBookCard)}
      {books[shelf].length === 0 && (
        <div className="col-12 text-center text-muted py-5">
          No books in this shelf
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-vh-100 bg-light bookshelf-container">
        <Header />
        <LoadingScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-light bookshelf-container">
        <Header />
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light bookshelf-container">
      <Header />

      <div className="container py-5">
        <div className="row g-4">
          {/* Shelf Navigation */}
          <div className="col-md-3">
            <div className="shelf-navigation">
              {shelves.map((shelf) => (
                <button
                  key={shelf.key}
                  className={`shelf-tab mb-3 ${activeShelf === shelf.key ? 'active' : ''}`}
                  onClick={() => setActiveShelf(shelf.key)}
                >
                  <div className="d-flex align-items-center gap-2">
                    {shelf.icon}
                    <span>{shelf.title}</span>
                    <Badge bg={shelf.color} className="ms-auto">
                      {books[shelf.key].length}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Shelf Content */}
          <div className="col-md-9">
            <div className="shelf-content">
              {renderBooksByShelf(activeShelf)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookshelf;