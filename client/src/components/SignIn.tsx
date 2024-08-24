import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';  
import useAuth from '../hooks/useAuth';  

const SignIn = () => {  
  const { signIn } = useAuth();  
  const navigate = useNavigate();  
  const [username, setUsername] = useState('');  
  const [password, setPassword] = useState('');  
  const [error, setError] = useState('');  

  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    const success = await signIn(username, password);  
    if (!success) {  
      setError('Invalid username or password');  
    } else {  
      setError('');  
      navigate('/dashboard'); // Redirect to the dashboard upon successful sign-in  
    }  
  };  

  return (  
    <div>  
      <h2>Sign In</h2>  
      <form onSubmit={handleSubmit}>  
        <div>  
          <label>  
            Username:  
            <input  
              type="text"  
              value={username}  
              onChange={(e) => setUsername(e.target.value)}  
              required  
            />  
          </label>  
        </div>  
        <div>  
          <label>  
            Password:  
            <input  
              type="password"  
              value={password}  
              onChange={(e) => setPassword(e.target.value)}  
              required  
            />  
          </label>  
        </div>  
        {error && <p style={{ color: 'red' }}>{error}</p>}  
        <button type="submit">Sign In</button>  
      </form>  
    </div>  
  );  
};  

export default SignIn;