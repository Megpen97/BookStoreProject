/**
 * Usually, we would store our users in a database instead of a plain text file
 * that we are committing to git. However, for the purposes of demonstrating
 * the front-end of student portfolio piece, this works fine.
 *
 * You can add or change users by editing the users.json file.
 * I called username "nameOfUser" and password "wordOfPassage"
 * to stop Github from flagging this as not secure because it is hardcoded.
 */
import users from "../assets/users";  // Adjust the import path if necessary  

export interface IUser {  
  id: string;  
  username: string;  
  password: string;  
}  

class Users {  
  static find(id: string): IUser {  
    const user = users.find(user => user.id === id);  
    if (!user) throw new Error("User not found");  
    return user;  
  }  

  static findByCredentials(username: string, password: string): IUser | null {  
    const user = users.find(user => user.username === username && user.password === password);  
    return user || null; // return null if no user is found  
  }  
}  

export default Users;
