# Band Song Sheet

Slack #club_band 합주곡 추천 스레드의 댓글을 분석하여 Google Sheets로 동기화하는 프로젝트.
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
- `링크\s*:\s*(https?://\S+)` → youtubeUrl (없으면 빈 문자열)

곡명 또는 가수명이 없으면 skip (안내 댓글, 일반 대화 등 제외).

### Step 3: AI 분석

파싱된 각 곡에 대해 아래 정보를 추론한다.

**장르** (genre): 한국어로 짧게 (예: "얼터너티브 록", "J-POP", "인디")

**세션별 숙련도** (sessions): 이 곡을 연주하는 데 필요한 기술 수준
- vocal, drums, guitar, bass, keyboard, chorus
- 1(매우 쉬움) ~ 5(매우 어려움)
- 해당 세션이 곡에서 불필요하거나 비중이 없으면 `-`

밴드 세션: 보컬(vocal), 드럼(drums), 기타(guitar), 베이스(bass), 건반(keyboard), 코러스(chorus)

### Step 4: Google Sheet 생성

분석된 전체 곡 목록을 CSV로 만들고 `mcp__claude_ai_Google_Drive__create_file`로 새 Google Sheets 파일을 생성한다.

**CSV 헤더 (고정):**
```
번호,장르,곡명,아티스트,보컬,드럼,기타,베이스,건반,코러스,YouTube링크,추천인,추천일시
```

**create_file 파라미터:**
- `title`: `합주곡 목록 YYYY-MM-DD` (싱크 날짜 포함)
- `contentMimeType`: `text/csv`
- `textContent`: CSV 전체 내용 (헤더 + 데이터 행)

완료 후 생성된 파일의 URL을 사용자에게 전달한다.

## 컬럼 순서

| 열 | 헤더 | 내용 |
|---|---|---|
| A | 번호 | 1부터 순차 증가 |
| B | 장르 | AI 추론 |
| C | 곡명 | Slack 파싱 |
| D | 아티스트 | Slack 파싱 |
| E | 보컬 | 1-5 또는 `-` |
| F | 드럼 | 1-5 또는 `-` |
| G | 기타 | 1-5 또는 `-` |
| H | 베이스 | 1-5 또는 `-` |
| I | 건반 | 1-5 또는 `-` |
| J | 코러스 | 1-5 또는 `-` |
| K | YouTube링크 | Slack 파싱 |
| L | 추천인 | Slack display_name |
| M | 추천일시 | KST (YYYY-MM-DD HH:mm) |

## 주의사항

- 싱크할 때마다 새 Google Sheet가 생성된다 (이전 시트는 그대로 유지)
- credentials, .env, service-account.json 불필요
