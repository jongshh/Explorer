import React, { useState, useEffect, useRef } from 'react';
import { Send, Settings, Heart, Zap, User, ShieldAlert, Image as ImageIcon, Loader2 } from 'lucide-react';
import { processGameTurn } from './api';

function App() {
  // --- 상태 관리 (State) ---
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  
  // ★ [추가됨] 로딩 상태 관리 (이게 없으면 에러남)
  const [isLoading, setIsLoading] = useState(false);

  // 가상의 게임 데이터
  const [gameState, setGameState] = useState({
    health: 80,
    mood: 60,
    hunger: 40,
    event: "평화로운 하루",
    goal: "통신기 수리하기",
    goalProgress: 10
  });

  // 채팅 로그
  const [messages, setMessages] = useState([
    { role: 'system', content: '시스템: 변방계 생존 시뮬레이션에 오신 것을 환영합니다.' },
    { role: 'assistant', content: '당신은 낯선 행성에 불시착했습니다. 주위를 둘러보니 부서진 우주선 파편들이 널려 있습니다. 무엇을 하시겠습니까?' }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // 로딩 상태가 변할 때도 스크롤 이동


  // 메시지 전송 핸들러
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return; // 로딩 중 중복 전송 방지
    
    if (!apiKey) {
      alert("설정 버튼을 눌러 OpenAI API Key를 먼저 입력해주세요!");
      setIsSettingsOpen(true);
      return;
    }

    // 1. 사용자 입력 즉시 표시
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true); // 로딩 시작

    try {
      // 2. 멀티 에이전트 파이프라인 가동
      const result = await processGameTurn(apiKey, input, gameState, messages);

      // 3. 결과 반영
      // (1) GM 데이터로 상태창 업데이트
      if (result.gmResult.statsChange) {
        setGameState(prev => ({
          ...prev,
          health: Math.max(0, Math.min(100, prev.health + (result.gmResult.statsChange.health || 0))),
          mood: Math.max(0, Math.min(100, prev.mood + (result.gmResult.statsChange.mood || 0))),
          event: result.gmResult.event,
          goalProgress: Math.max(0, Math.min(100, prev.goalProgress + (result.gmResult.statsChange.goalProgress || 0)))
        }));
      }

      // (2) 내레이터의 이야기 표시 (+이미지)
      const aiMsg = { 
        role: 'assistant', 
        content: result.storyText,
        image: result.imageUrl 
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error(error);
      const errorMsg = { role: 'system', content: `[오류 발생] API 요청 중 문제가 생겼습니다: ${error.message}` };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  // --- UI 렌더링 ---
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      
      {/* 1. 왼쪽 사이드바: 상태창 */}
      <div className="hidden md:flex w-80 bg-gray-800 border-r border-gray-700 flex-col p-6 shadow-xl z-10">
        <h1 className="text-2xl font-bold mb-6 text-yellow-500 tracking-wider">RIMWORLD RPG</h1>
        
        {/* 캐릭터 상태 */}
        <div className="space-y-6 mb-8">
          <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
            <h2 className="text-sm text-gray-400 mb-3 uppercase font-bold flex items-center gap-2">
              <User size={16} /> 생존자 상태
            </h2>
            
            {/* 체력 */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-1"><Heart size={14} className="text-red-400"/> 체력</span>
                <span>{gameState.health}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${gameState.health}%` }}></div>
              </div>
            </div>

            {/* 기분 */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-1"><Zap size={14} className="text-yellow-400"/> 기분</span>
                <span>{gameState.mood}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${gameState.mood}%` }}></div>
              </div>
            </div>
            
             {/* 현재 이벤트 */}
             <div className="mt-4 pt-4 border-t border-gray-600">
                <p className="text-xs text-gray-400 mb-1">현재 상황</p>
                <div className="flex items-center gap-2 text-red-300 font-semibold animate-pulse">
                  <ShieldAlert size={16} />
                  {gameState.event}
                </div>
             </div>
          </div>

          {/* 목표 진행도 */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-sm text-gray-400 mb-2 uppercase font-bold">현재 목표</h2>
            <p className="text-lg font-medium mb-2">{gameState.goal}</p>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${gameState.goalProgress}%` }}></div>
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">{gameState.goalProgress}% 완료</p>
          </div>
        </div>

        {/* 설정 버튼 */}
        <div className="mt-auto">
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <Settings size={16} /> 설정 / API Key
          </button>
        </div>
      </div>

      {/* 2. 메인 영역: 채팅창 */}
      <div className="flex-1 flex flex-col relative bg-gray-900">
        
        {/* 설정 모달 */}
        {isSettingsOpen && (
          <div className="absolute top-4 right-4 bg-gray-800 p-4 rounded-lg shadow-2xl border border-gray-600 w-96 z-50">
            <h3 className="font-bold mb-2 text-yellow-500">환경 설정</h3>
            <p className="text-xs text-gray-400 mb-2">OpenAI API Key를 입력해야 작동합니다.</p>
            <input 
              type="password" 
              placeholder="sk-..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm mb-2 focus:outline-none focus:border-yellow-500"
            />
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white rounded py-1 text-sm font-bold"
            >
              저장 및 닫기
            </button>
          </div>
        )}

        {/* 채팅 메시지 리스트 */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] md:max-w-[70%] p-4 rounded-lg shadow-md leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'
                }`}
              >
                {msg.role !== 'user' && (
                  <div className="text-xs font-bold text-yellow-500 mb-1 uppercase tracking-wider">
                    {msg.role === 'system' ? 'SYSTEM' : 'Narrator'}
                  </div>
                )}
                
                {/* 텍스트 내용 */}
                <div className="whitespace-pre-wrap">{msg.content}</div>
                
                {/* ★ [추가됨] 이미지 렌더링 부분 */}
                {msg.image && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-gray-600 shadow-lg">
                     <img src={msg.image} alt="Scene Visualization" className="w-full h-auto object-cover" />
                     <div className="bg-gray-900 p-2 text-xs text-gray-500 flex items-center gap-1">
                        <ImageIcon size={12}/> DALL-E 3 Generated
                     </div>
                  </div>
                )}

              </div>
            </div>
          ))}

          {/* ★ [추가됨] 로딩 인디케이터 (AI 생각중...) */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 border border-gray-700 text-yellow-500 px-4 py-3 rounded-lg rounded-bl-none shadow-md flex items-center gap-3">
                 <Loader2 size={18} className="animate-spin" />
                 <span className="text-sm font-medium animate-pulse">GM이 주사위를 굴리고 상황을 그리는 중...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 입력창 */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading} 
              placeholder={isLoading ? "AI가 응답을 생성중입니다..." : "어떤 행동을 하시겠습니까?"}
              className="flex-1 bg-gray-900 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 shadow-inner disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-lg font-bold transition-colors shadow-lg flex items-center gap-2"
            >
              <Send size={18} /> <span className="hidden sm:inline">전송</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;