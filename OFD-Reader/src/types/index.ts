export interface OfdDocument {
  id: string;
  name: string;
  pageCount: number;
  pages: OfdPage[];
  metadata?: DocumentMetadata;
}

export interface OfdPage {
  index: number;
  width: number;
  height: number;
  content: string;
}

export interface DocumentMetadata {
  title: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  creationDate?: string;
  modificationDate?: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  pageIndex: number;
  children?: TableOfContentsItem[];
}

export interface SearchResult {
  pageIndex: number;
  text: string;
  position: { x: number; y: number };
}

export interface ReaderState {
  currentPage: number;
  zoom: number;
  rotation: number;
  isFullscreen: boolean;
  isSidebarOpen: boolean;
  searchQuery: string;
  searchResults: SearchResult[];
  currentSearchIndex: number;
}

export interface ReaderProps {
  documentUrl?: string;
  initialDocument?: OfdDocument;
  onDocumentLoad?: (document: OfdDocument) => void;
  onError?: (error: Error) => void;
}
