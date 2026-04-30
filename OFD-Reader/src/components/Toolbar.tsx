import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCw,
  Search,
  Download,
  Printer,
  Menu
} from 'lucide-react';

interface ToolbarProps {
  zoom: number;
  rotation: number;
  isFullscreen: boolean;
  isSidebarOpen: boolean;
  searchQuery: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  onRotate: () => void;
  onSearchChange: (query: string) => void;
  onDownload: () => void;
  onPrint: () => void;
  onToggleSidebar: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  zoom,
  rotation,
  isFullscreen,
  isSidebarOpen,
  searchQuery,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  onRotate,
  onSearchChange,
  onDownload,
  onPrint,
  onToggleSidebar
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-lg font-semibold text-gray-800">OFD Reader</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <button
            onClick={onZoomOut}
            disabled={zoom <= 0.5}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-600 w-16 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            disabled={zoom >= 2}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <button
          onClick={onRotate}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={`Rotate ${rotation + 90} degrees`}
          title={`Rotate ${rotation + 90}°`}
        >
          <RotateCw className="w-5 h-5 text-gray-600" />
        </button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <button
          onClick={onDownload}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Download"
          title="下载文档"
        >
          <Download className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={onPrint}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Print"
          title="打印文档"
        >
          <Printer className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={onToggleFullscreen}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={isFullscreen ? '退出全屏' : '全屏阅读'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-gray-600" />
          ) : (
            <Maximize2 className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
