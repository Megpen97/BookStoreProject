// src/utils/DataFetcher.ts  

import axios from 'axios';  

class DataFetcher {  
  static async fetchData(): Promise<any> {  
    try {  
      const response = await axios.get('https://api.example.com/data');  
      return response.data;  
    } catch (error) {  
      console.error('Error fetching data:', error);  
      throw error;  
    }  
  }  
}  

export default DataFetcher;  