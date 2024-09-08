import React, { useEffect, useState } from 'react';  
import { useParams, Link, useNavigate } from 'react-router-dom';  
import useAuth from '../hooks/useAuth';  
import { Book } from '../types/DataTypes';  
import { Dropdown } from 'react-bootstrap';  
import { FaSearch, FaTrash } from 'react-icons/fa'; // Import trash icon for delete button  
import axios from 'axios';  

const BookDetails: React.FC = () => {  
  const { signOut } = useAuth();  
  const { bookId } = useParams<{ bookId: string }>();  
  const navigate = useNavigate(); // Use navigate to navigate after deletion  
  const [book, setBook] = useState<Book | null>(null);  
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

  if (loading) return <div>Loading...</div>;  
  if (error) return <div>{error}</div>;  
  if (!book) return <div>No book details available</div>;  

  return (  
    <div className='bg-white'>  
      <div className='navbar shadow-sm bg-success d-flex justify-content-between'>  
        <Link to={'/bookshelf'}>  
          <button className='navbar-brand mx-5 rounded text-white m-3 shadow-sm'>Bookshelf</button>  
        </Link>  
        <div className='d-flex ms-auto align-items-center'>  
          <Link to={'/search'} style={{ cursor: 'pointer', fontSize: '25px' }} className='navbar-item mx-2 rounded bg-secondary shadow-sm text-white m-3 d-flex align-items-center bg-success'>  
            <FaSearch className='me-2 bg-success'/>  
          </Link>  
          <button className='navbar-item mx-2 rounded bg-danger shadow-sm' onClick={signOut}>Sign Out</button>  
        </div>  
      </div>  
      <div className='container'>  
        <div className='mt-5 mx-5 d-flex justify-content-end'>
            <Dropdown className=''>  
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" className='shadow-sm'>  
                {book.shelf ? book.shelf.replace(/([A-Z])/g, ' $1').trim() : "Select Shelf"}  
            </Dropdown.Toggle>  
            <Dropdown.Menu>  
                <Dropdown.Item onClick={() => updateShelf("wantToRead")}>Want To Read</Dropdown.Item>  
                <Dropdown.Item onClick={() => updateShelf("currentlyReading")}>Currently Reading</Dropdown.Item>  
                <Dropdown.Item onClick={() => updateShelf("read")}>Read</Dropdown.Item>  
            </Dropdown.Menu>  
            </Dropdown>  
            <button className='btn btn-danger mx-2' onClick={removeBook}>  
                <FaTrash /> 
            </button>  
        </div>
        <div className='row'>  
          <div className="card col-md-11 mx-auto m-5 p-3 shadow">  
            <div className='row'>  
              <div className='col-md-3 m-2'>  
                <img src={book.imageLinks?.thumbnail} alt={`${book.title}`} className='img-fluid w-100 shadow-sm' />  
              </div>  
              <div className='col-md-6 m-2 d-flex flex-column '>  
                <h2 className='fs-2'>{book.title}</h2>  
                <h4 className='fs-5'>Authors: {book.authors?.join(", ")}</h4>  
                <h4 className="fs-6">Publisher: {book.publisher}</h4>  
                <h4 className='fs-6'>Date Published: {book.publishedDate}</h4>  
                <h4 className='fs-6'>Categories: {book.categories?.join(" ")}</h4>  
              </div>  
              <p className='m-2 mt-4'>{book.description}</p>  
            </div>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
};  

export default BookDetails;