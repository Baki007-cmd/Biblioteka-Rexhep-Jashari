# Biblioteka Rexhep Rushit Jashari — Versioni 14

**Lexim publik online me ruajtje private të materialeve.** Faqja statike dhe kopertinat publikohen në Vercel. PDF-të **nuk** vendosen në GitHub, në Vercel apo në dosje publike.

## Arkitektura
- `index.html`, `images/`: faqja publike me 12 kopertina.
- `books.json`: ID-të e 8 librave dhe numri i faqeve.
- `api/book-info.js`: jep numrin e faqeve.
- `api/page.js`: merr faqen WebP nga **Supabase Storage PRIVATE** përmes çelësit sekret të serverit.
- `scripts/upload_private_pages.py`: shndërron PDF-të në pamje WebP dhe i ngarkon në hapësirën private.

**Kufizim:** pamjet e faqeve transmetohen te shfletuesi dhe mund të ruhen ose fotografohen. Kjo zgjidhje fsheh PDF-të origjinale, por **nuk është DRM** dhe nuk garanton ndalimin e kopjimit.

## Vendosja në punë
1. Krijo një projekt në Supabase dhe një Storage bucket me emrin `faqet-private`, **Public = OFF**.
2. Në Supabase kopjo URL-në e projektit dhe çelësin `service_role`/secret API key. Mos e dërgo në bisedë dhe mos e ngarko në GitHub.
3. Krijo projekt në Vercel nga depoja GitHub `Baki007-cmd/Biblioteka-Rexhep-Jashari`; framework **Other**, root `/`.
4. Te Vercel Project → Settings → Environment Variables shto `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_BUCKET=faqet-private`. Redeploy pas konfigurimit.
5. Në kompjuter krijo dosjen `private-pdfs/` dhe vendos tetë PDF-të me emrat që janë në `books.json` (p.sh. `Prekazi_heroik.pdf`).
6. Instalo Python dhe `pip install pymupdf pillow`. Vendos të njëjtat variabla mjedisi **lokalisht**, pastaj ekzekuto `python scripts/upload_private_pages.py private-pdfs`.
7. Provo leximin në adresën e Vercel. Mos përdor GitHub Pages për këtë version: ai nuk ekzekuton `/api/page`.

## Siguria dhe kufizimet
- Çelësi sekret përdoret vetëm në server dhe në skriptin lokal.
- Mos i ngarko PDF-të ose skedarët `.env` në GitHub.
- Vizitorët nuk kanë nevojë të identifikohen; endpoint-i i imazheve është publik dhe mund të përdoret për të marrë faqet një nga një.
- Supabase dhe Vercel mund të kenë kufizime/kosto sipas trafikut dhe madhësisë së librave.
- Nëse PDF-të e vjetra janë publikuar më parë në GitHub, duhet të hiqen veçmas; ky version nuk i fshin ato automatikisht.
