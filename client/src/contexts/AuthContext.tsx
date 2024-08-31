import { createContext, useState, ReactNode } from 'react';  
import ApiService from '../api/apiService';  

// Define the shape of the User object  
export interface User {  
  id: string;  
  username: string;  
  password?: string; // Optional if you don't need to expose this  
}  

// Define the shape of the AuthContext  
export interface AuthContextType {  
  user: User | null;  
  signIn: (username: string, password: string) => Promise<boolean>;  
  signOut: () => void;  
}  

// Create the AuthContext with an initial undefined value  
const AuthContext = createContext<AuthContextType | undefined>(undefined);  

export const AuthProvider = ({ children }: { children: ReactNode }) => {  
  const [user, setUser] = useState<User | null>(null);  

  const signIn = async (username: string, password: string): Promise<boolean> => {  
    const response = await ApiService.validateCredentials(username, password);  
    if (response.isValid && response.token) {  
      try {  
        // After validation, fetch user details with the token  
        const userDetails = await ApiService.getUserByToken(response.token);  
        setUser(userDetails);  
        localStorage.setItem("authToken", response.token);  
        return true;  
      } catch (error) {  
        console.error("Failed to fetch user details:", error);  
        return false;  
      }  
    }  
    return false;  
  };  

  const signOut = () => {  
    localStorage.removeItem("authToken");  
    setUser(null);  
  };  

  return (  
    <AuthContext.Provider value={{ user, signIn, signOut }}>  
      {children}  
    </AuthContext.Provider>  
  );  
};  

export default AuthContext;