import { SongEntry } from './types';

export function generateHtml(songs: SongEntry[], generatedAt: string): string {
  const data = songs.map((s, i) => ({
    no: i + 1,
    genre: s.genre,
    song: escapeForJson(s.song),
    artist: escapeForJson(s.artist),
    vocal: s.sessions.vocal ?? '-',
    drums: s.sessions.drums ?? '-',
    guitar: s.sessions.guitar ?? '-',
    bass: s.sessions.bass ?? '-',
    keyboard: s.sessions.keyboard ?? '-',
    chorus: s.sessions.chorus ?? '-',
    youtubeUrl: s.youtubeUrl ?? '',
    recommender: escapeForJson(s.recommender),
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
  table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  th { background: #1a1a2e; color: white; padding: 10px 12px; text-align: left; font-size: 0.8rem; white-space: nowrap; }
  td { padding: 10px 12px; font-size: 0.875rem; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafafa; }
  .diff { display: inline-block; width: 20px; text-align: center; font-weight: 700; }
  .diff-1 { color: #22c55e; } .diff-2 { color: #84cc16; } .diff-3 { color: #eab308; }
  .diff-4 { color: #f97316; } .diff-5 { color: #ef4444; }
  .diff-none { color: #ccc; font-weight: 400; }
  a.yt { color: #ff0000; text-decoration: none; font-size: 1.1rem; }
  .empty { text-align: center; padding: 40px; color: #aaa; }
</style>
</head>
<body>
<h1>🎸 합주곡 목록</h1>
<p class="meta">생성일시: ${generatedAt} · 총 ${songs.length}곡</p>
<div class="filters">
  <select id="genreFilter" onchange="filterTable()">
    <option value="">전체 장르</option>
  </select>
</div>
<table>
  <thead>
    <tr>
      <th>#</th><th>장르</th><th>곡명</th><th>아티스트</th>
      <th>보컬</th><th>드럼</th><th>기타</th><th>베이스</th><th>건반</th><th>코러스</th>
      <th>YT</th><th>추천인</th><th>추천일시</th>
    </tr>
  </thead>
  <tbody id="tbody"></tbody>
</table>
<script>
const songs = ${dataJson};
function diffCell(v) {
  if (v === '-') return '<span class="diff diff-none">-</span>';
  return '<span class="diff diff-' + v + '">' + v + '</span>';
}
function render(list) {
  const tbody = document.getElementById('tbody');
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="13" class="empty">데이터가 없습니다</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(s =>
    '<tr>' +
    '<td>' + s.no + '</td><td>' + s.genre + '</td><td>' + s.song + '</td><td>' + s.artist + '</td>' +
    '<td>' + diffCell(s.vocal) + '</td><td>' + diffCell(s.drums) + '</td>' +
    '<td>' + diffCell(s.guitar) + '</td><td>' + diffCell(s.bass) + '</td>' +
    '<td>' + diffCell(s.keyboard) + '</td><td>' + diffCell(s.chorus) + '</td>' +
    '<td>' + (s.youtubeUrl ? '<a class="yt" href="' + s.youtubeUrl + '" target="_blank">▶</a>' : '') + '</td>' +
    '<td>' + s.recommender + '</td><td>' + s.recommendedAt + '</td>' +
    '</tr>'
  ).join('');
}
function filterTable() {
  const genre = document.getElementById('genreFilter').value;
  render(genre ? songs.filter(s => s.genre === genre) : songs);
}
const genres = [...new Set(songs.map(s => s.genre))].sort();
const sel = document.getElementById('genreFilter');
genres.forEach(g => { const o = document.createElement('option'); o.value = g; o.textContent = g; sel.appendChild(o); });
render(songs);
</script>
</body>
</html>`;
}

function escapeForJson(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
