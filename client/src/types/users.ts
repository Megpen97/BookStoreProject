export interface User {  
    id: string;  
    username: string;  
    password?: string; // Optional if you don't need to expose this  
  }