---
name: band-guitar-difficulty
description: Use when scoring guitar difficulty for band song sync - extracts chord change speed, riff complexity, and solo technique data before applying rubric
---

# 기타 난이도 분석

## 1단계: 기술 데이터 추출

아래 5개 쿼리로 웹 검색하여 항목을 파악한다. 확인 불가이면 "미확인"으로 표시.

**검색 쿼리 (5개 필수):**
1. `{곡명} {아티스트} ultimate guitar tab difficulty rating` → UG 난이도 태그
2. `{곡명} {아티스트} guitar tutorial beginner intermediate advanced` → 튜토리얼 레벨
3. `{곡명} {아티스트} guitar riff technique speed bpm` → 리프 속도/기법
4. `{곡명} {아티스트} guitar solo tapping sweep picking technique` → 솔로/특수 기법
5. `{곡명} {아티스트} guitar cover easy hard difficulty` → 커뮤니티 체감 난이도

**추출 결과를 아래 표로 정리한다:**

| 항목 | 확인 내용 |
|------|----------|
| UG 난이도 태그 | Beginner / Intermediate / Advanced / Expert / 미확인 |
| 코드 종류 | 오픈 코드 / 바레 코드 / 복잡한 보이싱 / 없음(리프 위주) |
| 코드 체인지 속도 | 느림(2박+) / 보통(1박) / 빠름(반박 이하) / 해당없음 |
| 리프 복잡도 | 없음 / 단순(루트 노트형) / 멜로딕(중간 속도) / 빠른 얼터네이트 피킹 |
| 솔로 수준 | 없음 / 짧고 단순 / 멜로딕 중간 / 빠른 속주 |
| 특수 기법 | 태핑 / 스윕 피킹 / 핑거피킹(복잡 아르페지오) / 슬라이드·비브라토 조합 / 없음 |
| 커뮤니티 체감 | Easy / Medium / Hard / Very Hard / 미확인 |

## 2단계: 루브릭 대입

| 점수 | 코드 / 반주 | 리프 | 솔로 |
|------|-----------|------|------|
| 1~20 | 오픈 코드, 느린 체인지, 단순 스트러밍 | 없거나 단순 루트 노트 | 없음 |
| 21~40 | 바레 코드 포함, 보통 체인지 속도 | 단순 멜로딕 리프 | 없음 또는 짧고 단순 |
| 41~60 | 바레 코드 빠른 체인지 또는 복잡 보이싱 | 멜로딕 리프 (얼터네이트 피킹 필요) | 짧은 멜로딕 솔로 |
| 61~80 | 복잡 보이싱 빠른 체인지 | 빠른 리프 (고속 얼터네이트 피킹) | 속주 솔로, 태핑 포함 |
| 81~100 | — | 극도로 빠른 리프 + 고급 기법 조합 | 스윕 피킹, 양손 태핑, 극속 |

> 참고 앵커 (각 점수가 나오는 기술 근거):
> - The Beatles - Let It Be: ~15 (오픈 코드 G·C·D·Em, 체인지 느림, 리프 없음)
> - Oasis - Wonderwall: ~20 (오픈 코드 Em7·G·Dsus4, 단순 스트러밍 패턴)
> - Green Day - When I Come Around: ~30 (바레 코드 G·D·Em·C, 단순 4코드 리프)
> - Nirvana - Come As You Are: ~35 (3현 단순 리프, 체인지 단순, 솔로 없음)
> - Bump of Chicken - 天体観測: ~38 (바레 코드 포함, 단순 리프, 솔로 없음)
> - Vaundy - Odoriko: ~42 (빠른 스트러밍, 간단 리프, BPM 157)
> - Guns N' Roses - Sweet Child O' Mine (리프): ~52 (16분음표 아르페지오 리프, BPM 125 얼터네이트 피킹)
> - Metallica - Master of Puppets (인트로 리프): ~65 (BPM 212 다운피킹, 고속 얼터네이트 피킹 교대)
> - Led Zeppelin - Stairway to Heaven (솔로): ~75 (멜로딕 솔로 + 빠른 펜타토닉 런)
> - Van Halen - Eruption: ~95 (양손 태핑, 스윕 아르페지오, 극속 레가토)

## 핵심 제약

**제약 1: UG 레이블 범위 제약 (외부 데이터)**

UG 태그 또는 커뮤니티 체감이 확인된 경우 해당 범위를 준수한다:

| UG 태그 / 커뮤니티 평가 | 점수 범위 |
|------------------------|----------|
| Beginner / Easy | 1~30 |
| Intermediate / Medium | 26~55 |
| Advanced / Hard | 46~78 (최소 46 보장) |
| Expert / Very Hard | 66~100 (최소 66 보장) |

**제약 2: 기법 최소 점수**

기법이 확인되면 해당 최소 점수 이상으로 채점:
- 스윕 피킹 / 양손 태핑 → 최소 75
- 태핑 / BPM 160+ 에서 16분음표 속주 솔로 → 최소 61
- BPM 120+ 에서 16분음표 속주 솔로 → 최소 51
- 멜로딕 솔로 / 빠른 얼터네이트 피킹 리프 → 최소 41
- 복잡한 아르페지오 핑거피킹 → 최소 25
- 바레 코드 / 단순 핑거피킹 → 최소 21

**제약 3: 코드 체인지 속도 보정**

- 바레 코드를 반박(8분음표) 이하 속도로 체인지 → 해당 밴드 내 상위 점수 채택
- 복잡한 보이싱을 빠르게 전환 → 해당 밴드 상한 근처로 책정

**제약 4: 상향 우선**

UG 레이블 범위와 기법 최소 점수 중 더 높은 값을 채택한다.

**제약 5: 직관 금지**

"쉬운 J-POP", "밝은 느낌" 등 일반 평판이 위 제약을 override하지 않는다.
