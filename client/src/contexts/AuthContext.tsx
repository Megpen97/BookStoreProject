import { createContext, useState, ReactNode } from 'react';  
import ApiService from '../api/apiService';  

// Define the shape of the User object  
export interface User {  
  id: string;  
  username: string;  
  password: string;  
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
    const fetchedUser = await ApiService.validateCredentials(username, password);  
    if (fetchedUser) {  
      setUser(fetchedUser);  
      return true;  
    }  
    return false;  
  };  

  const signOut = () => {  
    setUser(null);  
  };  

  return (  
    <AuthContext.Provider value={{ user, signIn, signOut }}>  
      {children}  
    </AuthContext.Provider>  
  );  
};  

export default AuthContext;