const books = require('../books.json');

module.exports = async (req, res) => {
  const book = String(req.query.book || '');
  const page = Number(req.query.page);

  if (!Object.prototype.hasOwnProperty.call(books, book) ||
      !Number.isInteger(page) || page < 1 || page > books[book]) {
    return res.status(404).send('Faqja nuk u gjet');
  }

  const base = (process.env.SUPABASE_URL || '').trim().replace(/\/$/, '');
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const bucket = (process.env.SUPABASE_BUCKET || 'faqet-private').trim();

  if (!base || !key) {
    console.error('Supabase configuration missing: URL or service role key');
    return res.status(503).send('Ruajtja private nuk është konfiguruar ende');
  }

  const object = `${book}/${String(page).padStart(4, '0')}.webp`;
  const url = `${base}/storage/v1/object/authenticated/${encodeURIComponent(bucket)}/${object}`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${key}`, apikey: key },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      // Log status only; never expose credentials or internal response details.
      console.error('Supabase Storage request failed', {
        status: response.status, book, page, bucket
      });
      return res.status(502).send('Faqja nuk është e disponueshme');
    }

    const data = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', 'inline');
    return res.status(200).send(data);
  } catch (error) {
    console.error('Supabase Storage connection error', {
      name: error?.name || 'Error', book, page
    });
    return res.status(502).send('Gabim gjatë ngarkimit të faqes');
  }
};
