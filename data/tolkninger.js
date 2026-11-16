// tolkninger.js – forklaringstekstene i rapporten. Tekstene er skrevet for denne appen
// (de er ikke hentet fra noen testmanual). Hver tekst skal vise både styrker og mulige
// utfordringer. Høy eller lav skår er aldri «bra» eller «dårlig», bare ulike måter å være på.
//
// Nivåer: "hoy" = gjennomsnittssvar 3,5 eller mer (62,5 %), "lav" = 2,5 eller mindre (37,5 %),
// ellers "midt". Nivået sier hvordan du beskriver deg selv, ikke hvordan du er sammenlignet med andre.

window.PT_DATA = window.PT_DATA || {};

PT_DATA.tolkninger = {
  grenser: { lav: 37.5, hoy: 62.5 },

  domener: {
    N: {
      navn: 'Nevrotisisme',
      undertittel: 'Følelsesmessig sensitivitet',
      beskrivelse: 'Hvor sterkt og hvor ofte du kjenner på følelser som uro, irritasjon og nedstemthet, og hvor lett stress setter seg.',
      kortHoy: 'følelsesmessig sensitiv og raskt var for det som kan gå galt',
      kortLav: 'rolig og stødig, også når det stormer',
      hoy: {
        styrker: 'Du kjenner raskt når noe ikke stemmer, tar risiko på alvor og har ofte god innlevelse i hvordan andre har det.',
        utfordringer: 'Stress og bekymringer kan ta mye plass og sette seg i kroppen. Du kan trenge mer tid og støtte for å finne roen igjen.'
      },
      lav: {
        styrker: 'Du er rolig under press, kommer deg raskt etter motgang og kan være en trygg klippe for andre.',
        utfordringer: 'Du kan undervurdere risiko eller hvor mye noe preger andre, og virke uberørt når andre trenger å bli møtt i følelsene sine.'
      },
      midt: 'Du ligger i midten. Du kjenner på uro og stress som de fleste, men det tar sjelden overhånd.'
    },
    E: {
      navn: 'Ekstroversjon',
      undertittel: 'Energi fra mennesker og aktivitet',
      beskrivelse: 'Hvor mye energi du henter fra andre mennesker, aktivitet og nye inntrykk.',
      kortHoy: 'utadvendt og energisk sammen med andre',
      kortLav: 'rolig og innadvendt, og lader best i egen ro',
      hoy: {
        styrker: 'Du tar initiativ, skaper stemning og knytter lett kontakt. Du får energi av å være sammen med folk.',
        utfordringer: 'Stille perioder kan kjennes kjedelige, og du kan ta mye plass uten å merke det selv.'
      },
      lav: {
        styrker: 'Du lytter godt, trives med ro og fordypning og investerer gjerne i noen få nære relasjoner.',
        utfordringer: 'Mye sosialt kan tappe deg, og i store grupper kan stemmen din bli oversett. Du trenger tid alene for å lade opp.'
      },
      midt: 'Du ligger i midten. Du trives både med folk og med egen tid, og hva du trenger, avhenger av dagen.'
    },
    O: {
      navn: 'Åpenhet for erfaring',
      undertittel: 'Nysgjerrighet og nytenkning',
      beskrivelse: 'Hvor nysgjerrig du er på ideer, opplevelser, kunst og følelser, og hvor gjerne du prøver noe nytt.',
      kortHoy: 'nysgjerrig og åpen for nye ideer og opplevelser',
      kortLav: 'jordnær og praktisk, med sans for det som har vist seg å fungere',
      hoy: {
        styrker: 'Du er kreativ, ser nye muligheter og er åpen for andres perspektiver.',
        utfordringer: 'Rutiner kan gjøre deg rastløs, og interessene dine kan spre seg i mange retninger samtidig.'
      },
      lav: {
        styrker: 'Du er jordnær og praktisk, verdsetter det som fungerer og står stødig i verdiene dine.',
        utfordringer: 'Endringer kan virke unødvendige, og du kan avvise nye ideer før du har gitt dem en sjanse.'
      },
      midt: 'Du ligger i midten. Du er åpen for nye ting, men liker også det kjente og trygge.'
    },
    A: {
      navn: 'Medmenneskelighet',
      undertittel: 'Samarbeid og omtanke',
      beskrivelse: 'Hvor mye du er opptatt av samarbeid, harmoni og andres behov.',
      kortHoy: 'varm, tillitsfull og opptatt av at andre skal ha det bra',
      kortLav: 'direkte og selvstendig, og ikke redd for å si imot',
      hoy: {
        styrker: 'Du er varm og hjelpsom, har tillit til andre og er god til å dempe konflikter.',
        utfordringer: 'Du kan sette dine egne behov til side, ha vanskelig for å si nei eller unngå uenigheter som burde vært tatt opp.'
      },
      lav: {
        styrker: 'Du er direkte og ærlig, står for meningene dine og lar deg ikke lett utnytte.',
        utfordringer: 'Andre kan oppleve deg som kritisk eller konkurranseinnstilt, og harmonien kan noen ganger tape mot det å få rett.'
      },
      midt: 'Du ligger i midten. Du er omtenksom, men sier også ifra når det trengs.'
    },
    C: {
      navn: 'Planmessighet',
      undertittel: 'Struktur og pålitelighet',
      beskrivelse: 'Hvor organisert, pålitelig og målrettet du er.',
      kortHoy: 'strukturert og pålitelig, og en som gjennomfører',
      kortLav: 'fleksibel og spontan, og en som tar ting litt som de kommer',
      hoy: {
        styrker: 'Du er pålitelig, planlegger godt og fullfører det du begynner på.',
        utfordringer: 'Du kan bli rigid eller perfeksjonistisk, og det kan være vanskelig å slappe av når noe er uferdig.'
      },
      lav: {
        styrker: 'Du er fleksibel og spontan og tilpasser deg lett når planene endrer seg.',
        utfordringer: 'Ting kan bli utsatt eller glemt, og andre kan oppleve hverdagen med deg som lite forutsigbar.'
      },
      midt: 'Du ligger i midten. Du har struktur når det trengs, men kan også ta ting på sparket.'
    }
  },

  fasetter: {
    N1: { beskrivelse: 'Tendens til uro og bekymring.',
      hoy: 'Du bekymrer deg lett og er årvåken for det som kan gå galt. Det gjør deg godt forberedt, men kan også gi en indre uro som er vanskelig å slå av.',
      lav: 'Du bekymrer deg sjelden og slipper lett tanken på hva som kan gå galt. Det gir ro, men noen ganger kan du overse en risiko.' },
    N2: { beskrivelse: 'Hvor lett du blir irritert eller sint.',
      hoy: 'Du kjenner raskt irritasjon når noe er urettferdig eller frustrerende. Det viser hva som er viktig for deg, men kan skape gnisninger hvis det kommer brått.',
      lav: 'Du blir sjelden sint og tåler mye frustrasjon. Det gir ro i samspillet, men du kan holde tilbake ting som burde vært sagt.' },
    N3: { beskrivelse: 'Tendens til tristhet, motløshet og tvil på deg selv.',
      hoy: 'Du kjenner ofte på tunge følelser eller tvil på deg selv. Det kan gi dybde og innlevelse i andre. Hvis det tunge varer lenge, kan det være godt å snakke med noen om det.',
      lav: 'Du er sjelden nedstemt og har det stort sett godt med deg selv. Det gir et stabilt fundament, men kan gjøre det vanskeligere å forstå hvordan det er å ha det tungt.' },
    N4: { beskrivelse: 'Hvor ubekvem du føler deg sosialt, særlig med nye mennesker.',
      hoy: 'Du kan føle deg usikker eller sjenert blant nye mennesker og trives best med dem du kjenner. Det gjør deg ofte lyttende og varsom, men kan holde deg tilbake.',
      lav: 'Du er trygg i sosiale situasjoner og lar deg ikke lett vippe av pinlige øyeblikk. Det gjør det lett å ta kontakt, men du kan undervurdere hvor krevende slikt er for andre.' },
    N5: { beskrivelse: 'Hvor lett du gir etter for lyster og trang.',
      hoy: 'Du kjenner lystene sterkt og unner deg gjerne det du har lyst på. Det gir glede her og nå, men kan gjøre det krevende å holde igjen når du ønsker det.',
      lav: 'Du står lett imot fristelser og har god kontroll over impulsene dine. Det gir stabilitet, men det kan være vanskeligere å slippe deg løs.' },
    N6: { beskrivelse: 'Hvordan du takler press og kriser.',
      hoy: 'Under stort press kan du føle deg overveldet og trenge støtte for å finne fotfestet igjen. Å vite dette om deg selv gjør det lettere å be om hjelp tidlig.',
      lav: 'Du holder hodet kaldt under press og takler kriser godt. Andre kan lene seg på deg, men husk at også du har en grense.' },

    E1: { beskrivelse: 'Hvor varm og imøtekommende du er mot andre.',
      hoy: 'Du knytter lett bånd og viser tydelig at du liker folk. Andre føler seg raskt velkomne, men du kan bruke mye energi på å ta vare på mange relasjoner.',
      lav: 'Du er mer reservert og bruker tid før du slipper folk inn. Relasjonene dine kan bli dype, men nye mennesker kan oppfatte deg som tilbakeholden.' },
    E2: { beskrivelse: 'Hvor mye du søker selskap og store sosiale lag.',
      hoy: 'Du trives i store lag og får energi av mange mennesker rundt deg. Rolige perioder kan likevel kjennes lange.',
      lav: 'Du foretrekker små lag eller egen tid framfor store sammenkomster. Det gir ro og nærhet, men du kan gå glipp av ting andre setter pris på.' },
    E3: { beskrivelse: 'Hvor mye du tar styringen og gjør deg gjeldende.',
      hoy: 'Du tar gjerne ledelsen og sier tydelig hva du mener. Det skaper framdrift, men kan gjøre at andre slipper mindre til.',
      lav: 'Du lar gjerne andre lede og trives i en støttende rolle. Det gir rom for andre, men dine egne synspunkter kan bli for lite hørt.' },
    E4: { beskrivelse: 'Tempo, og hvor mye du fyller tiden med.',
      hoy: 'Du lever i høyt tempo og fyller dagene med aktivitet. Det gir mye gjort, men lite rom for hvile.',
      lav: 'Du foretrekker et rolig tempo og god tid. Det gir overskudd og ro, men andre kan savne en pådriver.' },
    E5: { beskrivelse: 'Behovet for spenning, fart og nye inntrykk.',
      hoy: 'Du trives med spenning og tar gjerne sjanser for en god opplevelse. Det gir liv og eventyr, men kan innebære risiko.',
      lav: 'Du trives best uten mye dramatikk og foretrekker det trygge og forutsigbare. Det gir stabilitet, men kan gjøre livet litt mindre eventyrlig.' },
    E6: { beskrivelse: 'Hvor ofte du kjenner glede, entusiasme og optimisme.',
      hoy: 'Du kjenner ofte glede og entusiasme og smitter gjerne andre med det. Pass på at det også er rom for de tyngre følelsene.',
      lav: 'Du er mer avdempet i uttrykket og viser sjeldnere stor begeistring. Gleden din kan være mer stille, og andre kan feiltolke det som misnøye.' },

    O1: { beskrivelse: 'Hvor mye du lever i tanker, dagdrømmer og fantasi.',
      hoy: 'Du har et rikt indre liv og lar gjerne tankene vandre. Det gir kreativitet, men kan gjøre det vanskeligere å være til stede i hverdagen.',
      lav: 'Du er jordnær og opptatt av det konkrete her og nå. Det gjør deg praktisk og fokusert, men du kan gå glipp av lekne tanker og nye ideer.' },
    O2: { beskrivelse: 'Sansen for skjønnhet, kunst og estetikk.',
      hoy: 'Du blir berørt av kunst, musikk, natur og det vakre i hverdagen. Det gir rikdom, men du kan reagere sterkt på omgivelser som ikke fungerer.',
      lav: 'Kunst og estetikk betyr mindre for deg enn andre ting, og du verdsetter det nyttige. Det gir nøkternhet, men du kan gå glipp av noe som betyr mye for andre.' },
    O3: { beskrivelse: 'Hvor godt du merker og verdsetter dine egne og andres følelser.',
      hoy: 'Du kjenner følelsene dine godt og fanger opp andres stemninger. Det gir nærhet og innsikt, men kan også bli mye å bære.',
      lav: 'Du er mindre opptatt av følelser og tenker heller i fakta og løsninger. Det gir ro, men andre kan savne at du setter ord på det du kjenner.' },
    O4: { beskrivelse: 'Lysten til å prøve nye ting framfor det kjente.',
      hoy: 'Du liker variasjon og nye opplevelser og blir lett lei rutiner. Det holder livet friskt, men kan gjøre det vanskelig å slå seg til ro.',
      lav: 'Du trives med det kjente og vet hva du liker. Det gir trygghet, men forandringer kan kjennes krevende.' },
    O5: { beskrivelse: 'Gleden ved ideer, teorier og krevende tanker.',
      hoy: 'Du liker å gruble over ideer og store spørsmål og blir engasjert av gode diskusjoner. Andre kan av og til synes det blir for abstrakt.',
      lav: 'Du foretrekker det konkrete og praktiske framfor abstrakte diskusjoner. Det gjør deg løsningsorientert, men du kan miste tålmodigheten med lange teoretiske samtaler.' },
    O6: { beskrivelse: 'Åpenhet for å utfordre tradisjoner, autoriteter og etablerte verdier.',
      hoy: 'Du utfordrer gjerne normer og tradisjoner og ser saker fra flere sider. Det gir åpenhet, men kan skape avstand til dem som verdsetter det etablerte.',
      lav: 'Du verdsetter tradisjon, orden og tydelige normer. Det gir stabilitet og retning, men kan gjøre det vanskeligere å forstå andre verdivalg.',
      merknad: 'To av de fire påstandene handler om å stemme liberalt eller konservativt, ord som betyr noe annet i USA enn i Norge. Tolk derfor denne fasetten med ekstra varsomhet.' },

    A1: { beskrivelse: 'Hvor lett du tror på andres gode hensikter.',
      hoy: 'Du tror det beste om folk og møter dem med tillit. Det gjør relasjoner lette, men du kan bli skuffet eller utnyttet.',
      lav: 'Du er avventende og vil se at folk fortjener tilliten din før du gir den. Det beskytter deg, men kan gjøre det vanskeligere for andre å komme nær.' },
    A2: { beskrivelse: 'Ærlighet og oppriktighet i møte med andre.',
      hoy: 'Du er rett fram og ærlig og misliker å manipulere eller utnytte andre. Det gir tillit, men du kan være naiv i taktiske situasjoner.',
      lav: 'Du er villig til å spille taktisk eller bøye regler for å nå målene dine. Det kan gi gjennomslag, men kan koste tillit.' },
    A3: { beskrivelse: 'Ønsket om å hjelpe og bry deg om andre.',
      hoy: 'Du hjelper gjerne og blir glad av å gjøre noe for andre. Husk at også du har behov.',
      lav: 'Du prioriterer egne oppgaver og behov og tar ikke automatisk ansvar for andres. Det sparer krefter, men andre kan savne at du stiller opp.' },
    A4: { beskrivelse: 'Hvordan du håndterer uenighet og konflikt.',
      hoy: 'Du unngår helst krangel og strekker deg langt for å finne enighet. Pass på at viktige uenigheter likevel blir tatt opp.',
      lav: 'Du står på ditt og går gjerne inn i en diskusjon. Det skaper klarhet, men kan oppleves som konfronterende.' },
    A5: { beskrivelse: 'Hvor lite du framhever deg selv.',
      hoy: 'Du snakker lite om egne fortjenester og trives uten å stå i sentrum. Pass på at du ikke underselger deg selv.',
      lav: 'Du har en tydelig tro på deg selv og evnene dine og viser det gjerne. Det gir selvtillit, men kan oppfattes som skryt.' },
    A6: { beskrivelse: 'Hvor sterkt andres nød og lidelse berører deg.',
      hoy: 'Du blir berørt av andres nød og vil gjerne hjelpe dem som har det vanskelig. Andres smerte kan også tynge deg.',
      lav: 'Du er nøktern og rasjonell i møte med andres problemer. Det gjør deg til en god problemløser, men du kan virke lite berørt.' },

    C1: { beskrivelse: 'Troen på at du får til det du setter deg fore.',
      hoy: 'Du har tro på at du får ting til, og går løs på oppgaver med selvsikkerhet. Pass på at du ikke tar på deg for mye.',
      lav: 'Du tviler oftere på om du klarer oppgavene. Det kan gjøre deg grundig og ydmyk, men kan også holde deg tilbake.' },
    C2: { beskrivelse: 'Behovet for orden, ryddighet og system.',
      hoy: 'Du liker orden og har gjerne en fast plass til ting. Det gir oversikt, men rot kan stresse deg.',
      lav: 'Du har et avslappet forhold til rot og orden. Det gir fleksibilitet, men kan skape friksjon med noen som trenger mer system.' },
    C3: { beskrivelse: 'Hvor sterkt du føler deg bundet av løfter og regler.',
      hoy: 'Du holder det du lover og tar plikter alvorlig. Andre kan stole på deg, men du kan bli streng mot deg selv.',
      lav: 'Du ser mer fleksibelt på regler og avtaler og tilpasser deg situasjonen. Det gir handlingsrom, men kan oppleves som uforutsigbart.' },
    C4: { beskrivelse: 'Hvor mye du strekker deg mot høye mål.',
      hoy: 'Du har høye ambisjoner og jobber hardt for å nå dem. Pass på at det også er rom for hvile.',
      lav: 'Du er fornøyd med å gjøre det som trengs, og lar ikke arbeidet styre livet. Det gir balanse, men andre kan savne mer innsats.' },
    C5: { beskrivelse: 'Evnen til å komme i gang og fullføre, også når det er kjedelig.',
      hoy: 'Du kommer lett i gang og fullfører det du har bestemt deg for. Det kan gjøre det vanskelig å la ting ligge.',
      lav: 'Du kan slite med å komme i gang og utsetter gjerne kjedelige oppgaver. Faste rammer og avtaler med andre kan hjelpe.' },
    C6: { beskrivelse: 'Hvor grundig du tenker deg om før du handler.',
      hoy: 'Du tenker deg godt om før du bestemmer deg, og unngår forhastede valg. Det gir gode avgjørelser, men kan gjøre deg treg.',
      lav: 'Du handler raskt og spontant og tar beslutninger i farten. Det gir handlekraft, men noen valg kan bli forhastede.' }
  },

  fasettMidt: 'Du ligger i midten her, og kjenner deg trolig igjen i begge sider avhengig av situasjonen.',

  tilknytning: {
    innledning: 'Tilknytning handler om hvordan vi har det i nære relasjoner, særlig med en partner. ECR-R måler to dimensjoner.',
    ANX: {
      navn: 'Tilknytningsangst',
      beskrivelse: 'Hvor mye du bekymrer deg for om partneren er glad i deg og vil være der for deg.',
      hoy: 'Du kjenner ofte på uro for om partneren føler like sterkt som deg, og merker raskt små endringer i forholdet.',
      lav: 'Du er stort sett trygg på at partneren er glad i deg, og bekymrer deg lite for å bli forlatt.'
    },
    AVO: {
      navn: 'Tilknytningsunngåelse',
      beskrivelse: 'Hvor ubehagelig du synes det er å være nær, åpne deg og lene deg på en partner.',
      hoy: 'Du verdsetter selvstendighet høyt og kan synes at mye nærhet og åpenhet blir litt for tett.',
      lav: 'Du synes det er naturlig å være nær, dele det du tenker og føler, og lene deg på partneren.'
    },
    kvadranter: {
      'trygg': {
        navn: 'Trygg',
        tekst: 'Du er stort sett trygg på at partneren er der for deg, og du synes det er godt å være nær og lene deg på hverandre.',
        styrker: 'Åpenhet, tillit og evne til å både gi og ta imot støtte.',
        utfordringer: 'Også trygge mennesker har sårbare øyeblikk. Det er lett å ta tryggheten for gitt og glemme å vise den.'
      },
      'engstelig': {
        navn: 'Engstelig',
        tekst: 'Du ønsker mye nærhet og kan bekymre deg for om partneren føler like sterkt. Du merker raskt små endringer i forholdet.',
        styrker: 'Engasjement, varme og stor oppmerksomhet på relasjonen.',
        utfordringer: 'Usikkerhet kan gi et sterkt behov for bekreftelse, og små signaler kan tolkes som større enn de er.'
      },
      'unnvikende': {
        navn: 'Unnvikende',
        tekst: 'Du verdsetter selvstendighet og egen plass, og kan synes at mye nærhet og følelsesprat blir litt trangt.',
        styrker: 'Selvstendighet, ro og evne til å stå på egne bein.',
        utfordringer: 'Du kan holde følelser og behov for deg selv, og partneren kan savne åpenhet og nærhet.'
      },
      'fryktsom-unnvikende': {
        navn: 'Fryktsom-unnvikende',
        tekst: 'Du ønsker nærhet, men kan samtidig være redd for å bli såret og trekke deg unna når det blir nært.',
        styrker: 'Stor bevissthet om sårbarhet, både din egen og andres.',
        utfordringer: 'Det kan bli en indre dragkamp mellom å ønske nærhet og å beskytte seg, og det kan forvirre både deg og partneren.'
      }
    },
    glidende: 'De fire feltene er en forenkling. Angst og unngåelse er glidende skalaer, ikke faste bokser, og forskningen viser at folk fordeler seg jevnt utover, ikke i fire klare grupper (Fraley). Se på hvor punktet ligger, ikke bare hvilket felt det havner i. Tilknytning kan også endre seg over tid og med trygge relasjoner.',
    naerGrensen: 'Punktet ditt ligger nær en skillelinje, så feltnavnet sier ekstra lite. Du har trekk fra begge sider.'
  }
};
