---
name: band-bass-difficulty
description: Use when scoring bass difficulty for band song sync - extracts bassline pattern and technique data before applying rubric
---

# 베이스 난이도 분석

## 1단계: 기술 데이터 추출

아래 5개 쿼리로 웹 검색하여 항목을 파악한다. 확인 불가이면 "미확인"으로 표시.

**검색 쿼리 (5개 필수):**
1. `{곡명} {아티스트} songsterr bass difficulty` → Songsterr 난이도 태그
2. `{곡명} {아티스트} bass how to play beginner intermediate advanced` → 튜토리얼 레벨
3. `{곡명} {아티스트} bass slap tap technique` → 특수 기법 확인
4. `{곡명} {아티스트} bass BPM notes density` → 속도 및 노트 밀도 확인
5. `{곡명} {아티스트} bass cover easy hard` → 커뮤니티 체감 난이도

**추출 결과를 아래 표로 정리한다:**

| 항목 | 확인 내용 |
|------|----------|
| Songsterr 난이도 태그 | Beginner / Intermediate / Advanced / Expert / 미확인 |
| 패턴 유형 | 루트 노트 중심 / 코드 톤 워킹 / 멜로딕 라인 / 아이코닉 리프 |
| 특수 기법 | 슬랩/팝(단순) / 슬랩/팝(고속·복잡) / 탭핑 / 하모닉스 / 코드 베이스 / 없음 |
| 노트 밀도 | 느린 홀/반음표 중심 / 4분·8분음표 / 16분음표 런 포함 |
| 리듬 복잡도 | 단순 4/4 / 싱코페이션 / 고스트 노트 / 홀수 박자 |
| 커뮤니티 체감 | Easy / Medium / Hard / Very Hard / 미확인 |

## 2단계: 루브릭 대입

| 점수 | 기준 |
|------|------|
| 1~20 | 루트 노트 중심, 홀음표/반음표/4분음표, 포지션 이동 거의 없음, 초단순 반복 패턴 |
| 21~40 | 코드 톤 위주 또는 단순 워킹 베이스, 8분음표 중심, 기초 멜로딕 요소 포함 |
| 41~60 | 멜로딕 라인 또는 아르페지오, 8분~16분음표 혼합, 적당한 속도와 포지션 이동 |
| 61~80 | 아이코닉 리프(정밀도 필요), 단순~중간 슬랩, 빠른 멜로딕 패시지, 싱코페이션·고스트 노트 조합 |
| 81~100 | 극고속 16분음표 런, 고속·복잡 슬랩/팝, 탭핑, 하모닉스, 코드 베이스, 복합 기법 조합 |

> 참고 앵커:
> - Nirvana - Smells Like Teen Spirit: ~15 (루트 노트, BPM 117이지만 단순 4분음표)
> - Green Day - When I Come Around: ~18 (루트 노트 중심, 포지션 이동 최소)
> - The Beatles - Come Together: ~30 (워킹 베이스 요소, 코드 톤, 중간 속도)
> - RHCP - Under the Bridge: ~35 (멜로딕이지만 음표 밀도 낮음)
> - RHCP - Give It Away: ~55 (단순 슬랩, 반복 패턴, 중간 BPM)
> - RHCP - Around the World: ~65 (빠른 슬랩 패턴, 고속 16분음표)
> - Muse - Hysteria: ~70 (빠른 멜로딕 리프, BPM 175, 정밀도·지구력 요구)
> - Jaco Pastorius - Portrait of Tracy: ~90+ (하모닉스, 코드 베이스, 복합 기법)

## 핵심 제약

**제약 1: Songsterr/커뮤니티 레이블 범위 제약 (외부 데이터)**

외부 태그 또는 커뮤니티 체감이 확인된 경우 해당 범위를 준수한다:

| Songsterr 태그 / 커뮤니티 평가 | 점수 범위 |
|-------------------------------|----------|
| Beginner / Easy | 최대 30 |
| Intermediate / Medium | 21~55 |
| Advanced / Hard | 41~75 (최소 41 보장) |
| Expert / Very Hard | 최소 61 |

**제약 2: 기법 최소 점수**

기법이 확인되면 해당 최소 점수 이상으로 채점:
- 탭핑 / 하모닉스 / 코드 베이스 → 최소 71
- 고속·복잡 슬랩/팝 (빠른 16분음표 슬랩, 복잡한 팝 패턴) → 최소 61
- 단순 슬랩/팝 (반복 패턴, 중간 BPM) → 최소 51
- 아이코닉 리프 (정밀도 요구) → 최소 51
- 싱코페이션 + 고스트 노트 조합 → 최소 41
- 멜로딕 라인 또는 워킹 베이스 → 최소 21

**제약 3: 상향 우선**

Songsterr/커뮤니티 레이블 범위와 기법 최소 점수 중 더 높은 값을 채택한다.

**제약 4: 직관 금지**

"쉬운 팝 곡", "밝은 리듬", "입문자 추천" 같은 일반 평판이 위 제약을 override하지 않는다.
