import React, { useEffect, useState } from 'react';  
import useAuth from '../hooks/useAuth';  
import { Shelf, Book } from '../types/DataTypes';  
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
    return books[shelf].map((book: Book) => (  
      <li key={book.id}>  
      {/* left off here */}
        {/* <h3>{book.volumeInfo.title}</h3>  
        <p>{book.volumeInfo.description}</p>  
        <img src={book.volumeInfo.imageLinks?.thumbnail} alt={`${book.volumeInfo.title} cover`} />   */}
      </li>  
    ));  
  };  

  return (  
    <div>  
      <h1>Bookshelf</h1>  
      <div>  
        <h2>Welcome!</h2>  
        <button onClick={signOut}>Sign Out</button>  
      </div>  
      <div>  
        <h2>Currently Reading</h2>  
        <ul>  
          {renderBooksByShelf('currentlyReading')}  
        </ul>  
      </div>  
      <div>  
        <h2>Want to Read</h2>  
        <ul>  
          {/* {renderBooksByShelf('wantToRead')}   */}
        </ul>  
      </div>  
      <div>  
        <h2>Read</h2>  
        <ul>  
          {/* {renderBooksByShelf('read')}   */}
        </ul>  
      </div>  
    </div>  
  );  
};  

export default Bookshelf;