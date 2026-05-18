# Band Song Sheet

Slack #club_band 합주곡 추천 스레드의 댓글을 분석하여 output.html로 출력하는 프로젝트.
모든 처리는 Claude Code + MCP로 이루어지며, 별도 credentials 불필요.

## 싱크 워크플로 (수동 실행)

사용자가 "sync" 또는 "싱크" 명령을 요청하면 아래 단계를 실행한다.

### Step 1: Slack 스레드 읽기

`slack_read_thread` MCP 도구로 스레드 전체를 읽는다.
- channel_id: `C0B0ECEPLV7`
- message_ts: `1779083305.243429`

### Step 2: 댓글 파싱

각 댓글에서 아래 패턴을 추출한다:
- `곡명\s*:\s*(.+)` → song
- `가수명\s*:\s*(.+)` → artist
- `링크\s*:\s*(https?://\S+)` → youtubeUrl (없으면 null)

곡명 또는 가수명이 없으면 skip (안내 댓글, 일반 대화 등 제외).

### Step 3: AI 분석

파싱된 각 곡에 대해 아래 정보를 추론한다.

**대분류 장르** (mainGenre): 아래 세 값 중 하나만 사용
- `록`: 얼터너티브 록, 브릿팝, 팝 펑크, 펑크 록, 한국 록, J-록, 하드 록 등 록 계열 전반
- `팝`: J-POP, 케이팝, 팝 계열 전반
- `인디`: 인디 록, 인디 팝, 인디 포크, 한국 인디 등 독립 레이블/인디 씬 중심

**세부 장르** (subGenre): 한국어로 짧게 (예: "얼터너티브 록", "J-POP", "인디 팝")

**세션별 숙련도** (sessions):
- vocal, drums, guitar, bass, keyboard, chorus
- 1(매우 쉬움) ~ 5(매우 어려움)
- 해당 세션이 곡에서 불필요하거나 비중이 없으면 null

### Step 4: HTML 파일 생성

분석된 전체 곡 목록으로 generateHtml 함수를 호출하여 output.html을 생성한다.

```typescript
import { generateHtml } from './src/generateHtml';
import * as fs from 'fs';
const generatedAt = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
const html = generateHtml(songs, generatedAt);
fs.writeFileSync('output.html', html, 'utf-8');
```

완료 후 `open output.html`로 브라우저에서 열어 결과를 확인한다.

## 공유 방법

output.html 파일을 Slack에 파일로 첨부하면 밴드원들이 다운로드해서 열람 가능.

## 컬럼 구성

보컬, 드럼, 기타, 베이스, 건반, 코러스 (숙련도 1-5, 없으면 -)

## 주의사항

- output.html은 sync 실행 시 덮어쓰기 (항상 최신 데이터)
- credentials, .env, service-account.json 불필요
