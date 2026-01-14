# 기술 스택 및 아키텍처

## 기술 스택 선택

### 프론트엔드 프레임워크

#### React 18+
**선택 이유:**
- 컴포넌트 기반 아키텍처로 재사용성 높음
- 풍부한 생태계와 커뮤니티 지원
- React-Konva와의 완벽한 통합
- 훅 기반 개발로 코드 간결성
- TypeScript와의 우수한 호환성

**주요 기능 활용:**
- Hooks (useState, useEffect, useMemo, useCallback)
- Context API (전역 상태 일부)
- React.memo (성능 최적화)

---

### Canvas 라이브러리

#### React-Konva
**선택 이유:**
- React와 Canvas의 브릿지 역할
- 선언적 API로 React 패러다임 유지
- 성능 최적화 (자동 배칭, 레이어 분리)
- 풍부한 도형 지원 (Circle, Rect, Line, Arrow, Image 등)
- 이벤트 핸들링 용이
- 애니메이션 지원

**대안 고려:**
- **Fabric.js**: 더 많은 기능이지만 React와의 통합이 복잡
- **Paper.js**: 벡터 그래픽에 특화되어 있으나 React 통합 어려움
- **PixiJS**: 게임 엔진 성격이 강해 과함

**주요 컴포넌트:**
```typescript
import { Stage, Layer, Group, Circle, Rect, Line, Arrow, Image, Text } from 'react-konva';
```

---

### 타입 시스템

#### TypeScript
**선택 이유:**
- 타입 안정성으로 런타임 에러 감소
- IDE 자동완성 및 리팩토링 지원
- 코드 문서화 효과
- 대규모 프로젝트 관리 용이

**타입 정의 전략:**
- 엄격한 타입 체크 (`strict: true`)
- 인터페이스 우선 사용
- 유니온 타입으로 상태 표현
- 제네릭 활용

---

### 상태 관리

#### Zustand
**선택 이유:**
- 간단한 API로 학습 곡선 낮음
- 보일러플레이트 최소화
- TypeScript 지원 우수
- 미들웨어 지원 (persist, devtools)
- Redux 대비 가벼움

**대안:**
- **Redux Toolkit**: 더 복잡한 상태 관리 필요 시
- **Jotai**: 원자적 상태 관리, 작은 상태에 적합
- **Context API**: 간단한 전역 상태용

**상태 구조:**
```typescript
// store/tacticalBoardStore.ts
interface TacticalBoardState {
  players: Player[];
  shapes: Shape[];
  animations: Animation[];
  selectedObjectId: string | null;
  currentSession: Session | null;
  zoom: number;
  pan: { x: number; y: number };
}
```

---

### 빌드 도구

#### Vite
**선택 이유:**
- 빠른 개발 서버 (HMR)
- 최적화된 프로덕션 빌드
- ES 모듈 네이티브 지원
- 플러그인 생태계
- TypeScript 기본 지원

**대안:**
- **Create React App**: 느린 빌드 속도
- **Next.js**: SSR 불필요
- **Webpack**: 설정 복잡

---

### 스타일링

#### Tailwind CSS
**선택 이유:**
- 유틸리티 퍼스트 접근
- 빠른 개발 속도
- 일관된 디자인 시스템
- 작은 번들 사이즈 (PurgeCSS)
- 다크 모드 지원

**대안:**
- **CSS Modules**: 컴포넌트별 스타일 격리
- **Styled Components**: CSS-in-JS, 런타임 오버헤드
- **Emotion**: Styled Components 대안

**설정:**
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        // ...
      }
    }
  }
}
```

---

### 데이터 저장

#### IndexedDB (via idb)
**선택 이유:**
- 대용량 데이터 저장 가능
- 비동기 API
- 구조화된 데이터 저장
- 브라우저 네이티브 지원
- 로컬 저장소보다 큰 용량

**라이브러리:**
- **idb**: Promise 기반 IndexedDB 래퍼
- 또는 **Dexie.js**: 더 고수준 API

**대안:**
- **localStorage**: 작은 데이터용 (제한적)
- **Web SQL**: Deprecated

**저장 구조:**
```typescript
// IndexedDB 스키마
interface Database {
  sessions: Session[];
  tactics: Tactic[];
  settings: Settings;
}
```

---

### 유틸리티 라이브러리

#### Lodash (선택적)
**선택 이유:**
- 배열/객체 조작 유틸리티
- 깊은 복사, 병합 등
- 성능 최적화된 함수들

**사용 시 주의:**
- 필요한 함수만 import (`lodash-es`)
- Tree-shaking 활용

---

### 개발 도구

#### ESLint
- 코드 품질 유지
- Airbnb 또는 Standard 설정

#### Prettier
- 코드 포맷팅 자동화
- ESLint와 통합

#### Husky + lint-staged
- Git 훅으로 커밋 전 검사
- 코드 품질 보장

---

## 아키텍처 설계

### 전체 아키텍처

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (React Components, UI)                 │
├─────────────────────────────────────────┤
│           Business Logic Layer          │
│  (Custom Hooks, Services)              │
├─────────────────────────────────────────┤
│           State Management Layer        │
│  (Zustand Stores)                      │
├─────────────────────────────────────────┤
│           Data Layer                    │
│  (IndexedDB, Local Storage)             │
└─────────────────────────────────────────┘
```

