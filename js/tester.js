// tester.js – automatiske tester. Åpne tester.html i nettleseren for å kjøre dem.
// Hver test er en liten funksjon som feiler (kaster en feil) hvis noe ikke stemmer.

(function () {
  'use strict';

  var S = PT.skaring, K = PT.kode, IPIP = PT_DATA.ipip, ECR = PT_DATA.ecr;
  var grupper = [], aktiv = null;

  // ---------- Et lite testverktøy ----------
  function gruppe(navn, fn) { aktiv = { navn: navn, tester: [] }; grupper.push(aktiv); fn(); }
  function test(navn, fn) { aktiv.tester.push({ navn: navn, fn: fn }); }
  function likt(faktisk, forventet, hva) {
    if (JSON.stringify(faktisk) !== JSON.stringify(forventet)) {
      throw new Error((hva ? hva + ': ' : '') + 'fikk ' + JSON.stringify(faktisk) + ', forventet ' + JSON.stringify(forventet));
    }
  }
  function naer(faktisk, forventet, toleranse, hva) {
    if (!(Math.abs(faktisk - forventet) <= toleranse)) {
      throw new Error((hva ? hva + ': ' : '') + 'fikk ' + faktisk + ', forventet ' + forventet + ' ± ' + toleranse);
    }
  }
  function kaster(fn, hva) {
    try { fn(); } catch (e) { return e; }
    throw new Error('Forventet en feil' + (hva ? ' (' + hva + ')' : '') + ', men ingen kom');
  }
  function fyll(antall, verdi) { var a = []; for (var i = 0; i < antall; i++) a.push(verdi); return a; }
  // Svar som gir høyeste skår på alt: 5 (eller 7) på vanlige, 1 på reverserte.
  function ekstremSvar(data, hoy) {
    var min = data.svarskala.min, max = data.svarskala.max;
    return data.pastander.map(function (p) {
      var topp = (p.nokkel === '+') === hoy;
      return topp ? max : min;
    });
  }
  // Enkel tallgenerator med fast startverdi, så "tilfeldige" svar blir like hver gang.
  function tallrekke(start) {
    var x = start;
    return function (min, max) { x = (x * 1103515245 + 12345) % 2147483648; return min + (x % (max - min + 1)); };
  }
  function tilfeldigeSvar(data, neste) {
    return data.pastander.map(function () { return neste(data.svarskala.min, data.svarskala.max); });
  }

  // ======================================================================
  gruppe('Datafilene stemmer med kildene', function () {
    test('IPIP har 120 påstander nummerert 1–120', function () {
      likt(IPIP.pastander.length, 120);
      likt(IPIP.pastander.map(function (p) { return p.nr; }), fyll(120, 0).map(function (_, i) { return i + 1; }));
    });
    test('IPIP: 30 fasetter med nøyaktig 4 påstander hver', function () {
      var n = S.antallPerGruppe(IPIP, 'fasett');
      likt(Object.keys(n).length, 30);
      IPIP.fasetter.forEach(function (f) { likt(n[f.kode], 4, f.kode); });
    });
    test('IPIP: 65 positivt og 55 negativt nøklede påstander (Johnson 2014)', function () {
      likt(IPIP.pastander.filter(function (p) { return p.nokkel === '+'; }).length, 65);
      likt(IPIP.pastander.filter(function (p) { return p.nokkel === '-'; }).length, 55);
    });
    test('IPIP: andel positive per trekk er N 71 %, E 75 %, O 50 %, A 29 %, C 46 % (Johnson 2014)', function () {
      var forventet = { N: 71, E: 75, O: 50, A: 29, C: 46 };
      Object.keys(forventet).forEach(function (d) {
        var ps = IPIP.pastander.filter(function (p) { return p.fasett.charAt(0) === d; });
        var pos = ps.filter(function (p) { return p.nokkel === '+'; }).length;
        likt(Math.round(pos / ps.length * 100), forventet[d], d);
      });
    });
    test('IPIP: påstandene veksler N, E, O, A, C i nummerrekkefølge', function () {
      IPIP.pastander.forEach(function (p) { likt(p.fasett.charAt(0), 'NEOAC'.charAt((p.nr - 1) % 5), 'nr ' + p.nr); });
    });
    test('ECR-R har 36 påstander: 1–18 angst, 19–36 unngåelse', function () {
      likt(ECR.pastander.length, 36);
      ECR.pastander.forEach(function (p) { likt(p.dimensjon, p.nr <= 18 ? 'ANX' : 'AVO', 'nr ' + p.nr); });
    });
    test('ECR-R: reverserte påstander er nøyaktig 9, 11, 20, 22, 26–31, 33–36 (Fraley)', function () {
      likt(ECR.pastander.filter(function (p) { return p.nokkel === '-'; }).map(function (p) { return p.nr; }),
        [9, 11, 20, 22, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36]);
    });
    test('Alle påstander har både engelsk original og norsk tekst', function () {
      IPIP.pastander.concat(ECR.pastander).forEach(function (p) {
        if (!p.en || !p.no) throw new Error('Påstand ' + p.nr + ' mangler tekst');
      });
    });
  });

  // ======================================================================
  gruppe('Reversering', function () {
    test('5-punkts skala: 1↔5, 2↔4, 3 blir 3', function () {
      likt([1, 2, 3, 4, 5].map(function (s) { return S.reverser(s, 1, 5); }), [5, 4, 3, 2, 1]);
    });
    test('7-punkts skala: 8 − svar (1↔7, 4 blir 4)', function () {
      likt([1, 2, 3, 4, 5, 6, 7].map(function (s) { return S.reverser(s, 1, 7); }), [7, 6, 5, 4, 3, 2, 1]);
    });
    test('Positivt nøklet påstand beholder svaret, negativt nøklet snus', function () {
      likt(S.poeng(4, '+', 1, 5), 4);
      likt(S.poeng(4, '-', 1, 5), 2);
      likt(S.poeng(6, '-', 1, 7), 2);
    });
    test('Ukjent nøkkel gir feil', function () { kaster(function () { S.poeng(3, '?', 1, 5); }); });
    test('IPIP: maks svar på reverserte og min på vanlige gir 0 % på alle fasetter', function () {
      var svar = ekstremSvar(IPIP, false);
      var p = S.lagProfil(svar, fyll(36, 4), IPIP, ECR);
      IPIP.fasetter.forEach(function (f) { likt(p.fasetter[f.kode].prosent, 0, f.kode); });
    });
    test('IPIP: 5 på vanlige og 1 på reverserte gir 100 % på alle fasetter og trekk', function () {
      var p = S.lagProfil(ekstremSvar(IPIP, true), fyll(36, 4), IPIP, ECR);
      IPIP.fasetter.forEach(function (f) { likt(p.fasetter[f.kode].prosent, 100, f.kode); });
      IPIP.domener.forEach(function (d) { likt(p.domener[d.kode].prosent, 100, d.kode); });
    });
    test('IPIP: svarer man 5 på ALT, avhenger skåren av andelen reverserte påstander', function () {
      var p = S.lagProfil(fyll(120, 5), fyll(36, 4), IPIP, ECR);
      likt(p.fasetter.N1.prosent, 100, 'N1 (4 vanlige)');
      likt(p.fasetter.A2.prosent, 0, 'A2 (4 reverserte)');
      likt(p.fasetter.N2.sum, 5 + 5 + 5 + 1, 'N2-sum (3 vanlige, 1 reversert)');
      likt(p.fasetter.N2.prosent, 75, 'N2');
      likt(p.fasetter.O4.prosent, 25, 'O4 (1 vanlig, 3 reverserte)');
    });
    test('ECR-R: høyeste mulige på begge dimensjoner gir 100 %', function () {
      var p = S.lagProfil(fyll(120, 3), ekstremSvar(ECR, true), IPIP, ECR);
      likt(p.tilknytning.ANX.prosent, 100); likt(p.tilknytning.AVO.prosent, 100);
    });
    test('ECR-R: 7 på alt gir angst 6,33 (2 reverserte) og unngåelse 3,0 (12 reverserte)', function () {
      var p = S.lagProfil(fyll(120, 3), fyll(36, 7), IPIP, ECR);
      naer(p.tilknytning.ANX.snitt, (16 * 7 + 2 * 1) / 18, 1e-9, 'angst');
      naer(p.tilknytning.AVO.snitt, (6 * 7 + 12 * 1) / 18, 1e-9, 'unngåelse');
    });
  });

  // ======================================================================
  gruppe('Skåring og prosent', function () {
    test('Midtsvar (3 på IPIP, 4 på ECR-R) gir 50 % overalt, uansett reversering', function () {
      var p = S.lagProfil(fyll(120, 3), fyll(36, 4), IPIP, ECR);
      IPIP.fasetter.forEach(function (f) { likt(p.fasetter[f.kode].prosent, 50, f.kode); });
      IPIP.domener.forEach(function (d) { likt(p.domener[d.kode].prosent, 50, d.kode); });
      likt(p.tilknytning.ANX.prosent, 50); likt(p.tilknytning.AVO.prosent, 50);
    });
    test('Fraleys eget regneeksempel («Chris») gir angst 2,33 og unngåelse 2,17', function () {
      var eks = ECR.kontrolleksempel;
      var p = S.lagProfil(fyll(120, 3), eks.svar, IPIP, ECR);
      naer(p.tilknytning.ANX.snitt, eks.forventet.ANX, 0.005, 'angst');
      naer(p.tilknytning.AVO.snitt, eks.forventet.AVO, 0.005, 'unngåelse');
    });
    test('Et trekk er gjennomsnittet av sine seks fasetter', function () {
      var p = S.lagProfil(tilfeldigeSvar(IPIP, tallrekke(7)), fyll(36, 4), IPIP, ECR);
      IPIP.domener.forEach(function (d) {
        var fs = IPIP.fasetter.filter(function (f) { return f.kode.charAt(0) === d.kode; });
        var snitt = fs.reduce(function (s, f) { return s + p.fasetter[f.kode].prosent; }, 0) / fs.length;
        naer(p.domener[d.kode].prosent, snitt, 1e-9, d.kode);
      });
    });
    test('Én konkret fasett regnet for hånd (N2 med svar 4, 2, 5, 4 der siste er reversert)', function () {
      var svar = fyll(120, 3);
      svar[6 - 1] = 4; svar[36 - 1] = 2; svar[66 - 1] = 5; svar[96 - 1] = 4; // nr 96 er reversert: 4 → 2
      var p = S.lagProfil(svar, fyll(36, 4), IPIP, ECR);
      likt(p.fasetter.N2.sum, 4 + 2 + 5 + 2);
      naer(p.fasetter.N2.prosent, (13 / 4 - 1) / 4 * 100, 1e-9);
    });
    test('Ugyldige svar avvises: 0, 6, 2,5, tekst og manglende svar', function () {
      [0, 6, 2.5, '3', null, undefined].forEach(function (galt) {
        var svar = fyll(120, 3); svar[9] = galt;
        kaster(function () { S.lagProfil(svar, fyll(36, 4), IPIP, ECR); }, String(galt));
      });
      kaster(function () { S.lagProfil(fyll(119, 3), fyll(36, 4), IPIP, ECR); }, 'for få svar');
      kaster(function () { S.lagProfil(fyll(120, 3), fyll(36, 8), IPIP, ECR); }, 'ECR-svar 8');
    });
  });

  // ======================================================================
  gruppe('Persentiler (bare ECR-R, fra Fraleys normer)', function () {
    test('Normalfordelingen: 50 % under 0, ca. 84 % under +1, ca. 97,5 % under 1,96', function () {
      naer(S.normalFordeling(0), 0.5, 1e-7);
      naer(S.normalFordeling(1), 0.8413, 0.0001);
      naer(S.normalFordeling(1.96), 0.975, 0.0001);
      naer(S.normalFordeling(-1), 0.1587, 0.0001);
    });
    test('Skår lik normgjennomsnittet gir persentil 50, ett standardavvik over gir 84', function () {
      likt(S.persentil(3.56, 3.56, 1.12), 50);
      likt(S.persentil(3.56 + 1.12, 3.56, 1.12), 84);
    });
    test('Persentil holdes mellom 1 og 99', function () {
      likt(S.persentil(1, 3.56, 0.1), 1);
      likt(S.persentil(7, 3.56, 0.1), 99);
    });
  });

  // ======================================================================
  gruppe('Tilknytningskvadrant', function () {
    var norm = ECR.normer.hele_utvalget;
    test('Lav angst og lav unngåelse → trygg', function () { likt(S.kvadrant(1.5, 1.5, norm).navn, 'trygg'); });
    test('Høy angst og lav unngåelse → engstelig', function () { likt(S.kvadrant(5.5, 1.5, norm).navn, 'engstelig'); });
    test('Lav angst og høy unngåelse → unnvikende', function () { likt(S.kvadrant(1.5, 5.5, norm).navn, 'unnvikende'); });
    test('Høy angst og høy unngåelse → fryktsom-unnvikende', function () { likt(S.kvadrant(5.5, 5.5, norm).navn, 'fryktsom-unnvikende'); });
    test('Punkt like ved en skillelinje markeres som «nær grensen»', function () {
      likt(S.kvadrant(norm.ANX.M + 0.1, 1.5, norm).naerGrensen, true);
      likt(S.kvadrant(1.5, 1.5, norm).naerGrensen, false);
    });
  });

  // ======================================================================
  gruppe('Resultatkode', function () {
    function profilFra(start) {
      var r = tallrekke(start);
      return S.lagProfil(tilfeldigeSvar(IPIP, r), tilfeldigeSvar(ECR, r), IPIP, ECR);
    }
    function sammeSummer(a, b) {
      IPIP.fasetter.forEach(function (f) { likt(b.fasetter[f.kode].sum, a.fasetter[f.kode].sum, f.kode); });
      likt(b.tilknytning, a.tilknytning, 'tilknytning');
      likt(b.domener, a.domener, 'trekk');
      likt(b.kvadrant, a.kvadrant, 'kvadrant');
    }
    test('Kode → profil gir nøyaktig samme profil (50 ulike svarsett)', function () {
      for (var i = 1; i <= 50; i++) {
        var p = profilFra(i * 97);
        sammeSummer(p, K.lesKode(K.lagKode(p, 'Test', IPIP, ECR), IPIP, ECR).profil);
      }
    });
    test('Ytterpunktene (alt lavest, alt høyest) overlever koden', function () {
      [false, true].forEach(function (hoy) {
        var p = S.lagProfil(ekstremSvar(IPIP, hoy), ekstremSvar(ECR, hoy), IPIP, ECR);
        sammeSummer(p, K.lesKode(K.lagKode(p, '', IPIP, ECR), IPIP, ECR).profil);
      });
    });
    test('Koden er kort (36 tegn uten navn)', function () { likt(K.lagKode(profilFra(1), '', IPIP, ECR).length, 36); });
    test('Navn med æøå, mellomrom og bindestrek kommer riktig tilbake', function () {
      ['Åse Øyhus', 'Kari-Mette', 'Bjørn'].forEach(function (navn) {
        likt(K.lesKode(K.lagKode(profilFra(3), navn, IPIP, ECR), IPIP, ECR).navn, navn);
      });
    });
    test('Hele lenker godtas (alt før # ignoreres)', function () {
      var p = profilFra(5), kode = K.lagKode(p, 'Kari', IPIP, ECR);
      var r = K.lesKode('https://eksempel.no/resultat.html#' + kode, IPIP, ECR);
      likt(r.navn, 'Kari'); sammeSummer(p, r.profil);
    });
    test('Ett feilskrevet tegn oppdages av kontrolltegnet', function () {
      var kode = K.lagKode(profilFra(11), '', IPIP, ECR);
      for (var i = 1; i < kode.length - 1; i++) {
        var nytt = kode.charAt(i) === '0' ? '1' : '0';
        var feil = kode.slice(0, i) + nytt + kode.slice(i + 1);
        kaster(function () { K.lesKode(feil, IPIP, ECR); }, 'endret tegn ' + i);
      }
    });
    test('Avkuttet kode, feil versjon og ugyldige tegn gir forståelig feilmelding', function () {
      var kode = K.lagKode(profilFra(13), '', IPIP, ECR);
      if (!/lengde/.test(kaster(function () { K.lesKode(kode.slice(0, 20), IPIP, ECR); }).message)) throw new Error('mangler forklaring');
      kaster(function () { K.lesKode('2' + kode.slice(1), IPIP, ECR); }, 'versjon');
      kaster(function () { K.lesKode(kode.slice(0, 5) + '!' + kode.slice(6), IPIP, ECR); }, 'ugyldig tegn');
      kaster(function () { K.lesKode('', IPIP, ECR); }, 'tom kode');
    });
    test('Koden inneholder ikke de enkelte svarene (bare summer)', function () {
      var a = fyll(120, 3), b = fyll(120, 3);
      a[0] = 5; a[30] = 1;   // to N1-påstander: 5 + 1
      b[0] = 1; b[30] = 5;   // samme sum, andre svar
      var ka = K.lagKode(S.lagProfil(a, fyll(36, 4), IPIP, ECR), '', IPIP, ECR);
      var kb = K.lagKode(S.lagProfil(b, fyll(36, 4), IPIP, ECR), '', IPIP, ECR);
      likt(ka, kb);
    });
  });

  // ======================================================================
  gruppe('Testpersonene', function () {
    test('Ingrid og Erik gir gyldige profiler og koder', function () {
      ['ingrid', 'erik'].forEach(function (id) {
        var s = PT.testdata.svarFor(id);
        var p = S.lagProfil(s.ipip, s.ecr, IPIP, ECR);
        K.lesKode(K.lagKode(p, s.navn, IPIP, ECR), IPIP, ECR);
      });
    });
    test('Ingrid havner som «unnvikende», Erik som «engstelig» (slik de er laget)', function () {
      function kv(id) { var s = PT.testdata.svarFor(id); return S.lagProfil(s.ipip, s.ecr, IPIP, ECR).kvadrant.navn; }
      likt(kv('ingrid'), 'unnvikende'); likt(kv('erik'), 'engstelig');
    });
  });

  // ======================================================================
  gruppe('Tolkninger og tekster', function () {
    var TK = PT_DATA.tolkninger, TL = PT.tolkning;
    test('Alle 5 trekk har beskrivelse, høy/lav-tekst (styrker og utfordringer) og midt-tekst', function () {
      IPIP.domener.forEach(function (d) {
        var t = TK.domener[d.kode];
        if (!t) throw new Error('Mangler ' + d.kode);
        ['beskrivelse', 'kortHoy', 'kortLav', 'midt'].forEach(function (f) { if (!t[f]) throw new Error(d.kode + ' mangler ' + f); });
        ['hoy', 'lav'].forEach(function (n) { if (!t[n].styrker || !t[n].utfordringer) throw new Error(d.kode + '.' + n + ' mangler styrker/utfordringer'); });
      });
    });
    test('Alle 30 fasetter har beskrivelse, høy-tekst og lav-tekst', function () {
      IPIP.fasetter.forEach(function (f) {
        var t = TK.fasetter[f.kode];
        if (!t || !t.beskrivelse || !t.hoy || !t.lav) throw new Error('Mangler tekst for ' + f.kode);
      });
      likt(Object.keys(TK.fasetter).length, 30);
    });
    test('Alle fire tilknytningsfelt har tekst, styrker og utfordringer', function () {
      ['trygg', 'engstelig', 'unnvikende', 'fryktsom-unnvikende'].forEach(function (k) {
        var t = TK.tilknytning.kvadranter[k];
        if (!t || !t.tekst || !t.styrker || !t.utfordringer) throw new Error('Mangler ' + k);
      });
    });
    test('Ingen tekster kaller en skår «bra» eller «dårlig»', function () {
      var alt = JSON.stringify(TK).toLowerCase();
      [' bra ', ' dårlig ', 'dårlig skår', 'god skår', 'heldigvis', 'dessverre'].forEach(function (ord) {
        if (alt.indexOf(ord) >= 0 && ord !== ' bra ') throw new Error('Fant «' + ord.trim() + '»');
      });
      if (/(skår|resultat)[^.]{0,30}\bbra\b/.test(alt)) throw new Error('En tekst kaller en skår bra');
    });
    test('Nivåer: 37,5 % og lavere er «lav», 62,5 % og høyere er «høy», ellers «midt»', function () {
      likt([0, 37.5, 37.6, 50, 62.4, 62.5, 100].map(TL.nivaa), ['lav', 'lav', 'midt', 'midt', 'midt', 'hoy', 'hoy']);
    });
    test('Nøtteskall: bare midtsvar gir «balansert» og nevner tilknytning', function () {
      var s = TL.notteskall(S.lagProfil(fyll(120, 3), fyll(36, 4), IPIP, ECR));
      likt(s.punkter.length, 0, 'punkter');
      if (!/balansert/.test(s.setninger[0])) throw new Error(s.setninger[0]);
      if (!/nære relasjoner/.test(s.setninger[s.setninger.length - 1])) throw new Error('mangler tilknytning');
    });
    test('Nøtteskall: tar med høyst tre tydelige trekk', function () {
      var p = S.lagProfil(ekstremSvar(IPIP, true), fyll(36, 4), IPIP, ECR);
      likt(TL.notteskall(p).punkter.length, 3);
    });
    test('Nøtteskall for Ingrid nevner høy planmessighet', function () {
      var t = PT.testdata.svarFor('ingrid');
      var s = TL.notteskall(S.lagProfil(t.ipip, t.ecr, IPIP, ECR)).punkter.join(' ').toLowerCase();
      if (s.indexOf(PT_DATA.tolkninger.domener.C.kortHoy) < 0) throw new Error(s);
    });
  });

  // ======================================================================
  gruppe('Parrapport', function () {
    var PA = PT.paranalyse;
    function person(id) { var t = PT.testdata.svarFor(id); return { navn: t.navn, profil: S.lagProfil(t.ipip, t.ecr, IPIP, ECR) }; }
    function midtPerson(navn) { return { navn: navn, profil: S.lagProfil(fyll(120, 3), fyll(36, 4), IPIP, ECR) }; }
    function medKvadrant(p, kv) { var k = JSON.parse(JSON.stringify(p)); k.profil.kvadrant = { navn: kv, naerGrensen: false }; return k; }
    var KV = ['trygg', 'engstelig', 'unnvikende', 'fryktsom-unnvikende'];

    test('Alle 16 kombinasjoner av tilknytningsfelt gir en ferdig tekst med riktige navn', function () {
      KV.forEach(function (x) {
        KV.forEach(function (y) {
          var an = PA.analyser(medKvadrant(midtPerson('Anna'), x), medKvadrant(midtPerson('Bo'), y));
          if (!an.tilknytning.tekst || /[{}]/.test(an.tilknytning.tekst)) throw new Error(x + '|' + y + ': ' + an.tilknytning.tekst);
          if (x !== y && (an.tilknytning.tekst.indexOf('Anna') < 0 || an.tilknytning.tekst.indexOf('Bo') < 0)) throw new Error(x + '|' + y + ' mangler navn');
        });
      });
    });
    test('Antall samtalespørsmål er alltid 8–12, uten duplikater', function () {
      var par = [[person('ingrid'), person('erik')], [midtPerson('A'), midtPerson('B')],
        [{ navn: 'Høy', profil: S.lagProfil(ekstremSvar(IPIP, true), ekstremSvar(ECR, true), IPIP, ECR) },
         { navn: 'Lav', profil: S.lagProfil(ekstremSvar(IPIP, false), ekstremSvar(ECR, false), IPIP, ECR) }]];
      par.forEach(function (p) {
        var s = PA.analyser(p[0], p[1]).sporsmal;
        if (s.length < 8 || s.length > 12) throw new Error(p[0].navn + '/' + p[1].navn + ': ' + s.length + ' spørsmål');
        likt(s.filter(function (x, i) { return s.indexOf(x) === i; }).length, s.length, 'duplikater');
        s.forEach(function (x) { if (/[{}]/.test(x)) throw new Error('Uutfylt: ' + x); });
      });
    });
    test('Ved store forskjeller nevnes den som skårer høyest, først', function () {
      var hoy = { navn: 'Høy', profil: S.lagProfil(ekstremSvar(IPIP, true), fyll(36, 4), IPIP, ECR) };
      var lav = { navn: 'Lav', profil: S.lagProfil(ekstremSvar(IPIP, false), fyll(36, 4), IPIP, ECR) };
      [PA.analyser(hoy, lav), PA.analyser(lav, hoy)].forEach(function (an) {
        an.domener.forEach(function (d) {
          likt(d.type, 'ulike', d.kode);
          if (d.tekst.indexOf('Høy') > d.tekst.indexOf('Lav')) throw new Error(d.kode + ': ' + d.tekst);
        });
      });
    });
    test('Moderat forskjell (mellom 12,5 og 25 poeng) kalles ikke «nær»', function () {
      var a = midtPerson('A'), b = midtPerson('B');
      b.profil.domener.E.prosent = 70; // 50 mot 70: forskjell 20
      var d = PA.analyser(a, b).domener.filter(function (x) { return x.kode === 'E'; })[0];
      likt(d.type, 'litt');
      if (d.tekst.indexOf('B ligger en del høyere enn A') < 0) throw new Error(d.tekst);
    });
    test('Like profiler gir ingen ulikheter og tre likheter', function () {
      var an = PA.analyser(person('ingrid'), person('ingrid'));
      likt(an.ulikheter.length, 0); likt(an.likheter.length, 3);
    });
    test('Ingrid og Erik: planmessighet og ekstroversjon-fasetter gir tydelige forskjeller', function () {
      var an = PA.analyser(person('ingrid'), person('erik'));
      likt(an.domener.filter(function (d) { return d.kode === 'C'; })[0].type, 'ulike', 'C');
      if (!an.ulikheter.length) throw new Error('ingen ulikheter');
      likt(an.tilknytning.nokkel, 'engstelig|unnvikende');
    });
    test('Claude-teksten har begge navn, alle 30 fasetter for hver person og ingen hull', function () {
      var t = PA.claudeTekst(person('ingrid'), person('erik'));
      ['Ingrid', 'Erik', 'IPIP-NEO-120', 'ECR-R', 'Tilknytningsangst', 'ikke still diagnoser'].forEach(function (ord) {
        if (t.toLowerCase().indexOf(ord.toLowerCase()) < 0) throw new Error('mangler ' + ord);
      });
      IPIP.fasetter.forEach(function (f) {
        var antall = t.split('  - ' + f.kode + ' ').length - 1;
        likt(antall, 2, f.kode);
      });
      if (/undefined|NaN|[{}]/.test(t)) throw new Error('teksten har hull');
    });
  });

  // ======================================================================
  gruppe('Portrett og pardynamikk', function () {
    var PO = PT.portrett, R = PT_DATA.portretter;
    // Lager varierte profiler: hvert trekk får et tilfeldig grunnivå, fasettene varierer rundt det.
    function variertProfil(start) {
      var r = tallrekke(start), fs = {};
      ['N', 'E', 'O', 'A', 'C'].forEach(function (d) {
        var base = r(4, 20);
        IPIP.fasetter.filter(function (f) { return f.kode.charAt(0) === d; }).forEach(function (f) {
          fs[f.kode] = Math.min(20, Math.max(4, base + r(-6, 6)));
        });
      });
      return S.profilFraSummer(fs, { ANX: r(18, 126), AVO: r(18, 126) }, IPIP, ECR);
    }
    function sjekkTekst(obj, hva) {
      var t = JSON.stringify(obj);
      if (/undefined|NaN/.test(t)) throw new Error(hva + ' har hull: ' + t.slice(0, 200));
      if (/\{[a-zæøå]+\}/.test(t)) throw new Error(hva + ' har uutfylt plassholder: ' + t.match(/\{[a-zæøå]+\}/)[0]);
      (obj.avsnitt || []).forEach(function (a) { if (!a.tekst || !a.overskrift) throw new Error(hva + ' har tomt avsnitt'); });
      if (!obj.tittel || !obj.ingress) throw new Error(hva + ' mangler tittel/ingress');
    }
    test('Alle 40 kombinasjoner av to trekk og alle 10 enkelttrekk har arketype', function () {
      var D5 = ['N', 'E', 'O', 'A', 'C'], antall = 0;
      D5.forEach(function (x, i) {
        D5.slice(i + 1).forEach(function (y) {
          ['+', '-'].forEach(function (sx) { ['+', '-'].forEach(function (sy) {
            var a = R.arketyper[x + sx + '|' + y + sy];
            if (!a || !a.tittel || !a.tekst) throw new Error('Mangler ' + x + sx + '|' + y + sy);
            antall++;
          }); });
        });
        ['+', '-'].forEach(function (s) { if (!R.enkelt[x + s]) throw new Error('Mangler enkelt ' + x + s); });
      });
      likt(antall, 40);
    });
    test('Portrett lages uten hull for 200 varierte profiler og for ytterpunktene', function () {
      for (var i = 1; i <= 200; i++) sjekkTekst(PO.individ(variertProfil(i * 31)), 'profil ' + i);
      sjekkTekst(PO.individ(S.lagProfil(ekstremSvar(IPIP, true), ekstremSvar(ECR, true), IPIP, ECR)), 'høy');
      sjekkTekst(PO.individ(S.lagProfil(fyll(120, 3), fyll(36, 4), IPIP, ECR)), 'midt');
    });
    test('Midtsvar gir «Allrounderen»', function () {
      likt(PO.individ(S.lagProfil(fyll(120, 3), fyll(36, 4), IPIP, ECR)).tittel, R.balansert.tittel);
    });
    test('Ingrid blir «Den pålitelige omsorgspersonen» (høy medmenneskelighet og planmessighet)', function () {
      var t = PT.testdata.svarFor('ingrid');
      likt(PO.individ(S.lagProfil(t.ipip, t.ecr, IPIP, ECR)).tittel, R.arketyper['A+|C+'].tittel);
    });
    test('Parfortelling lages uten hull for 100 varierte par', function () {
      for (var i = 1; i <= 100; i++) {
        var a = { navn: 'Anna', profil: variertProfil(i * 7) }, b = { navn: 'Bo', profil: variertProfil(i * 13 + 1) };
        var h = PO.par(a, b, PT.paranalyse.analyser(a, b));
        sjekkTekst(h, 'par ' + i);
        if (h.avsnitt.length < 3) throw new Error('par ' + i + ' har for få avsnitt');
      }
    });
    test('Ingrid og Erik blir «Planleggeren og improvisatøren», med Ingrid som planleggeren', function () {
      function p(id) { var t = PT.testdata.svarFor(id); return { navn: t.navn, profil: S.lagProfil(t.ipip, t.ecr, IPIP, ECR) }; }
      var a = p('ingrid'), b = p('erik'), h = PO.par(a, b, PT.paranalyse.analyser(a, b));
      likt(h.tittel, 'Planleggeren og improvisatøren');
      if (h.ingress.indexOf('Ingrid har gjerne lagt planen') !== 0) throw new Error(h.ingress);
    });
  });

  // ---------- Kjør alt og vis resultatet ----------
  var ok = 0, feil = 0, html = '';
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  grupper.forEach(function (g) {
    html += '<h2>' + esc(g.navn) + '</h2>';
    g.tester.forEach(function (t) {
      try { t.fn(); ok++; html += '<div class="test ok">' + esc(t.navn) + '</div>'; }
      catch (e) { feil++; html += '<div class="test feil">' + esc(t.navn) + '<span class="detalj">' + esc(e.message) + '</span></div>'; }
    });
  });
  document.getElementById('resultater').innerHTML = html;
  var o = document.getElementById('oppsummering');
  o.className = feil ? 'noe-feil' : 'alt-ok';
  o.textContent = feil ? feil + ' av ' + (ok + feil) + ' tester feilet' : 'Alle ' + ok + ' tester bestod ✓';
  window.TESTRESULTAT = { ok: ok, feil: feil };
})();
