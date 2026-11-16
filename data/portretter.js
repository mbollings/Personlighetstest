// portretter.js – tekster til det utbroderte portrettet (individ) og fortellingen om pardynamikken.
// Tekstene setter trekkene litt på spissen med vilje. De skal likevel alltid vise både styrker og
// utfordringer, og aldri fremstille høy eller lav skår som bra eller dårlig.
//
// Nøkler: trekk + retning, f.eks. "E+" = høy ekstroversjon, "C-" = lav planmessighet.
// To trekk kombineres i fast rekkefølge N, E, O, A, C: "N+|E+".

window.PT_DATA = window.PT_DATA || {};

PT_DATA.portretter = {
  forbehold: 'Satt litt på spissen. Portrettet er laget ut fra hvordan du beskrev deg selv, og ingen er bare én ting.',

  // ---------- Arketyper ut fra de to trekkene som skiller seg mest ut ----------
  arketyper: {
    'N+|E+': { tittel: 'Den intense entusiasten', tekst: 'Du lever livet med volumknappen skrudd opp. Du får energi av folk og opplevelser, og du kjenner både gleden og uroen sterkt. Når det går bra, er du den som får festen og prosjektet til å ta av. Når det butter, kjennes det i hele kroppen.' },
    'N+|E-': { tittel: 'Den sensitive observatøren', tekst: 'Du legger merke til mye og kjenner mye, men viser det ikke nødvendigvis utad. Du trives best med få, trygge mennesker og trenger ro for å bearbeide inntrykk. Andre ser kanskje en rolig overflate, men under den skjer det mye.' },
    'N-|E+': { tittel: 'Den uanstrengte sosialiseren', tekst: 'Du er trygg i deg selv og får energi av folk. Du går inn i et rom uten å bekymre deg mye for hva andre mener, og du slår deg lett løs. Stress biter dårlig på deg, noen ganger så dårlig at du ikke merker at andre har det tøft.' },
    'N-|E-': { tittel: 'Den stille klippen', tekst: 'Rolig, avbalansert og lite opptatt av å være i sentrum. Du trenger ikke mye ytre stimulans og lar deg sjelden rive med. Folk rundt deg føler seg trygge når du er der, men kan lure på hva du egentlig tenker.' },
    'N+|O+': { tittel: 'Den følsomme drømmeren', tekst: 'Du har et rikt indre liv der tanker, følelser, ideer og inntrykk flyter i hverandre. Du blir lett grepet av kunst, samtaler og andres skjebner, og like lett urolig. Det gjør deg dyp og kreativ, men også lett å slite ut.' },
    'N+|O-': { tittel: 'Den trygghetssøkende tradisjonsbæreren', tekst: 'Du søker trygghet i det kjente og forutsigbare, og forandringer kan vekke uro. Du tar vare på det som fungerer, og merker raskt når noe er i ferd med å skli ut. Hjemmet og de faste rutinene er din festning.' },
    'N-|O+': { tittel: 'Den rolige utforskeren', tekst: 'Nye ideer og opplevelser trekker i deg, og du møter dem uten særlig uro. Du kan kaste deg ut i ukjent farvann og samtidig holde hodet kaldt. Andre kan oppleve deg som modig, eller som litt for avslappet når det gjelder risiko.' },
    'N-|O-': { tittel: 'Den jordnære realisten', tekst: 'Du står med begge beina på jorda: rolig, praktisk og lite opptatt av luftslott. Du vet hva som fungerer, og lar deg ikke vippe av nye trender eller dramatikk. Du er en trygg grunnmur, men kanskje vanskelig å lokke med på eksperimenter.' },
    'N+|A+': { tittel: 'Den omsorgsfulle bekymreren', tekst: 'Du bryr deg dypt om folk og kjenner det på kroppen når noen du er glad i, har det vondt. Du gjør mye for å holde freden og ta vare på andre, noen ganger så mye at du glemmer deg selv og bekymringene tar over.' },
    'N+|A-': { tittel: 'Den skarpe kvalitetssikreren', tekst: 'Du ser feil og svakheter raskt og sier ifra, og når noe går deg imot, kjenner du det sterkt. Det gjør deg til en kvalitetssikrer av rang, men konflikter kan blusse opp raskt og ta tid å legge bak seg.' },
    'N-|A+': { tittel: 'Den gode sjelen', tekst: 'Varm, rolig og tilgivende. Du lar deg sjelden provosere og møter folk med velvilje. Du er limet i mange fellesskap, og står i fare for å bli tatt for gitt.' },
    'N-|A-': { tittel: 'Den kjølige strategen', tekst: 'Du er rolig under press og sier rett ut hva du mener. Du lar deg lite styre av følelser, verken dine egne eller andres. Det gir handlekraft i kriser, men kan oppleves som hardt for dem som trenger litt mykhet.' },
    'N+|C+': { tittel: 'Den samvittighetsfulle perfeksjonisten', tekst: 'Du har høye krav til deg selv og vil gjøre ting riktig, og du kjenner uroen når noe ikke er på plass. Lister, planer og kontroll gir trygghet. Det gjør deg svært pålitelig, men det kan være vanskelig å senke skuldrene.' },
    'N+|C-': { tittel: 'Det følsomme impulsmennesket', tekst: 'Du handler ofte på følelsen i øyeblikket, og humøret kan styre dagen mer enn planene gjør. Det gir spontanitet og ekthet, men også perioder der ting hoper seg opp og blir overveldende.' },
    'N-|C+': { tittel: 'Den stødige gjennomføreren', tekst: 'Rolig, strukturert og pålitelig: Du legger en plan og følger den uten å stresse unødvendig. Mange vil gjerne ha deg på laget sitt. Faren er at det alltid blir du som tar ansvaret.' },
    'N-|C-': { tittel: 'Den avslappede livsnyteren', tekst: 'Du tar dagene som de kommer, og lar deg ikke stresse av frister eller rot. Det gir et befriende avslappet forhold til livet, og noen ganger litt kaos rundt deg som andre må rydde opp i.' },
    'E+|O+': { tittel: 'Den eventyrlystne inspiratoren', tekst: 'Du elsker nye mennesker, nye steder og nye ideer. Du drar andre med deg på tur, inn i prosjekter og inn i samtaler som varer til langt på natt. Kjedsomhet er din største fiende.' },
    'E+|O-': { tittel: 'Den sosiale tradisjonalisten', tekst: 'Du trives i godt selskap og med det kjente: faste venner, faste tradisjoner og høytider som feires som de alltid har vært. Du er ofte limet i familien og vennegjengen, men nye vaner og ukjente miljøer frister mindre.' },
    'E-|O+': { tittel: 'Den stille tenkeren', tekst: 'Du har et rikt indre liv og trives godt i ro med bøker, tanker og egne prosjekter. De gode samtalene tar du helst på tomannshånd. Mye av det beste i deg ser bare de som kommer nær.' },
    'E-|O-': { tittel: 'Den rolige hjemmekoseren', tekst: 'Du trives best hjemme, i kjente rammer og med folk du kjenner godt. Du trenger ikke mye spenning for å ha det bra. Det gir et trygt og stabilt liv, men kanskje færre overraskelser.' },
    'E+|A+': { tittel: 'Den varme verten', tekst: 'Du liker folk, og folk liker deg. Du sørger for at alle føler seg inkludert, husker bursdager og inviterer gjerne. Du gir mye energi til andre, så husk å fylle på selv.' },
    'E+|A-': { tittel: 'Den karismatiske utfordreren', tekst: 'Du tar plass, sier hva du mener og liker en god diskusjon. Du kan begeistre og provosere i samme åndedrag. Folk vet alltid hvor de har deg, men ikke alle tåler like mye av det.' },
    'E-|A+': { tittel: 'Den lyttende støttespilleren', tekst: 'Du er rolig og omtenksom og trives best i bakgrunnen. Du legger merke til at noen er stille, og lytter mer enn du snakker. Godheten din er ikke høylytt, men den merkes, og den kan bli oversett.' },
    'E-|A-': { tittel: 'Den uavhengige individualisten', tekst: 'Du trenger lite av andres selskap og går gjerne dine egne veier. Du sier ifra hvis noe ikke stemmer, men holder ellers kortene tett. Du er sjelden avhengig av andres godkjenning, og andre kan oppleve deg som vanskelig å komme inn på.' },
    'E+|C+': { tittel: 'Den energiske lederen', tekst: 'Du har både driv og struktur: Du får folk med deg og sørger for at ting faktisk blir gjort. Kalenderen er full, og du liker det sånn. Pass på at det er rom for hvile, for deg og for dem rundt deg.' },
    'E+|C-': { tittel: 'Den spontane festløven', tekst: 'Du lever i øyeblikket, sier ja til det meste og lar planene ordne seg. Med deg skjer det alltid noe. Kalenderen og regningene kan være en annen sak.' },
    'E-|C+': { tittel: 'Den grundige strategen', tekst: 'Stille, systematisk og pålitelig. Du jobber godt alene, tenker før du handler og leverer det du lover. Du trenger ikke rampelyset for å gjøre en forskjell, men innsatsen din kan bli usynlig for andre.' },
    'E-|C-': { tittel: 'Den frie sjelen', tekst: 'Du går i ditt eget tempo, i ditt eget hode og etter din egen klokke. Lite mas, lite plikt og mye frihet. Andre kan lure på hva du holder på med, men du har det ofte ganske bra.' },
    'O+|A+': { tittel: 'Den åpne idealisten', tekst: 'Du er nysgjerrig på mennesker og ideer, og du tror på det gode i folk. Du engasjerer deg i store spørsmål og i andres liv. Du kan bli skuffet når virkeligheten ikke lever opp til idealene.' },
    'O+|A-': { tittel: 'Den uredde debattanten', tekst: 'Du elsker ideer og diskusjoner og sier gjerne imot, også når alle andre er enige. Du utfordrer etablerte sannheter og andres argumenter. Inspirerende for noen, krevende for andre.' },
    'O-|A+': { tittel: 'Den trofaste hjelperen', tekst: 'Du står for det kjente og trygge, og du stiller opp for folk rundt deg. Du er praktisk omtanke i egen person, den som kommer med middag når noen er syke. Nye ideer må gjerne vise at de er til nytte før du blir begeistret.' },
    'O-|A-': { tittel: 'Den nøkterne pragmatikeren', tekst: 'Du er praktisk, direkte og lite opptatt av dilldall. Du vet hva du mener og sier det. Nye ideer og andres følelser må gjerne bevise sin nytte før du kjøper dem.' },
    'O+|C+': { tittel: 'Den kreative byggeren', tekst: 'Du får ideer og gjennomfører dem. Nysgjerrighet og struktur er en sjelden kombinasjon: Du kan både drømme stort og legge en plan. Faren er for mange prosjekter på en gang.' },
    'O+|C-': { tittel: 'Den kreative kaosmakeren', tekst: 'Ideene kommer på løpende bånd, og du hopper gjerne fra det ene til det andre. Du er inspirerende og nyskapende, men halvferdige prosjekter kan vitne om at gjennomføring ikke er favorittdelen.' },
    'O-|C+': { tittel: 'Den pliktoppfyllende tradisjonalisten', tekst: 'Du verdsetter orden, rutiner og det som har vist seg å fungere. Du er pålitelig som et sveitsisk ur. Forandringer må gjerne begrunnes godt før du er med.' },
    'O-|C-': { tittel: 'Det avslappede hverdagsmennesket', tekst: 'Du lever et ukomplisert liv uten store teorier eller stramme planer. Du tar ting som de kommer og trives med det enkle. Det gir ro, men kanskje mindre framdrift i det du drømmer om.' },
    'A+|C+': { tittel: 'Den pålitelige omsorgspersonen', tekst: 'Du stiller opp for andre og holder det du lover. Folk vet at de kan regne med deg, både praktisk og følelsesmessig. Pass på at ikke alle andres behov alltid går foran dine egne.' },
    'A+|C-': { tittel: 'Den hjertevarme improvisatøren', tekst: 'Du er raus, varm og fleksibel, og sier gjerne ja når noen trenger deg, også når kalenderen egentlig er full. Du har hjertet på rett sted, men logistikken kan halte.' },
    'A-|C+': { tittel: 'Den krevende effektivisten', tekst: 'Du har høye krav til deg selv og til andre, og sier ifra når noe ikke holder mål. Du får ting gjort, og forventer at andre også gjør det. Ikke alle trives like godt i det tempoet.' },
    'A-|C-': { tittel: 'Den uavhengige frilanseren', tekst: 'Du gjør ting på din måte og i ditt tempo, og du lar deg lite styre av andres forventninger eller regler. Frihet betyr mye for deg, og andre kan oppleve deg som vanskelig å planlegge med.' }
  },

  // Når bare ett trekk skiller seg tydelig ut.
  enkelt: {
    'N+': { tittel: 'Seismografen', tekst: 'Du registrerer små rystelser før andre merker noe som helst. Du kjenner livet sterkt, både det gode og det vonde, og det gjør deg innlevende og årvåken, men også sårbar for stress.' },
    'N-': { tittel: 'Ankeret', tekst: 'Du er rolig og stødig, og lar deg sjelden rive med av stemninger. Når det stormer rundt deg, står du fortsatt. Andre kan lene seg på deg, men kan også savne at du viser hva som rører deg.' },
    'E+': { tittel: 'Energibunten', tekst: 'Du får energi av folk og aktivitet og trives best når det skjer noe. Du tar initiativ og får ting i gang, men stillhet og rolige perioder kan kjennes lange.' },
    'E-': { tittel: 'Den rolige reflektøren', tekst: 'Du lader best i ro og trenger ikke mye ytre stimulans. Du lytter, observerer og tenker før du snakker. Det gir dybde, men store sosiale lag kan tappe deg raskt.' },
    'O+': { tittel: 'Utforskeren', tekst: 'Du er nysgjerrig på det meste: ideer, steder, mennesker og følelser. Livet med deg er sjelden kjedelig, men rutiner og gjentakelser kan gjøre deg rastløs.' },
    'O-': { tittel: 'Den jordnære', tekst: 'Du vet hva du liker, og setter pris på det som fungerer. Du lar deg ikke vippe av hver ny idé, og det gir stabilitet, men kan gjøre det vanskeligere å omstille seg.' },
    'A+': { tittel: 'Diplomaten', tekst: 'Du er varm, tillitsfull og opptatt av at alle skal ha det bra. Du glatter ut konflikter og ser det beste i folk, men kan glemme dine egne behov på veien.' },
    'A-': { tittel: 'Den rettlinjede', tekst: 'Du sier det som det er, og lar deg ikke lett presse. Ærligheten din er forfriskende for mange, men kan oppleves som hard for andre.' },
    'C+': { tittel: 'Planleggeren', tekst: 'Du liker orden, oversikt og å fullføre det du begynner på. Folk kan stole på deg, men det kan være vanskelig å slappe av når noe er uferdig.' },
    'C-': { tittel: 'Improvisatøren', tekst: 'Du er fleksibel og spontan og tar ting som de kommer. Det gir frihet og tilpasningsevne, men frister og praktiske ting kan bli liggende.' }
  },
  balansert: { tittel: 'Allrounderen', tekst: 'Ingen av de fem hovedtrekkene skiller seg tydelig ut hos deg. Du har trekk fra begge sider av de fleste skalaene, og tilpasser deg trolig godt ulike situasjoner og mennesker. Det gjør deg allsidig, men kanskje også vanskeligere å «lese» for andre, og for deg selv.' },

  // ---------- Slik kan andre oppleve deg (ekstroversjon × medmenneskelighet) ----------
  andre: {
    'hoy|hoy': 'Andre opplever deg trolig som varm og lett å bli kjent med, en som får folk til å føle seg velkomne.',
    'hoy|midt': 'Andre opplever deg trolig som utadvendt og lett å komme i kontakt med, både hyggelig og tydelig.',
    'hoy|lav': 'Andre opplever deg trolig som tydelig og engasjert. Noen synes du er forfriskende rett fram, andre at du tar mye plass.',
    'midt|hoy': 'Andre opplever deg trolig som vennlig og lett å samarbeide med, uten at du trenger å stå i sentrum.',
    'midt|midt': 'Andre opplever deg trolig som lett å forholde seg til, verken påtrengende eller tilbaketrukket.',
    'midt|lav': 'Andre opplever deg trolig som selvstendig og rett fram, en som sier ifra når noe ikke stemmer.',
    'lav|hoy': 'Andre opplever deg trolig som stille og snill. Noen trenger tid for å oppdage hvor omtenksom du er.',
    'lav|midt': 'Andre opplever deg trolig som rolig og litt reservert til å begynne med, men god å ha med å gjøre når de blir kjent med deg.',
    'lav|lav': 'Andre kan oppleve deg som reservert og vanskelig å lese til å begynne med. De som kommer nær, vet at du er ærlig og står for det du mener.'
  },

  // ---------- Under press (nevrotisisme × planmessighet) ----------
  press: {
    'hoy|hoy': 'Under press jobber du gjerne hardere og strammer grepet med lister, kontroll og ekstra innsats. Det holder ting i gang, men hodet slår seg sjelden av.',
    'hoy|midt': 'Under press kan uroen ta mye plass. Det hjelper ofte å bryte ting ned i små, konkrete steg og å snakke med noen.',
    'hoy|lav': 'Under press kan det kjennes overveldende, og det er fristende å utsette det som stresser. Små rutiner og støtte fra andre kan gjøre stor forskjell.',
    'midt|hoy': 'Under press lener du deg på struktur og planer, og det gir deg trygghet.',
    'midt|midt': 'Under press reagerer du som de fleste: litt mer anspent enn vanlig, men du finner som regel veien gjennom.',
    'midt|lav': 'Under press tar du det gjerne litt på sparket. Noen ganger fungerer det fint, andre ganger hoper det seg opp.',
    'lav|hoy': 'Under press er du ofte på ditt beste: rolig, systematisk og løsningsorientert. Det er gjerne deg andre ser til når det brenner.',
    'lav|midt': 'Under press holder du hodet kaldt og tar én ting om gangen.',
    'lav|lav': 'Under press lar du deg sjelden stresse, noen ganger så lite at fristene får seile sin egen sjø.'
  },

  // ---------- I nære relasjoner ----------
  relasjon: {
    'trygg': 'I nære relasjoner er du trolig både en trygg havn og et godt reisefølge. Du tåler både nærhet og avstand, og sier ifra om hva du trenger.',
    'engstelig': 'I nære relasjoner gir du mye av deg selv og kjenner forholdet på kroppen. Du merker raskt små endringer i tonen, og trenger å kjenne at du er ønsket.',
    'unnvikende': 'I nære relasjoner er du lojal, men holder gjerne noe for deg selv. Du viser kjærlighet mer gjennom handling enn ord, og trenger rom for å puste.',
    'fryktsom-unnvikende': 'I nære relasjoner lengter du etter nærhet, men kjenner også en trang til å beskytte deg. Det kan gi et «kom hit, gå vekk»-mønster som kan forvirre både deg og den andre.'
  },

  // ---------- Pardynamikk ----------
  par: {
    forbehold: 'Satt litt på spissen. Fortellingen bygger på hvordan dere beskrev dere selv, og den virkelige hverdagen deres er selvsagt mer sammensatt.',
    // Tittel når et trekk skiller dere tydelig. {hoy} = den som skårer høyest.
    ulikeTittel: {
      N: { tittel: 'Seismografen og fjellet', tekst: '{hoy} merker de små rystelsene, og {lav} står støtt når det rister. Sammen har dere både et tidlig varslingssystem og et anker.' },
      E: { tittel: 'Gnisten og roen', tekst: '{hoy} tenner på folk og aktivitet, og {lav} lader i ro. Sammen kan dere få både fart og hvile, hvis dere lar hverandre være den dere er.' },
      O: { tittel: 'Oppdageren og vokteren', tekst: '{hoy} vil se hva som finnes rundt neste sving, og {lav} passer på det dere allerede har. Sammen kan dere få både nye opplevelser og trygge tradisjoner.' },
      A: { tittel: 'Diplomaten og den rettlinjede', tekst: '{hoy} vil helst at alle skal ha det bra, og {lav} vil helst at ting blir sagt som de er. Sammen kan dere få både varme og ærlighet.' },
      C: { tittel: 'Planleggeren og improvisatøren', tekst: '{hoy} har gjerne lagt planen, og {lav} er gjerne den som finner på noe nytt underveis. Sammen kan dere få både struktur og spontanitet.' }
    },
    // Tittel når dere er like og begge ligger høyt eller lavt.
    likeTittel: {
      'N+': { tittel: 'De følsomme', tekst: 'Dere kjenner begge livet sterkt. Dere forstår hverandres uro godt, men kan også smitte hverandre med den.' },
      'N-': { tittel: 'De uforstyrrelige', tekst: 'Dere er begge rolige og stødige. Hos dere blir det sjelden mye dramatikk.' },
      'E+': { tittel: 'Det sosiale laget', tekst: 'Dere får begge energi av folk. Huset er sjelden stille lenge.' },
      'E-': { tittel: 'Hjemmekoserne', tekst: 'Dere trives begge best i ro, hjemme og med hverandre.' },
      'O+': { tittel: 'Utforskerne', tekst: 'Dere er begge nysgjerrige og lar dere lett begeistre av nye ideer og steder.' },
      'O-': { tittel: 'De jordnære', tekst: 'Dere setter begge pris på det kjente og praktiske, og vet hva dere liker.' },
      'A+': { tittel: 'Det varme laget', tekst: 'Dere er begge omtenksomme og opptatt av at den andre skal ha det bra.' },
      'A-': { tittel: 'De rettlinjede', tekst: 'Dere sier begge det som det er. Hos dere er det lite som blir pakket inn.' },
      'C+': { tittel: 'Prosjektlaget', tekst: 'Dere er begge strukturerte og pålitelige. Hverdagen går gjerne som et velsmurt maskineri.' },
      'C-': { tittel: 'Improvisatørene', tekst: 'Dere er begge spontane og fleksible, og lar gjerne ting ordne seg underveis.' }
    },
    balansert: { tittel: 'De allsidige', tekst: 'Dere ligger ganske nær hverandre og nær midten på de fleste trekkene. Det gir god felles forståelse og mye fleksibilitet.' },

    // Scener fra hverdagen, per trekk. Type: ulike, beggeHoy, beggeLav.
    scener: {
      C: {
        overskrift: 'En helt vanlig uke',
        ulike: 'Fredag ettermiddag: {hoy} har allerede tenkt gjennom helgen, handlelisten og hvem som gjør hva. {lav} har ikke tenkt så langt ennå, og synes egentlig det er det som er fint med helger. Her ligger det små irritasjoner på lur, men også et godt lagspill: {hoy} gir trygghet og forutsigbarhet, {lav} gir rom for det uplanlagte.',
        beggeHoy: 'Hos dere er det orden i sakene: felles kalender, faste rutiner og ting som blir gjort i tide. Det gir ro, men hjemmet kan også bli et lite prosjektkontor der hvile og spontane innfall må kjempe om plassen.',
        beggeLav: 'Hos dere blir mye bestemt i siste liten, og det er en del av sjarmen. Men når ingen av dere egentlig liker å planlegge, kan regninger, skjemaer og praktiske ting bli liggende til det haster.'
      },
      E: {
        overskrift: 'Lørdag kveld',
        ulike: '{hoy} har lyst ut eller vil invitere folk, mens {lav} har gledet seg til en rolig kveld hjemme. Ingen av dere tar feil, dere lader bare på ulike måter. Det kan bli en dragkamp, eller en fin balanse der {hoy} drar dere ut og {lav} sørger for at dere også får tid alene sammen.',
        beggeHoy: 'Dere har trolig en full kalender og et stort nettverk, og huset er ofte fullt. Dere trives med det. Faren er at tiden bare for dere to er den som ryker først.',
        beggeLav: 'Dere trives best hjemme, i hverandres selskap og med noen få nære venner. Det gir en rolig og nær hverdag. Pass på at nettverket rundt dere ikke krymper uten at dere merker det.'
      },
      N: {
        overskrift: 'Når noe går galt',
        ulike: 'En uventet regning, en vanskelig beskjed på jobben: {hoy} reagerer raskt og sterkt, mens {lav} forblir rolig. Det kan være en styrke, siden én kjenner alvoret og én holder hodet kaldt. Men det kan også bli «du overreagerer» mot «du bryr deg ikke», og ingen av delene er som regel sant.',
        beggeHoy: 'Når stresset kommer, kjenner dere det begge, og det kan smitte. To bekymrede hoder kan få små ting til å vokse. Samtidig forstår dere hverandre godt og vet hvordan det føles.',
        beggeLav: 'Stress preller ganske godt av på dere begge, og det gir et rolig hjem. Bakdelen kan være at vanskelige ting ikke blir snakket om før de har vokst seg store.'
      },
      A: {
        overskrift: 'Når dere er uenige',
        ulike: '{lav} vil gjerne ta saken der og da, rett fram. {hoy} vil helst finne en løsning der begge er fornøyde, og kan gi etter for å få fred. Over tid kan det bli skjevt hvis det alltid er {hoy} som gir seg. Samtidig kan dere lære av hverandre: {lav} viser at uenighet ikke er farlig, og {hoy} viser hvordan man sier vanskelige ting på en god måte.',
        beggeHoy: 'Dere er snille mot hverandre og unngår helst konflikter. Det gir en varm tone, men noen ganger blir viktige ting usagt fordi ingen vil lage bråk.',
        beggeLav: 'Dere sier det som det er, og diskusjonene kan gå friskt. Det er ærlig og klart, men det kan også bli hardt mot hardt. Det som hjelper, er å huske å vise varme også midt i en diskusjon.'
      },
      O: {
        overskrift: 'Når ferien skal planlegges',
        ulike: '{hoy} vil gjerne til et nytt sted, en ny kultur eller noe helt annerledes, mens {lav} gjerne drar dit dere vet at det er fint. {hoy} gir dere nye opplevelser, og {lav} gir dere tradisjoner og trygghet.',
        beggeHoy: 'Dere har trolig lange samtaler, mange ideer og felles lyst på nye opplevelser. Livet sammen er sjelden kjedelig, men det kan være mange prosjekter og planer i lufta samtidig.',
        beggeLav: 'Dere er enige om at det kjente er godt. Dere har trolig faste tradisjoner og vet hva dere liker. Små, nye ting sammen kan likevel gi nytt liv.'
      }
    },

    // Tilknytningsdansen: et bilde på hvordan nærhet og avstand kan spille seg ut.
    dans: {
      'trygg|trygg': 'Nærhet og avstand er stort sett lett hos dere. Når den ene trenger rom, tåler den andre det, og når den ene trenger nærhet, er den andre der.',
      'trygg|engstelig': 'Når {engstelig} kjenner uro og søker nærhet, kan {trygg} være en rolig havn. Tryggheten kan smitte, men bare hvis {engstelig} faktisk får kjenne at den er der.',
      'trygg|unnvikende': 'Når det blir mye nærhet, trekker {unnvikende} seg gjerne litt tilbake. {trygg} kan tåle det uten å ta det personlig, og det gjør det lettere for {unnvikende} å komme tilbake.',
      'trygg|fryktsom-unnvikende': '{fryktsom} kan veksle mellom å søke og å skyve unna nærhet. {trygg} kan være det faste punktet som ikke forsvinner, og det er ofte nettopp det som trengs.',
      'engstelig|engstelig': 'Dere søker begge nærhet og bekreftelse. Når begge er usikre samtidig, kan dere trekke hverandre ned i uroen. Når det er godt, er det svært godt.',
      'engstelig|unnvikende': 'Tenk dere en dans: Når {engstelig} tar et steg nærmere, tar {unnvikende} et steg tilbake, og da tar {engstelig} enda et steg fram. Ingen av dere gjør noe galt, men mønsteret kan gå i ring. Å se dansen sammen er ofte det første steget ut av den.',
      'engstelig|fryktsom-unnvikende': 'Begge kjenner på redsel for å miste den andre, men {fryktsom} kan også trekke seg unna når det blir nært. Det kan gi en usikker rytme der dere går glipp av hverandre.',
      'unnvikende|unnvikende': 'Dere gir hverandre mye rom, og det kan føles fritt og lett. Men det kan gå lang tid mellom de virkelig nære samtalene uten at noen av dere merker det.',
      'unnvikende|fryktsom-unnvikende': 'Begge kan trekke seg unna når det blir nært, men {fryktsom} lengter samtidig etter mer. Avstanden kan bli en vane hvis ingen tar første steg.',
      'fryktsom-unnvikende|fryktsom-unnvikende': 'Dere kjenner begge på både lengsel og forsiktighet. Når én åpner seg, kan den andre bli redd, og omvendt. Tålmodighet og små, trygge steg er nøkkelen.'
    },

    // Hva hver av dere bidrar med når dere er ulike.
    bidrag: {
      N: { hoy: 'følsomhet for når noe er i ferd med å gå galt', lav: 'ro og perspektiv' },
      E: { hoy: 'energi, initiativ og sosialt liv', lav: 'ro, lytting og nærvær' },
      O: { hoy: 'nysgjerrighet og nye opplevelser', lav: 'stabilitet og sans for det som fungerer' },
      A: { hoy: 'varme og evnen til å glatte ut', lav: 'ærlighet og evnen til å ta opp ting' },
      C: { hoy: 'struktur og gjennomføring', lav: 'fleksibilitet og spontanitet' }
    },
    bidragFelles: {
      'N-': 'ro', 'N+': 'innlevelse', 'E+': 'livsglede og et sosialt nettverk', 'E-': 'ro og nærhet',
      'O+': 'nysgjerrighet', 'O-': 'stabilitet', 'A+': 'varme og omsorg', 'A-': 'ærlighet',
      'C+': 'pålitelighet', 'C-': 'fleksibilitet'
    },

    // Fallgruven å se opp for.
    fallgruve: {
      N: 'at {hoy} føler seg avvist når {lav} prøver å roe ned, mens {lav} føler seg maktesløs',
      E: 'at {hoy} føler seg bremset og {lav} føler seg presset',
      O: 'at {hoy} føler seg innestengt og {lav} føler seg dratt med',
      A: 'at {hoy} gir etter så ofte at det hoper seg opp',
      C: 'at {hoy} blir «sjefen» i hjemmet og {lav} føler seg mast på'
    },
    fallgruveFelles: {
      'N+': 'at stress smitter mellom dere og blåser opp små ting',
      'E+': 'at tiden bare for dere to forsvinner i en full kalender',
      'E-': 'at nettverket rundt dere krymper uten at dere merker det',
      'A+': 'at viktige ting blir usagt for å bevare freden',
      'A-': 'at diskusjoner blir hardt mot hardt',
      'C+': 'at hverdagen blir et prosjekt og hvilen blir borte',
      'C-': 'at praktiske ting blir liggende til de haster'
    },
    fallgruveGenerell: 'at hverdagen tar over, og at dere glemmer å snakke om hvordan dere egentlig har det'
  }
};
