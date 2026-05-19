# Band Song Sheet

Slack #club_band 합주곡 추천 스레드의 댓글을 분석하여 GitHub Pages로 퍼블리싱하는 프로젝트.
모든 처리는 Claude Code + MCP로 이루어지며, 별도 credentials 불필요.

GitHub Pages URL: https://soonki-98.github.io/band-difficulty/

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

### Step 3: 웹 검색으로 난이도 정보 수집

각 곡에 대해 아래 쿼리로 웹 검색하여 기술 데이터와 실제 연주자들의 난이도 평가를 수집한다.

**필수 검색 (매 곡):**
- `{곡명} {아티스트} bpm tempo` → BPM 확인 (드럼 루브릭 적용의 기준)
- `{곡명} {아티스트} vocal range highest note` → 최고음 확인 (보컬 루브릭 적용의 기준)

**세션별 검색:**
- `{곡명} {아티스트} guitar tab difficulty`
- `{곡명} {아티스트} drum sheet music tutorial`
- `{곡명} {아티스트} bass tab`

YouTube 커버 영상 댓글, Ultimate Guitar 난이도 태그, 연주 튜토리얼 설명 등을 근거로 삼는다.
검색 결과가 없는 경우 아래 루브릭만으로 판단한다.

**검색 후 반드시 아래 항목을 파악한다 (Step 4 진행 전):**
- 드럼 BPM (숫자): 검색으로 확인되면 기록, 확인 불가이면 "미확인"으로 표시
- 보컬 최고음 (노트명, 예: A4, B♭4, C5): 확인되면 기록, 확인 불가이면 "미확인"
- 기타 특수 기법 여부: 태핑 / 스윕 피킹 / 복잡한 솔로 등 유무
- 베이스 특수 기법 여부: 슬랩 / 아이코닉 리프 유무

### Step 4: AI 분석

파싱된 각 곡에 대해 장르와 세션별 숙련도를 산출한다.

**분석은 반드시 2단계로 진행한다:**

#### 1단계: 기술 데이터 명시 (점수 책정 전 필수)

각 세션에 대해 Step 3에서 수집한 데이터를 바탕으로 다음을 명시한다:

| 세션 | 파악할 데이터 |
|------|--------------|
| 드럼 | BPM (숫자 또는 "미확인"), 비트 패턴 (8비트/16비트/특수), 더블 페달 사용 여부, 복잡한 필 여부 |
| 보컬 | 최고음 (노트명 또는 "미확인"), 팔세토/강한 벨팅 필요 여부, 멜리스마/런 여부 |
| 기타 | 코드 종류 (오픈/바레/복잡한 보이싱), 솔로 유무 및 복잡도, 특수 기법 (태핑/스윕 등) 여부 |
| 베이스 | 패턴 유형 (루트 노트 중심/멜로딕/아이코닉 리프), 슬랩 여부 |
| 건반 | 비중 (주요 악기/배경 패드), 멜로딕/아르페지오 파트 여부 |
| 코러스 | 하모니 파트 수, 음역 요구 수준 |

#### 2단계: 루브릭 기계적 대입

1단계에서 파악한 기술 데이터를 각 세션 루브릭 표의 기준과 대조하여 점수를 결정한다.

**핵심 제약 (반드시 준수):**
1. **BPM 제약**: 드럼 BPM이 확인된 경우, 점수는 반드시 해당 BPM이 속하는 루브릭 밴드의 하한 이상이어야 한다.
   - BPM 80 이하 → 최대 20
   - BPM 80~120 → 21~40 범위
   - BPM 120~160 → 41~60 범위 (또는 16비트 패턴이면 그 이상)
   - BPM 160~200 → 61~80 범위
   - BPM 200+ → 81~100 범위
2. **음역 제약**: 보컬 최고음이 확인된 경우, 해당 음이 속하는 루브릭 밴드를 반드시 충족한다.
3. **기법 제약**: 고급 기법(태핑, 스윕 피킹, 더블 페달, 슬랩 등)이 확인되면 해당 기법이 속하는 루브릭 밴드 이상으로 책정한다.
4. **상향 우선**: 여러 기준 중 더 높은 밴드를 요구하는 기준을 채택한다.
5. **직관 금지**: "쉬운 곡", "밝은 느낌", "입문자 추천" 같은 일반적 평판이 루브릭 기준을 override하지 않는다.

**보정 기준 예시 (calibration anchors):**
- Nirvana - Smells Like Teen Spirit: drums ≈ 25 (BPM 117, 기본 비트, 단순 필)
- Vaundy - Odoriko: drums ≥ 41 (BPM 157 → 120~160 범위)
- Muse - Hysteria: drums ≈ 65 (BPM 175, 복잡한 패턴)
- Queen - We Will Rock You: drums ≈ 15 (BPM 81, 매우 단순)

---

**대분류 장르** (mainGenre): 아래 세 값 중 하나만 사용
- `록`: 얼터너티브 록, 브릿팝, 팝 펑크, 펑크 록, 한국 록, J-록, 하드 록 등 록 계열 전반
- `팝`: J-POP, 케이팝, 팝 계열 전반
- `인디`: 인디 록, 인디 팝, 인디 포크, 한국 인디 등 독립 레이블/인디 씬 중심

**세부 장르** (subGenre): 한국어로 짧게 (예: "얼터너티브 록", "J-POP", "인디 팝")

**세션별 숙련도** (sessions):
- vocal, drums, guitar, bass, keyboard, chorus
- 1(완전 입문) ~ 100(전문 연주자 수준)
- 해당 세션이 곡에서 불필요하거나 비중이 없으면 null

각 세션은 아래 스킬을 사용하여 분석한다 (1단계 기술 데이터 추출 → 2단계 루브릭 대입):
- 드럼: `band-drums-difficulty`
- 기타: `band-guitar-difficulty`
- 베이스: `band-bass-difficulty`
- 건반: `band-keyboard-difficulty`
- 보컬 + 코러스: `band-vocal-difficulty`

### Step 5: HTML 파일 생성 및 배포

분석된 전체 곡 목록으로 generateHtml 함수를 호출하여 `docs/index.html`을 생성한다.

```typescript
import { generateHtml } from './src/generateHtml';
import * as fs from 'fs';
const generatedAt = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
const html = generateHtml(songs, generatedAt);
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/index.html', html, 'utf-8');
```

완료 후 아래 순서로 배포한다:

```bash
open docs/index.html   # 브라우저에서 로컬 확인
git add docs/index.html
git commit -m "chore: sync song list"
git push
```

푸시 후 약 1분 뒤 https://soonki-98.github.io/band-difficulty/ 에서 확인 가능.

## 공유 방법

GitHub Pages URL을 Slack에 공유하면 밴드원들이 바로 열람 가능:
https://soonki-98.github.io/band-difficulty/

## 컬럼 구성

보컬, 드럼, 기타, 베이스, 건반, 코러스 (숙련도 1-100, 없으면 -)

## 주의사항

- docs/index.html은 sync 실행 시 덮어쓰기 (항상 최신 데이터)
- credentials, .env, service-account.json 불필요
