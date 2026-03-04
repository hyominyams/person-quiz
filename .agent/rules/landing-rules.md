---
trigger: model_decision
description: "Landing Component 가이드"
---

# Landing Component (랜딩 페이지 컴포넌트)

## 1. 디자인 의도
- 방송국 예능 프로그램 (예: 신서유기 등) 스타일의 랜딩 페이지입니다.
- 밝고 역동적인 그라데이션 및 볼드하고 큰 타이포그래피를 사용하여 사용자에게 재미와 기대감을 줍니다.
- 수많은 인물 카드가 움직이는 Marquee 애니메이션을 배경으로 사용하여 퀴즈쇼의 분위기를 살립니다.
- 사용자가 마우스를 배경에 올리면 애니메이션이 정지되도록 하여 시각적인 흥미를 유발합니다.

## 2. Props 구조
- `onStart`: (mode: "typing" | "speaking") => void
  - 게임을 시작하는 트리거 함수입니다. 타이핑 모드인지, 말하기 모드인지를 인자로 전달합니다.

## 3. 구현 방식
- **의존성**: `framer-motion` (컴포넌트 등장 애니메이션), `lucide-react` (아이콘).
- **스타일링**: Tailwind CSS를 활용. 특히 `animate-marquee` 클래스와 `group-hover:[animation-play-state:paused]`를 활용해 CSS 애니메이션으로 구현했습니다.
- 배경 카드들은 무한 스크롤(Marquee) 효과를 주기 위해 데이터 배열을 두 번 이어붙여 렌더링하고 있습니다.
