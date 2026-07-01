export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { isbn } = req.query;
  if (!isbn) {
    return res.status(400).json({ error: 'ISBN이 필요합니다' });
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v3/search/book?target=isbn&query=${isbn}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
        },
      }
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
