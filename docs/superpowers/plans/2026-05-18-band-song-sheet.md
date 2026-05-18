# Band Song Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Slack #club_band 합주곡 추천 스레드의 댓글을 읽어 Claude AI가 장르·세션·난이도를 분석하고 Google Sheets에 자동 등록하는 Claude Code 워크플로 구축

**Architecture:** `sync.ts`는 JSON을 stdin으로 받아 Google Sheets에 행을 추가하는 write-only CLI. Claude Code가 전체 흐름을 오케스트레이션한다: Slack MCP로 스레드 읽기 → Claude가 직접 AI 분석 → `sync.ts` 호출. `service-account.json`으로 Google 인증, `slack_ts`로 중복 방지.

**Tech Stack:** Node.js + TypeScript, `googleapis`, `dotenv`

---

## 파일 구조

| 파일 | 역할 |
|---|---|
| `src/types.ts` | SongEntry 타입 정의 |
| `src/sheetsClient.ts` | Google Sheets 인증 + 읽기/쓰기 |
| `src/sync.ts` | 메인 진입점: stdin JSON → Sheets append |
| `src/parseSongReply.ts` | Slack 댓글 → SongEntry 파싱 |
| `tests/parseSongReply.test.ts` | 파싱 유닛 테스트 |
| `CLAUDE.md` | 싱크 워크플로 실행 방법 |
| `.env.example` | 환경변수 예시 |
| `package.json` | npm 설정 |
| `tsconfig.json` | TS 설정 |
| `.gitignore` | service-account.json, .env, node_modules 제외 |

---

## Task 1: 프로젝트 초기화

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: package.json 생성**

```json
{
  "name": "band-song-sheet",
  "version": "1.0.0",
  "description": "Sync band song recommendations from Slack to Google Sheets",
  "main": "dist/sync.js",
  "scripts": {
    "sync": "ts-node src/sync.ts",
    "test": "jest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "dotenv": "^16.0.0",
    "googleapis": "^144.0.0"
  },
  "devDependencies": {
    "@types/jest": "^29.0.0",
    "@types/node": "^20.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "ts-node": "^10.0.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 2: tsconfig.json 생성**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: .gitignore 생성**

```
node_modules/
dist/
.env
service-account.json
tokens.json
```

- [ ] **Step 4: .env.example 생성**

```
SPREADSHEET_ID=your_spreadsheet_id_here
```

- [ ] **Step 5: 의존성 설치**

```bash
cd /Users/minsoonki/Desktop/repository/external/band-song-sheet
npm install
```

Expected: `node_modules/` 생성, lock file 생성

- [ ] **Step 6: 커밋**

```bash
git init
git add package.json tsconfig.json .gitignore .env.example package-lock.json
git commit -m "chore: initialize band-song-sheet project"
```

---

## Task 2: 타입 정의

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: src/types.ts 작성**

```typescript
export interface SessionDifficulty {
  vocal: number | null;
  drums: number | null;
  guitar: number | null;
  bass: number | null;
  keyboard: number | null;
  chorus: number | null;
}

