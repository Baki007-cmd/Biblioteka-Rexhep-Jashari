const books = require('../books.json');
module.exports = async (req,res) => {
  const book = String(req.query.book || '');
  const page = Number(req.query.page);
  if (!Object.prototype.hasOwnProperty.call(books,book) || !Number.isInteger(page) || page<1 || page>books[book]) {
    return res.status(404).send('Faqja nuk u gjet');
  }
  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_BUCKET || 'faqet-private';
  if (!base || !key) return res.status(503).send('Ruajtja private nuk është konfiguruar ende');
  try {
    const object = `${book}/${String(page).padStart(4,'0')}.webp`;
    const url = `${base.replace(/\\/$/,'')}/storage/v1/object/authenticated/${encodeURIComponent(bucket)}/${object}`;
    const response = await fetch(url, {headers:{Authorization:`Bearer ${key}`,apikey:key},signal:AbortSignal.timeout(15000)});
    if (!response.ok) return res.status(response.status===404?404:502).send('Faqja nuk është e disponueshme');
    res.setHeader('Content-Type','image/webp');
    res.setHeader('Cache-Control','private, no-store');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Content-Disposition','inline');
    return res.status(200).send(Buffer.from(await response.arrayBuffer()));
  } catch(e) {return res.status(502).send('Gabim gjatë ngarkimit të faqes');}
};
