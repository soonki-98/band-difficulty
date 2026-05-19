---
name: band-bass-difficulty
description: Use when scoring bass difficulty for band song sync - extracts bassline pattern and technique data before applying rubric
---

# 베이스 난이도 분석

## 1단계: 기술 데이터 추출

웹 검색으로 아래 항목을 파악한다. 확인 불가이면 "미확인"으로 표시.

- **패턴 유형**: 루트 노트 중심 / 멜로딕 / 아이코닉 리프
- **슬랩 베이스** 여부
- **리프 복잡도**: 아이코닉하거나 빠른 리프 여부
- 검색 쿼리: `{곡명} {아티스트} bass tab`

## 2단계: 루브릭 대입

| 점수 | 기준 |
|------|------|
| 1~20 | 루트 노트 중심, 단순 패턴 |
| 21~40 | 단순 멜로딕 베이스라인, 약간의 움직임 |
| 41~60 | 멜로딕 베이스라인, 적당한 속도 |
| 61~80 | 아이코닉/복잡한 리프, 슬랩 베이스 |
| 81~100 | 극도로 빠르거나 기술적 (Flea/Victor Wooten 수준) |

> 참고 예시: 단순 팝 루트 노트 ~20 / Rage Against The Machine - Bombtrack ~55 / Muse - Time Is Running Out ~65

## 핵심 제약

1. **슬랩 베이스 확인 시** 최소 61 적용
2. **아이코닉 리프 확인 시** 최소 61 적용
3. **상향 우선**: 여러 기준 중 더 높은 밴드를 채택
4. **직관 금지**: 곡의 전반적 분위기가 베이스 기술 수준을 override하지 않음
