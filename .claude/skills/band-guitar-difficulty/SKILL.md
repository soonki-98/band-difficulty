---
name: band-guitar-difficulty
description: Use when scoring guitar difficulty for band song sync - extracts chord complexity and technique data before applying rubric
---

# 기타 난이도 분석

## 1단계: 기술 데이터 추출

웹 검색으로 아래 항목을 파악한다. 확인 불가이면 "미확인"으로 표시.

- **코드 종류**: 오픈 코드 / 바레 코드 / 복잡한 보이싱
- **솔로 유무**: 있으면 속도·복잡도 파악
- **특수 기법**: 태핑 / 스윕 피킹 / 슬라이드 / 복잡한 리프 여부
- 검색 쿼리: `{곡명} {아티스트} guitar tab difficulty`

## 2단계: 루브릭 대입

| 점수 | 기준 |
|------|------|
| 1~20 | 오픈 코드, 단순 스트러밍/피킹 |
| 21~40 | 바레 코드, 간단한 리프, 솔로 없음 |
| 41~60 | 복잡한 코드 보이싱 또는 중간 난이도 솔로, 얼터네이트 피킹 |
| 61~80 | 빠른 솔로, 태핑/슬라이드 등 고급 기법, 아이코닉한 복잡한 리프 |
| 81~100 | 극도의 속주, 스윕 피킹, 매우 복잡한 기법 |

> 참고 예시: Oasis - Wonderwall ~20 / Guns N' Roses - Sweet Child O' Mine (리프) ~55 / Van Halen - Eruption ~95

## 핵심 제약

1. **특수 기법 확인 시** 해당 기법이 속하는 밴드 이상 적용
   - 태핑 / 스윕 피킹 → 최소 61
   - 복잡한 솔로 → 최소 41
2. **상향 우선**: 여러 기준 중 더 높은 밴드를 채택
3. **직관 금지**: "쉬운 J-POP" 같은 인상이 기법 제약을 override하지 않음
