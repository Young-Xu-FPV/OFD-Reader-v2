import React, { useState, useRef, useEffect } from 'react';

interface MobileOFDReaderProps {
  onToggleView?: () => void;
}

const MobileOFDReader: React.FC<MobileOFDReaderProps> = ({ onToggleView }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showToolMenu, setShowToolMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAnnotationMode, setShowAnnotationMode] = useState(false);
  const [overallVerificationStatus, setOverallVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [showVerificationReport, setShowVerificationReport] = useState(false);
  const [showDocumentProperties, setShowDocumentProperties] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
  const [showSealDetails, setShowSealDetails] = useState(false);
  const [activeSealTab, setActiveSealTab] = useState<'signature' | 'seal'>('signature');
  const [showPageIndicator, setShowPageIndicator] = useState(false);
  const [toolbarsVisible, setToolbarsVisible] = useState(true);
  
  const documentRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);

  // 处理双指缩放和滚动显示页码
  useEffect(() => {
    if (!documentRef.current) return;

    let startDistance = 0;
    let startZoom = zoomLevel;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        startDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        startZoom = zoomLevel;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const scale = currentDistance / startDistance;
        const newZoom = Math.max(25, Math.min(600, startZoom * scale));
        setZoomLevel(newZoom);
      }
    };

    const handleScroll = () => {
      setShowPageIndicator(true);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = window.setTimeout(() => {
        setShowPageIndicator(false);
      }, 1500);
      
      // 当缩放比例为适合宽度（100%）时，根据滚动方向收起/展开工具栏
      if (zoomLevel === 100) {
        const currentScrollY = documentRef.current?.scrollTop || 0;
        if (currentScrollY > lastScrollYRef.current && toolbarsVisible) {
          // 向下滚动，收起工具栏
          setToolbarsVisible(false);
        } else if (currentScrollY < lastScrollYRef.current && !toolbarsVisible) {
          // 向上滚动，展开工具栏
          setToolbarsVisible(true);
        }
        lastScrollYRef.current = currentScrollY;
      }
    };

    const handleClick = () => {
      // 单指点击切换工具栏显示/隐藏
      setToolbarsVisible(!toolbarsVisible);
    };

    const element = documentRef.current;
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('scroll', handleScroll);
    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('scroll', handleScroll);
      element.removeEventListener('click', handleClick);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [zoomLevel, toolbarsVisible]);

  // 验证印章
  const verifySeal = () => {
    setOverallVerificationStatus('success');
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Top Toolbar */}
      <header className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-40 transition-transform duration-300 ${toolbarsVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* 返回按钮 */}
        <button 
          className="p-2 rounded hover:bg-gray-100 transition-colors"
          onClick={onToggleView}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>

        {/* 中间留空 */}
        <div className="flex-1"></div>

        {/* 菜单按钮带验真角标 */}
        <div className="relative">
          <button 
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            onClick={() => setShowMenu(!showMenu)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* 验真结果角标 */}
          {overallVerificationStatus === 'success' && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              ✓
            </div>
          )}
          {overallVerificationStatus === 'failed' && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              ✗
            </div>
          )}
        </div>
      </header>

      {/* Document Content */}
      <main 
        ref={documentRef}
        className="absolute inset-0 bg-gray-200 overflow-auto p-4"
      >
        {/* 页码浮窗 */}
        {showPageIndicator && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-lg font-medium z-50">
            {currentPage}/3
          </div>
        )}
        
        <div className="mx-auto max-w-[800px]">
          {/* Page 1 */}
          <div 
            className="bg-white shadow-lg rounded overflow-hidden mb-8"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            <div className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-gray-800 mb-3">OFD电子保单</h1>
                <div className="flex flex-col space-y-2 text-xs text-gray-600">
                  <div>保险公司：XX保险</div>
                  <div>保单号：POL20240115001</div>
                </div>
              </div>
              
              <div className="border border-gray-300 p-3 mb-6">
                <table className="w-full text-xs">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 bg-gray-50 w-1/4">被保险人</td>
                      <td className="border border-gray-300 p-2 w-1/4">张三</td>
                      <td className="border border-gray-300 p-2 bg-gray-50 w-1/4">证件号</td>
                      <td className="border border-gray-300 p-2 w-1/4">110101********1234</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 bg-gray-50">保险期间</td>
                      <td className="border border-gray-300 p-2" colSpan={3}>2024-01-15 至 2025-01-14</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 bg-gray-50">保险金额</td>
                      <td className="border border-gray-300 p-2" colSpan={3}>¥500,000.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-6">
                <h2 className="text-base font-semibold mb-2">保险责任</h2>
                <p className="text-xs text-gray-700 leading-relaxed">
                  在本合同保险期间内，本公司承担以下保险责任：被保险人因意外伤害事故导致身故、伤残，或因疾病导致身故、伤残，本公司按照合同约定给付保险金。
                </p>
              </div>

              <div className="flex justify-end mt-8">
                <div className="text-right">
                  <div className="w-20 h-20 border-2 border-red-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="text-red-600 font-bold text-xs">电子签章</span>
                  </div>
                  <p className="text-xs text-gray-500">保险公司签章</p>
                  <p className="text-xs text-gray-500 mt-1">2024-01-15</p>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500 mt-6">
                <p>本电子保单与纸质保单具有同等法律效力</p>
              </div>
            </div>
          </div>
          
          {/* Page 2 */}
          <div 
            className="bg-white shadow-lg rounded overflow-hidden mb-8"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            <div className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-gray-800 mb-3">OFD电子保单</h1>
                <div className="flex flex-col space-y-2 text-xs text-gray-600">
                  <div>保险公司：XX保险</div>
                  <div>保单号：POL20240115001</div>
                  <div>页码：第 2 页</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-base font-semibold mb-2">责任免除</h2>
                <p className="text-xs text-gray-700 leading-relaxed">
                  因下列情形之一导致被保险人身故、伤残的，本公司不承担给付保险金的责任：
                </p>
                <ul className="list-disc pl-5 text-xs text-gray-700 mt-2 space-y-1">
                  <li>投保人对被保险人的故意杀害、故意伤害；</li>
                  <li>被保险人故意自伤、故意犯罪或者抗拒依法采取的刑事强制措施；</li>
                  <li>被保险人主动吸食或注射毒品；</li>
                  <li>被保险人酒后驾驶、无合法有效驾驶证驾驶，或驾驶无有效行驶证的机动车；</li>
                  <li>战争、军事冲突、暴乱或武装叛乱；</li>
                  <li>核爆炸、核辐射或核污染。</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Page 3 */}
          <div 
            className="bg-white shadow-lg rounded overflow-hidden mb-8"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            <div className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-gray-800 mb-3">OFD电子保单</h1>
                <div className="flex flex-col space-y-2 text-xs text-gray-600">
                  <div>保险公司：XX保险</div>
                  <div>保单号：POL20240115001</div>
                  <div>页码：第 3 页</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-base font-semibold mb-2">保险金申请</h2>
                <p className="text-xs text-gray-700 leading-relaxed">
                  发生保险事故后，受益人应及时通知本公司，并向本公司提供下列证明和资料：
                </p>
                <ul className="list-disc pl-5 text-xs text-gray-700 mt-2 space-y-1">
                  <li>保险合同；</li>
                  <li>受益人的有效身份证件；</li>
                  <li>公安部门或医疗机构出具的被保险人死亡证明；</li>
                  <li>如被保险人为宣告死亡，受益人须提供人民法院出具的宣告死亡证明文件；</li>
                  <li>被保险人的户籍注销证明；</li>
                  <li>受益人所能提供的与确认保险事故的性质、原因、损失程度等有关的其他证明和资料。</li>
                </ul>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      {/* Bottom Toolbar */}
      <footer className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around shadow-sm z-40 transition-transform duration-300 ${toolbarsVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        {/* 标注按钮 */}
        <button 
          className="flex flex-col items-center p-1 rounded hover:bg-gray-100 transition-colors"
          onClick={() => setShowAnnotationMode(!showAnnotationMode)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L15 16.5 18.5 18.5H15z" />
          </svg>
          <span className="text-xs text-gray-700 mt-1">标注</span>
        </button>

        {/* 工具按钮 */}
        <button 
          className="flex flex-col items-center p-1 rounded hover:bg-gray-100 transition-colors"
          onClick={() => setShowToolMenu(!showToolMenu)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <span className="text-xs text-gray-700 mt-1">工具</span>
        </button>
      </footer>

      {/* 标注编辑模式 */}
      {showAnnotationMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className="text-xs text-gray-700 mt-1">画笔</span>
            </button>
            <button className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs text-gray-700 mt-1">高亮</span>
            </button>
            <button className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs text-gray-700 mt-1">下划线</span>
            </button>
            <button className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-xs text-gray-700 mt-1">删除线</span>
            </button>
            <button className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs text-gray-700 mt-1">形状标注</span>
            </button>
            <button className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-xs text-gray-700 mt-1">橡皮</span>
            </button>
            <button className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-gray-700 mt-1">签名</span>
            </button>
          </div>
          <div className="flex justify-center mt-3">
            <button 
              className="px-6 py-2 bg-gray-100 text-gray-800 rounded-full text-sm"
              onClick={() => setShowAnnotationMode(false)}
            >
              退出标注
            </button>
          </div>
        </div>
      )}

      {/* 工具菜单 */}
      {/* 遮罩层 */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${showToolMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setShowToolMenu(false)}
      ></div>
      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[60vh] flex flex-col transition-all duration-300 ease-out ${showToolMenu ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        {/* Menu Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-xl font-medium text-gray-900">电子印章</h3>
          </div>
          <button 
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => setShowToolMenu(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* 电子印章卡片 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between relative">
              {/* 状态图标 */}
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex items-center">
                <div className="w-20 h-20 bg-amber-50 rounded-lg flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">电子印章1</p>
                  <p className="text-xs text-gray-500">签名算法: sm3WithSM2</p>
                </div>
              </div>
              <button 
                className="p-2 rounded-full border border-gray-300 bg-white"
                onClick={() => setShowSealDetails(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between relative">
              {/* 状态图标 */}
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex items-center">
                <div className="w-20 h-20 bg-amber-50 rounded-lg flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">电子印章2</p>
                  <p className="text-xs text-gray-500">签名算法: sm3WithSM2</p>
                </div>
              </div>
              <button 
                className="p-2 rounded-full border border-gray-300 bg-white"
                onClick={() => setShowSealDetails(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between relative">
              {/* 状态图标 */}
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex items-center">
                <div className="w-20 h-20 bg-amber-50 rounded-lg flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">电子印章3</p>
                  <p className="text-xs text-gray-500">签名算法: sm3WithSM2</p>
                </div>
              </div>
              <button 
                className="p-2 rounded-full border border-gray-300 bg-white"
                onClick={() => setShowSealDetails(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 顶部菜单 */}
      {/* 遮罩层 */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${showMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setShowMenu(false)}
      ></div>
      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[95vh] flex flex-col transition-all duration-300 ease-out ${showMenu ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            {/* Menu Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">电子保单_20241010_CX12345678_车险.ofd</p>
                  <p className="text-xs text-gray-500">大小：2.2 MB</p>
                </div>
              </div>
              <button 
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setShowMenu(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {/* 验证状态显示 */}
                <div className="p-4 mb-4 rounded-lg bg-gray-50">
                  {overallVerificationStatus === 'success' && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-800">验真通过</p>
                        <button 
                          className="text-sm text-blue-600 mt-1"
                          onClick={() => setShowVerificationReport(true)}
                        >
                          查看详情
                        </button>
                      </div>
                    </div>
                  )}
                  {overallVerificationStatus === 'failed' && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-800">验真不通过</p>
                        <button 
                          className="text-sm text-blue-600 mt-1"
                          onClick={() => setShowVerificationReport(true)}
                        >
                          查看详情
                        </button>
                      </div>
                    </div>
                  )}
                  {overallVerificationStatus === 'pending' && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-800">待验真</p>
                        <button 
                          className="text-sm text-blue-600 mt-1"
                          onClick={verifySeal}
                        >
                          立即验真
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <button className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="text-xs text-gray-800">下载</span>
                  </button>
                  <button className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xs text-gray-800">打印</span>
                  </button>
                  <button className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="text-xs text-gray-800">分享</span>
                  </button>
                  <button 
                    className="flex flex-col items-center p-3 rounded-lg bg-gray-50"
                    onClick={() => setShowDocumentProperties(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v6m3-3H9" />
                    </svg>
                    <span className="text-xs text-gray-800">文档属性</span>
                  </button>
                </div>
                

                

              </div>
            </div>
          </div>

      {/* 验真报告弹窗 */}
      {showVerificationReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-[90%] mx-4 animate-scale-in">
            <div className="text-center mb-4">
              {overallVerificationStatus === 'success' ? (
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {overallVerificationStatus === 'success' ? '验真通过' : '验真不通过'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {overallVerificationStatus === 'success' 
                  ? '该文档有3个数字签名，验证成功3个，验证失败0个。' 
                  : '该文档有3个数字签名，验证成功1个，验证失败2个。'}
              </p>
              {overallVerificationStatus === 'failed' && (
                <div className="text-left mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">验证失败原因：</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>证书已吊销，电子签章验证失败</li>
                    <li>证书已吊销，电子签章验证失败</li>
                  </ul>
                </div>
              )}
            </div>
            <button 
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setShowVerificationReport(false)}
            >
              确定
            </button>
          </div>
        </div>
      )}

      {/* 文档属性弹窗 */}
      {showDocumentProperties && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[90%] max-h-[80vh] mx-4 flex flex-col animate-scale-in">
            {/* 弹窗头部 */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">文档属性</h3>
              <button 
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setShowDocumentProperties(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* 标签页 */}
            <div className="flex border-b border-gray-200">
              <button 
                className={`flex-1 py-3 px-4 text-center ${activeTab === 'info' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-600'}`}
                onClick={() => setActiveTab('info')}
              >
                元数据
              </button>
              <button 
                className={`flex-1 py-3 px-4 text-center ${activeTab === 'security' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-600'}`}
                onClick={() => setActiveTab('security')}
              >
                安全
              </button>
            </div>
            
            {/* 标签页内容 */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeTab === 'info' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">作者</span>
                    <span className="text-gray-900">XX财产保险有限公司</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">创建日期</span>
                    <span className="text-gray-900">2025-01-01 15:23:56</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">被保险人名称</span>
                    <span className="text-gray-900">李四</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">被保险人证件类型</span>
                    <span className="text-gray-900">居民身份证</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">被保险人证件号码</span>
                    <span className="text-gray-900">110XXXXXXXXXXXXXXX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">保险起期</span>
                    <span className="text-gray-900">2025-01-01 15:23:56</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">保险止期</span>
                    <span className="text-gray-900">2025-12-31 15:23:56</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">承保险种</span>
                    <span className="text-gray-900">第三者责任险</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">保险金额/责任限额</span>
                    <span className="text-gray-900">1000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">保险费总计</span>
                    <span className="text-gray-900">1500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">保险人名称</span>
                    <span className="text-gray-900">XX财产保险有限公司</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">保险单号</span>
                    <span className="text-gray-900">1234567890abcdefgh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">保单生成时间</span>
                    <span className="text-gray-900">2025-01-01 15:23:56</span>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">安全性</span>
                    <span className="text-gray-900">无保护</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">安全方法</span>
                    <span className="text-gray-900">数字签名保护</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600 font-medium mb-3">文档限制摘要</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">打印</span>
                        <span className="text-gray-900">允许</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">修改文档</span>
                        <span className="text-gray-900">允许</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">内容复制</span>
                        <span className="text-gray-900">允许</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">注释</span>
                        <span className="text-gray-900">允许</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">填写表单</span>
                        <span className="text-gray-900">允许</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">页面提取</span>
                        <span className="text-gray-900">允许</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">文档组合</span>
                        <span className="text-gray-900">允许</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 电子印章详情弹窗 */}
      {showSealDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[90%] max-h-[80vh] mx-4 flex flex-col animate-scale-in">
            {/* 弹窗头部 */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium text-gray-900">电子印章1</h3>
                <p className="text-red-600 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  该印章无效
                </p>
              </div>
              <button 
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setShowSealDetails(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* 标签页 */}
            <div className="flex border-b border-gray-200">
              <button 
                className={`flex-1 py-3 px-4 text-center ${activeSealTab === 'signature' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-600'}`}
                onClick={() => setActiveSealTab('signature')}
              >
                签章
              </button>
              <button 
                className={`flex-1 py-3 px-4 text-center ${activeSealTab === 'seal' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-600'}`}
                onClick={() => setActiveSealTab('seal')}
              >
                印章
              </button>
            </div>
            
            {/* 标签页内容 */}
            <div className="flex-1 p-4 overflow-y-auto">
              
              {activeSealTab === 'signature' && (
                <div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-medium text-gray-700 mb-3">签章属性</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">签章人</span>
                          <span className="text-gray-900 col-span-2">370100123456789099</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">原文摘要</span>
                          <span className="text-gray-900 col-span-2 break-all">4419492f1d6a7d481f27d430b60277009bf930801df0d63de0397ea786f6202</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">签名值</span>
                          <span className="text-gray-900 col-span-2 break-all">304402204eac29e12bab2ea741afa17c17992f3e409fbd980ce1fa335f863ddb9022026910d6cd5948cb3dfccc37ab24f40017b713cb1c241c472f514fa7ca2655997f5</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">签名方法</span>
                          <span className="text-gray-900 col-span-2">sm3</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">版本号</span>
                          <span className="text-gray-900 col-span-2">1</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-base font-medium text-gray-700 mb-3">签章人证书</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">版本</span>
                          <span className="text-gray-900 col-span-2">3</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">序列号</span>
                          <span className="text-gray-900 col-span-2">0180aca09384</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">签名算法</span>
                          <span className="text-gray-900 col-span-2">sm3WithSM2</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">签名哈希算法</span>
                          <span className="text-gray-900 col-span-2">sm3</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">颁发者</span>
                          <span className="text-gray-900 col-span-2 break-all">C=CN ST=北京市 L=? O=国家信息中心认证处 OU=? CN=电子印章</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">制作者</span>
                          <span className="text-gray-900 col-span-2">制作系统接入平台测试01</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">有效期从</span>
                          <span className="text-gray-900 col-span-2">2022-05-09 24:00:00</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">到</span>
                          <span className="text-gray-900 col-span-2">2027-05-09 24:00:00</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">使用者</span>
                          <span className="text-gray-900 col-span-2 break-all">C=CN ST=? L=? O=北京数科科技有限公司 OU=? CN=电子印章</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600">公钥</span>
                          <span className="text-gray-900 col-span-2 break-all">0487ed72f46242070a8ef1866aa3dc36a780a709e966b9dac37b9170f765a1dc64c9a7c8039f6c52c930bd770a9958a9c7f92ad19347616a627352660fc7d84</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSealTab === 'seal' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="w-32 h-32 bg-amber-50 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-base font-medium text-gray-700 mb-3">印章属性</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">印章名称</span>
                        <span className="text-gray-900 col-span-2">北京数科科技有限公司</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">印章类型</span>
                        <span className="text-gray-900 col-span-2">1</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">有效期从</span>
                        <span className="text-gray-900 col-span-2">未知</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">到</span>
                        <span className="text-gray-900 col-span-2">2027-05-08 24:00:00</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">制章日期</span>
                        <span className="text-gray-900 col-span-2">2022-05-10 14:26:36</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">印章版本</span>
                        <span className="text-gray-900 col-span-2">4</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">厂商标识</span>
                        <span className="text-gray-900 col-span-2">SHANDONGTONGZHIWEIYE</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">制章签名方法</span>
                        <span className="text-gray-900 col-span-2">sm3</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">印章签名值</span>
                        <span className="text-gray-900 col-span-2 break-all">b6b2c6e32a42749a95c02100b144a47cbba7bc075359f7dfca8ec793a40303319b3bbd7d0c79dde77a8730d</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-base font-medium text-gray-700 mb-3">制章人证书</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">版本</span>
                        <span className="text-gray-900 col-span-2">3</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">序列号</span>
                        <span className="text-gray-900 col-span-2">017277ae1111</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">签名算法</span>
                        <span className="text-gray-900 col-span-2">sm3WithSM2</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">签名哈希算法</span>
                        <span className="text-gray-900 col-span-2">sm3</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">颁发者</span>
                        <span className="text-gray-900 col-span-2 break-all">C=CN ST=北京市 L=? O=国家信息中心认证处 OU=? CN=电子印章</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">有效期从</span>
                        <span className="text-gray-900 col-span-2">2019-06-27 24:00:00</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">到</span>
                        <span className="text-gray-900 col-span-2">2029-06-27 24:00:00</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">使用者</span>
                        <span className="text-gray-900 col-span-2 break-all">C=CN ST=? L=? O=制章单位 OU=? CN=测试CN</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-600">公钥</span>
                        <span className="text-gray-900 col-span-2 break-all">04c2818f005d862c9291756878d12ee6e5bd91928cdb39ee9a6e62f219351442a1s</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileOFDReader;
