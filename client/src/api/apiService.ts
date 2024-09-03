import axios from "axios";  
import { User } from '../types/users';  

class ApiService {  
  static baseURL = "http://localhost:3000/api"; // Adjust the base URL as necessary  

  static async validateCredentials(username: string, password: string): Promise<{ isValid: boolean; token?: string }> {  
    try {  
      const response = await axios.post<{ token: string }>(  
        `${this.baseURL}/signin`,  // Ensure this matches your actual API endpoint  
        { username, password }  
      );  
      return { isValid: true, token: response.data.token };  // Correctly map the response to the expected format  
    } catch (error) {  
      console.error("Error validating credentials:", error);  
      return { isValid: false };  
    }  
  }  

  static async getUserByToken(token: string): Promise<User> {  
    try {  
      const response = await axios.get<User>(  
        `${this.baseURL}/auth`,  // Suppose you have an endpoint to fetch user details  
        {  
          headers: { Authorization: `Bearer ${token}` }  
        }  
      );  
      return response.data;  
    } catch (error) {  
      console.error("Error fetching user:", error);  
      throw error;  
    }  
  }  
}  

export default ApiService;