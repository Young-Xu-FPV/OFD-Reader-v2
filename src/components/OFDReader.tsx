import React, { useState } from 'react';

interface OFDReaderProps {
  onToggleView?: () => void;
}

const OFDReader: React.FC<OFDReaderProps> = ({ onToggleView }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sealStatus, setSealStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSeal, setSelectedSeal] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'signature' | 'seal'>('signature');
  const [docPropActiveTab, setDocPropActiveTab] = useState<'description' | 'security'>('description');
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  // 验签相关状态
  const [verificationResults, setVerificationResults] = useState<Array<{status: 'success' | 'failed', error?: string}>>([]);
  const [showVerificationReport, setShowVerificationReport] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [overallVerificationStatus, setOverallVerificationStatus] = useState<'pending' | 'verifying' | 'success' | 'warning' | 'failed' | 'noResponse'>('pending');

  const verifySeal = () => {
    // 模拟验签过程
    setIsVerifying(true);
    setOverallVerificationStatus('pending');
    
    // 模拟验证所有印章
    setTimeout(() => {
      // 模拟验证结果，根据sealDetails中的status字段
      const results = sealDetails.map(seal => {
        if (seal.status === 'valid') {
          return { status: 'success' as const };
        } else {
          // 随机生成失败原因
          const errorReasons = [
            '签名值不一致，电子签章验证失败',
            '证书过期或无效，电子签章验证失败',
            '证书已吊销，电子签章验证失败'
          ];
          const randomError = errorReasons[Math.floor(Math.random() * errorReasons.length)];
          return { status: 'failed' as const, error: randomError };
        }
      });
      
      setVerificationResults(results);
      setShowVerificationReport(true);
      setIsVerifying(false);
      
      // 更新整体验证状态
      if (results.every(result => result.status === 'success')) {
        setOverallVerificationStatus('success');
      } else {
        setOverallVerificationStatus('failed');
      }
    }, 1500);
  };

  const sealDetails = [
    {
      status: 'invalid',
      signature: {
        attributes: {
          '签章人': '37010012345678909',
          '原文摘要': '4419492f1d6a7d48f27d430b60277009bf930801df0d63de0397ea786f6202',
          '签名值': '3044022040eac29e12bab2ea741afa17c17992f3e409fbd980ce1ffa335f863ddb902206910d6cd5948cb3dfcc3c7ab24f40017b713cb1c241c472f514fa7ca2655997f5',
          '签名方法': 'sm3',
          '版本号': '1'
        },
        certificate: {
          '版本': '3',
          '序列号': '0180aca09384',
          '签名算法': 'sm3WithSM2',
          '签名哈希算法': 'sm3',
          '颁发者': 'C=CN ST=北京市 L=? O=国家信息中心认证处 OU=? CN=电子印章',
          '制作者': '制作系统接入平台测试01',
          '有效期从': '2022-05-09 24:00:00',
          '到': '2027-05-09 24:00:00',
          '使用者': 'C=CN ST=? L=? O=91110108MA01UE9D3W北京复眼科技有限公司 OU=? CN=37010012345678909',
          '公钥': '0487ede7214624207d98afe1866aa3dc3762a038d7c522c7dbc779109f7659dc4c1420e07d966b930b3b5b495d2ae6f6792d219347f16a6275f23660fcd784'
        }
      },
      seal: {
        attributes: {
          '印章名称': '北京复眼科技有限公司',
          '印章类型': '1',
          '有效时间从': '未知',
          '到': '2027-05-08 24:00:00',
          '制章日期': '2022-05-10 14:26:36',
          '印章版本': '4',
          '厂商标识': 'SHANDONG.TONGZHIWEIYE',
          '制章签名方法': 'sm3',
          '印章签名值': 'bcb2c0632e47247a95c022100b14f44a7cb1ba07ccd3587fbfca8caec7934a030319b3bbd70d7c9dde71a37bd'
        },
        certificate: {
          '版本': '3',
          '序列号': '017277ace111',
          '签名算法': 'sm3WithSM2',
          '签名哈希算法': 'sm3',
          '颁发者': 'C=CN ST=北京市 L=? O=国家信息中心认证处 OU=? CN=电子印章',
          '有效期从': '2019-06-27 24:00:00',
          '到': '2029-06-27 24:00:00',
          '使用者': 'C=CN ST=? L=? O=测试单位 OU=? CN=测试单位',
          '公钥': '04c218f5f0d08e2c29f5768d179d12eee5b61928c8b37b9ed5b3cec2f23ac1442a1374cc6a7f81b39a9a9c668f5199135484c54a74a9f73524a06b1b24aac3167'
        }
      }
    },
    {
      status: 'valid',
      signature: {
        attributes: {
          '签章人': '37010098765432100',
          '原文摘要': 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
          '签名值': '3044022040eac29e12bab2ea741afa17c17992f3e409fbd980ce1ffa335f863ddb902206910d6cd5948cb3dfcc3c7ab24f40017b713cb1c241c472f514fa7ca2655997f6',
          '签名方法': 'sm3',
          '版本号': '1'
        },
        certificate: {
          '版本': '3',
          '序列号': '0180aca09385',
          '签名算法': 'sm3WithSM2',
          '签名哈希算法': 'sm3',
          '颁发者': 'C=CN ST=北京市 L=? O=国家信息中心认证处 OU=? CN=电子印章',
          '制作者': '制作系统接入平台测试01',
          '有效期从': '2022-05-10 00:00:00',
          '到': '2027-05-09 24:00:00',
          '使用者': 'C=CN ST=? L=? O=91110108MA01UE9D3W北京复眼科技有限公司 OU=? CN=37010098765432100',
          '公钥': '0487ede7214624207d98afe1866aa3dc3762a038d7c522c7dbc779109f7659dc4c1420e07d966b930b3b5b495d2ae6f6792d219347f16a6275f23660fcd785'
        }
      },
      seal: {
        attributes: {
          '印章名称': '北京复眼科技有限公司',
          '印章类型': '1',
          '有效时间从': '未知',
          '到': '2027-05-08 24:00:00',
          '制章日期': '2022-05-10 14:26:36',
          '印章版本': '4',
          '厂商标识': 'SHANDONG.TONGZHIWEIYE',
          '制章签名方法': 'sm3',
          '印章签名值': '3046022100f19519b11fc353b17854a7379fe53069ccd1ab8657b97b'
        },
        certificate: {
          '版本': '3',
          '序列号': '0180aca09384',
          '签名算法': 'sm3WithSM2',
          '签名哈希算法': 'sm3',
          '颁发者': 'C=CN ST=北京市 L=? O=国家信息中心认证处 OU=? CN=电子印章',
          '有效期从': '2022-05-09 24:00:00',
          '到': '2027-05-09 24:00:00',
          '使用者': 'C=CN ST=? L=? O=北京复眼科技有限公司 OU=? CN=北京复眼科技有限公司',
          '公钥': '0487ede7214624207d98afe1866aa3dc3762a038d7c522c7dbc779109f7659dc4c1420e07d966b930b3b5b495d2ae6f6792d219347f16a6275f23660fcd784'
        }
      }
    },
    {
      status: 'invalid',
      signature: {
        attributes: {
          '签章人': '37010011111111100',
          '原文摘要': 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
          '签名值': '3044022040eac29e12bab2ea741afa17c17992f3e409fbd980ce1ffa335f863ddb902206910d6cd5948cb3dfcc3c7ab24f40017b713cb1c241c472f514fa7ca2655997f7',
          '签名方法': 'sm3',
          '版本号': '1'
        },
        certificate: {
          '版本': '3',
          '序列号': '017277ace111',
          '签名算法': 'sm3WithSM2',
          '签名哈希算法': 'sm3',
          '颁发者': 'C=CN ST=北京市 L=? O=国家信息中心认证处 OU=? CN=电子印章',
          '制作者': '制作系统接入平台测试01',
          '有效期从': '2019-06-27 00:00:00',
          '到': '2029-06-27 24:00:00',
          '使用者': 'C=CN ST=? L=? O=测试公司 OU=? CN=37010011111111100',
          '公钥': '0487ede7214624207d98afe1866aa3dc3762a038d7c522c7dbc779109f7659dc4c1420e07d966b930b3b5b495d2ae6f6792d219347f16a6275f23660fcd786'
        }
      },
      seal: {
        attributes: {
          '印章名称': '测试印章',
          '印章类型': '1',
          '有效时间从': '未知',
          '到': '2029-06-27 24:00:00',
          '制章日期': '2019-06-27 10:00:00',
          '印章版本': '3',
          '厂商标识': 'SHANDONG.TONGZHIWEIYE',
          '制章签名方法': 'sm3',
          '印章签名值': 'test-seal-signature-value'
        },
        certificate: {
          '版本': '3',
          '序列号': '017277ace112',
          '签名算法': 'sm3WithSM2',
          '签名哈希算法': 'sm3',
          '颁发者': 'C=CN ST=北京市 L=? O=国家信息中心认证处 OU=? CN=电子印章',
          '有效期从': '2019-06-27 24:00:00',
          '到': '2029-06-27 24:00:00',
          '使用者': 'C=CN ST=? L=? O=测试单位2 OU=? CN=测试单位2',
          '公钥': '0487ede7214624207d98afe1866aa3dc3762a038d7c522c7dbc779109f7659dc4c1420e07d966b930b3b5b495d2ae6f6792d219347f16a6275f23660fcd787'
        }
      }
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Toolbar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        {/* Left section - Zoom controls */}
        <div className="flex items-center space-x-2 relative">
          <button 
            className="p-2 rounded hover:bg-gray-100 transition-colors border border-gray-300"
            onClick={() => setZoomLevel(Math.max(25, zoomLevel - 10))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <div className="relative group">
            <div className="text-sm font-medium text-gray-700 min-w-[50px] text-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1">
              {zoomLevel}%
            </div>
            <div className="absolute left-0 top-full mt-1 w-40 bg-white shadow-lg rounded border border-gray-200 z-10 hidden group-hover:block">
              <div className="py-1">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  自动缩放
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  实际大小
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  适合宽度
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  适合高度
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                {[50, 75, 100, 125, 150, 200, 300, 400, 500, 600].map((level) => (
                  <button 
                    key={level}
                    className={`block w-full text-left px-4 py-2 text-sm ${zoomLevel === level ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setZoomLevel(level)}
                  >
                    {level}%
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button 
            className="p-2 rounded hover:bg-gray-100 transition-colors border border-gray-300"
            onClick={() => setZoomLevel(Math.min(600, zoomLevel + 10))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Center section - Page navigation */}
        <div className="flex items-center space-x-3">
          {/* 视图切换按钮 */}
          {onToggleView && (
            <button 
              className="p-2 rounded hover:bg-gray-100 transition-colors border border-gray-300"
              onClick={onToggleView}
              aria-label="切换到移动端"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
          )}
          <button 
            className="p-2 rounded hover:bg-gray-100 transition-colors border border-gray-300"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center space-x-2 bg-gray-50 rounded border border-gray-300 px-3 py-1">
            <input 
              type="text" 
              value={currentPage}
              onChange={(e) => {
                const value = e.target.value;
                // 只允许输入数字
                if (/^\d*$/.test(value)) {
                  const num = parseInt(value) || 1;
                  setCurrentPage(Math.max(1, Math.min(10, num)));
                }
              }}
              className="w-12 text-center bg-transparent border-0 outline-none text-sm"
            />
            <span className="text-gray-500 text-sm">/ 10</span>
          </div>
          <button 
            className="p-2 rounded hover:bg-gray-100 transition-colors border border-gray-300"
            onClick={() => setCurrentPage(Math.min(10, currentPage + 1))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Right section - File operations */}
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm">打开</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-sm">下载</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="text-sm">打印</span>
          </button>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Navigation + Content */}
        <div className={`flex border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-12' : 'w-auto'}`}>
          {/* Vertical icon navigation */}
          <div className="bg-gray-100 w-12 flex flex-col items-center py-2 border-r border-gray-200 flex-shrink-0">
            <button 
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </button>
          </div>

          {/* Electronic seal content panel - Only show when not collapsed */}
          {!sidebarCollapsed && (
            <aside className="w-64 bg-gray-50 flex flex-col border-l border-gray-200">
              <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
                <h2 className="text-gray-800 font-medium text-sm">电子印章</h2>
                <div className="flex items-center space-x-2">
                  <button className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" onClick={verifySeal}>
                    验签
                  </button>
                  <button 
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setSidebarCollapsed(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {sealDetails.map((seal, index) => (
                    <div key={index} className="group border border-gray-200 rounded-lg p-3 bg-white hover:border-blue-400 cursor-pointer transition-all shadow-sm relative">
                      <div className="flex items-center justify-center w-full p-4 relative">
                        <img 
                          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20chinese%20official%20seal%20with%20star%20in%20center%20and%20chinese%20characters%20around&image_size=square_hd" 
                          alt={`公章${String.fromCharCode(65 + index)}`} 
                          className="w-32 h-32 object-contain" 
                        />
                        {verificationResults.length > 0 ? (
                          verificationResults[index].status === 'success' ? (
                            <div className="absolute top-4 right-4 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <div className="absolute top-4 right-4 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                          )
                        ) : (
                          <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                        <button 
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSeal(index);
                            setShowDetailsModal(true);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Central document area and right sidebar */}
        <div className="flex-1 flex">
          {/* Central document area */}
          <main className="flex-1 bg-gray-200 overflow-auto flex items-start justify-center p-8">
            <div className="max-w-4xl">
              {/* Page 1 */}
              <div className="bg-white shadow-lg rounded overflow-hidden mb-8" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}>
                <div className="p-12">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">OFD电子保单</h1>
                    <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
                      <div>保险公司：XX保险</div>
                      <div>保单号：POL20240115001</div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-300 p-4 mb-8">
                    <table className="w-full text-sm">
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

                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">保险责任</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      在本合同保险期间内，本公司承担以下保险责任：被保险人因意外伤害事故导致身故、伤残，或因疾病导致身故、伤残，本公司按照合同约定给付保险金。
                    </p>
                  </div>

                  <div className="flex justify-end mt-12">
                    <div className="text-right">
                      <div className="w-24 h-24 border-2 border-red-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span className="text-red-600 font-bold text-xs">电子签章</span>
                      </div>
                      <p className="text-xs text-gray-500">保险公司签章</p>
                      <p className="text-xs text-gray-500 mt-1">2024-01-15</p>
                    </div>
                  </div>

                  <div className="text-center text-xs text-gray-500 mt-8">
                    <p>本电子保单与纸质保单具有同等法律效力</p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Right sidebar toggle button */}
          {rightSidebarCollapsed && (
            <div className="flex items-center justify-center border-l border-gray-200 bg-white p-2">
              <button 
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                onClick={() => setRightSidebarCollapsed(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          )}

          {/* Right sidebar - Document properties */}
          {!rightSidebarCollapsed && (
            <aside className="w-80 border-l border-gray-200 bg-white flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-sm font-medium text-gray-900">文档属性</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setRightSidebarCollapsed(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-6 px-4">
                <button 
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${docPropActiveTab === 'description' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setDocPropActiveTab('description')}
                >
                  元数据
                </button>
                <button 
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${docPropActiveTab === 'security' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setDocPropActiveTab('security')}
                >
                  安全
                </button>
              </nav>
            </div>
            
            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* 说明标签页内容 */}
              {docPropActiveTab === 'description' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">作者</span>
                      <span className="text-sm text-gray-900">XX财产保险有限公司</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">创建日期</span>
                      <span className="text-sm text-gray-900">2025-01-01 15:23:56</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">被保险人名称</span>
                      <span className="text-sm text-gray-900">李四</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">被保险人证件类型</span>
                      <span className="text-sm text-gray-900">居民身份证</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">被保险人证件号码</span>
                      <span className="text-sm text-gray-900">110XXXXXXXXXXXXXXX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">保险起期</span>
                      <span className="text-sm text-gray-900">2025-01-01 15:23:56</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">保险止期</span>
                      <span className="text-sm text-gray-900">2025-12-31 15:23:56</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">承保险种</span>
                      <span className="text-sm text-gray-900">第三者责任险</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">保险金额/责任限额</span>
                      <span className="text-sm text-gray-900">1000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">保险费总计</span>
                      <span className="text-sm text-gray-900">1500.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">保险人名称</span>
                      <span className="text-sm text-gray-900">XX财产保险有限公司</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">保险单号</span>
                      <span className="text-sm text-gray-900">1234567890abcdefgh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">保单生成时间</span>
                      <span className="text-sm text-gray-900">2025-01-01 15:23:56</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 安全标签页内容 */}
              {docPropActiveTab === 'security' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900">安全性</h3>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">安全方法</span>
                      <span className="text-sm text-gray-900">数字签名保护</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900">文档限制摘要</h3>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">打印</span>
                      <span className="text-sm text-gray-900">允许</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">修改文档</span>
                      <span className="text-sm text-gray-900">允许</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">内容复制</span>
                      <span className="text-sm text-gray-900">允许</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">注释</span>
                      <span className="text-sm text-gray-900">允许</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">填写表单</span>
                      <span className="text-sm text-gray-900">允许</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">页面提取</span>
                      <span className="text-sm text-gray-900">允许</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">文档组合</span>
                      <span className="text-sm text-gray-900">允许</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
          )}
        </div>
      </div>

      {/* Bottom status bar */}
      <footer className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex items-center">
        {/* 左侧验证状态 */}
        <div className="flex items-center space-x-3">
          {/* 待验真状态 */}
          {overallVerificationStatus === 'pending' && (
            <div className="flex items-center text-gray-600 cursor-pointer" onClick={() => setOverallVerificationStatus('verifying')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">待验真</span>
              <button className="ml-2 p-1 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800" onClick={() => setShowVerificationReport(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
            </div>
          )}
          
          {/* 正在验真中状态 */}
          {overallVerificationStatus === 'verifying' && (
            <div className="flex items-center text-blue-600 cursor-pointer" onClick={() => setOverallVerificationStatus('success')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm">正在验真中</span>
              <button className="ml-2 p-1 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800" onClick={() => setShowVerificationReport(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
            </div>
          )}
          
          {/* 验真通过状态 */}
          {overallVerificationStatus === 'success' && (
            <div className="flex items-center text-green-600 cursor-pointer" onClick={() => setOverallVerificationStatus('warning')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">验真通过</span>
              <button className="ml-2 p-1 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800" onClick={() => setShowVerificationReport(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
            </div>
          )}
          
          {/* 验真存疑状态 */}
          {overallVerificationStatus === 'warning' && (
            <div className="flex items-center text-yellow-600 cursor-pointer" onClick={() => setOverallVerificationStatus('failed')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              <span className="text-sm">验真存疑</span>
              <button className="ml-2 p-1 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800" onClick={() => setShowVerificationReport(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
            </div>
          )}
          
          {/* 验真不通过状态 */}
          {overallVerificationStatus === 'failed' && (
            <div className="flex items-center text-red-600 cursor-pointer" onClick={() => setOverallVerificationStatus('noResponse')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-sm">验真不通过</span>
              <button className="ml-2 p-1 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800" onClick={() => setShowVerificationReport(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
            </div>
          )}
          
          {/* 验真未响应状态 */}
          {overallVerificationStatus === 'noResponse' && (
            <div className="flex items-center text-orange-600 cursor-pointer" onClick={() => setOverallVerificationStatus('pending')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm">验真未响应</span>
              <button className="ml-2 p-1 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800" onClick={() => setShowVerificationReport(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* 中间页码信息 */}
        <div className="flex-1 flex justify-center">
          <span className="text-gray-600 text-sm">第 {currentPage} 页 / 共 10 页</span>
        </div>
      </footer>

      {/* Seal details modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white z-10 rounded-t-lg flex-shrink-0">
              <h3 className="text-lg font-medium text-gray-900">电子印章详情</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowDetailsModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 pt-4 flex-shrink-0">
              <div className="flex items-center mb-4">
                <div className={`flex items-center ${sealDetails[selectedSeal].status === 'valid' ? 'text-green-600' : 'text-red-600'}`}>
                  {sealDetails[selectedSeal].status === 'valid' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="font-medium">
                    {sealDetails[selectedSeal].status === 'valid' ? '该印章有效' : '该印章无效'}
                  </span>
                </div>
              </div>
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('signature')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'signature'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    签章
                  </button>
                  <button
                    onClick={() => setActiveTab('seal')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'seal'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    印章
                  </button>
                </nav>
              </div>
            </div>
            {/* Tab content - 可滚动区域 */}
            <div className="px-6 pb-6 overflow-y-auto flex-grow">
              {activeTab === 'signature' && (
                <div className="space-y-6">
                  {/* Signature attributes */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">签章属性</h4>
                    <div className="space-y-3 pl-2 border-l-2 border-green-500">
                      {Object.entries(sealDetails[selectedSeal].signature.attributes).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 gap-2">
                          <p className="text-sm font-medium text-gray-700 col-span-1">{key}</p>
                          <p className="text-sm text-gray-600 col-span-2 break-all">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Signer certificate */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">签章人证书</h4>
                    <div className="space-y-3 pl-2 border-l-2 border-green-500">
                      {Object.entries(sealDetails[selectedSeal].signature.certificate).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 gap-2">
                          <p className="text-sm font-medium text-gray-700 col-span-1">{key}</p>
                          <p className="text-sm text-gray-600 col-span-2 break-all">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'seal' && (
                <div className="space-y-6">
                  {/* Seal attributes */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">印章属性</h4>
                    <div className="space-y-3 pl-2 border-l-2 border-green-500">
                      {/* 显示缩略图 */}
                      <div className="py-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">缩略图</p>
                        <div className="flex justify-center">
                          <div className="w-48 h-48 border-2 border-gray-300 flex items-center justify-center relative">
                            <svg viewBox="0 0 200 200" className="w-full h-full">
                              {/* 印章外圈 */}
                              <circle cx="100" cy="100" r="90" fill="none" stroke="#e53e3e" strokeWidth="6"/>
                              <circle cx="100" cy="100" r="85" fill="none" stroke="#e53e3e" strokeWidth="2"/>
                              {/* 五角星 */}
                              <path d="M100,40 L112,75 L150,75 L120,95 L132,130 L100,110 L68,130 L80,95 L50,75 L88,75 Z" fill="#e53e3e"/>
                              {/* 印章文字 */}
                              <text x="100" y="35" textAnchor="middle" fill="#e53e3e" fontSize="14" fontWeight="bold">电子签章系统</text>
                              <text x="100" y="170" textAnchor="middle" fill="#e53e3e" fontSize="12">演示专用章</text>
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* 显示其他属性 */}
                      {Object.entries(sealDetails[selectedSeal].seal.attributes).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 gap-2">
                          <p className="text-sm font-medium text-gray-700 col-span-1">{key}</p>
                          <p className="text-sm text-gray-600 col-span-2 break-all">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Seal maker certificate */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">制章人证书</h4>
                    <div className="space-y-3 pl-2 border-l-2 border-green-500">
                      {Object.entries(sealDetails[selectedSeal].seal.certificate).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 gap-2">
                          <p className="text-sm font-medium text-gray-700 col-span-1">{key}</p>
                          <p className="text-sm text-gray-600 col-span-2 break-all">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 验签报告弹窗 */}
      {showVerificationReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="text-center mb-6">
              {verificationResults.every(result => result.status === 'success') ? (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">验真通过</h3>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">验真不通过</h3>
                </>
              )}
              <p className="text-gray-600">
                该文档有{verificationResults.length}个数字签名，验证成功{verificationResults.filter(r => r.status === 'success').length}个，验证失败{verificationResults.filter(r => r.status === 'failed').length}个。
              </p>
            </div>
            
            {verificationResults.some(result => result.status === 'failed') && (
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-gray-700">验证失败原因：</h4>
                <div className="space-y-2">
                  {verificationResults.map((result, index) => (
                    result.status === 'failed' && (
                      <div key={index} className="text-sm text-red-600">
                        {result.error}
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <button
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => setShowVerificationReport(false)}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 验签中加载动画 */}
      {isVerifying && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700">验签中，请稍候...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OFDReader;
