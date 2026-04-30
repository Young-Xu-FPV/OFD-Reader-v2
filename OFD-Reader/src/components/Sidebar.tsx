import React from 'react';
import { X, List, FileText } from 'lucide-react';
import type { TableOfContentsItem, DocumentMetadata } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  tableOfContents: TableOfContentsItem[];
  metadata: DocumentMetadata | undefined;
  onNavigateToPage: (pageIndex: number) => void;
  currentPage: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  tableOfContents,
  metadata,
  onNavigateToPage,
  currentPage
}) => {
  const importantClauses = [
    { title: '保险责任', pageIndex: 1 },
    { title: '责任免除', pageIndex: 2 },
    { title: '保险期间', pageIndex: 3 },
    { title: '保险金额', pageIndex: 4 },
    { title: '如实告知', pageIndex: 5 },
    { title: '受益人', pageIndex: 6 },
    { title: '保险金申请', pageIndex: 7 }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 lg:w-72 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">目录</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {metadata && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">文档信息</span>
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <p><strong className="text-gray-700">标题：</strong>{metadata.title}</p>
              {metadata.author && (
                <p><strong className="text-gray-700">作者：</strong>{metadata.author}</p>
              )}
              {metadata.subject && (
                <p><strong className="text-gray-700">主题：</strong>{metadata.subject}</p>
              )}
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <List className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">章节目录</span>
          </div>
          <nav className="space-y-1">
            {tableOfContents.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigateToPage(item.pageIndex);
                  onClose();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentPage === item.pageIndex
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-sm font-medium text-gray-700">重要条款</span>
          </div>
          <nav className="space-y-1">
            {importantClauses.map((clause, index) => (
              <button
                key={index}
                onClick={() => {
                  onNavigateToPage(clause.pageIndex);
                  onClose();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  currentPage === clause.pageIndex
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                {clause.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
