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
4. 헤더 행 초기화 (최초 1회): `npm run init-sheet`

## 스프레드시트 컬럼 순서

A: 번호, B: 장르, C: 곡명, D: 아티스트, E: 보컬, F: 드럼, G: 기타, H: 베이스, I: 건반, J: 코러스, K: YouTube링크, L: 추천인, M: 추천일시, N: slack_ts (숨김)

## 주의사항

- `service-account.json`과 `.env`는 절대 git에 커밋하지 않는다
- sync.ts는 `slack_ts` 기준으로 중복을 방지하므로 여러 번 실행해도 안전하다
