// Datafil for ecr-r. Innholdet mellom { og } er vanlig JSON.
// Du kan endre de norske tekstene (feltet "no"). Ikke endre "en", "nr" eller "nokkel".
window.PT_DATA = window.PT_DATA || {};
PT_DATA.ecr = {
  "instrument": "ECR-R",
  "fullt_navn": {
    "en": "Experiences in Close Relationships-Revised",
    "no": "Erfaringer i nære relasjoner – revidert"
  },
  "kilde": {
    "referanse": "Fraley, R. C., Waller, N. G., & Brennan, K. A. (2000). An item-response theory analysis of self-report measures of adult attachment. Journal of Personality and Social Psychology, 78, 350-365.",
    "pastander_hentet_fra": "https://labs.psychology.illinois.edu/~rcfraley/measures/ecrritems.htm",
    "skaring_hentet_fra": "https://labs.psychology.illinois.edu/~rcfraley/measures/ecrr.htm",
    "hentet_dato": "2026-11-16",
    "bruksvilkar": "Fri til ikke-kommersiell bruk uten tillatelse. Ikke til kommersiell bruk uten tillatelse (Fraley, ecrr.htm)."
  },
  "instruks": {
    "en": "The statements below concern how you feel in emotionally intimate relationships. We are interested in how you generally experience relationships, not just in what is happening in a current relationship. Respond to each statement by clicking a circle to indicate how much you agree or disagree with the statement.",
    "no": "Påstandene nedenfor handler om hvordan du har det i følelsesmessig nære relasjoner. Vi er interessert i hvordan du generelt opplever relasjoner, ikke bare i det som skjer i et nåværende forhold. Svar på hver påstand ved å trykke på et tall som viser hvor enig eller uenig du er."
  },
  "svarskala": {
    "min": 1,
    "max": 7,
    "reversering": "8 - svar",
    "merknad": "Kilden oppgir bare endepunktene: 1 = strongly disagree, 7 = strongly agree.",
    "ankere": [
      { "verdi": 1, "en": "Strongly disagree", "no": "Helt uenig" },
      { "verdi": 7, "en": "Strongly agree", "no": "Helt enig" }
    ]
  },
  "rekkefolge": {
    "regel": "tilfeldig",
    "kildetekst": "In real research, the order in which these items are presented should be randomized. ... The ordering below is simply a convenient one for illustrating which items belong to which scale."
  },
  "dimensjoner": [
    { "kode": "ANX", "en": "Attachment-related anxiety", "no": "Tilknytningsangst" },
    { "kode": "AVO", "en": "Attachment-related avoidance", "no": "Tilknytningsunngåelse" }
  ],
  "normer": {
    "kilde": "https://labs.psychology.illinois.edu/~rcfraley/measures/ecrr.htm (avsnittet «Do you have any norms for the ECR-R?»)",
    "utvalg": "Over 17 000 personer som tok ECR-R på nett tidlig på 2000-tallet; 73 % kvinner; gjennomsnittsalder 27 (SD 10); 21 % gift.",
    "forbehold": "Fraley skriver selv at normene bør tas med en klype salt.",
    "hele_utvalget": { "ANX": { "M": 3.56, "SD": 1.12 }, "AVO": { "M": 2.92, "SD": 1.19 } },
    "menn": { "ANX": { "M": 3.57, "SD": 1.10 }, "AVO": { "M": 2.94, "SD": 1.13 } },
    "kvinner": { "ANX": { "M": 3.56, "SD": 1.13 }, "AVO": { "M": 2.92, "SD": 1.21 } },
    "gifte": { "ANX": { "M": 3.26, "SD": 1.15 }, "AVO": { "M": 2.86, "SD": 1.26 } },
    "enslige": { "ANX": { "M": 3.64, "SD": 1.10 }, "AVO": { "M": 2.94, "SD": 1.17 } },
    "korrelasjon_ANX_AVO": 0.40
  },
  "kontrolleksempel": {
    "merknad": "Fraleys eget regneeksempel («Chris»). Brukes i de automatiske testene.",
    "svar": [1, 2, 2, 1, 3, 2, 2, 2, 1, 1, 6, 2, 2, 2, 3, 2, 5, 1, 2, 5, 2, 5, 2, 4, 2, 6, 6, 7, 7, 5, 6, 2, 6, 6, 6, 6],
    "forventet": { "ANX": 2.33, "AVO": 2.17 }
  },
  "pastander": [
    { "nr": 1, "dimensjon": "ANX", "nokkel": "+", "en": "I'm afraid that I will lose my partner's love.", "no": "Jeg er redd for å miste kjærligheten fra partneren min." },
    { "nr": 2, "dimensjon": "ANX", "nokkel": "+", "en": "I often worry that my partner will not want to stay with me.", "no": "Jeg bekymrer meg ofte for at partneren min ikke vil fortsette å være sammen med meg." },
    { "nr": 3, "dimensjon": "ANX", "nokkel": "+", "en": "I often worry that my partner doesn't really love me.", "no": "Jeg bekymrer meg ofte for at partneren min ikke egentlig elsker meg." },
    { "nr": 4, "dimensjon": "ANX", "nokkel": "+", "en": "I worry that romantic partners won't care about me as much as I care about them.", "no": "Jeg bekymrer meg for at partnere ikke vil bry seg like mye om meg som jeg bryr meg om dem." },
    { "nr": 5, "dimensjon": "ANX", "nokkel": "+", "en": "I often wish that my partner's feelings for me were as strong as my feelings for him or her.", "no": "Jeg skulle ofte ønske at partnerens følelser for meg var like sterke som mine følelser for ham eller henne." },
    { "nr": 6, "dimensjon": "ANX", "nokkel": "+", "en": "I worry a lot about my relationships.", "no": "Jeg bekymrer meg mye for forholdene mine." },
    { "nr": 7, "dimensjon": "ANX", "nokkel": "+", "en": "When my partner is out of sight, I worry that he or she might become interested in someone else.", "no": "Når partneren min ikke er i nærheten, bekymrer jeg meg for at han eller hun kan bli interessert i noen andre." },
    { "nr": 8, "dimensjon": "ANX", "nokkel": "+", "en": "When I show my feelings for romantic partners, I'm afraid they will not feel the same about me.", "no": "Når jeg viser følelsene mine for en partner, er jeg redd for at han eller hun ikke vil føle det samme for meg." },
    { "nr": 9, "dimensjon": "ANX", "nokkel": "-", "en": "I rarely worry about my partner leaving me.", "no": "Jeg bekymrer meg sjelden for at partneren min skal forlate meg." },
    { "nr": 10, "dimensjon": "ANX", "nokkel": "+", "en": "My romantic partner makes me doubt myself.", "no": "Partneren min får meg til å tvile på meg selv." },
    { "nr": 11, "dimensjon": "ANX", "nokkel": "-", "en": "I do not often worry about being abandoned.", "no": "Jeg er ikke ofte bekymret for å bli forlatt." },
    { "nr": 12, "dimensjon": "ANX", "nokkel": "+", "en": "I find that my partner(s) don't want to get as close as I would like.", "no": "Jeg opplever at partneren min (eller partnerne mine) ikke vil komme så nær meg som jeg skulle ønske." },
    { "nr": 13, "dimensjon": "ANX", "nokkel": "+", "en": "Sometimes romantic partners change their feelings about me for no apparent reason.", "no": "Noen ganger endrer partnere følelsene sine for meg uten noen åpenbar grunn." },
    { "nr": 14, "dimensjon": "ANX", "nokkel": "+", "en": "My desire to be very close sometimes scares people away.", "no": "Ønsket mitt om å være veldig nær skremmer noen ganger folk bort." },
    { "nr": 15, "dimensjon": "ANX", "nokkel": "+", "en": "I'm afraid that once a romantic partner gets to know me, he or she won't like who I really am.", "no": "Jeg er redd for at når en partner blir kjent med meg, vil han eller hun ikke like den jeg egentlig er." },
    { "nr": 16, "dimensjon": "ANX", "nokkel": "+", "en": "It makes me mad that I don't get the affection and support I need from my partner.", "no": "Det gjør meg sint at jeg ikke får den hengivenheten og støtten jeg trenger fra partneren min." },
    { "nr": 17, "dimensjon": "ANX", "nokkel": "+", "en": "I worry that I won't measure up to other people.", "no": "Jeg bekymrer meg for at jeg ikke strekker til sammenlignet med andre." },
    { "nr": 18, "dimensjon": "ANX", "nokkel": "+", "en": "My partner only seems to notice me when I'm angry.", "no": "Partneren min ser bare ut til å legge merke til meg når jeg er sint." },
    { "nr": 19, "dimensjon": "AVO", "nokkel": "+", "en": "I prefer not to show a partner how I feel deep down.", "no": "Jeg vil helst ikke vise en partner hva jeg føler innerst inne." },
    { "nr": 20, "dimensjon": "AVO", "nokkel": "-", "en": "I feel comfortable sharing my private thoughts and feelings with my partner.", "no": "Jeg føler meg trygg på å dele mine private tanker og følelser med partneren min." },
    { "nr": 21, "dimensjon": "AVO", "nokkel": "+", "en": "I find it difficult to allow myself to depend on romantic partners.", "no": "Jeg synes det er vanskelig å tillate meg selv å lene meg på en partner." },
    { "nr": 22, "dimensjon": "AVO", "nokkel": "-", "en": "I am very comfortable being close to romantic partners.", "no": "Jeg føler meg veldig vel med å være nær en partner." },
    { "nr": 23, "dimensjon": "AVO", "nokkel": "+", "en": "I don't feel comfortable opening up to romantic partners.", "no": "Jeg føler meg ikke vel med å åpne meg for en partner." },
    { "nr": 24, "dimensjon": "AVO", "nokkel": "+", "en": "I prefer not to be too close to romantic partners.", "no": "Jeg vil helst ikke være for nær en partner." },
    { "nr": 25, "dimensjon": "AVO", "nokkel": "+", "en": "I get uncomfortable when a romantic partner wants to be very close.", "no": "Jeg blir ukomfortabel når en partner vil være veldig nær meg." },
    { "nr": 26, "dimensjon": "AVO", "nokkel": "-", "en": "I find it relatively easy to get close to my partner.", "no": "Jeg synes det er relativt lett å komme nær partneren min." },
    { "nr": 27, "dimensjon": "AVO", "nokkel": "-", "en": "It's not difficult for me to get close to my partner.", "no": "Det er ikke vanskelig for meg å komme nær partneren min." },
    { "nr": 28, "dimensjon": "AVO", "nokkel": "-", "en": "I usually discuss my problems and concerns with my partner.", "no": "Jeg pleier å snakke med partneren min om problemene og bekymringene mine." },
    { "nr": 29, "dimensjon": "AVO", "nokkel": "-", "en": "It helps to turn to my romantic partner in times of need.", "no": "Det hjelper å vende meg til partneren min når jeg har det vanskelig." },
    { "nr": 30, "dimensjon": "AVO", "nokkel": "-", "en": "I tell my partner just about everything.", "no": "Jeg forteller partneren min omtrent alt." },
    { "nr": 31, "dimensjon": "AVO", "nokkel": "-", "en": "I talk things over with my partner.", "no": "Jeg snakker gjennom ting med partneren min." },
    { "nr": 32, "dimensjon": "AVO", "nokkel": "+", "en": "I am nervous when partners get too close to me.", "no": "Jeg blir nervøs når en partner kommer for nær meg." },
    { "nr": 33, "dimensjon": "AVO", "nokkel": "-", "en": "I feel comfortable depending on romantic partners.", "no": "Jeg føler meg vel med å lene meg på en partner." },
    { "nr": 34, "dimensjon": "AVO", "nokkel": "-", "en": "I find it easy to depend on romantic partners.", "no": "Jeg synes det er lett å lene meg på en partner." },
    { "nr": 35, "dimensjon": "AVO", "nokkel": "-", "en": "It's easy for me to be affectionate with my partner.", "no": "Det er lett for meg å være kjærlig og øm mot partneren min." },
    { "nr": 36, "dimensjon": "AVO", "nokkel": "-", "en": "My partner really understands me and my needs.", "no": "Partneren min forstår virkelig meg og behovene mine." }
  ]
};
