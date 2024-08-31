import React, { useState } from "react";  
import { useNavigate } from "react-router-dom";  
import useAuth from "../hooks/useAuth";  

const SignIn: React.FC = () => {  
  const [username, setUsername] = useState<string>("");  
  const [password, setPassword] = useState<string>("");  
  const [error, setError] = useState<string | null>(null);  
  const { signIn } = useAuth();  
  const navigate = useNavigate();  

  const handleSignIn = async () => {  
    const isSuccess = await signIn(username, password);  
    if (isSuccess) {  
      navigate("/dashboard");
      setError(null);  
    } else {  
      setError("Invalid username or password");  
    }  
  };  

  return (  
    <div className="col d-flex justify-content-center align-items-center">
      <div className="card" style={{ width: '24rem' }}>  
        <div className="card-body">
          <h2 className="card-title text-center">Sign In</h2>  
          {error && <div style={{ color: "red" }}>{error}</div>}  
          <div className="form-group d-flex flex-row p-2">  
            <label className="col-sm-3 col-form-label">  
              Username:  
            </label>  
            <input  
              type="text"  
              className="form-control"
              placeholder="Enter username"  
              required
              value={username}  
              onChange={(e) => setUsername(e.target.value)}  
            />  
            
          </div>  
          <div className="form-group d-flex flex-row p-2">  
            <label className="col-sm-3 col-form-label">  
              Password:  
            </label>  
            <input  
              type="password"  
              className="form-control"  
              placeholder="Enter password"  
              required
              value={password}  
              onChange={(e) => setPassword(e.target.value)}  
            />  
            
          </div>  
          <button
          type="button"
          className="btn btn-primary btn-block m-2"  
          onClick={handleSignIn}>Sign In</button>  
        </div>
      </div>  
    </div>
  );  
};  

export default SignIn;