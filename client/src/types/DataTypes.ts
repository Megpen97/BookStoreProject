// Define the structure of the volume information within the book object  
export interface VolumeInfo {  
    title: string;  
    authors?: string[];  
    publishedDate?: string;  
    description?: string;  
    industryIdentifiers?: { type: string; identifier: string }[];  
    pageCount?: number;  
    imageLinks?: {  
      thumbnail?: string;  
    };  
  }  
  
  // Define the structure of the book object  
  export interface Book {  
    id: string;  
    volumeInfo: VolumeInfo;  
  }