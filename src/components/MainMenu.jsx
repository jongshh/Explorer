// src/components/MainMenu.jsx
import React, { useState, useEffect } from 'react';
import { Save, Trash2, X } from 'lucide-react'; 
import { SCENARIOS } from '../data/scenarios';

// ▼▼▼ 이미지 파일들 import ▼▼▼
import MainBg from '../assets/main_bg.png'; 
import MainLogo from '../assets/logo.png'; // 로고 파일

export default function MainMenu({ 
  apiKey, setApiKey, 
  onLoadGame, onDeleteSave, 
  onStartGame, 
  useImage, setUseImage, 
  modelType, setModelType 
}) {
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [saveList, setSaveList] = useState([]);

  useEffect(() => {
    if (showLoadModal) {
      const saves = JSON.parse(localStorage.getItem('rimworld_saves') || '[]');
      setSaveList(saves);
    }
  }, [showLoadModal]);

  const handleDelete = (e, id) => {
    e.stopPropagation(); 
    if (window.confirm("정말 이 세이브 파일을 삭제하시겠습니까?")) {
      const newSaves = onDeleteSave(id);
      setSaveList(newSaves);
    }
  };

  return (
    <div className="relative min-h-screen text-gray-100 flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* 배경 이미지 영역 */}
      <div className="absolute inset-0 z-0">
        <img 
          src={MainBg} 
          alt="Background" 
          className="w-full h-full object-cover animate-in fade-in duration-1000" 
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        
        {/* ▼▼▼ [수정됨] 텍스트 대신 로고 이미지 사용 ▼▼▼ */}
        <img 
          src={MainLogo} 
          alt="Game Logo"
          // w-full: 가로 꽉 채움, max-w-[600px]: 너무 커지지 않게 제한, h-auto: 비율 유지
          className="w-full max-w-[500px] h-auto mb-8 drop-shadow-2xl animate-in fade-in zoom-in duration-1000"
        />
        {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}
        
        <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full border border-gray-600">
          
          {/* API Key */}
          <div className="mb-8">
             <label className="block text-gray-300 mb-2 text-sm font-bold">OpenAI API Key</label>
             <input 
               type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} 
               placeholder="sk-..." className="w-full bg-gray-900/90 border border-gray-500 p-3 rounded text-white focus:outline-none focus:border-yellow-500 transition"
             />
          </div>

          {/* 메뉴 버튼들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
             <button 
               onClick={() => setShowLoadModal(true)} 
               className="bg-gray-700/80 hover:bg-gray-600 p-4 rounded-lg flex items-center justify-center gap-2 font-bold transition border border-gray-600 hover:border-gray-500"
             >
               <Save size={20} /> 불러오기
             </button>
             
             <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">이미지 생성</span>
                  <input type="checkbox" checked={useImage} onChange={(e) => setUseImage(e.target.checked)} className="accent-yellow-600 w-4 h-4 cursor-pointer"/>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">모델</span>
                  <select value={modelType} onChange={(e) => setModelType(e.target.value)} className="bg-gray-800 text-xs p-1 border border-gray-600 rounded focus:outline-none focus:border-yellow-500 text-white">
                    <option value="gpt-4o-mini">Mini (빠름)</option>
                    <option value="gpt-4o">GPT-4o (지능)</option>
                  </select>
                </div>
             </div>
          </div>

          {/* 시나리오 목록 */}
          <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-600 pb-2">새 게임 시작</h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-500">
            {SCENARIOS.map(scen => (
              <button 
                key={scen.id} 
                onClick={() => onStartGame(scen)} 
                className="w-full text-left bg-gray-700/50 hover:bg-yellow-900/40 hover:border-yellow-500 border border-transparent p-4 rounded-lg transition group backdrop-blur-sm"
              >
                <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300 transition">{scen.title}</h3>
                <p className="text-gray-300 text-sm mt-1">{scen.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 불러오기 모달 (기존 동일) */}
      {showLoadModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-lg w-full border border-gray-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Save size={20}/> 저장된 게임</h2>
              <button onClick={() => setShowLoadModal(false)} className="text-gray-400 hover:text-white"><X size={24}/></button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600">
              {saveList.length === 0 ? (
                <p className="text-center text-gray-500 py-8">저장된 게임이 없습니다.</p>
              ) : (
                saveList.map((save) => (
                  <div key={save.id} 
                    onClick={() => onLoadGame(save)}
                    className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg cursor-pointer border border-transparent hover:border-yellow-500 transition group relative"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-yellow-500 group-hover:text-yellow-300">{save.summary}</h3>
                        <p className="text-xs text-gray-400 mt-1">{save.scenarioTitle}</p>
                        <p className="text-xs text-gray-500 mt-1">{save.timestamp}</p>
                      </div>
                      <button 
                        onClick={(e) => handleDelete(e, save.id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-800 rounded transition"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}