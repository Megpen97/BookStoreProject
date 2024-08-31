export interface IndustryIdentifier {  
  type: string;  
  identifier: string;  
}  

export interface ReadingModes {  
  text: boolean;  
  image: boolean;  
}  

export interface PanelizationSummary {  
  containsEpubBubbles: boolean;  
  containsImageBubbles: boolean;  
}  

// Define the structure of the volume information within the book object  
export interface VolumeInfo {  
  title: string;  
  subtitle?: string;  
  authors?: string[];  
  publisher?: string;  
  publishedDate?: string;  
  description?: string;  
  industryIdentifiers?: IndustryIdentifier[];  
  readingModes?: ReadingModes;  
  pageCount?: number;  
  printedPageCount?: number;  
  printType?: string;  
  categories?: string[];  
  maturityRating?: string;  
  allowAnonLogging?: boolean;  
  contentVersion?: string;  
  panelizationSummary?: PanelizationSummary;  
  imageLinks?: {  
    smallThumbnail?: string;  
    thumbnail?: string;  
  };  
  language?: string;  
  previewLink?: string;  
  infoLink?: string;  
  canonicalVolumeLink?: string;  
}  

// Define the structure of the book object  
export interface Book {  
  id: string;  
  volumeInfo: VolumeInfo;  
}  