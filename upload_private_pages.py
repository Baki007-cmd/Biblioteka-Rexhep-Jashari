#!/usr/bin/env python3
"""Render local PDFs to WebP pages and upload to a PRIVATE Supabase Storage bucket.
Requires: pip install pymupdf pillow
Environment: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_BUCKET.
Run from project root: python scripts/upload_private_pages.py /path/to/private-pdfs
Never commit the original PDFs, .env, or service-role key.
"""
import os, sys, json, io, urllib.request, urllib.error
from pathlib import Path
import fitz
from PIL import Image

root = Path(__file__).resolve().parent.parent
manifest = json.loads((root/'books.json').read_text(encoding='utf-8'))
pdfdir = Path(sys.argv[1]) if len(sys.argv)>1 else root/'private-pdfs'
base = os.environ.get('SUPABASE_URL','').rstrip('/')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY','')
bucket = os.environ.get('SUPABASE_BUCKET','faqet-private')
if not base or not key:
    sys.exit('Vendos SUPABASE_URL dhe SUPABASE_SERVICE_ROLE_KEY në mjedis.')
if not pdfdir.is_dir():
    sys.exit(f'Dosja nuk ekziston: {pdfdir}')
for book, count in manifest.items():
    path = pdfdir / f'{book}.pdf'
    if not path.exists():
        print(f'Pa PDF: {path.name} — po e anashkaloj')
        continue
    with fitz.open(path) as pdf:
        if len(pdf)!=count:
            sys.exit(f'Numri i faqeve ndryshon për {book}: {len(pdf)} != {count}. Përditëso books.json.')
        print(f'{book}: {count} faqe',flush=True)
        for idx, page in enumerate(pdf,1):
            pix = page.get_pixmap(matrix=fitz.Matrix(1.35,1.35),alpha=False)
            image=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
            buf=io.BytesIO()
            image.save(buf,format='WEBP',quality=77,method=4)
            object_path=f'{book}/{idx:04d}.webp'
            url=f'{base}/storage/v1/object/{bucket}/{object_path}'
            req=urllib.request.Request(url,buf.getvalue(),method='POST',headers={
                'Authorization':f'Bearer {key}','apikey':key,
                'Content-Type':'image/webp','x-upsert':'true'})
            try:
                with urllib.request.urlopen(req,timeout=60) as response: response.read()
            except urllib.error.HTTPError as e:
                sys.exit(f'Gabim {e.code} në {object_path}: {e.read()[:400]!r}')
            if idx%25==0 or idx==count:print(f'  {idx}/{count}',flush=True)
print('Ngarkimi i faqeve përfundoi.')
