import React, { useState } from 'react';
import OFDReader from './components/OFDReader';
import MobileOFDReader from './components/MobileOFDReader';

function App() {
  const [isMobile, setIsMobile] = useState(true);

  return (
    <div className="relative">
      {/* 根据状态显示不同组件，并传递切换函数 */}
      {isMobile ? 
        <MobileOFDReader onToggleView={() => setIsMobile(false)} /> : 
        <OFDReader onToggleView={() => setIsMobile(true)} />
      }
    </div>
  );
}

export default App;