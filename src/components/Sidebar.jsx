// src/components/Sidebar.jsx
import React from 'react';
import { Heart, Zap, ShieldAlert, Save, Menu, Image as ImageIcon, Cpu, User, Users, Package, Smile } from 'lucide-react';

export default function Sidebar({ gameState, onSave, onMenu, useImage, setUseImage, modelType, setModelType }) {
  if (!gameState || !gameState.characters) return null;

  return (
    <div className="hidden md:flex w-80 bg-gray-800 border-r border-gray-700 flex-col h-full shadow-xl z-10 overflow-hidden">
      
      {/* 헤더 */}
      <div className="flex-none p-6 pb-4 bg-gray-800 z-10 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-yellow-500 tracking-wider">생존자 현황</h1>
          <div className="flex gap-2">
            <button onClick={onSave} title="저장" className="text-gray-400 hover:text-white transition"><Save size={20}/></button>
            <button onClick={onMenu} title="메뉴" className="text-gray-400 hover:text-white transition"><Menu size={20}/></button>
          </div>
        </div>
      </div>
      
      {/* 캐릭터 리스트 */}
      <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-4 scrollbar-thin scrollbar-thumb-gray-600">
        {gameState.characters.map((char, idx) => (
          <div key={idx} className={`bg-gray-700 p-4 rounded-lg border-l-4 ${char.isPlayer ? 'border-blue-500 ring-1 ring-blue-500/30' : 'border-gray-500'}`}>
            
            {/* 기본 정보 */}
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {char.isPlayer ? <User size={18} className="text-blue-400"/> : <Users size={18} className="text-gray-400"/>}
                  <span className={`font-bold text-lg ${char.isPlayer ? 'text-white' : 'text-gray-200'}`}>
                    {char.name}
                  </span>
                </div>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                  {char.age}세 / {char.gender === 'Male' ? '남' : char.gender === 'Female' ? '여' : '기타'}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-1 pl-6">
                <span className="text-xs text-gray-500">[{char.role}]</span>
                {!char.isPlayer && char.relationship && (
                  <span className="text-xs text-yellow-400 flex items-center gap-1">
                    <Smile size={10}/> {char.relationship}
                  </span>
                )}
              </div>
              {char.traits && (
                <div className="text-xs text-blue-300 mt-1 pl-6 italic truncate">"{char.traits}"</div>
              )}
            </div>

            {/* 스탯 바 (한글화) */}
            <div className="mb-2 mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span className="flex items-center gap-1"><Heart size={10}/> 체력</span>
                  <span>{char.health || 0}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all duration-500 ${ (char.health || 0) < 30 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.max(0, char.health || 0)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span className="flex items-center gap-1"><Zap size={10}/> 기분</span>
                  <span>{char.mood || 0}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.max(0, char.mood || 0)}%` }}></div>
                </div>
              </div>
            </div>

            {/* 인벤토리 (한글화) */}
            <div className="mt-4 pt-3 border-t border-gray-600">
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                <Package size={12} /> <span>소지품</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {char.inventory && char.inventory.length > 0 ? (
                  char.inventory.map((item, i) => (
                    <span key={i} className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-600">{item}</span>
                  ))
                ) : (
                  <span className="text-[10px] text-gray-600 italic">없음</span>
                )}
              </div>
            </div>
            
          </div>
        ))}
      </div>

      {/* 하단 영역 */}
      <div className="flex-none p-6 bg-gray-800 border-t border-gray-700 z-10 shadow-inner">
         <div className="mb-4">
           <p className="text-xs text-gray-400 mb-2">현재 사건</p>
           <div className="text-red-300 font-semibold text-sm animate-pulse flex gap-2">
             <ShieldAlert size={16} /> {gameState.event || "없음"}
           </div>
        </div>
        
        <div className="bg-gray-900 p-3 rounded border border-gray-700 space-y-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
              <ImageIcon size={14} className={useImage ? "text-green-400" : "text-gray-500"} />
              <span className={`text-sm ${useImage ? "text-gray-200" : "text-gray-500"}`}>이미지 생성</span>
            </div>
            <input type="checkbox" checked={useImage} onChange={(e) => setUseImage(e.target.checked)} className="w-4 h-4 rounded border-gray-600 text-yellow-600 focus:ring-yellow-500 bg-gray-700 cursor-pointer"/>
          </label>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2"><Cpu size={14} /><span>AI 모델</span></div>
            <select value={modelType} onChange={(e) => setModelType(e.target.value)} className="bg-gray-800 text-yellow-500 text-xs border border-gray-600 rounded px-2 py-1 outline-none">
              <option value="gpt-4o-mini">Mini</option>
              <option value="gpt-4o">GPT-4o</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}