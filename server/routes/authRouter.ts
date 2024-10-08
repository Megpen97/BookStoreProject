import express, { Request, Response, NextFunction } from "express";  
import Users, { IUser } from "../models/Users";  
import methodNotAllowedError from "../errors/methodNotAllowed";  
import { auth } from "../middlewares/auth";  
import { generateAccessToken } from "../services/authServices";  

const router = express.Router();  

router.use((req: Request, res: Response, next: NextFunction) => {  
  if (/\/signout/.test(req.path)) {  
    return auth(req, res, next);  
  }  
  next();  
});  

router  
  .route("/signin")  
  .post((req: Request, res: Response) => {  
    setTimeout(() => {  
      const { username, password } = req.body;  

      if (!username || !password) {  
        return res.status(400).send({  
          message:  
            "Pst! You are missing something in your request. Do you have a 'Content-Type' header and is it 'application/json?' Are you sending JSON? Is the username and password a part of the request?",  
        });  
      }  

      let user: IUser | null = null;  
      try {  
        user = Users.findByCredentials(username, password);  
        if (!user) {  
          throw new Error("User not found");  
        }  
      } catch (err) {  
        return res.status(401).send({  
          message: "Unauthorized. Your username or password is not correct.",  
        });  
      }  

      if (!user) {  
        return res.status(401).send({  
          message: "Unauthorized. User not found."  
        });  
      }  

      const userId = user.id.toString();  

      return res.status(200).send({  
        message: "You did it! Success!",  
        token: generateAccessToken(userId),  
        user: {
          id: user.id.toString(),
          username: user.username,
        }
      });  
    }, 500);  
  })  
  .all(methodNotAllowedError);  

export default router;