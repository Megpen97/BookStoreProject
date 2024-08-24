import axios from 'axios';  
import { Book } from '../types/DataTypes';  

class ApiService {  
  // Base URL for the Google Books API  
  private static baseURL = 'https://www.googleapis.com/books/v1';  

  /**  
   * Fetches a book by ID from the Google Books API.  
   * @param id The ID of the book to fetch.  
   * @returns A Promise of Book or null if the book is not found.  
   */  
  static async fetchBookById(id: string): Promise<Book | null> {  
    try {  
      const response = await axios.get<Book>(`${this.baseURL}/volumes/${id}`);  
      return response.data;  
    } catch (error) {  
      console.error('Error fetching book by ID:', error);  
      return null;  
    }  
  }  

  /**  
   * Searches for books matching the given query.  
   * @param query The search query string.  
   * @returns A Promise of an array of found books.  
   */  
  static async searchBooks(query: string): Promise<Book[]> {  
    try {  
      const response = await axios.get<{ items: Book[] }>(`${this.baseURL}/volumes?q=${encodeURIComponent(query)}`);  
      return response.data.items || [];  
    } catch (error) {  
      console.error('Error searching for books:', error);  
      return [];  
    }  
  }  
}  

export default ApiService;