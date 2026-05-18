import { parseSongReply } from '../src/parseSongReply';

describe('parseSongReply', () => {
  it('올바른 형식의 댓글을 파싱한다', () => {
    const message = `곡명: Time is Running Out\n가수명: Muse\n링크: https://youtu.be/O2IuJPh6h_A`;
    const result = parseSongReply(message, '민순기', '1779083524.870179', '2026-05-18 14:52');
    expect(result).not.toBeNull();
    expect(result!.song).toBe('Time is Running Out');
    expect(result!.artist).toBe('Muse');
    expect(result!.youtubeUrl).toBe('https://youtu.be/O2IuJPh6h_A');
    expect(result!.recommender).toBe('민순기');
    expect(result!.slackTs).toBe('1779083524.870179');
  });

  it('가수명: 형식도 파싱한다', () => {
    const message = `곡명: HAPPY\n가수명: 데이식스\n링크: https://www.youtube.com/watch?v=sWXGbkM0tBI`;
    const result = parseSongReply(message, '박채영', '1779083825.668379', '2026-05-18 14:57');
    expect(result).not.toBeNull();
    expect(result!.artist).toBe('데이식스');
  });

  it('곡명 필드 없으면 null 반환', () => {
    const message = '합주곡을 자유롭게 추천해주시면 감사드리겠습니다';
    const result = parseSongReply(message, '민순기', '1779083403.574619', '2026-05-18 14:50');
    expect(result).toBeNull();
  });

  it('링크 없어도 파싱 성공 (youtubeUrl은 null)', () => {
    const message = `곡명: Butterfly\n가수명: 전영호`;
    const result = parseSongReply(message, '민순기', '1779085691.079469', '2026-05-18 15:28');
    expect(result).not.toBeNull();
    expect(result!.youtubeUrl).toBeNull();
  });

  it('공백 포함 형식(가수명 : ) 파싱', () => {
    const message = `곡명 : No Pain\n가수명 : 실리카겔\n링크 : https://youtu.be/JaIMSzE5yLA`;
    const result = parseSongReply(message, '양호준', '1779084951.244529', '2026-05-18 15:15');
    expect(result).not.toBeNull();
    expect(result!.song).toBe('No Pain');
  });
});
