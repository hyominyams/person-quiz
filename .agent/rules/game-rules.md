---
trigger: model_decision
description: "Game Component 가이드"
---

# Game Component (게임 페이지 컴포넌트)

## 1. 디자인 의도
- 10초 카운트다운 타이머 바, 그리고 긴박하게 스코어가 오르는 아케이드 형태 게임입니다.
- 인물 사진을 무작위로 보여주고, 사용자가 10초 이내에 타이핑 또는 음성인식을 통해 맞추는 구조입니다.
- 정답일 경우 화면에 크게 '정답' 모달이 나타나며 다음 카드로 넘어갑니다.
- '말하기 모드'에서는 가운데 위치한 큰 마이크 아이콘이 사용자의 발성을 대기하고 있음을 직관적으로 보여주며, 애니메이션으로 이펙트를 제공합니다.

## 2. Props 구조
- `mode`: "typing" | "speaking"
  - `Landing.tsx`에서 선택된 게임 모드.
- `onExit`: () => void
  - 게임 종료 후 결과 화면이나 외부에서 '나가기'를 원할 때 호출하는 함수입니다.

## 3. 구현 방식
- **의존성**: `framer-motion` (카드 등장, 정답/오답/시간초과 애니메이션 및 타이머 체력바), 내장 `SpeechRecognition` Web API.
- **음성 인식 로직**: `window.SpeechRecognition` 또는 `window.webkitSpeechRecognition` API를 활용하여 음성을 감지합니다. 이 부분은 HTTPS 환경이나 localhost에서만 지원될 수 있습니다. (권한 허용 필요)
- **로직 구조**: `shuffledChars` 배열을 통해 문제가 출제되며, `useEffect` 훅을 이용해 1초에 한 번씩 `timeLeft`를 깎아 상태를 최신화하게 됩니다.
- 정답 시 정답 이펙트, 오답 시 오답 이펙트, 시간이 다 되면 자동 스킵됩니다.