export interface SongEntry {
  song: string;
  artist: string;
  genre: string;
  sessions: SessionDifficulty;
  youtubeUrl: string | null;
  recommender: string;
  recommendedAt: string;
  slackTs: string;
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/types.ts
git commit -m "feat: add SongEntry type definitions"
```

---

## Task 3: Slack 댓글 파서

**Files:**
- Create: `src/parseSongReply.ts`
- Create: `tests/parseSongReply.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/parseSongReply.test.ts`:

```typescript
import { parseSongReply } from '../src/parseSongReply';

describe('parseSongReply', () => {
  it('올바른 형식의 댓글을 파싱한다', () => {
    const message = `곡명: Time is Running Out\n가수명: Muse\n링크: https://youtu.be/O2IuJPh6h_A`;
    const result = parseSongReply(message, '민순기', '1779083524.870179', '2026-05-18 14:52');
    expect(result).not.toBeNull();
    expect(result!.song).toBe('Time is Running Out');
    expect(result!.artist).toBe('Muse');
    expect(result!.youtubeUrl).toBe('https://youtu.be/O2IuJPh6h_A');
    expect(result!.recommender).toBe('민순기');
    expect(result!.slackTs).toBe('1779083524.870179');
  });

  it('가수명: 형식도 파싱한다', () => {
    const message = `곡명: HAPPY\n가수명: 데이식스\n링크: https://www.youtube.com/watch?v=sWXGbkM0tBI`;
    const result = parseSongReply(message, '박채영', '1779083825.668379', '2026-05-18 14:57');
    expect(result).not.toBeNull();
    expect(result!.artist).toBe('데이식스');
  });

  it('곡명 필드 없으면 null 반환', () => {
    const message = '합주곡을 자유롭게 추천해주시면 감사드리겠습니다';
    const result = parseSongReply(message, '민순기', '1779083403.574619', '2026-05-18 14:50');
    expect(result).toBeNull();
  });

  it('링크 없어도 파싱 성공 (youtubeUrl은 null)', () => {
    const message = `곡명: Butterfly\n가수명: 전영호`;
    const result = parseSongReply(message, '민순기', '1779085691.079469', '2026-05-18 15:28');
    expect(result).not.toBeNull();
    expect(result!.youtubeUrl).toBeNull();
  });

  it('공백 포함 형식(가수명 : ) 파싱', () => {
    const message = `곡명 : No Pain\n가수명 : 실리카겔\n링크 : https://youtu.be/JaIMSzE5yLA`;
    const result = parseSongReply(message, '양호준', '1779084951.244529', '2026-05-18 15:15');
    expect(result).not.toBeNull();
    expect(result!.song).toBe('No Pain');
  });
});
```

- [ ] **Step 2: 테스트 실행 → 실패 확인**

```bash
npm test -- --testPathPattern=parseSongReply
```

Expected: `FAIL` — `Cannot find module '../src/parseSongReply'`

- [ ] **Step 3: parseSongReply.ts 구현**

`src/parseSongReply.ts`:

```typescript
import { SongEntry } from './types';

export function parseSongReply(
  text: string,
  recommender: string,
  slackTs: string,
  recommendedAt: string
): Omit<SongEntry, 'genre' | 'sessions'> | null {
  const songMatch = text.match(/곡명\s*:\s*(.+)/i);
  if (!songMatch) return null;

  const artistMatch = text.match(/가수명\s*:\s*(.+)/i);
  if (!artistMatch) return null;

  const linkMatch = text.match(/링크\s*:\s*(https?:\/\/\S+)/i);

  return {
    song: songMatch[1].trim(),
    artist: artistMatch[1].trim(),
    youtubeUrl: linkMatch ? linkMatch[1].trim() : null,
    recommender,
    recommendedAt,
    slackTs,
  };
}
```

- [ ] **Step 4: jest 설정 추가 (package.json에 추가)**

```json
"jest": {
  "preset": "ts-jest",
  "testEnvironment": "node",
  "roots": ["<rootDir>/tests"]
}
```

- [ ] **Step 5: 테스트 실행 → 통과 확인**

```bash
npm test -- --testPathPattern=parseSongReply
```

Expected: `PASS` — 5 tests passed

- [ ] **Step 6: 커밋**

```bash
git add src/parseSongReply.ts tests/parseSongReply.test.ts package.json
git commit -m "feat: add Slack reply parser with tests"
```

---

## Task 4: Google Sheets 클라이언트

**Files:**
- Create: `src/sheetsClient.ts`

- [ ] **Step 1: src/sheetsClient.ts 작성**

```typescript
import { google } from 'googleapis';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SERVICE_ACCOUNT_PATH = path.resolve(process.cwd(), 'service-account.json');

function getAuth() {
  return new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: SCOPES,
  });
}

export async function getExistingSlackTs(spreadsheetId: string): Promise<Set<string>> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1!N:N',
  });

  const values = response.data.values ?? [];
  return new Set(values.flat().filter(Boolean));
}

