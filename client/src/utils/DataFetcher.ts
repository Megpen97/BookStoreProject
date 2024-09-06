// src/utils/DataFetcher.ts  

import axios from 'axios';  

class DataFetcher {  
  static async fetchData(): Promise<string> {  
    try {  
      const response = await axios.get('/api/bookshelf');  
      return response.data;  
    } catch (error) {  
      console.error('Error fetching data:', error);  
      throw error;  
    }  
  }  
}  

export default DataFetcher;  