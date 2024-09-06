export interface Book {  
  id: string;  
  shelf: Shelf[];  
  volumeInfo: VolumeInfo;  
}  
export interface IndustryIdentifier {  
  type: string;  
  identifier: string;  
}

export interface ImageLinks {  
  smallThumbnail?: string;  
  thumbnail?: string;  
}

export interface Dimensions {  
  height: string;  
  width: string;  
  thickness: string;  
}

export interface VolumeInfo {  
  title: string;  
  subtitle?: string;  
  authors?: string[];  
  publisher?: string;  
  publishedDate?: string;  
  description?: string;  
  industryIdentifiers?: IndustryIdentifier[];  
  pageCount?: number;  
  printedPageCount?: number;  
  printType?: string;  
  categories?: string[];  
  maturityRating?: string;  
  allowAnonLogging?: boolean;  
  contentVersion?: string;  
  imageLinks?: ImageLinks;  
  language?: string;  
  previewLink?: string;  
  infoLink?: string;  
  canonicalVolumeLink?: string;  
  dimensions?: Dimensions;  
}

export interface Shelf {  
  wantToRead: Book[];  
  currentlyReading: Book[];  
  read: Book[];  
}
export interface User {  
  id: string;  
  username: string;  
  password: string;
}  
