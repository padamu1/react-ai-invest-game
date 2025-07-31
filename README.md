# 📈 모의 투자 게임 (Mock Investment Game)

React로 개발된 턴제 모의 투자 게임입니다. 주식, 코인, 펀드 등 다양한 투자 상품을 거래하며 시장의 변동성과 뉴스/루머의 영향을 경험할 수 있습니다.

## 🎮 게임 특징

### 📊 투자 시스템
- **12개 투자 상품**: A주식, B코인, C펀드부터 L펀드까지 다양한 상품
- **실시간 가격 변동**: -10% ~ +10% 랜덤 변동
- **가격 히스토리 그래프**: 최근 5턴의 가격 변화를 시각적으로 표시
- **매수/매도 시스템**: 수량을 지정하여 투자 상품 거래

### 📰 뉴스 & 루머 시스템
- **루머**: 가격 변동 전에 발생, 실제 가격에 영향 없음
- **실제 뉴스**: 가격 변동 후 발생, 실제 가격에 직접적인 영향
- **다중 뉴스**: 한 턴에 여러 개의 뉴스/루머 동시 발생 가능
- **동적 메시지**: 모든 투자 상품에 적용 가능한 포맷 기반 뉴스

### ⚠️ 상장폐지 시스템
- **연속 하락 위험**: 5턴 연속 하락 시 상장폐지 위험 상태 진입
- **지속적 위험**: 계속 하락하면 위험 상태 연장
- **회복 기회**: 상승 시 즉시 위험 상태 해제
- **영구 상장폐지**: 상장폐지된 상품은 복구 불가

### 💰 게임 밸런스
- **지수적 턴 비용**: 턴이 진행될수록 턴 진행 머니가 지수적으로 증가
- **전략적 경고**: 투자 후 남은 머니가 턴 진행 머니보다 적을 경우 경고
- **턴 진입 경고**: 턴 시작 시 보유 머니가 부족하면 경고

## 🛠️ 기술 스택

- **Frontend**: React 19.1.1
- **Routing**: React Router DOM 7.7.1
- **State Management**: React Context API
- **Styling**: CSS-in-JS (Inline Styles)
- **Charts**: SVG 기반 커스텀 차트
- **Build Tool**: Create React App

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/invest-game.git
cd invest-game
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm start
```

### 4. 빌드 (배포용)
```bash
npm run build
```

## 📁 프로젝트 구조

```
invest-game/
├── public/                 # 정적 파일
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트
│   ├── context/           # React Context
│   │   └── GameContext.jsx # 게임 상태 관리
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── Home.jsx       # 시작 페이지 (닉네임 입력)
│   │   ├── Game.jsx       # 메인 게임 페이지
│   │   └── Result.jsx     # 결과 페이지
│   ├── App.js             # 라우팅 설정
│   └── index.js           # 앱 진입점
├── package.json           # 프로젝트 설정
└── README.md             # 프로젝트 문서
```

## 🎯 게임 규칙

### 기본 규칙
1. **시작**: 닉네임을 입력하고 게임 시작
2. **턴 진행**: 매 턴마다 턴 진행 머니 차감
3. **투자**: 원하는 상품을 선택하여 매수/매도
4. **가격 변동**: 모든 상품의 가격이 랜덤하게 변동
5. **뉴스 발생**: 루머와 실제 뉴스가 발생하여 시장에 영향
6. **게임 종료**: 파산하거나 자진 종료

### 승리 조건
- **장기 생존**: 최대한 오래 생존하며 자산 증식
- **전략적 투자**: 뉴스와 루머를 분석하여 적절한 타이밍에 투자
- **리스크 관리**: 상장폐지 위험을 피하고 안정적인 포트폴리오 구성

### 패배 조건
- **파산**: 보유 머니가 턴 진행 머니보다 적어짐
- **자진 종료**: 40턴 이후 게임 종료 버튼 클릭

## 🔧 개발 과정

### 1단계: 기본 구조 설계
- React 프로젝트 생성
- 라우팅 설정 (Home → Game → Result)
- Context API를 통한 전역 상태 관리

### 2단계: 핵심 게임 로직 구현
- 투자 상품 데이터 구조 설계
- 매수/매도 시스템 구현
- 턴 기반 게임 진행 로직

### 3단계: UI/UX 개선
- 헤더 섹션 (턴, 보유 머니, 턴 진행 머니)
- 투자 상품 그리드 레이아웃
- 모달을 통한 매수/매도 인터페이스

### 4단계: 고급 기능 추가
- **가격 히스토리 그래프**: SVG 기반 커스텀 차트
- **뉴스/루머 시스템**: 동적 메시지 생성
- **상장폐지 시스템**: 연속 하락 기반 위험 관리
- **지수적 턴 비용**: 게임 난이도 조절

### 5단계: 게임 밸런싱
- 경고 시스템 구현 (투자 전, 턴 진입 시)
- 상장폐지 로직 최적화
- 뉴스 발생 확률 및 효과 조정

## 🎨 주요 기능 상세

### 가격 히스토리 그래프
```javascript
const PriceGraph = ({ priceHistory, name }) => {
  // SVG 기반 라인 차트
  // 현재 가격 강조 표시
  // 이전 가격과 트렌드 방향 표시
};
```

### 동적 뉴스 시스템
```javascript
const NEWS_FORMATS = {
  real: [
    { effect: 1.2, message: '{name}이 대형 호재로 급등했습니다!' },
    // ... 더 많은 실제 뉴스 포맷
  ],
  rumor: [
    { effect: 1, message: '{name}이 곧 상장폐지된다는 소문이 돌고 있습니다.' },
    // ... 더 많은 루머 포맷
  ]
};
```

### 상장폐지 로직
```javascript
// 5연속 하락 시 위험 상태 진입
if (newConsecutiveDown >= 5 && newDelistRiskTurns === 0) {
  newDelistRiskTurns = 1;
}
// 위험 상태에서 계속 하락하면 연장
else if (newDelistRiskTurns > 0) {
  if (newPrice < item.price) {
    newDelistRiskTurns += 1;
  } else {
    newDelistRiskTurns = 0; // 상승 시 해제
  }
}
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

- React 팀에게 훌륭한 프레임워크를 제공해주셔서 감사합니다
- 모든 테스터와 피드백을 제공해주신 분들께 감사드립니다

---

**즐거운 투자 게임 되세요! 📈💰**
