import React, { useEffect, useState } from 'react';  
import useAuth from '../hooks/useAuth';  
import DataFetcher from '../utils/DataFetcher';  
import { Book } from '../types/DataTypes.ts';

const Dashboard: React.FC = () => {  
  const { user, signOut } = useAuth(); // Get authenticated user and signOut function from the useAuth hook  
  const [data, setData] = useState<Book[]>([]);  
  const [loading, setLoading] = useState<boolean>(true);  
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {  
    const fetchData = async () => {  
      try {  
        const fetchedData = await DataFetcher.fetchData();  
        setData(fetchedData);  
      } catch (err) {  
        if(err instanceof Error) {
        setError('Error fetching data: ${err.message}');  
        }
      } finally {  
        setLoading(false);  
      }  
    };  

    fetchData();  
  }, []);  

  if (loading) return <div>Loading...</div>;  
  if (error) return <div>{error}</div>;  

  return (  
    <div>  
      <h1>Dashboard</h1>  
      <div>  
        <h2>Welcome, {user?.username}</h2>  
        <button onClick={signOut}>Sign Out</button>  
      </div>  
      <div>  
        <h2>Data</h2>  
        <ul>  
          {data.map((item) => (  
            <li key={item.id}>  
              {/* <h3>{item.name}</h3>  
              <p>{item.description}</p>   */}
            </li>  
          ))}  
        </ul>  
      </div>  
    </div>  
  );  
};  

export default Dashboard;