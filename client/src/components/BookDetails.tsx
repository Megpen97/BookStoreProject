// import React, { useState, useEffect } from 'react';  
// import { useParams } from 'react-router-dom';  
// import ApiService from '../api/apiService';  
// import { Book } from '../types/DataTypes';  

// const BookDetails: React.FC = () => {  
//   const { id } = useParams<{ id: string }>();  
//   const [book, setBook] = useState<Book | null>(null);  
//   const [loading, setLoading] = useState<boolean>(true);  
//   const [error, setError] = useState<string | null>(null);  

//   useEffect(() => {  
//     const fetchBook = async () => {  
//       if (id) {  
//         try {  
//           const fetchedBook = await ApiService.fetchBookById(id);  
//           if (fetchedBook) {  
//             setBook(fetchedBook);  
//           } else {  
//             setError('Book not found.');  
//           }  
//         } catch (err) {  
//           setError('Error fetching book data.');  
//         } finally {  
//           setLoading(false);  
//         }  
//       }  
//     };  

//     fetchBook();  
//   }, [id]);  

//   if (loading) return <div>Loading...</div>;  
//   if (error) return <div>{error}</div>;  

//   return (  
//     <div>  
//       {book && (  
//         <>  
//           <h1>{book.volumeInfo.title}</h1>  
//           <p>{book.volumeInfo.description}</p>  
//           {book.volumeInfo.imageLinks?.thumbnail && (  
//             <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />  
//           )}  
//           <ul>  
//             {book.volumeInfo.authors?.map((author, index) => (  
//               <li key={index}>{author}</li>  
//             ))}  
//           </ul>  
//         </>  
//       )}  
//     </div>  
//   );  
// };  

// export default BookDetails;