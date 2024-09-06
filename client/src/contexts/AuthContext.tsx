import React, { createContext, useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';  

interface User {  
  id: string;  
  username: string;  
  password: string;
}  

interface AuthContextProps {  
  user: User | null;  
  signIn: (username: string, password: string) => Promise<boolean>;  
  signOut: () => void;  
}  

const AuthContext = createContext<AuthContextProps | undefined>(undefined);  

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {  
  const [user, setUser] = useState<User | null>(null);  
  const navigate = useNavigate();  

  useEffect(() => {  
    const token = localStorage.getItem('authToken');  
    if (token) {  
      fetchUser(token);  
    }  
  }, []);  

  const fetchUser = async (token: string) => {  
    try {  
      const response = await axios.get('/api/bookshelf', { 
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json',  
        },  
      });  
      console.log("fetchUser", response.data); 
      setUser(response.data);  
    } catch (error) {  
      console.error('Failed to fetch user:', error);  
      localStorage.removeItem('authToken');  
    }  
  };  

  const signIn = async (username: string, password: string): Promise<boolean> => {  
    try {  
      console.log("Attempting to sign in with:", { username, password });  
      const response = await axios.post('/api/signin', { username, password });  
      if (response.data.token) {  
        localStorage.setItem('authToken', response.data.token);  
        fetchUser(response.data.token);  
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
    localStorage.removeItem('authToken');  
    setUser(null);  
    navigate('/signin');  
  };  

  return (  
    <AuthContext.Provider value={{ user, signIn, signOut }}>  
      {children}  
    </AuthContext.Provider>  
  );  
};  

export default AuthContext;