### 폴더 구조

```
soccer_strategy_app/
├── public/
│   ├── images/          # 정적 이미지
│   └── icons/           # 아이콘
├── src/
│   ├── components/      # React 컴포넌트
│   │   ├── common/      # 공통 컴포넌트
│   │   ├── header/      # 헤더 관련
│   │   ├── sidebar/     # 사이드바 관련
│   │   ├── board/       # 전술 보드 관련
│   │   └── modals/      # 모달 컴포넌트
│   ├── hooks/           # 커스텀 훅
│   │   ├── useTacticalBoard.ts
│   │   ├── useAnimation.ts
│   │   ├── useDragDrop.ts
│   │   └── useKeyboard.ts
│   ├── store/           # Zustand 스토어
│   │   ├── tacticalBoardStore.ts
│   │   ├── sessionStore.ts
│   │   ├── animationStore.ts
│   │   └── uiStore.ts
│   ├── services/        # 비즈니스 로직
│   │   ├── storageService.ts
│   │   ├── exportService.ts
│   │   └── importService.ts
│   ├── utils/           # 유틸리티 함수
│   │   ├── canvasUtils.ts
│   │   ├── mathUtils.ts
│   │   └── validationUtils.ts
│   ├── types/           # TypeScript 타입
│   │   ├── player.ts
│   │   ├── shape.ts
│   │   ├── session.ts
│   │   └── animation.ts
│   ├── constants/       # 상수
│   │   ├── formations.ts
│   │   └── colors.ts
│   ├── styles/          # 스타일
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── docs/                # 문서
├── .eslintrc.js
├── .prettierrc
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 데이터 모델

### 핵심 엔티티

#### Player
```typescript
interface Player {
  id: string;
  number: number;
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  team: 'home' | 'away';
  color: string;
  x: number;
  y: number;
  rotation?: number;
}
```

#### Shape
```typescript
interface Shape {
  id: string;
  type: 'arrow' | 'line' | 'rect' | 'circle' | 'text';
  points: number[];
  color: string;
  strokeWidth: number;
  fill?: string;
  opacity?: number;
  // 타입별 추가 속성
}
```

#### Animation
```typescript
interface Animation {
  id: string;
  name: string;
  keyframes: Keyframe[];
  duration: number;
  loop: boolean;
}

interface Keyframe {
  time: number;
  players: Player[];
  shapes: Shape[];
}
```

#### Session
```typescript
interface Session {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  tactics: Tactic[];
  thumbnail?: string; // Base64 이미지
}

interface Tactic {
  id: string;
  name: string;
  players: Player[];
  shapes: Shape[];
  animations: Animation[];
  createdAt: Date;
}
```

---

## 상태 관리 설계

### 스토어 분리 전략

#### 1. TacticalBoardStore
```typescript
// 전술 보드 상태
interface TacticalBoardState {
  players: Player[];
  shapes: Shape[];
  selectedObjectId: string | null;
  zoom: number;
  pan: { x: number; y: number };
  gridVisible: boolean;
  snapToGrid: boolean;
}
```

#### 2. SessionStore
```typescript
// 세션 관리
interface SessionState {
  sessions: Session[];
  currentSessionId: string | null;
  currentTacticId: string | null;
}
```

#### 3. AnimationStore
```typescript
// 애니메이션 상태
interface AnimationState {
  isPlaying: boolean;
  currentTime: number;
  playbackSpeed: number;
  animations: Animation[];
}
```

#### 4. UIStore
```typescript
// UI 상태
interface UIState {
  sidebarOpen: boolean;
  activeTab: 'players' | 'tools' | 'tactics';
  activeTool: ToolType | null;
  modalOpen: ModalType | null;
}
```

---

## 컴포넌트 아키텍처

### 컴포넌트 계층

```
App
  ├── Layout
  │     ├── Header
  │     ├── MainContent
  │     │     ├── Sidebar
  │     │     ├── TacticalBoard
  │     │     └── BottomPanel
  │     └── Modals
  └── Providers
        ├── StoreProvider
        └── ThemeProvider
