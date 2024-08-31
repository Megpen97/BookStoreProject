import { useState, useEffect } from "react";  
import { useNavigate } from "react-router-dom";  
import ApiService from "../api/apiService";  

interface User {  
  username: string;  
  // Add other user properties as needed  
}  

const useAuth = () => {  
  const [user, setUser] = useState<User | null>(null);  
  const navigate = useNavigate();  

  useEffect(() => {  
    const token = localStorage.getItem("authToken");  
    if (token) {  
      fetchUser(token);  
    }  
  }, []);  

  const fetchUser = async (token: string) => {  
    try {  
      const userData = await ApiService.getUserByToken(token);  
      setUser(userData);  
    } catch (error) {  
      console.error("Failed to fetch user:", error);  
    }  
  };  

  const signIn = async (username: string, password: string): Promise<boolean> => {  
    const response = await ApiService.validateCredentials(username, password);  
    if (response.isValid && response.token) {  
      localStorage.setItem("authToken", response.token);  
      await fetchUser(response.token);  
      return true;  
    }  
    return false;  
  };  

  const signOut = () => {  
    localStorage.removeItem("authToken");  
    setUser(null);  
    navigate("/signin");  
  };  

  return { user, signIn, signOut };  
};  

export default useAuth;