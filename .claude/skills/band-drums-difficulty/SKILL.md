---
name: band-drums-difficulty
description: Use when scoring drum difficulty for band song sync - extracts BPM and pattern data before applying rubric
---

# 드럼 난이도 분석

## 1단계: 기술 데이터 추출

아래 5개 쿼리로 웹 검색하여 항목을 파악한다. 확인 불가이면 "미확인"으로 표시.

**검색 쿼리 (5개 필수):**
1. `{곡명} {아티스트} bpm tempo` → BPM 확인
2. `{곡명} {아티스트} drum tutorial beginner intermediate advanced` → 튜토리얼 레벨
3. `{곡명} {아티스트} drum sheet music difficulty` → 악보 복잡도
4. `{곡명} {아티스트} drum double bass blast beat polyrhythm` → 특수 기법
5. `{곡명} {아티스트} drum cover easy hard` → 커뮤니티 체감

**추출 결과를 아래 표로 정리한다:**

| 항목 | 확인 내용 |
|------|----------|
| BPM | 숫자 / 미확인 |
| 비트 패턴 | 4/4 기본 / 8비트 / 16비트 / 싱코페이션 / 폴리리듬 / 박자 변환 |
| 더블 베이스 페달 | 없음 / 간헐적 / 연속 빠른 |
| 필 복잡도 | 없음 / 단순(8비트) / 중간(16비트) / 복잡(고속 연타) |
| 튜토리얼 레벨 | Beginner / Intermediate / Advanced / Expert / 미확인 |
| 커뮤니티 체감 | Easy / Medium / Hard / Very Hard / 미확인 |

## 2단계: 루브릭 대입

| 점수 | 기준 |
|------|------|
| 1~20 | 4/4 기본 비트, BPM 80 이하, 단순 필 |
| 21~40 | BPM 80~120, 기본 비트 변형, 간단한 필 |
| 41~60 | BPM 120~160 또는 16비트 패턴, 복잡한 필 |
| 61~80 | BPM 160~200 또는 복잡한 리듬 패턴, 더블 베이스 페달 요소 |
| 81~100 | BPM 200+, 블라스트 비트, 극도로 복잡한 폴리리듬 |

> 참고 앵커:
> - Queen - We Will Rock You: ~15 (BPM 81, 극히 단순한 패턴)
> - The Beatles - Let It Be: ~18 (BPM 73, 매우 단순)
> - Nirvana - Smells Like Teen Spirit: ~25 (BPM 117, 기본 비트, 단순 필)
> - Green Day - Basket Case: ~32 (BPM 172이지만 패턴 단순, 펑크 스트레이트)
> - Vaundy - Odoriko: ≥41 (BPM 157, 기본 16비트)
> - System of a Down - Chop Suey: ~55 (박자 변환, 복잡한 필)
> - Tool - Schism: ~62 (복잡한 박자 변환, 폴리리듬)
> - Muse - Hysteria: ~65 (BPM 175, 복잡한 패턴)
> - Slayer - Raining Blood: ~88 (BPM 220+, 블라스트 비트)

## 핵심 제약

**제약 1: BPM 제약**

BPM이 확인된 경우 점수는 해당 BPM 밴드의 하한 이상이어야 한다:
- BPM 80 이하 → 최대 20
- BPM 80~120 → 21 이상
- BPM 120~160 → 41 이상
- BPM 160~200 → 61 이상
- BPM 200+ → 81 이상

**제약 2: 외부 레이블 범위 제약**

기타의 UG 태그 제약과 동일하게, 튜토리얼/커뮤니티 평가가 확인된 경우 해당 범위를 준수한다:

| 튜토리얼/커뮤니티 평가 | 점수 범위 |
|----------------------|----------|
| Beginner / Easy | 최대 30 |
| Intermediate / Medium | 21~55 |
| Advanced / Hard | 41~75 (최소 41 보장) |
| Expert / Very Hard | 최소 61 |

**제약 3: 기법 최소 점수**

기법이 확인되면 해당 최소 점수 이상으로 채점:
- 블라스트 비트 → 최소 81
- 더블 베이스 페달 (연속, 빠른 16분음표) → 최소 61
- 더블 베이스 페달 (간헐적/악센트) → 최소 41
- 복잡한 폴리리듬 / 박자 변환 → 최소 51
- 복잡한 필 (고속 16비트 연타) → 최소 41

**제약 4: 상향 우선**

BPM 제약, 외부 레이블 범위, 기법 최소 점수 중 더 높은 값을 채택한다.

**제약 5: 직관 금지**

"쉬운 곡", "밝은 느낌", "입문자 추천" 같은 일반적 평판이 위 제약을 override하지 않는다.
