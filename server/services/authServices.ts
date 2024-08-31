import * as jwt from "jsonwebtoken";  
import { JWT_SECRET, JWT_EXPIRY_IN_MILLISECONDS } from "../config";  
import Users from "../models/Users";  

export const generateAccessToken = (userId: string): string => {  
  return jwt.sign({ sub: userId }, JWT_SECRET, {  
    expiresIn: `${JWT_EXPIRY_IN_MILLISECONDS}ms`,  
  });  
};  

export const authenticateUser = async (  
  username: string,  
  password: string  
): Promise<{ isValid: boolean; token?: string }> => {  
  const user = Users.findByCredentials(username, password);  

  if (user) {  
    const token = generateAccessToken(user.id);  
    return { isValid: true, token };  
  }  

  return { isValid: false };  
};