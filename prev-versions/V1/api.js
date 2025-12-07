import OpenAI from "openai";

// 1. GM 에이전트의 시스템 프롬프트 (JSON 데이터만 담당)
const SYSTEM_PROMPT_GM = `
당신은 '림월드' 스타일의 하드코어 생존 게임의 '게임 시스템(GM)'입니다.
사용자의 행동을 분석하여 성공/실패 여부와 그에 따른 결과를 계산하십시오.
절대 문장으로 대답하지 말고, 오직 아래 포맷의 JSON 데이터만 출력하십시오.

{
  "success": boolean, // 성공 여부
  "dice": number, // 1~100 주사위 결과 (성공 확률에 기반)
  "event": string, // 발생한 상황 요약 (예: "치료 성공", "습격 발생", "식중독")
  "statsChange": { // 스탯 변화량 (없으면 0)
    "health": number,
    "mood": number,
    "goalProgress": number
  },
  "narrative_clues": string // 다음 서술자를 위한 짧은 가이드 (예: "상처가 깊어 피가 많이 났지만 지혈에 성공했다.")
}
`;

// 2. 서술 에이전트 (이야기 담당)
const SYSTEM_PROMPT_NARRATOR = `
당신은 생존 시뮬레이션의 '메인 서술자'이자 플레이어의 동료입니다.
GM이 판정한 결과(JSON)를 바탕으로 몰입감 있는 이야기를 서술하십시오.
- 성공했다면 안도하거나 기뻐하는 묘사.
- 실패했다면 긴박하거나 절망적인 묘사.
- 문체는 소설처럼 디테일하게.
- 답변은 한글로 작성하십시오.
`;

// 3. 비주얼 에이전트 (이미지 프롬프트 담당)
const SYSTEM_PROMPT_VISUALIZER = `
Read the story provided and extract visual keywords to generate an image.
Output must be a single string of English keywords tailored for DALL-E 3.
Style: Digital painting, Sci-fi, Rimworld style, gritty, dramatic lighting.
Format: "Subject action, environment, lighting, mood, style"
`;

export async function processGameTurn(apiKey, userAction, currentStats, chatHistory) {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // 클라이언트 사이드 실행 허용
  });

  try {
    // --- STEP 1: GM 판단 (Logic) ---
    console.log("1. GM 판단 중...");
    const gmResponse = await openai.chat.completions.create({
      model: "gpt-4o", // 혹은 gpt-3.5-turbo (비용 절약 시)
      messages: [
        { role: "system", content: SYSTEM_PROMPT_GM },
        { role: "user", content: `현재 상태: ${JSON.stringify(currentStats)}. \n플레이어 행동: ${userAction}` }
      ],
      response_format: { type: "json_object" } // JSON 모드 강제
    });

    const gmResult = JSON.parse(gmResponse.choices[0].message.content);
    console.log("GM Result:", gmResult);

    // --- STEP 2: 이야기 서술 (Story) ---
    console.log("2. 이야기 생성 중...");
    const narratorResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT_NARRATOR },
        ...chatHistory.slice(-4), // 최근 대화 문맥 일부 전달
        { role: "user", content: `행동: ${userAction} \nGM판정결과: ${JSON.stringify(gmResult)}` }
      ]
    });

    const storyText = narratorResponse.choices[0].message.content;

    // --- STEP 3: 이미지 키워드 추출 (Visual Prompt) ---
    console.log("3. 이미지 키워드 추출 중...");
    const visualResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT_VISUALIZER },
        { role: "user", content: storyText }
      ]
    });

    const imagePrompt = visualResponse.choices[0].message.content;
    console.log("Image Prompt:", imagePrompt);

    // --- STEP 4: 이미지 생성 (DALL-E 3) ---
    // 주의: 비용 문제로 인해 실제 생성은 선택적으로 할 수 있게 분리하는 것이 좋으나, 
    // 여기서는 흐름대로 바로 요청합니다.
    console.log("4. 이미지 생성 중...");
    const imageGenResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard", // standard가 더 빠름
    });

    const imageUrl = imageGenResponse.data[0].url;

    // 최종 결과 반환
    return {
      gmResult,
      storyText,
      imageUrl
    };

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}