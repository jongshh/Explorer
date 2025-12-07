// src/data/scenarios.js

export const SCENARIOS = [
  {
    id: 1,
    title: "불시착한 생존자들",
    desc: "변방계 행성에 추락했습니다. 자원은 부족하고 밤은 위험합니다.",
    intro: "우주선이 굉음과 함께 찢겨 나갔습니다. 당신은 불타는 파편들 사이에서 눈을 뜹니다.",
    initialState: {
      characters: [
        // 플레이어: 기본 무기와 식량 고정
        { id: 'player', name: 'Player', role: '지휘관', relationship: '본인', health: 80, mood: 60, isPlayer: true, inventory: ["권총", "비상식량", "구급상자"] },
        // 동료들: 인벤토리 없음 -> App.jsx에서 랜덤 생성됨
        { id: 'comp1', name: 'Unknown', role: '동료', relationship: '모름', health: 70, mood: 50, isPlayer: false },
        { id: 'comp2', name: 'Unknown', role: '동료', relationship: '모름', health: 90, mood: 40, isPlayer: false }
      ],
      event: "추락의 충격",
      goal: "구조 신호 보내기",
      goalProgress: 0
    }
  },
  {
    id: 2,
    title: "부유한 탐험가",
    desc: "첨단 장비를 가지고 왔지만, 당신은 혼자입니다.",
    intro: "최신식 차지 라이플을 손에 쥔 채 포드에서 내립니다.",
    initialState: {
      characters: [
        // 강력한 고정 아이템 지급
        { id: 'player', name: 'Player', role: '탐험가', relationship: '본인', health: 100, mood: 80, isPlayer: true, inventory: ["전자기 소총", "첨단 약품", "호화로운 식량"] }
      ],
      event: "고독한 시작",
      goal: "연구 기지 건설",
      goalProgress: 0
    }
  },
  {
    id: 3,
    title: "광란의 부족민",
    desc: "기계 신을 숭배하는 부족에서 추방당했습니다.",
    intro: "부족장은 당신을 황무지로 내쫓았습니다.",
    initialState: {
      characters: [
        // 부족민 전용 아이템
        { id: 'player', name: 'Player', role: '추방자', relationship: '본인', health: 60, mood: 80, isPlayer: true, inventory: ["비취 몽둥이", "약초", "보존식"] }
      ],
      event: "추방됨",
      goal: "새로운 부족 결성",
      goalProgress: 0
    }
  }
];