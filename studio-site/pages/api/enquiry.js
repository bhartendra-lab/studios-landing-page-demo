export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, weddingDate, weddingLocation, message } = req.body ?? {};

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const apiBase = process.env.NEXT_PUBLIC_GALLERY_API;
  const studioId = process.env.NEXT_PUBLIC_STUDIO_ID;

  try {
    const upstream = await fetch(`${apiBase}/enquiry/${studioId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, weddingDate, weddingLocation, message }),
    });

    if (!upstream.ok) {
      console.error(`Enquiry upstream error: ${upstream.status} ${upstream.statusText}`);
    }
  } catch (err) {
    console.error('Enquiry forward failed:', err.message);
  }

  return res.status(200).json({ success: true });
}
