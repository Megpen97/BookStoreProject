import { useState } from "react";  
import { useNavigate } from "react-router-dom";  
import axios from "axios";  

interface IUser {  
  id: string;
  username: string;  
  password: string;
}  

const useAuth = () => {  
  const [user, setUser] = useState<IUser | null>(null);  
  const navigate = useNavigate();  

  const fetchUser = async (token: string) => {  
    try {  
      const response = await axios.get('/api/bookshelf', {  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json',  
        },  
      });  
      console.log("User fetched:", response.data);  
      setUser(response.data);  
    } catch (error) {  
      console.error("Failed to fetch user:", error);  
    }  
  };  

  const signIn = async (username: string, password: string): Promise<boolean> => {  
    try {  
      console.log("Attempting to sign in with:", { username, password });  
      const response = await axios.post('/api/signin', {  
        username,  
        password,  
      });  
      console.log("Response from server:", response.data);  
      // Adjusting to check for the presence of the token only  
      if (response.data.token) {  
        localStorage.setItem("authToken", response.data.token);  
        await fetchUser(response.data.token);  
        return true;  
      }  
      console.error("Sign-in invalid, no token found in response:", response.data.message);  
      return false;  
    } catch (error) {  
      console.error("Sign-in failed with error:", error);  
      return false;  
    }  
  };  

  const signOut = () => {  
    localStorage.removeItem("authToken");  
    setUser(null);  
    navigate("/signin");  
  };  

  return { user, signIn, signOut };  
};  

export default useAuth;