```

### 컴포넌트 패턴

#### 1. Container/Presentational 패턴
- Container: 상태 관리, 비즈니스 로직
- Presentational: UI만 담당

#### 2. Custom Hooks 패턴
- 재사용 가능한 로직을 훅으로 분리
- 컴포넌트는 훅 사용만

#### 3. Compound Components
- 관련 컴포넌트를 그룹화
- 예: `ToolPalette`, `ToolPalette.Item`

---

## 성능 최적화 전략

### React 최적화

#### 1. 메모이제이션
```typescript
// React.memo로 불필요한 리렌더링 방지
const PlayerIcon = React.memo(({ player }: Props) => {
  // ...
});

// useMemo로 계산 결과 캐싱
const filteredPlayers = useMemo(
  () => players.filter(p => p.team === 'home'),
  [players]
);

// useCallback으로 함수 메모이제이션
const handlePlayerClick = useCallback((id: string) => {
  // ...
}, []);
```

#### 2. 코드 스플리팅
```typescript
// 동적 import
const SessionList = lazy(() => import('./SessionList'));
```

### Canvas 최적화

#### 1. 레이어 분리
- 배경, 도형, 선수, 애니메이션을 별도 레이어로 분리
- 변경된 레이어만 리렌더링

#### 2. 배칭 (Batching)
- React-Konva가 자동으로 배칭 처리
- 수동 제어 필요 시 `batchDraw()` 사용

#### 3. 가상화
- 보이지 않는 객체는 렌더링하지 않음
- 뷰포트 기반 렌더링

#### 4. 이벤트 최적화
- 이벤트 리스너 최소화
- 이벤트 위임 활용

---

## 에러 처리

### 에러 바운더리
```typescript
class ErrorBoundary extends React.Component {
  // 컴포넌트 에러 캐치
}
```

### 에러 로깅
- 개발 환경: 콘솔 출력
- 프로덕션: 에러 수집 서비스 (선택적)

### 사용자 피드백
- Toast 알림
- 에러 메시지 표시
- 복구 제안

---

## 테스트 전략

### 단위 테스트
- **Jest**: 테스트 러너
- **React Testing Library**: 컴포넌트 테스트
- **@testing-library/user-event**: 사용자 이벤트 시뮬레이션

### 통합 테스트
- 주요 사용자 플로우 테스트
- 상태 관리 로직 테스트

### E2E 테스트 (향후)
- **Playwright** 또는 **Cypress**
- 주요 시나리오 자동화

---

## 빌드 및 배포

### 빌드 설정
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'konva-vendor': ['konva', 'react-konva'],
        }
      }
    }
  }
});
```

### 배포 전략
- **정적 호스팅**: Vercel, Netlify, GitHub Pages
- **CDN**: Cloudflare, AWS CloudFront
- **도메인**: 커스텀 도메인 연결

---

## 보안 고려사항

### 클라이언트 사이드 보안
- XSS 방지: 입력 검증 및 이스케이프
- CSRF: 토큰 기반 인증 (향후)
- 데이터 검증: 클라이언트 및 서버 양쪽 검증

### 데이터 프라이버시
- 모든 데이터는 로컬에만 저장
- 외부 서버로 데이터 전송 없음
- 사용자 동의 없이 데이터 수집하지 않음

---

## 확장성 고려사항

### 향후 기능 추가
- **플러그인 시스템**: 커스텀 도구 추가
- **테마 시스템**: 사용자 정의 테마
- **다중 스포츠**: 스포츠별 모듈화
- **협업 기능**: WebSocket 통합 준비

### 마이그레이션 전략
- 버전 관리된 데이터 스키마
- 마이그레이션 스크립트
- 하위 호환성 유지

---

## 개발 워크플로우

### Git 전략
- **브랜치 전략**: Git Flow 또는 GitHub Flow
- **커밋 메시지**: Conventional Commits
- **PR 리뷰**: 코드 리뷰 필수

### CI/CD (향후)
- **GitHub Actions**: 자동 빌드 및 테스트
- **자동 배포**: 메인 브랜치 머지 시 배포

---

## 의존성 관리

### 패키지 버전 관리
- **Semantic Versioning**: 버전 명명 규칙
- **Lock 파일**: package-lock.json 커밋
- **정기 업데이트**: 보안 패치 적용

### 번들 크기 관리
- **Bundle Analyzer**: 번들 크기 분석
- **Tree Shaking**: 사용하지 않는 코드 제거
- **Code Splitting**: 청크 분리

---

## 문서화

### 코드 문서화
- **JSDoc**: 함수/클래스 문서화
- **TypeScript**: 타입으로 문서화
- **README**: 프로젝트 개요 및 시작 가이드

### API 문서화
- 커스텀 훅 API 문서
- 서비스 함수 문서
- 컴포넌트 Props 문서
