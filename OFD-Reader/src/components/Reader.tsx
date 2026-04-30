import React, { useState, useEffect, useCallback } from 'react';
import type { OfdDocument, ReaderState, TableOfContentsItem } from '../types';
import { generateMockDocument } from '../utils/ofdParser';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';
import DocumentViewer from './DocumentViewer';

interface ReaderProps {
  documentUrl?: string;
}

const Reader: React.FC<ReaderProps> = ({ documentUrl }) => {
  const [ofdDocument, setOfdDocument] = useState<OfdDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [readerState, setReaderState] = useState<ReaderState>({
    currentPage: 0,
    zoom: 1,
    rotation: 0,
    isFullscreen: false,
    isSidebarOpen: false,
    searchQuery: '',
    searchResults: [],
    currentSearchIndex: -1
  });

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const doc = generateMockDocument();
        setOfdDocument(doc);
      } catch (err) {
        setError('加载文档失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [documentUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!ofdDocument) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (readerState.currentPage > 0) {
            setReaderState((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
          }
          break;
        case 'ArrowRight':
          if (readerState.currentPage < ofdDocument.pageCount - 1) {
            setReaderState((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
          }
          break;
        case 'Escape':
          if (readerState.isFullscreen) {
            setReaderState((prev) => ({ ...prev, isFullscreen: false }));
          }
          break;
        case '+':
        case '=':
          setReaderState((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 0.1, 2) }));
          break;
        case '-':
          setReaderState((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 0.1, 0.5) }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ofdDocument, readerState.currentPage, readerState.isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setReaderState((prev) => ({
        ...prev,
        isFullscreen: !!document.fullscreenElement
      }));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleZoomIn = useCallback(() => {
    setReaderState((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 0.1, 2) }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setReaderState((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 0.1, 0.5) }));
  }, []);

  const handleRotate = useCallback(() => {
    setReaderState((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    const container = document.getElementById('reader-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      await container.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setReaderState((prev) => ({
      ...prev,
      searchQuery: query,
      searchResults: [],
      currentSearchIndex: -1
    }));
  }, []);

  const handleDownload = useCallback(() => {
    const blob = new Blob(['OFD Document Content'], { type: 'application/ofd' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = ofdDocument?.name || 'document.ofd';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [ofdDocument]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setReaderState((prev) => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }));
  }, []);

  const handlePrevPage = useCallback(() => {
    if (ofdDocument && readerState.currentPage > 0) {
      setReaderState((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  }, [ofdDocument, readerState.currentPage]);

  const handleNextPage = useCallback(() => {
    if (ofdDocument && readerState.currentPage < ofdDocument.pageCount - 1) {
      setReaderState((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  }, [ofdDocument, readerState.currentPage]);

  const handleGoToPage = useCallback((page: number) => {
    if (ofdDocument && page >= 0 && page < ofdDocument.pageCount) {
      setReaderState((prev) => ({ ...prev, currentPage: page }));
    }
  }, [ofdDocument]);

  const tableOfContents: TableOfContentsItem[] = [
    { id: '1', title: '保单信息', pageIndex: 0 },
    { id: '2', title: '第一条 保险责任', pageIndex: 1 },
    { id: '3', title: '第二条 责任免除', pageIndex: 2 },
    { id: '4', title: '第三条 保险期间', pageIndex: 3 },
    { id: '5', title: '第四条 保险金额与保险费', pageIndex: 4 },
    { id: '6', title: '第五条 如实告知', pageIndex: 5 },
    { id: '7', title: '第六条 受益人', pageIndex: 6 },
    { id: '8', title: '第七条 保险金申请与给付', pageIndex: 7 }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">加载文档中...</p>
        </div>
      </div>
    );
  }

  if (error || !ofdDocument) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || '文档加载失败'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="reader-container"
      className={`h-screen flex flex-col bg-gray-50 ${
        readerState.isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      <Sidebar
        isOpen={readerState.isSidebarOpen}
        onClose={handleToggleSidebar}
        tableOfContents={tableOfContents}
        metadata={ofdDocument.metadata}
        onNavigateToPage={handleGoToPage}
        currentPage={readerState.currentPage}
      />

      <div className="flex-1 flex flex-col lg:ml-72">
        <Toolbar
          zoom={readerState.zoom}
          rotation={readerState.rotation}
          isFullscreen={readerState.isFullscreen}
          isSidebarOpen={readerState.isSidebarOpen}
          searchQuery={readerState.searchQuery}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onToggleFullscreen={handleToggleFullscreen}
          onRotate={handleRotate}
          onSearchChange={handleSearchChange}
          onDownload={handleDownload}
          onPrint={handlePrint}
          onToggleSidebar={handleToggleSidebar}
        />

        <main className="flex-1 overflow-auto">
          <DocumentViewer
            page={ofdDocument.pages[readerState.currentPage]}
            zoom={readerState.zoom}
            rotation={readerState.rotation}
            searchQuery={readerState.searchQuery}
          />
        </main>

        <NavigationBar
          currentPage={readerState.currentPage}
          pageCount={ofdDocument.pageCount}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          onGoToPage={handleGoToPage}
        />
      </div>
    </div>
  );
};

export default Reader;
