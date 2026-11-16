// par-tekster.js – tekstene i parrapporten («Hva betyr dette for oss»).
// {hoy}, {lav}, {a}, {b} osv. byttes ut med navn. Tekstene beskriver tendenser, ikke dommer.

window.PT_DATA = window.PT_DATA || {};

PT_DATA.parTekster = {
  // Grenser i prosentpoeng for når to skårer regnes som «nære» eller «ulike».
  grenser: { naer: 12.5, ulik: 25 },

  domener: {
    N: {
      omraade: 'Stress og følelser',
      beggeHoy: 'Dere kjenner begge stress og følelser sterkt. Det kan gi stor forståelse for hverandre, men når dere er presset samtidig, kan stemningen lettere skyte fart. Det hjelper ofte å avtale på forhånd hvordan dere tar en pause og roer dere ned.',
      beggeLav: 'Dere er begge ganske rolige og stødige. Det gir et avslappet hjem med lite dramatikk. Pass på at dere likevel tar opp det som er vanskelig, så ingenting blir liggende.',
      ulike: '{hoy} kjenner stress og bekymring sterkere enn {lav}. {lav} kan være en rolig havn, og {hoy} fanger ofte opp problemer tidlig. Det kan oppstå misforståelser hvis {lav} virker uberørt, eller hvis {hoy} opplever at følelsene ikke blir tatt på alvor. Å anerkjenne følelsen før man prøver å løse problemet hjelper ofte.',
      ulikFasett: 'Dere kan reagere ulikt på uro, stress og motgang her.'
    },
    E: {
      omraade: 'Sosialt liv',
      beggeHoy: 'Dere får begge energi av folk og aktivitet. Det gir et sosialt og levende liv sammen. Husk å sette av rolig tid bare for dere to også.',
      beggeLav: 'Dere trives begge med ro og egen tid. Det gir et rolig og nært hjem. Pass på at vennskap og nettverk rundt dere også blir pleiet.',
      ulike: '{hoy} får mer energi av folk og aktivitet enn {lav}, som lader best i ro. Dette er en av de vanligste forskjellene i par, og en av de enkleste å finne gode løsninger på. Snakk om hvor mye sosialt dere ønsker dere, og gjør det greit at {lav} går hjem tidligere eller trekker seg tilbake for å lade.',
      ulikFasett: 'Dere kan ha ulikt behov for folk, tempo og aktivitet her.'
    },
    O: {
      omraade: 'Nye opplevelser og samtaler',
      beggeHoy: 'Dere er begge nysgjerrige og åpne for nye ting. Det gir mange samtaler, ideer og opplevelser. Noen ganger kan dere trenge å hjelpe hverandre med å lande og fullføre.',
      beggeLav: 'Dere setter begge pris på det kjente og praktiske. Det gir stabilitet og enighet om hverdagen. Små nye opplevelser sammen kan likevel gi ny energi.',
      ulike: '{hoy} søker mer nye ideer og opplevelser enn {lav}, som setter mer pris på det kjente. {hoy} kan dra dere ut av hjulsporene, og {lav} kan passe på at det dere har, blir tatt vare på. Ulike ønsker for ferier, fritid og samtaleemner er vanlige her.',
      ulikFasett: 'Dere kan ha ulik lyst på det nye og ukjente her.'
    },
    A: {
      omraade: 'Konflikt og kommunikasjon',
      beggeHoy: 'Dere er begge varme og opptatt av harmoni. Det gir mye omsorg og få harde konflikter. Pass på at ingen av dere legger lokk på egne behov for å unngå uenighet.',
      beggeLav: 'Dere er begge direkte og sier det dere mener. Det gir ærlighet og klarhet. I konflikter kan det likevel bli hardt mot hardt, så det kan hjelpe å vise varme og anerkjennelse underveis.',
      ulike: '{hoy} er mer opptatt av harmoni og andres behov enn {lav}, som er mer direkte. {lav} kan hjelpe dere med å få ting på bordet, og {hoy} kan hjelpe dere med å holde tonen god. Pass på at det ikke alltid er {hoy} som gir etter.',
      ulikFasett: 'Dere kan møte uenighet og andres behov på ulike måter her.'
    },
    C: {
      omraade: 'Planlegging og hverdag',
      beggeHoy: 'Dere er begge strukturerte og pålitelige, og hverdagen går ofte som smurt. Husk å gi rom for spontanitet og hvile, og vær rause når noe ikke blir perfekt.',
      beggeLav: 'Dere er begge fleksible og spontane. Det gir frihet og lite mas, men praktiske ting kan bli liggende. Enkle felles systemer, som en delt kalender eller faste dager, kan gjøre mye.',
      ulike: '{hoy} liker mer struktur og planlegging enn {lav}. Dette er en klassisk kilde til små irritasjoner i hverdagen, som rydding, frister og planer. Det kan hjelpe å fordele oppgaver etter styrker og bli enige om hva som er «godt nok».',
      ulikFasett: 'Dere kan ha ulike forventninger til orden, planer og gjennomføring her.'
    }
  },
  naer: 'Dere ligger ganske nær hverandre her. Det betyr ofte at dere forstår hverandres måte å være på uten at det trengs mye forklaring.',
  litt: 'Dere er i samme landskap, men {hoy} ligger en del høyere enn {lav}. Forskjellen er ikke stor, men den kan merkes i perioder med mye på gang.',
  likFasett: 'Dere ligger nær hverandre her. Likhet gjør det lett å forstå hverandre, og noen ganger kan dere forsterke hverandre, både på godt og vondt.',

  // Tilknytningskombinasjoner. Nøkkelen er de to feltene i fast rekkefølge:
  // trygg, engstelig, unnvikende, fryktsom-unnvikende.
  // {trygg}, {engstelig}, {unnvikende} og {fryktsom} byttes ut med navnet til den som ligger i feltet.
  // Når begge er i samme felt, brukes {a} og {b}.
  tilknytning: {
    'trygg|trygg': 'Dere ligger begge nærmest det trygge feltet. Forskning tyder på at par der begge er trygt tilknyttet, oftere er fornøyde og håndterer konflikter mer konstruktivt. Det er et godt utgangspunkt, og noe som er verdt å pleie.',
    'trygg|engstelig': '{trygg} ligger nærmest det trygge feltet og {engstelig} nærmest det engstelige. En trygg partner kan over tid gjøre det lettere for den andre å føle seg trygg. For {engstelig} hjelper det ofte med tydelige tegn på at {trygg} er der. For {trygg} kan det hjelpe å vite at behovet for bekreftelse ikke handler om mistillit.',
    'trygg|unnvikende': '{trygg} ligger nærmest det trygge feltet og {unnvikende} nærmest det unnvikende. {unnvikende} trenger gjerne mer egen plass og kan bruke tid på å åpne seg. {trygg} kan gi rom uten å ta det personlig, og {unnvikende} kan øve på å dele litt mer, litt om gangen.',
    'trygg|fryktsom-unnvikende': '{trygg} ligger nærmest det trygge feltet og {fryktsom} nærmest det fryktsom-unnvikende. {fryktsom} kan både ønske nærhet og trekke seg unna når det blir nært. Tålmodighet og forutsigbarhet fra {trygg} hjelper ofte, og det samme gjør det å sette ord på det som skjer, uten å dømme.',
    'engstelig|engstelig': 'Dere ligger begge nærmest det engstelige feltet. Dere ønsker mye nærhet og forstår hverandres behov godt. Når begge kjenner uro samtidig, kan små ting vokse seg store. Tydelige, hyppige bekreftelser og rolige stunder etter uenighet hjelper ofte.',
    'engstelig|unnvikende': '{engstelig} ligger nærmest det engstelige feltet og {unnvikende} nærmest det unnvikende. Dette er en av de mest kjente kombinasjonene: {engstelig} søker nærhet når noe føles usikkert, mens {unnvikende} trenger avstand når det blir intenst. Det kan bli en sirkel der den ene «jager» og den andre «trekker seg unna». Å kjenne igjen mønsteret, sette ord på det og avtale pauser som ikke føles som avvisning, hjelper ofte mye.',
    'engstelig|fryktsom-unnvikende': '{engstelig} ligger nærmest det engstelige feltet og {fryktsom} nærmest det fryktsom-unnvikende. Begge kan kjenne uro for å miste den andre, og {fryktsom} kan i tillegg trekke seg unna når det blir nært. Forutsigbare rutiner for nærhet og tydelige, rolige samtaler etter uenighet hjelper ofte.',
    'unnvikende|unnvikende': 'Dere ligger begge nærmest det unnvikende feltet. Dere gir hverandre god plass og har kanskje få dramatiske konflikter, men avstanden kan bli stor uten at noen merker det. Det kan hjelpe å bevisst sette av tid til å snakke om hvordan dere har det.',
    'unnvikende|fryktsom-unnvikende': '{unnvikende} ligger nærmest det unnvikende feltet og {fryktsom} nærmest det fryktsom-unnvikende. Begge kan trekke seg unna når det blir nært, men {fryktsom} ønsker seg samtidig ofte mer nærhet. Små, trygge skritt mot å dele mer kan gjøre mye for dere begge.',
    'fryktsom-unnvikende|fryktsom-unnvikende': 'Dere ligger begge nærmest det fryktsom-unnvikende feltet. Dere kjenner trolig begge på både lengsel etter nærhet og redsel for å bli såret. Tålmodighet, forutsigbarhet og å snakke åpent om dette mønsteret hjelper ofte. Mange par har også glede av parsamtaler, også når det går bra.'
  },
  tilknytningAvslutning: 'Husk at dette er tendenser og ikke dommer. Tilknytning er glidende og kan endre seg, og en trygg relasjon er noe dere bygger sammen over tid.',

  // Hva forskningen sier – formulert varsomt.
  forskning: [
    { tekst: 'Når den ene partneren har lavere nevrotisisme og høyere medmenneskelighet, planmessighet eller ekstroversjon, er den andre i gjennomsnitt litt mer fornøyd i forholdet. Sammenhengene er små.',
      kilde: 'Malouff mfl. (2010), metaanalyse i Journal of Research in Personality, 44, 124–127' },
    { tekst: 'Det er hver persons egne trekk som betyr mest for egen tilfredshet. Partnerens trekk betyr litt, særlig medmenneskelighet, planmessighet og følelsesmessig stabilitet. Hvor like partnerne er, forklarer nesten ingenting.',
      kilde: 'Dyrenforth mfl. (2010), Journal of Personality and Social Psychology, 99, 690–702' },
    { tekst: 'Nevrotisisme går igjen som et av de mer stabile kjennetegnene i forskning på hvordan par har det over tid. Mye av sammenhengen ser ut til å gå via hvordan stress og konflikter håndteres.',
      kilde: 'Karney og Bradbury (1995), Psychological Bulletin, 118, 3–34' },
    { tekst: 'Både tilknytningsangst og tilknytningsunngåelse henger sammen med lavere tilfredshet i forholdet, og ens egen usikkerhet betyr mer enn partnerens.',
      kilde: 'Candel og Turliuc (2019), metaanalyse i Personality and Individual Differences, 147, 190–199' },
    { tekst: 'Mønsteret der den ene krever og den andre trekker seg unna, er godt beskrevet i parforskningen. Den som ønsker en endring, havner oftest i rollen som den som krever.',
      kilde: 'Christensen og Heavey (1990), Journal of Personality and Social Psychology, 59, 73–81' },
    { tekst: 'Effektene er gjennomsnitt for mange par og er stort sett moderate. De sier lite om akkurat dere. Personlighet og tilknytning kan også endre seg gjennom livet og i en god relasjon.',
      kilde: '' }
  ],

  // Samtalespørsmål. Rapporten plukker 8–12 ut fra resultatene deres.
  sporsmal: {
    alltid: [
      'Hva i resultatet ditt kjente du deg mest igjen i, og hva overrasket deg?',
      'Hvilken av mine styrker setter du mest pris på i hverdagen?',
      'Når følte vi oss sist virkelig nære hverandre? Hva gjorde at det ble slik?'
    ],
    ulike: {
      N: 'Hvordan merker vi at stresset øker hos den andre, og hva hjelper da?',
      E: 'Hvordan finner vi en god balanse mellom tid med andre, tid for oss to og tid alene?',
      O: 'Hva er noe nytt vi kunne prøve sammen, og hva er noe kjent vi vil ta vare på?',
      A: 'Hvordan liker vi å ta opp uenigheter, og hva gjør at en krangel ender godt?',
      C: 'Hvordan fordeler vi planlegging og praktiske oppgaver, og hvor trenger vi mer eller mindre struktur?'
    },
    beggeHoy: {
      N: 'Hvordan kan vi roe hverandre ned når vi begge er stresset samtidig?',
      A: 'Er det noe av betydning vi lar være å ta opp for å bevare freden?',
      C: 'Hvordan kan vi gi oss selv lov til å slappe av når ikke alt er gjort?'
    },
    beggeLav: {
      A: 'Hvordan sørger vi for at det er rom for omsorg og anerkjennelse når vi er direkte med hverandre?',
      C: 'Hvem tar seg av det praktiske når ingen av oss egentlig liker det, og hvordan kan vi gjøre det lettere?',
      E: 'Hvordan tar vi vare på vennskapene våre når vi begge trives best hjemme?'
    },
    likFasett: 'Vi ligger nær hverandre på «{fasett}». Er det en styrke for oss, eller hender det at vi forsterker hverandre?',
    ulikFasett: 'Vi er ganske ulike på «{fasett}». Hvordan merker vi det i hverdagen, og hva kan vi lære av hverandre?',
    tilknytning: {
      engstelig: 'Hva gjør at du føler deg trygg på at jeg er der for deg?',
      unnvikende: 'Hvordan kan vi gi hverandre både nærhet og frihet?',
      'fryktsom-unnvikende': 'Finnes det situasjoner der du både ønsker nærhet og vil trekke deg unna? Hvordan kan jeg møte deg da?',
      beggeTrygg: 'Hva er det som gjør at vi har det trygt sammen, og hvordan kan vi ta vare på det?'
    },
    reserve: [
      'Hvordan har store endringer i livet påvirket hvordan vi har det sammen?',
      'Hva ønsker du deg mer av fra meg det neste året?',
      'Hvordan har vi forandret oss siden vi møttes, og hva setter du pris på i den forandringen?',
      'Hva er en liten ting jeg gjør som betyr mye for deg?'
    ]
  }
};
