import React from 'react';
import type { OfdPage } from '../types';

interface DocumentViewerProps {
  page: OfdPage;
  zoom: number;
  rotation: number;
  searchQuery: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ page, zoom, rotation, searchQuery }) => {
  const highlightContent = (content: string, query: string): string => {
    if (!query.trim()) return content;
    const regex = new RegExp(`(${query})`, 'gi');
    return content.replace(regex, '<mark class="bg-yellow-300">$1</mark>');
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4 min-h-[600px]">
      <div
        className="bg-white shadow-lg overflow-auto"
        style={{
          transform: `scale(${zoom}) rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          width: page.width,
          height: page.height,
          minWidth: page.width,
          minHeight: page.height
        }}
      >
        <div
          className="p-8 h-full overflow-auto"
          dangerouslySetInnerHTML={{
            __html: highlightContent(page.content, searchQuery)
          }}
        />
      </div>
    </div>
  );
};

export default DocumentViewer;