export async function appendSongRows(
  spreadsheetId: string,
  rows: string[][]
): Promise<number> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  if (rows.length === 0) return 0;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A:N',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  });

  return rows.length;
}

export async function getLastRowNumber(spreadsheetId: string): Promise<number> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1!A:A',
  });

  return (response.data.values ?? []).length;
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/sheetsClient.ts
git commit -m "feat: add Google Sheets client with service account auth"
```

---

## Task 5: 메인 sync 스크립트

**Files:**
- Create: `src/sync.ts`

`sync.ts`는 stdin으로 `SongEntry[]` JSON을 받아서 Sheets에 새 행을 추가한다.

- [ ] **Step 1: src/sync.ts 작성**

```typescript
import 'dotenv/config';
import { SongEntry } from './types';
import { getExistingSlackTs, appendSongRows, getLastRowNumber } from './sheetsClient';

function songEntryToRow(entry: SongEntry, rowNumber: number): string[] {
  const { song, artist, genre, sessions, youtubeUrl, recommender, recommendedAt, slackTs } = entry;
  return [
    String(rowNumber),
    genre,
    song,
    artist,
    sessions.vocal != null ? String(sessions.vocal) : '-',
    sessions.drums != null ? String(sessions.drums) : '-',
    sessions.guitar != null ? String(sessions.guitar) : '-',
    sessions.bass != null ? String(sessions.bass) : '-',
    sessions.keyboard != null ? String(sessions.keyboard) : '-',
    sessions.chorus != null ? String(sessions.chorus) : '-',
    youtubeUrl ?? '',
    recommender,
    recommendedAt,
    slackTs,
  ];
}

async function main() {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('SPREADSHEET_ID is required in .env');

  let rawInput = '';
  for await (const chunk of process.stdin) rawInput += chunk;

  const songs: SongEntry[] = JSON.parse(rawInput);
  if (!Array.isArray(songs) || songs.length === 0) {
    console.log('No songs to process.');
    return;
  }

  const existingTs = await getExistingSlackTs(spreadsheetId);
  const newSongs = songs.filter(s => !existingTs.has(s.slackTs));

  if (newSongs.length === 0) {
    console.log('No new songs to add (all already in sheet).');
    return;
  }

  // getLastRowNumber counts header + existing data rows
  // e.g. header(1) + 23 songs = 24 → next song number is 24
  let nextSongNumber = await getLastRowNumber(spreadsheetId);
  const rows = newSongs.map(song => songEntryToRow(song, nextSongNumber++));

  const added = await appendSongRows(spreadsheetId, rows);
  console.log(`Added ${added} new songs to the sheet.`);
}

main().catch(err => {
  console.error('Sync failed:', err.message);
  process.exit(1);
});
```

- [ ] **Step 2: 커밋**

```bash
git add src/sync.ts
git commit -m "feat: add main sync script (stdin JSON → Google Sheets)"
```

---

## Task 6: CLAUDE.md 작성

Claude Code가 이 프로젝트를 열었을 때 싱크 워크플로를 정확히 알 수 있도록 CLAUDE.md를 작성한다.

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: CLAUDE.md 작성**

```markdown
# Band Song Sheet

Slack #club_band 합주곡 추천 스레드의 댓글을 Google Sheets에 동기화하는 프로젝트.

## 싱크 워크플로 (수동 실행)

사용자가 "sync" 또는 "싱크" 명령을 요청하면 아래 단계를 실행한다.

### Step 1: Slack 스레드 읽기

Slack MCP의 `slack_read_thread` 도구로 스레드 전체를 읽는다.
- channel_id: `C0B0ECEPLV7`
- message_ts: `1779083305.243429`

### Step 2: 댓글 파싱

각 댓글에서 아래 패턴을 추출한다:
- `곡명\s*:\s*(.+)` → song
- `가수명\s*:\s*(.+)` → artist
- `링크\s*:\s*(https?://\S+)` → youtubeUrl (없으면 null)

