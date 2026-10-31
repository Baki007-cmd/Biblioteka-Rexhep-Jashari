const books = require('../books.json');
module.exports = (req,res) => {
  const book = String(req.query.book || '');
  if (!Object.prototype.hasOwnProperty.call(books, book)) return res.status(404).json({error:'Libri nuk u gjet'});
  res.setHeader('Cache-Control','public, max-age=3600');
  return res.status(200).json({pages:books[book]});
};
