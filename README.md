# 🚀 Explorer\! : AI-Powered Sci-Fi Survival TRPG

<img width="2816" height="1536" alt="Gemini_Generated_Image_5ns3675ns3675ns3" src="https://github.com/user-attachments/assets/3156b614-2304-48c6-850f-c0a23aa2f359" />

**"무한한 우주, 예측할 수 없는 운명. 당신만의 생존 이야기가 시작됩니다."**

[](https://reactjs.org/)
[](https://vitejs.dev/)
[](https://openai.com/)
[](https://www.google.com/search?q=LICENSE)

[👉 **게임 플레이하기 (Play Now)**](https://jongshh.github.io/Explorer/)

-----

## 📖 프로젝트 소개 (Introduction)

\*\*Explorer\!\*\*는 OpenAI의 **GPT-4o**와 **DALL-E 3**를 활용한 웹 기반 텍스트 어드벤처 게임(TRPG)입니다.
정해진 선택지르 고르는 지루한 방식이 아닙니다. 당신이 입력하는 모든 행동이 곧 스토리가 되며, AI 게임 마스터가 실시간으로 당신의 운명을 서술하고, 그 장면을 고퀄리티 애니메이션 화풍의 이미지로 그려냅니다.

불시착한 행성에서 살아남거나, 고독한 탐험가가 되어 기지를 건설하세요. 동료를 모으고, 배신과 우정 사이에서 갈등하며 나만의 대서사시를 완성하세요.

## ✨ 핵심 기능 (Key Features)

### 1\. ♾️ 무한한 자유도와 스토리텔링

  * **GPT-4o Mini / GPT-4o** 기반의 실시간 서사 생성. (모델은 추후 혹장할 예정)
  * 단순한 결과 통보가 아닌, 문학적 묘사와 절단신공(Cliffhanger)을 통한 몰입감 제공.
  * 플레이어의 창의적인 행동을 완벽하게 이해하고 반영.

### 2\. 🎨 실시간 비주얼 생성 (Live Visuals)

  * **DALL-E 3**를 활용하여 현재 상황을 묘사하는 이미지를 실시간으로 생성.
  * 고퀄리티 **SF 애니메이션 스타일** 프롬프트 엔지니어링 적용.
  * 텍스트를 먼저 보여주고 이미지는 백그라운드에서 로딩하는 비동기 처리로 쾌적한 UX 제공.

### 3\. 👥 동적 스쿼드 시스템 (Dynamic Squad)

  * **랜덤 캐릭터 생성:** 시나리오에 따라 다양한 국적, 나이, 성별, 직업을 가진 동료들이 합류.
  * **상태 관리:** 체력(Health), 기분(Mood), 소지품(Inventory), 관계(Relationship) 등 세밀한 상태 추적.
  * **영구적 죽음(Permadeath):** 동료가 사망하면 영원히 사라집니다.

### 4\. 💾 데이터 관리 및 최적화

  * **다중 세이브 슬롯:** 로컬 스토리지(LocalStorage)를 활용한 브라우저 저장 시스템.
  * **Context Pruning:** 대화 내역이 길어져도 속도가 느려지지 않도록 중요 데이터(JSON)와 최근 대화만 선별하여 전송하는 최적화 로직 적용.

-----


## 🛠️ 기술 스택 (Tech Stack)

  * **Frontend:** React (Vite)
  * **Styling:** Tailwind CSS (via CDN or Utility classes)
  * **AI Integration:** OpenAI API (GPT-4o-mini, GPT-4o, DALL-E 3)
  * **Icons:** Lucide React
  * **Markdown:** React Markdown, Remark GFM
  * **Deployment:** GitHub Pages

-----

## 🚀 설치 및 실행 (Getting Started)

이 프로젝트를 로컬 환경에서 실행하려면 **OpenAI API Key**가 필요합니다.

### 1\. 저장소 클론 (Clone)

```bash
git clone https://github.com/본인아이디/explorer-ai-game.git
cd explorer-ai-game
```

### 2\. 패키지 설치 (Install)

```bash
npm install
```

### 3\. 개발 서버 실행 (Run)

```bash
npm run dev
```

### 4\. API Key 입력

브라우저가 열리면 메인 메뉴의 설정창에 본인의 `sk-...` 로 시작하는 API Key를 입력하세요.
*(Key는 브라우저의 LocalStorage에만 저장되며 외부로 전송되지 않습니다.)*

-----

## 향후 계획 

  * Json 기반으로 스테이터스 확장
  * 사용자 지정 시나리오 작성 기능 추가
  * 버그 픽스
  * 화풍(프롬프트) 등 환경설정에 입력 필드 추가

-----

## ⚠️ 주의사항 (Disclaimer)

  * **API 비용:** 이 게임은 개인의 OpenAI API Key를 사용합니다. GPT-4o와 DALL-E 3 사용 시 소정의 비용이 발생할 수 있습니다. (설정에서 이미지 생성을 끄거나, 모델을 `gpt-4o-mini`로 설정하면 비용을 절약할 수 있습니다.)
  * **AI 환각:** 생성형 AI의 특성상 가끔 엉뚱한 이야기를 하거나, 설정 오류가 발생할 수 있습니다. 이는 게임의 묘미로 즐겨주세요\!

-----

## 📜 라이선스 (License)

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

-----

Created with ❤️ by Jongsh with Gemini PRO
