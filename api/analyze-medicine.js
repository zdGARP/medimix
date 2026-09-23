import { processMedicineImagesWithGemini } from '../server/geminiHandler.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { images } = req.body || {};
    const result = await processMedicineImagesWithGemini(images || []);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
