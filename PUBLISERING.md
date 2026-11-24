# Slik publiserer du testen på GitHub Pages

Dette tar omtrent 15 minutter første gang. Du trenger bare en nettleser, og ingenting skal installeres.
Det går fint å gjøre dette fra en privat PC. Kopier i så fall hele mappa `Personlighetstest` dit først
(via OneDrive eller en minnepinne).

---

## 1. Lag en GitHub-konto
1. Gå til **https://github.com/signup**.
2. Skriv inn e-post, et passord og et **brukernavn**.
   - Brukernavnet blir en del av adressen til siden: `https://BRUKERNAVN.github.io/...`
   - Velg noe du er komfortabel med at andre ser.
3. Bekreft e-posten med koden GitHub sender deg.

## 2. Lag en «repository» (en mappe på GitHub)
1. Når du er logget inn: Trykk **+** øverst til høyre, og velg **New repository**.
2. **Repository name:** `personlighetstest`
3. Velg **Public**. Det er nødvendig for at Pages skal være gratis. Filene inneholder ingenting personlig.
4. La resten stå som det er, og trykk **Create repository**.

## 3. Last opp filene
1. På siden som nå vises, trykk lenken **uploading an existing file** (midt på siden).
2. Åpne mappa `Personlighetstest` i Filutforsker.
3. Merk **alt** i mappa (Ctrl+A), altså både filene og mappene `css`, `data`, `fonts` og `js`.
4. **Dra** det du har merket inn i det store feltet i nettleseren. Mappene blir med, med innholdet sitt.
5. Vent til alle filene er listet opp under feltet.
6. Nederst, under «Commit changes»: Skriv for eksempel `Første versjon`, og trykk den grønne knappen **Commit changes**.
7. Sjekk at du ser mappene `css`, `data`, `fonts` og `js` og filene `index.html`, `resultat.html` og `par.html` i lista.

> Mangler mappene? Noen nettlesere tar ikke med mapper når du drar. Trykk da **Add file → Upload files**
> og dra hver mappe inn for seg.

## 4. Slå på GitHub Pages
1. Trykk **Settings** (tannhjulet i menyen øverst i repositoryet).
2. Velg **Pages** i menyen til venstre.
3. Under **Build and deployment**, ved **Source**: velg **Deploy from a branch**.
4. Under **Branch**: velg **main** og **/ (root)**, og trykk **Save**.
5. Vent 1–3 minutter og last siden på nytt. Øverst står det nå
   **«Your site is live at https://BRUKERNAVN.github.io/personlighetstest/»**.

## 5. Sjekk at alt virker
1. Åpne `https://BRUKERNAVN.github.io/personlighetstest/tester.html`. Du skal se den grønne boksen «Alle … tester bestod ✓».
2. Åpne `https://BRUKERNAVN.github.io/personlighetstest/index.html?demo` og prøv demoen med Ingrid eller Erik.
3. Åpne `https://BRUKERNAVN.github.io/personlighetstest/` på mobilen.

**Tips: Legg siden på hjemskjermen**, så åpnes den som en app:
- **iPhone (Safari):** Trykk Del-knappen og velg **Legg til på Hjem-skjerm**.
- **Android (Chrome):** Trykk ⋮ og velg **Legg til på startsiden**.

## 6. Ta testen
1. Ta testen hver for dere, på hver deres telefon. Dere kan ta pause når som helst.
   **Bruk en vanlig fane (ikke privat), og samme nettleser hele veien.** Tar dere testen fra hjemskjermen,
   fortsett derfra, og ikke fjern snarveien underveis.
   Når du er ferdig: **Ta vare på resultatet** med **Send lenken til meg selv** eller **Last ned som fil**.
   Forsvinner det fra telefonen, åpner du det igjen under **Har du en kode, lenke eller fil fra før?** på forsiden.
2. Når dere er ferdige: Trykk **Kopier koden** eller **Del lenke til resultatet** og send den til hverandre.
3. Åpne **parsiden** (lenken nederst på forsiden eller i rapporten). Egen kode fylles inn automatisk,
   og partnerens kode limer du inn.
4. Vil dere gå dypere, trykk **Kopier tekst til Claude** nederst i parrapporten og lim teksten inn i en ny Claude-samtale.

## Hvis du vil endre noe senere
1. Gå inn i riktig mappe i repositoryet (for eksempel `data`).
2. Trykk **Add file → Upload files**, dra inn den endrede fila og trykk **Commit changes**.
   Fila med samme navn blir erstattet.
3. Endringen er ute etter et minutt eller to. Last siden på nytt på mobilen (eventuelt to ganger).
   Ser du fortsatt gammel versjon, vent 10 minutter. Ikke slett nettleserdata og ikke fjern hjemskjermsnarveien
   før resultatet er lagret et annet sted.

Endringer i norske tekster er helt trygge. Resultatkoder dere allerede har fått, virker fortsatt.

**Viktig:** Ikke bytt navn på repositoryet mens noen er midt i testen. Svarene underveis er lagret for
akkurat den adressen, og en ny adresse betyr en tom test. Ferdige resultatkoder virker uansett.

## Hva som er offentlig, og hva som ikke er det
| Offentlig | Ikke offentlig |
|---|---|
| Filene i repositoryet (påstander, tekster og kode) | Svarene deres. De ligger bare i nettleseren på hver telefon. |
| At siden finnes, for den som har adressen | Resultatkodene. De står etter `#` i lenken, og den delen sendes aldri til GitHub. |
| Brukernavnet ditt (i adressen) | Claude-teksten, til du selv limer den inn et sted |

Sidene er merket slik at søkemotorer ikke skal ta dem med (`noindex` og `robots.txt`).

## Slik fjerner du siden
- **Ta siden av nett:** Settings → Pages → **Unpublish site** (eller sett Source til «None»).
- **Slette alt:** Settings → General → helt nederst → **Delete this repository**.
