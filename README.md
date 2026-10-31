# Biblioteka Rexhep Rushit Jashari — Versioni 16

**Lexim publik online me ruajtje private të materialeve.** Faqja statike dhe kopertinat publikohen në Vercel. PDF-të **nuk** vendosen në GitHub, në Vercel apo në dosje publike.

## Arkitektura
- `index.html`, `images/`: faqja publike me 13 kopertina.
- `books.json`: ID-të e 10 librave dhe numri i faqeve.
- `api/book-info.js`: jep numrin e faqeve.
- `api/page.js`: merr faqen WebP nga **Supabase Storage PRIVATE** përmes çelësit sekret të serverit.
- `scripts/upload_private_pages.py`: shndërron PDF-të në pamje WebP dhe i ngarkon në hapësirën private.

**Kufizim:** pamjet e faqeve transmetohen te shfletuesi dhe mund të ruhen ose fotografohen. Kjo zgjidhje fsheh PDF-të origjinale, por **nuk është DRM** dhe nuk garanton ndalimin e kopjimit.

## Vendosja në punë
1. Krijo një projekt në Supabase dhe një Storage bucket me emrin `faqet-private`, **Public = OFF**.
2. Në Supabase kopjo URL-në e projektit dhe çelësin `service_role`/secret API key. Mos e dërgo në bisedë dhe mos e ngarko në GitHub.
3. Krijo projekt në Vercel nga depoja GitHub `Baki007-cmd/Biblioteka-Rexhep-Jashari`; framework **Other**, root `/`.
4. Te Vercel Project → Settings → Environment Variables shto `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_BUCKET=faqet-private`. Redeploy pas konfigurimit.
5. Në kompjuter krijo dosjen `private-pdfs/` dhe vendos dhjetë PDF-të me emrat që janë në `books.json` (p.sh. `Prekazi_heroik.pdf`).
6. Instalo Python dhe `pip install pymupdf pillow`. Vendos të njëjtat variabla mjedisi **lokalisht**, pastaj ekzekuto `python scripts/upload_private_pages.py private-pdfs`.
7. Provo leximin në adresën e Vercel. Mos përdor GitHub Pages për këtë version: ai nuk ekzekuton `/api/page`.

## Siguria dhe kufizimet
- Çelësi sekret përdoret vetëm në server dhe në skriptin lokal.
- Mos i ngarko PDF-të ose skedarët `.env` në GitHub.
- Vizitorët nuk kanë nevojë të identifikohen; endpoint-i i imazheve është publik dhe mund të përdoret për të marrë faqet një nga një.
- Supabase dhe Vercel mund të kenë kufizime/kosto sipas trafikut dhe madhësisë së librave.
- Nëse PDF-të e vjetra janë publikuar më parë në GitHub, duhet të hiqen veçmas; ky version nuk i fshin ato automatikisht.

## Libri i ri (2023)
`Figura_e_Isa_Boletinit.pdf` (260 faqe) shtohet te `private-pdfs/` në kompjuter dhe ngarkohet me skriptin ekzistues në Supabase private Storage. **Mos e ngarko PDF-në në GitHub.** Kopertina është `images/isa_boletini.png`.

## Figura e Bajram Currit (2023)
`Figura_e_Bajram_Currit.pdf` (177 faqe) vendoset te `private-pdfs/` në kompjuter dhe ngarkohet në Supabase përmes skriptit. Kopertina ekzistuese është `images/book10.jpg`. Mos e ngarko PDF-në në GitHub.

## Përditësimi v17
- Figura e Bajram Currit: 177 faqe, kopertina origjinale `images/book10.jpg`.
- Shaban, Hamzë e Adem Jashari: 429 faqe, kopertina origjinale `images/book12.jpg`.
- PDF-të origjinale nuk përfshihen në ZIP publik; faqet duhen ngarkuar në Supabase private Storage para se të funksionojë leximi online.
