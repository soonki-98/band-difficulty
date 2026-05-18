import { SongEntry } from './types';

export function generateHtml(songs: SongEntry[], generatedAt: string): string {
  const data = songs.map((s, i) => ({
    no: i + 1,
    mainGenre: s.mainGenre,
    subGenre: s.subGenre,
    song: s.song,
    artist: s.artist,
    vocal: s.sessions.vocal ?? '-',
    drums: s.sessions.drums ?? '-',
    guitar: s.sessions.guitar ?? '-',
    bass: s.sessions.bass ?? '-',
    keyboard: s.sessions.keyboard ?? '-',
    chorus: s.sessions.chorus ?? '-',
    youtubeUrl: s.youtubeUrl ?? '',
    recommender: s.recommender,
    recommendedAt: s.recommendedAt,
  }));

  const dataJson = JSON.stringify(data).replace(/<\/script>/gi, '<\\/script>');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>합주곡 목록</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; color: #333; padding: 24px; }
  h1 { font-size: 1.5rem; margin-bottom: 4px; }
  .meta { color: #888; font-size: 0.875rem; margin-bottom: 16px; }
  .filters { margin-bottom: 16px; }
  .filters select { padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 0.875rem; background: white; }
  details { margin-bottom: 16px; }
  summary { cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 0.875rem; color: #555; padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; background: white; user-select: none; }
  summary:hover { background: #f5f5f5; }
  details[open] summary { border-radius: 6px 6px 0 0; border-bottom-color: transparent; }
  .rubric-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; padding: 16px; background: white; border: 1px solid #ddd; border-top: none; border-radius: 0 6px 6px 6px; }
  .rubric-card h3 { font-size: 0.8rem; font-weight: 700; color: #1a1a2e; margin-bottom: 6px; }
  .rubric-card table { width: 100%; border-collapse: collapse; font-size: 0.75rem; }
  .rubric-card td { padding: 3px 6px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
  .rubric-card td:first-child { white-space: nowrap; font-weight: 600; color: #888; width: 72px; }
  .rubric-card tr:last-child td { border-bottom: none; }
  table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  th { background: #1a1a2e; color: white; padding: 10px 12px; text-align: left; font-size: 0.8rem; white-space: nowrap; }
  td { padding: 10px 12px; font-size: 0.875rem; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafafa; }
  .diff { display: inline-block; min-width: 28px; text-align: center; font-weight: 700; font-size: 0.8rem; }
  .diff-none { color: #ccc; font-weight: 400; }
  a.yt { color: #ff0000; text-decoration: none; font-size: 1.1rem; }
  .empty { text-align: center; padding: 40px; color: #aaa; }
</style>
</head>
<body>
<h1>🎸 합주곡 목록</h1>
<p class="meta">생성일시: ${generatedAt} · 총 ${songs.length}곡</p>
<div class="filters">
  <select id="mainGenreFilter" onchange="onMainGenreChange()">
    <option value="">전체 대분류</option>
  </select>
  <select id="subGenreFilter" onchange="filterTable()">
    <option value="">전체 소분류</option>
  </select>
</div>
<details>
  <summary>📊 난이도 기준 (1–100)</summary>
  <div class="rubric-grid">
    <div class="rubric-card">
      <h3>🎤 보컬</h3>
      <table>
        <tr><td>1–20</td><td>단조로운 멜로디, 음역 1옥타브 이내</td></tr>
        <tr><td>21–40</td><td>1~1.5옥타브, 보통 템포, 기초 호흡</td></tr>
        <tr><td>41–60</td><td>1.5~2옥타브, 남성 G4/여성 C5 내외</td></tr>
        <tr><td>61–80</td><td>고음 다수 (남성 A4~B4), 팔세토/벨팅</td></tr>
        <tr><td>81–100</td><td>극고음 (남성 C5+), 멜리스마/런</td></tr>
      </table>
    </div>
    <div class="rubric-card">
      <h3>🥁 드럼</h3>
      <table>
        <tr><td>1–20</td><td>4/4 기본 비트, BPM 80 이하</td></tr>
        <tr><td>21–40</td><td>BPM 80~120, 기본 비트 변형</td></tr>
        <tr><td>41–60</td><td>BPM 120~160, 16비트 패턴</td></tr>
        <tr><td>61–80</td><td>BPM 160+, 복잡한 패턴/더블 베이스</td></tr>
        <tr><td>81–100</td><td>BPM 200+, 블라스트 비트/폴리리듬</td></tr>
      </table>
    </div>
    <div class="rubric-card">
      <h3>🎸 기타</h3>
      <table>
        <tr><td>1–20</td><td>오픈 코드, 단순 스트러밍</td></tr>
        <tr><td>21–40</td><td>바레 코드, 간단한 리프</td></tr>
        <tr><td>41–60</td><td>복잡한 보이싱, 중간 난이도 솔로</td></tr>
        <tr><td>61–80</td><td>빠른 솔로, 태핑/슬라이드</td></tr>
        <tr><td>81–100</td><td>극도의 속주, 스윕 피킹</td></tr>
      </table>
    </div>
    <div class="rubric-card">
      <h3>🎸 베이스</h3>
      <table>
        <tr><td>1–20</td><td>루트 노트 중심, 단순 패턴</td></tr>
        <tr><td>21–40</td><td>단순 멜로딕 베이스라인</td></tr>
        <tr><td>41–60</td><td>멜로딕 베이스라인, 적당한 속도</td></tr>
        <tr><td>61–80</td><td>아이코닉 리프, 슬랩 베이스</td></tr>
        <tr><td>81–100</td><td>극도로 기술적 (Flea 수준)</td></tr>
      </table>
    </div>
    <div class="rubric-card">
      <h3>🎹 건반</h3>
      <table>
        <tr><td>1–20</td><td>단순 코드 패드, 분위기용</td></tr>
        <tr><td>21–40</td><td>단순 멜로디 또는 코드 진행</td></tr>
        <tr><td>41–60</td><td>중요한 멜로딕 파트, 적당한 기술</td></tr>
        <tr><td>61–80</td><td>복잡한 피아노 파트, 아르페지오</td></tr>
        <tr><td>81–100</td><td>클래식 수준 피아노 파트</td></tr>
      </table>
    </div>
    <div class="rubric-card">
      <h3>🎵 코러스</h3>
      <table>
        <tr><td>없음</td><td>코러스 파트 없거나 비중 매우 낮음</td></tr>
        <tr><td>1–20</td><td>단순 유니즌 백킹 보컬</td></tr>
        <tr><td>21–40</td><td>기본 화음 (3도/5도)</td></tr>
        <tr><td>41–60</td><td>복잡한 하모니, 2~3파트</td></tr>
        <tr><td>61–100</td><td>복잡한 하모니, 넓은 음역</td></tr>
      </table>
    </div>
  </div>
</details>
<table>
  <thead>
    <tr>
      <th>#</th><th>대분류</th><th>장르</th><th>곡명</th><th>아티스트</th>
      <th>보컬</th><th>드럼</th><th>기타</th><th>베이스</th><th>건반</th><th>코러스</th>
      <th>YT</th><th>추천인</th><th>추천일시</th>
    </tr>
  </thead>
  <tbody id="tbody"></tbody>
</table>
<script>
const songs = ${dataJson};
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function diffCell(v) {
  if (v === '-') return '<span class="diff diff-none">-</span>';
  var n = Number(v);
  // green(120°) → yellow(60°) → red(0°) based on 1-100 scale
  var hue = Math.round(120 - (n - 1) / 99 * 120);
  var color = 'hsl(' + hue + ',85%,40%)';
  return '<span class="diff" style="color:' + color + '">' + v + '</span>';
}
function render(list) {
  const tbody = document.getElementById('tbody');
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="14" class="empty">데이터가 없습니다</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(s =>
    '<tr>' +
    '<td>' + s.no + '</td><td>' + esc(s.mainGenre) + '</td><td>' + esc(s.subGenre) + '</td>' +
    '<td>' + esc(s.song) + '</td><td>' + esc(s.artist) + '</td>' +
    '<td>' + diffCell(s.vocal) + '</td><td>' + diffCell(s.drums) + '</td>' +
    '<td>' + diffCell(s.guitar) + '</td><td>' + diffCell(s.bass) + '</td>' +
    '<td>' + diffCell(s.keyboard) + '</td><td>' + diffCell(s.chorus) + '</td>' +
    '<td>' + (s.youtubeUrl && s.youtubeUrl.startsWith('https://') ? '<a class="yt" href="' + esc(s.youtubeUrl) + '" target="_blank">▶</a>' : '') + '</td>' +
    '<td>' + esc(s.recommender) + '</td><td>' + esc(s.recommendedAt) + '</td>' +
    '</tr>'
  ).join('');
}
function onMainGenreChange() {
  const mainGenre = document.getElementById('mainGenreFilter').value;
  const subSel = document.getElementById('subGenreFilter');
  subSel.innerHTML = '<option value="">전체 소분류</option>';
  const subGenres = [...new Set(
    songs
      .filter(s => !mainGenre || s.mainGenre === mainGenre)
      .map(s => s.subGenre)
  )].sort();
  subGenres.forEach(g => { const o = document.createElement('option'); o.value = g; o.textContent = g; subSel.appendChild(o); });
  filterTable();
}
function filterTable() {
  const mainGenre = document.getElementById('mainGenreFilter').value;
  const subGenre = document.getElementById('subGenreFilter').value;
  render(songs.filter(s =>
    (!mainGenre || s.mainGenre === mainGenre) &&
    (!subGenre || s.subGenre === subGenre)
  ));
}
const mainGenres = [...new Set(songs.map(s => s.mainGenre))].sort();
const mainSel = document.getElementById('mainGenreFilter');
mainGenres.forEach(g => { const o = document.createElement('option'); o.value = g; o.textContent = g; mainSel.appendChild(o); });
render(songs);
</script>
</body>
</html>`;
}
