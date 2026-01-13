# 개발 시작 전 준비사항 가이드

## 필수 도구 설치

### 1. Node.js 설치

#### Windows
1. [Node.js 공식 웹사이트](https://nodejs.org/) 방문
2. LTS 버전 다운로드 (18.x 이상 권장)
3. 설치 프로그램 실행
4. 설치 확인:
```bash
node --version
npm --version
```

#### macOS
```bash
# Homebrew 사용
brew install node

# 또는 공식 웹사이트에서 다운로드
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Git 설치

#### Windows
1. [Git 공식 웹사이트](https://git-scm.com/) 방문
2. 설치 프로그램 다운로드 및 실행
3. 설치 확인:
```bash
git --version
```

#### macOS
```bash
# Homebrew 사용
brew install git

# 또는 Xcode Command Line Tools 설치
xcode-select --install
```

#### Linux
```bash
sudo apt-get update
sudo apt-get install git
```

### 3. 코드 에디터 설치

#### Visual Studio Code (권장)
1. [VS Code 공식 웹사이트](https://code.visualstudio.com/) 방문
2. 다운로드 및 설치
3. 필수 확장 프로그램 설치:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - GitLens

#### 다른 에디터
- WebStorm
- Sublime Text
- Atom

---

## 프로젝트 초기화

### 1. 프로젝트 생성

```bash
# Vite로 React + TypeScript 프로젝트 생성
npm create vite@latest soccer_strategy_app -- --template react-ts

# 프로젝트 디렉토리로 이동
cd soccer_strategy_app
```

### 2. 의존성 설치

#### 핵심 의존성
```bash
# React 및 React-Konva
npm install react react-dom
npm install react-konva konva

# 상태 관리
npm install zustand

# 데이터 저장
npm install idb

# 유틸리티 (선택적)
npm install lodash-es
npm install @types/lodash-es
```

#### 개발 의존성
```bash
# 타입 정의
npm install -D @types/react @types/react-dom

# 빌드 도구
npm install -D vite @vitejs/plugin-react

# 스타일링
npm install -D tailwindcss postcss autoprefixer

# 린팅 및 포맷팅
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier

# Git 훅
npm install -D husky lint-staged
```

### 3. 프로젝트 구조 생성

```bash
# src 디렉토리 구조 생성
mkdir -p src/components/common
mkdir -p src/components/header
mkdir -p src/components/sidebar
mkdir -p src/components/board
mkdir -p src/components/modals
mkdir -p src/hooks
mkdir -p src/store
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/types
mkdir -p src/constants
mkdir -p src/styles

# public 디렉토리 구조
mkdir -p public/images
mkdir -p public/icons
```

---

## 설정 파일 구성

### 1. TypeScript 설정 (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@store/*": ["src/store/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2. Vite 설정 (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'konva-vendor': ['konva', 'react-konva'],
        },
      },
    },
  },
});
```

### 3. Tailwind CSS 설정

#### `tailwind.config.js` 생성
```bash
npx tailwindcss init -p
```

#### `tailwind.config.js` 내용
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
```

#### `src/styles/globals.css` 추가
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-900 text-white;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700;
  }
}
```

### 4. ESLint 설정 (`.eslintrc.cjs`)

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
```

### 5. Prettier 설정 (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### 6. Husky 설정

```bash
# Husky 초기화
npx husky init

# pre-commit 훅 설정
echo "npx lint-staged" > .husky/pre-commit
```

#### `package.json`에 lint-staged 추가
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

## 기본 파일 생성

### 1. 타입 정의 파일

#### `src/types/player.ts`
```typescript
export type Position = 'GK' | 'DF' | 'MF' | 'FW';
export type Team = 'home' | 'away';

export interface Player {
  id: string;
  number: number;
  name: string;
  position: Position;
  team: Team;
  color: string;
  x: number;
  y: number;
  rotation?: number;
}
```

#### `src/types/shape.ts`
```typescript
export type ShapeType = 'arrow' | 'line' | 'rect' | 'circle' | 'text';

export interface Shape {
  id: string;
  type: ShapeType;
  points: number[];
  color: string;
  strokeWidth: number;
  fill?: string;
  opacity?: number;
}
```

#### `src/types/session.ts`
```typescript
import { Player } from './player';
import { Shape } from './shape';
import { Animation } from './animation';

export interface Session {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  tactics: Tactic[];
  thumbnail?: string;
}

export interface Tactic {
  id: string;
  name: string;
  players: Player[];
  shapes: Shape[];
  animations: Animation[];
  createdAt: Date;
}
```

#### `src/types/animation.ts`
```typescript
import { Player } from './player';
import { Shape } from './shape';

export interface Animation {
  id: string;
  name: string;
  keyframes: Keyframe[];
  duration: number;
  loop: boolean;
}

export interface Keyframe {
  time: number;
  players: Player[];
  shapes: Shape[];
}
```

### 2. 기본 스토어 파일

#### `src/store/tacticalBoardStore.ts`
```typescript
import { create } from 'zustand';
import { Player } from '@/types/player';
import { Shape } from '@/types/shape';

interface TacticalBoardState {
  players: Player[];
  shapes: Shape[];
  selectedObjectId: string | null;
  zoom: number;
  pan: { x: number; y: number };
  gridVisible: boolean;
  snapToGrid: boolean;
  
  // Actions
  addPlayer: (player: Player) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  removePlayer: (id: string) => void;
  addShape: (shape: Shape) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  removeShape: (id: string) => void;
  setSelectedObject: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
}

export const useTacticalBoardStore = create<TacticalBoardState>((set) => ({
  players: [],
  shapes: [],
  selectedObjectId: null,
  zoom: 1,
  pan: { x: 0, y: 0 },
  gridVisible: false,
  snapToGrid: false,
  
  addPlayer: (player) => set((state) => ({ players: [...state.players, player] })),
  updatePlayer: (id, updates) =>
    set((state) => ({
      players: state.players.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  removePlayer: (id) =>
    set((state) => ({ players: state.players.filter((p) => p.id !== id) })),
  addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
  updateShape: (id, updates) =>
    set((state) => ({
      shapes: state.shapes.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
  removeShape: (id) =>
    set((state) => ({ shapes: state.shapes.filter((s) => s.id !== id) })),
  setSelectedObject: (id) => set({ selectedObjectId: id }),
  setZoom: (zoom) => set({ zoom }),
  setPan: (pan) => set({ pan }),
}));
```

### 3. 기본 컴포넌트

#### `src/App.tsx`
```typescript
import { useState } from 'react';
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
import TacticalBoard from './components/board/TacticalBoard';
import BottomPanel from './components/bottom/BottomPanel';
import './styles/globals.css';

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TacticalBoard />
          <BottomPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
```

---

## 개발 서버 실행

### 1. 개발 모드 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 2. 빌드
```bash
npm run build
```

### 3. 프로덕션 미리보기
```bash
npm run preview
```

---

## Git 설정

### 1. Git 저장소 초기화
```bash
git init
git add .
git commit -m "init: 프로젝트 초기 설정"
```

### 2. `.gitignore` 확인
```gitignore
# Dependencies
node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Production
/dist
/build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.idea
*.swp
*.swo
*~

# OS
Thumbs.db
```

### 3. 원격 저장소 연결 (선택)
```bash
git remote add origin <repository-url>
git branch -M main
git push -u origin main
```

---

## 체크리스트

개발 시작 전 다음 항목들을 확인하세요:

### 환경 설정
- [ ] Node.js 18+ 설치 완료
- [ ] Git 설치 완료
- [ ] VS Code (또는 다른 에디터) 설치 완료
- [ ] 필수 VS Code 확장 프로그램 설치

### 프로젝트 설정
- [ ] 프로젝트 생성 완료
- [ ] 모든 의존성 설치 완료
- [ ] 프로젝트 구조 생성 완료
- [ ] 설정 파일 구성 완료

### 개발 환경
- [ ] 개발 서버 실행 확인
- [ ] 빌드 성공 확인
- [ ] ESLint/Prettier 작동 확인
- [ ] Git 저장소 초기화 완료

### 문서 확인
- [ ] 기능 명세서 검토
- [ ] 유저 스토리 검토
- [ ] UI 설계 검토
- [ ] 기술 스택 문서 검토
- [ ] 개발 계획 검토

---

## 문제 해결

### 일반적인 문제

#### 1. Node 버전 불일치
```bash
# nvm 사용 (권장)
nvm install 18
nvm use 18
```

#### 2. 포트 충돌
```bash
# 다른 포트 사용
npm run dev -- --port 3000
```

#### 3. 의존성 설치 실패
```bash
# 캐시 클리어 후 재설치
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript 에러
```bash
# 타입 정의 재설치
npm install -D @types/node @types/react @types/react-dom
```

---

## 다음 단계

환경 설정이 완료되면 다음 문서를 참고하여 개발을 시작하세요:

1. [개발 계획서](./development-plan.md) - Phase 1부터 시작
2. [기술 스택 문서](./tech-stack.md) - 아키텍처 참고
3. [UI 설계 문서](./ui-design.md) - 컴포넌트 구현 참고
4. [유저 스토리](./user-stories.md) - 기능 구현 참고

---

## 추가 리소스

### 학습 자료
- [React 공식 문서](https://react.dev/)
- [React-Konva 문서](https://konvajs.org/docs/react/)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

### 도구
- [Vite 문서](https://vitejs.dev/)
- [ESLint 문서](https://eslint.org/)
- [Prettier 문서](https://prettier.io/)
