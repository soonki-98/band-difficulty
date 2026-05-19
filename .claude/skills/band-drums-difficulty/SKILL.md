---
name: band-drums-difficulty
description: Use when scoring drum difficulty for band song sync - extracts BPM and pattern data before applying rubric
---

# 드럼 난이도 분석

## 1단계: 기술 데이터 추출

웹 검색으로 아래 항목을 파악한다. 확인 불가이면 "미확인"으로 표시.

- **BPM** (숫자): `{곡명} {아티스트} bpm tempo` 검색
- **비트 패턴**: 8비트 / 16비트 / 특수 리듬
- **더블 베이스 페달** 사용 여부
- **복잡한 필** 여부

## 2단계: 루브릭 대입

| 점수 | 기준 |
|------|------|
| 1~20 | 4/4 기본 비트, BPM 80 이하, 단순 필 |
| 21~40 | BPM 80~120, 기본 비트 변형, 간단한 필 |
| 41~60 | BPM 120~160 또는 16비트 패턴, 복잡한 필 |
| 61~80 | BPM 160~200 또는 복잡한 리듬 패턴, 더블 베이스 페달 요소 |
| 81~100 | BPM 200+, 블라스트 비트, 극도로 복잡한 폴리리듬 |

> 참고 예시: Queen - We Will Rock You ~15 / Nirvana - Smells Like Teen Spirit ~25 / Vaundy - Odoriko ≥41 / Muse - Hysteria ~65

## 핵심 제약

1. **BPM이 확인된 경우** 점수는 해당 BPM 밴드의 하한 이상이어야 한다.
   - BPM 80 이하 → 최대 20
   - BPM 80~120 → 21 이상
   - BPM 120~160 → 41 이상
   - BPM 160~200 → 61 이상
   - BPM 200+ → 81 이상
2. **더블 페달 또는 복잡한 패턴** 확인 시 해당 기법 밴드 이상 적용
3. **상향 우선**: 여러 기준 중 더 높은 밴드를 채택
4. **직관 금지**: "쉬운 곡" 평판이 BPM 제약을 override하지 않음
