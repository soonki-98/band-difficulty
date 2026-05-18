import { SongEntry } from './types';

export function parseSongReply(
  text: string,
  recommender: string,
  slackTs: string,
  recommendedAt: string
): Omit<SongEntry, 'genre' | 'sessions'> | null {
  const songMatch = text.match(/곡명\s*:\s*(.+)/i);
  if (!songMatch) return null;

  const artistMatch = text.match(/가수명\s*:\s*(.+)/i);
  if (!artistMatch) return null;

  const linkMatch = text.match(/링크\s*:\s*(https?:\/\/\S+)/i);

  return {
    song: songMatch[1].trim(),
    artist: artistMatch[1].trim(),
    youtubeUrl: linkMatch ? linkMatch[1].trim() : null,
    recommender,
    recommendedAt,
    slackTs,
  };
}
