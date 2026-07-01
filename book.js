export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { isbn, title } = req.query;
  if (!isbn && !title) {
    return res.status(400).json({ error: 'ISBN 또는 제목이 필요합니다' });
  }

  try {
    let url;
    if (isbn && isbn !== 'warmup') {
      url = `https://dapi.kakao.com/v3/search/book?target=isbn&query=${isbn}`;
    } else if (title) {
      url = `https://dapi.kakao.com/v3/search/book?query=${encodeURIComponent(title)}&size=5`;
    } else {
      return res.status(200).json({ documents: [] });
    }

    const response = await fetch(url, {
      headers: { Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}` },
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
