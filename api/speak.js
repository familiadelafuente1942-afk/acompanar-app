export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { text, voice_id } = req.body;
    const VOICE = voice_id || "pMsXgVXv3BLzUgSXRplE";
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY || "sk_ebc98bbf603b7750baa8d07e1515cfadc8a323536a763d55",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.25, similarity_boost: 0.90, style: 0.75 }
        }),
      }
    );
    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.end(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