세 필드 중 곡명/가수명이 없으면 skip.

### Step 3: AI 분석

파싱된 각 곡에 대해 아래 정보를 추론한다:

**장르** (genre): 한국어로 짧게 (예: "얼터너티브 록", "J-POP", "인디")

**세션별 숙련도** (sessions): 각 세션이 이 곡을 연주할 때 필요한 기술 수준
- vocal, drums, guitar, bass, keyboard, chorus
- 1(매우 쉬움) ~ 5(매우 어려움)
- 해당 세션이 곡에서 불필요하거나 비중이 없으면 null

밴드 세션: 보컬(vocal), 드럼(drums), 기타(guitar), 베이스(bass), 건반(keyboard), 코러스(chorus)

### Step 4: sync.ts 실행

분석된 SongEntry[] 배열을 JSON으로 직렬화하여 sync.ts에 stdin으로 전달한다.

```bash
echo '<JSON_ARRAY>' | npm run sync
```

SongEntry 타입:
```typescript
{
  song: string;
  artist: string;
  genre: string;
  sessions: {
    vocal: number | null;
    drums: number | null;
    guitar: number | null;
    bass: number | null;
    keyboard: number | null;
    chorus: number | null;
  };
  youtubeUrl: string | null;
  recommender: string;       // Slack display_name
  recommendedAt: string;     // "YYYY-MM-DD HH:mm" KST
  slackTs: string;           // Slack message timestamp
}
```

## 환경 설정

1. `.env` 파일에 `SPREADSHEET_ID=<Google Sheet ID>` 설정
2. `service-account.json` 파일을 프로젝트 루트에 배치
3. Google Sheet의 편집자로 서비스 계정 이메일 공유
4. 헤더 행 (1행): 번호, 장르, 곡명, 아티스트, 보컬, 드럼, 기타, 베이스, 건반, 코러스, YouTube링크, 추천인, 추천일시, slack_ts

## 주의사항

- `service-account.json`과 `.env`는 절대 git에 커밋하지 않는다
- sync.ts는 `slack_ts` 기준으로 중복을 방지하므로 여러 번 실행해도 안전하다
```

- [ ] **Step 2: 커밋**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md with sync workflow instructions"
```

---

## Task 7: 시트 헤더 초기화 스크립트

최초 1회 Google Sheet의 1행에 헤더를 삽입하는 스크립트.

**Files:**
- Create: `src/initSheet.ts`

- [ ] **Step 1: src/initSheet.ts 작성**

```typescript
import 'dotenv/config';
import { google } from 'googleapis';
import path from 'path';

async function main() {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('SPREADSHEET_ID is required in .env');

  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(process.cwd(), 'service-account.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Sheet1!A1:N1',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [['번호', '장르', '곡명', '아티스트', '보컬', '드럼', '기타', '베이스', '건반', '코러스', 'YouTube링크', '추천인', '추천일시', 'slack_ts']],
    },
  });

  console.log('Sheet header initialized.');
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
```

- [ ] **Step 2: package.json scripts에 추가**

```json
"scripts": {
  "sync": "ts-node src/sync.ts",
  "init-sheet": "ts-node src/initSheet.ts",
  "test": "jest",
  "typecheck": "tsc --noEmit"
}
```

- [ ] **Step 3: 커밋**

```bash
git add src/initSheet.ts package.json
git commit -m "feat: add sheet header initializer script"
```

---

## 검증 방법

1. **타입 체크:** `npm run typecheck` → 에러 없음
2. **유닛 테스트:** `npm test` → 5 tests passed
3. **시트 초기화:** `npm run init-sheet` → 1행에 헤더 생성 확인
4. **첫 싱크:** Claude Code에서 "sync 해줘" → 기존 23개 댓글 시트에 일괄 등록 확인
5. **중복 방지:** 동일 상태로 재실행 → "No new songs to add" 출력 확인
6. **신규 댓글:** 스레드에 테스트 댓글 추가 후 싱크 → 새 행 1개만 추가 확인
