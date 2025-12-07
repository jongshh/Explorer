// src/api.js
import OpenAI from "openai";

const SYSTEM_PROMPT = `
당신은 TRPG 게임 마스터입니다.
JSON 형식으로만 응답해야 합니다.

[서술 작성 원칙]
1. 가독성: 문단 나누기(엔터 두 번)와 대화문 줄바꿈 필수.
2. 길이: 너무 길지 않게, 핵심적인 사건 위주로 3~5문장 내외로 서술하세요.
3. 절단신공: 행동 결과 후 즉시 새로운 위기를 제시하세요.

[상태 관리 규칙 (매우 중요)]
1. **캐릭터 식별 및 업데이트 (Duplicate Prevention):**
   - **절대 규칙:** 인물이 이름을 밝히거나 역할이 변경되면, **새 객체를 추가하지 말고 기존 객체의 name, role, relationship을 수정**하세요.
   - 예: "Unknown"(id: comp1) -> "알렉스"(id: comp1)로 변경 (id 유지 필수).
   - 기존 캐릭터가 사망하거나 영구 이탈한 경우에만 배열에서 삭제(remove)하세요.

2. characters 배열 관리:
   - 문자열은 반드시 한글로 작성 (Role, Relationship 포함).
   - **이름(Name)**은 SF 세계관에 어울리는 **다국적 이름(서양, 동양 혼합)**을 사용하세요. (한국 이름에 국한되지 말 것)
   - 플레이어(isPlayer: true)는 절대 삭제하지 마세요.

3. inventory 관리:
   - 아이템 획득/분실을 즉시 반영하세요.

[JSON 구조]
{
  "story": "...",
  "gameState": {
    "event": "...",
    "characters": [
      // 기존 id를 유지하며 내용만 업데이트할 것
      { "id": "comp1", "name": "알렉스", "role": "생존자", ... } 
    ]
  },
  "isGameOver": false
}
`;

// 1. 텍스트 및 게임 상태 처리 함수
export async function processGameTurn(apiKey, userInput, currentGameState, messageHistory, options = {}) {
  const { model = 'gpt-4o-mini' } = options; 

  const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });

  const RECENT_HISTORY_LIMIT = 10;
  const recentMessages = messageHistory.slice(-RECENT_HISTORY_LIMIT);

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    // 현재 상태(ID 포함)를 AI에게 보여줘서, 이 ID를 그대로 쓰라고 압박합니다.
    { role: "system", content: `[Current Game Data (Maintain IDs)]: ${JSON.stringify(currentGameState)}` },
    ...recentMessages,
    { role: "user", content: userInput }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      response_format: { type: "json_object" },
      temperature: 0.7, 
      max_tokens: 800, // 서사 길이를 위해 토큰 약간 여유 둠
    });

    let gmData = JSON.parse(completion.choices[0].message.content);
    
    return {
      storyText: gmData.story,
      gmResult: gmData.gameState,
      isGameOver: gmData.isGameOver
    };

  } catch (e) {
    console.error("AI Error:", e);
    return {
      storyText: "통신 상태가 불안정하여 응답이 지연되었습니다. 다시 시도해주세요.",
      gmResult: currentGameState,
      isGameOver: false
    };
  }
}

// 2. 이미지 생성 함수 (변경 없음)
export async function generateSceneImage(apiKey, storyText) {
  const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });

  try {
    const promptRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Summarize this into a short English prompt for DALL-E." },
        { role: "user", content: storyText }
      ],
      max_tokens: 50 
    });
    const prompt = promptRes.choices[0].message.content;

    const imageRes = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A high-quality anime screenshot from a sci-fi survival series. Vibrant colors, cel-shaded, detailed background art, expressive character designs, realistic. Scene description: ${prompt}`,
      n: 1,
      size: "1024x1024",
    });
    
    return imageRes.data[0].url;
  } catch (err) {
    console.error("Image Gen Error:", err);
    return null;
  }
}