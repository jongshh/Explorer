// src/App.jsx
import React, { useState, useEffect } from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';
import { processGameTurn, generateSceneImage } from './api';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import MainMenu from './components/MainMenu';
import CharacterCreation from './components/CharacterCreation';

function App() {
  const [screen, setScreen] = useState('menu'); 
  
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_key') || '');
  const [useImage, setUseImage] = useState(false);
  const [modelType, setModelType] = useState('gpt-4o-mini');
  
  const [gameState, setGameState] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  
  // [세이브 구분용] 세션 ID
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    localStorage.setItem('openai_key', apiKey);
  }, [apiKey]);

  const loadGame = (saveSlot) => {
    setGameState(saveSlot.gameState);
    setMessages(saveSlot.messages);
    setSessionId(saveSlot.id);
    setSelectedScenario({ title: saveSlot.scenarioTitle, initialState: {} }); 
    setScreen('game');
  };

  const saveGame = () => {
    if (!gameState || !sessionId) return;
    const player = gameState.characters.find(c => c.isPlayer) || { name: 'Unknown', role: 'Survivor' };
    const summary = `${player.name} | ${player.age || '?'}세 | ${player.gender === 'Male' ? '남' : '여'} | ${player.role}`;
    const timestamp = new Date().toLocaleString();

    const saveData = {
      id: sessionId,
      summary: summary,
      timestamp: timestamp,
      gameState: gameState,
      messages: messages,
      scenarioTitle: selectedScenario ? selectedScenario.title : "진행 중인 게임"
    };

    const existingSaves = JSON.parse(localStorage.getItem('rimworld_saves') || '[]');
    const existingIndex = existingSaves.findIndex(s => s.id === sessionId);
    
    let newSaves;
    if (existingIndex >= 0) {
      existingSaves[existingIndex] = saveData;
      newSaves = existingSaves;
    } else {
      newSaves = [saveData, ...existingSaves];
    }

    localStorage.setItem('rimworld_saves', JSON.stringify(newSaves));
    alert(`[저장 완료]\n${summary}`);
  };

  const deleteSave = (id) => {
    const existingSaves = JSON.parse(localStorage.getItem('rimworld_saves') || '[]');
    const newSaves = existingSaves.filter(s => s.id !== id);
    localStorage.setItem('rimworld_saves', JSON.stringify(newSaves));
    return newSaves;
  };

  const handleScenarioSelect = (scenario) => {
    if (!apiKey) return alert("API Key를 입력해주세요!");
    setSelectedScenario(scenario);
    setScreen('create');
  };

  // --- 헬퍼 함수 ---
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getRandomGender = () => Math.random() > 0.5 ? 'Male' : 'Female';

  const getRandomInventory = (role, isPlayer) => {
    const commonItems = ["비상식량", "물통", "성냥", "낡은 지도", "손전등"];
    const weaponItems = ["단검", "권총", "쇠파이프", "활", "도끼"];
    const medicalItems = ["붕대", "항생제", "약초", "진통제"];
    
    let inventory = [commonItems[Math.floor(Math.random() * commonItems.length)]];
    const safeRole = role || ""; 
    if (safeRole.includes('지휘관') || safeRole.includes('탐험가') || safeRole.includes('전투원') || safeRole.includes('용병')) {
       inventory.push(weaponItems[Math.floor(Math.random() * weaponItems.length)]);
    } else if (safeRole.includes('의무병') || safeRole.includes('의사')) {
       inventory.push(medicalItems[Math.floor(Math.random() * medicalItems.length)]);
    } else {
       if (Math.random() > 0.5) inventory.push(weaponItems[Math.floor(Math.random() * weaponItems.length)]);
    }
    return inventory;
  };

  const mergeGameState = (originalState, aiResultState) => {
    if (!aiResultState) return originalState;
    if (!aiResultState.characters) return { ...originalState, ...aiResultState };
    const originalPlayer = originalState.characters.find(c => c.isPlayer);
    const mergedCharacters = aiResultState.characters.map(newChar => {
      if (newChar.isPlayer && originalPlayer) {
        return {
          ...newChar,
          name: originalPlayer.name,
          role: originalPlayer.role,
          traits: originalPlayer.traits,
          age: originalPlayer.age,
          gender: originalPlayer.gender,
          relationship: '본인'
        };
      }
      return newChar;
    });
    return { ...originalState, ...aiResultState, characters: mergedCharacters };
  };

  // --- [수정됨] 캐릭터 생성 및 게임 시작 로직 ---
  const handleCharacterConfirm = async (charData) => {
    setSessionId(Date.now()); 

    // 1. 초기 데이터 복사 (시나리오 고정 아이템 우선)
    const startState = JSON.parse(JSON.stringify(selectedScenario.initialState));
    
    if (startState.characters) {
      startState.characters = startState.characters.map(char => {
        const fluctuation = getRandomInt(-10, 10);
        const newHealth = Math.max(10, Math.min(100, (char.health || 0) + fluctuation));
        const newMood = Math.max(10, Math.min(100, (char.mood || 0) + fluctuation));

        // 플레이어
        if (char.isPlayer) {
          const finalInventory = (char.inventory && char.inventory.length > 0)
            ? char.inventory 
            : getRandomInventory(charData.role || char.role, true);

          return {
            ...char,
            name: charData.name,
            age: charData.age,
            gender: charData.gender, 
            role: charData.role || char.role, 
            traits: charData.traits,
            health: newHealth,
            mood: newMood,
            inventory: finalInventory
          };
        } 
        // 동료
        else {
          let role = char.role;
          if (role === '동료') {
             const roles = ['의무병', '전투원', '요리사', '건설가', '정찰병'];
             role = roles[Math.floor(Math.random() * roles.length)];
          }
          const finalInventory = (char.inventory && char.inventory.length > 0)
            ? char.inventory
            : getRandomInventory(role, false);
          
          const genGender = char.gender || getRandomGender();
          return {
            ...char,
            name: 'Unknown', 
            age: char.age || getRandomInt(18, 55),
            gender: genGender,
            role: role,
            relationship: '모름',
            health: newHealth,
            mood: newMood,
            inventory: finalInventory
          };
        }
      });
    }

    setGameState(startState);
    setScreen('game');
    setIsLoading(true);

    // [중요 수정] 동료 유무에 따라 AI에게 보내는 명령을 다르게 설정
    const hasCompanions = startState.characters.length > 1;
    const companionInstruction = hasCompanions 
      ? "2. 'Unknown' 상태인 동료들의 이름을 성별/나이에 맞춰(다국적 이름) 짓고 관계를 설정하여 JSON 업데이트."
      : "2. 현재 동료가 없는 1인 시나리오입니다. 억지로 동료를 추가하지 마세요. 고독감을 묘사하세요.";

    const initialMessages = [
      { 
        role: 'system', 
        content: `
        [시나리오: ${selectedScenario.title}]
        [플레이어] 이름: ${charData.name}, 직업: ${charData.role}, 특징: ${charData.traits}
        [동료 상태] ${hasCompanions ? "동료 있음" : "동료 없음 (Solo)"}

        [임무]
        1. 가독성 있게 줄바꿈하여 오프닝 서술 (Cliffhanger 포함).
        ${companionInstruction}
        3. **중요: 플레이어의 '직업'과 '특징' 정보를 JSON에 그대로 유지해서 반환하세요.**
        ` 
      }
    ];
    setMessages(initialMessages);

    try {
      const result = await processGameTurn(
        apiKey, 
        "[System: Start game. Use Korean. Describe opening. Do not add extra characters if solo.]", 
        startState, 
        initialMessages, 
        { model: modelType }
      );

      if (result.gmResult) {
        setGameState(prev => mergeGameState(prev, result.gmResult));
      }

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: result.storyText, image: null, loadingImage: useImage }
      ]);
      
      setIsLoading(false);

      if (useImage) {
        generateSceneImage(apiKey, result.storyText).then(imageUrl => {
          if (imageUrl) {
            setMessages(prev => {
              const updated = [...prev];
              const lastIdx = updated.length - 1;
              if (updated[lastIdx].role === 'assistant') {
                updated[lastIdx] = { ...updated[lastIdx], image: imageUrl, loadingImage: false };
              }
              return updated;
            });
          }
        });
      }

    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await processGameTurn(apiKey, input, gameState, messages, { model: modelType });

      if (result.gmResult) {
        setGameState(prev => mergeGameState(prev, result.gmResult));
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.storyText, 
        image: null,
        loadingImage: useImage
      }]);
      
      setIsLoading(false);

      if (result.isGameOver) {
        setTimeout(() => setScreen('gameover'), 2000);
      }

      if (useImage) {
        generateSceneImage(apiKey, result.storyText).then(imageUrl => {
          if (imageUrl) {
            setMessages(prev => {
              const updated = [...prev];
              for (let i = updated.length - 1; i >= 0; i--) {
                if (updated[i].role === 'assistant' && updated[i].loadingImage) {
                  updated[i] = { ...updated[i], image: imageUrl, loadingImage: false };
                  break;
                }
              }
              return updated;
            });
          }
        });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (screen === 'menu') {
    return (
      <MainMenu 
        apiKey={apiKey} setApiKey={setApiKey}
        onLoadGame={loadGame}
        onDeleteSave={deleteSave}
        onStartGame={handleScenarioSelect}
        useImage={useImage} setUseImage={setUseImage}
        modelType={modelType} setModelType={setModelType}
      />
    );
  }

  if (screen === 'create') {
    return <CharacterCreation onConfirm={handleCharacterConfirm} onCancel={() => setScreen('menu')} />;
  }

  if (screen === 'gameover') {
    return (
      <div className="min-h-screen bg-black text-red-600 flex flex-col items-center justify-center p-4">
        <ShieldAlert size={80} className="mb-6 animate-pulse" />
        <h1 className="text-6xl font-black mb-4">GAME OVER</h1>
        <button onClick={() => setScreen('menu')} className="bg-red-900 text-white px-8 py-4 rounded font-bold flex gap-2"><RotateCcw /> 메인 메뉴</button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      <Sidebar 
        gameState={gameState} 
        onSave={saveGame} 
        onMenu={() => setScreen('menu')}
        useImage={useImage}
        setUseImage={setUseImage}
        modelType={modelType}
        setModelType={setModelType}
      />
      <ChatArea 
        messages={messages} 
        input={input} 
        setInput={setInput} 
        handleSendMessage={handleSendMessage} 
        isLoading={isLoading} 
      />
    </div>
  );
}

export default App;