export interface SessionDifficulty {
  vocal: number | null;
  drums: number | null;
  guitar: number | null;
  bass: number | null;
  keyboard: number | null;
  chorus: number | null;
}

export interface SongEntry {
  song: string;
  artist: string;
  mainGenre: string;   // 대분류: 록 | 팝 | 인디
  subGenre: string;    // 소분류: 얼터너티브 록, J-POP, 인디 팝 등
  sessions: SessionDifficulty;
  youtubeUrl: string | null;
  recommender: string;
  recommendedAt: string;
  slackTs: string;
}
