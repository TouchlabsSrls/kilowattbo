Repository pronto per deploy via Plesk.

Usa `html/` come document root in Plesk (`httpdocs` o cartella equivalente).

Contenuto pubblicabile:
- `html/*.html`
- `html/assets/`
- `html/robots.txt`
- `html/sitemap.xml`

Contenuto escluso dal push:
- file di lavoro locali
- configurazione Docker
- eventuali asset temporanei non usati

Workflow consigliato:
1. punta Plesk alla root Git del repository
2. imposta `html/` come document root del dominio
3. esegui il pull dal pannello Plesk

Se in futuro modifichi il sito nella root del progetto, ricopia i file aggiornati dentro `html/` prima del push.
