// paranalyse.js – sammenligner to profiler. Rene funksjoner, testet i tester.html.
// a og b: { navn, profil } der profil kommer fra PT.skaring / PT.kode.

window.PT = window.PT || {};

PT.paranalyse = (function () {
  'use strict';

  var P = PT_DATA.parTekster, T = PT_DATA.tolkninger;
  var DOMENER = ['N', 'E', 'O', 'A', 'C'];
  var KV_REKKEFOLGE = ['trygg', 'engstelig', 'unnvikende', 'fryktsom-unnvikende'];

  function fyll(tekst, verdier) {
    return tekst.replace(/\{(\w+)\}/g, function (m, k) { return verdier[k] !== undefined ? verdier[k] : m; });
  }
  function navnPa(x, nr) { return x.navn || ('Person ' + nr); }

  function sammenlignDomene(d, a, b) {
    var pa = a.profil.domener[d].prosent, pb = b.profil.domener[d].prosent, diff = pa - pb;
    var na = PT.tolkning.nivaa(pa), nb = PT.tolkning.nivaa(pb), type, tekst;
    if (Math.abs(diff) >= P.grenser.ulik) {
      type = 'ulike';
      tekst = fyll(P.domener[d].ulike, diff > 0 ? { hoy: navnPa(a, 1), lav: navnPa(b, 2) } : { hoy: navnPa(b, 2), lav: navnPa(a, 1) });
    } else if (na === 'hoy' && nb === 'hoy') { type = 'beggeHoy'; tekst = P.domener[d].beggeHoy; }
    else if (na === 'lav' && nb === 'lav') { type = 'beggeLav'; tekst = P.domener[d].beggeLav; }
    else if (Math.abs(diff) <= P.grenser.naer) { type = 'naer'; tekst = P.naer; }
    else {
      type = 'litt';
      tekst = fyll(P.litt, diff > 0 ? { hoy: navnPa(a, 1), lav: navnPa(b, 2) } : { hoy: navnPa(b, 2), lav: navnPa(a, 1) });
    }
    return { kode: d, navn: T.domener[d].navn, omraade: P.domener[d].omraade, a: pa, b: pb, diff: diff, type: type, tekst: tekst };
  }

  function fasettListe(a, b) {
    return PT_DATA.ipip.fasetter.map(function (f) {
      var pa = a.profil.fasetter[f.kode].prosent, pb = b.profil.fasetter[f.kode].prosent;
      return { kode: f.kode, navn: f.no, domene: f.kode.charAt(0), a: pa, b: pb, diff: pa - pb };
    });
  }

  // Likheter: fasettene der dere ligger nærmest hverandre. Ved lik avstand foretrekkes
  // fasetter der dere begge ligger langt fra midten (de er mest «talende»).
  function likheter(fasetter) {
    return fasetter
      .filter(function (f) { return Math.abs(f.diff) <= P.grenser.naer; })
      .sort(function (x, y) {
        return (Math.abs(x.diff) - Math.abs(y.diff)) ||
          (Math.abs((y.a + y.b) / 2 - 50) - Math.abs((x.a + x.b) / 2 - 50));
      })
      .slice(0, 3)
      .map(function (f) { f.tekst = P.likFasett; return f; });
  }

  function ulikheter(fasetter) {
    return fasetter
      .filter(function (f) { return Math.abs(f.diff) >= P.grenser.ulik; })
      .sort(function (x, y) { return Math.abs(y.diff) - Math.abs(x.diff); })
      .slice(0, 4)
      .map(function (f) { f.tekst = P.domener[f.domene].ulikFasett; return f; });
  }

  function tilknytning(a, b) {
    var ka = a.profil.kvadrant.navn, kb = b.profil.kvadrant.navn;
    var sortert = [ka, kb].sort(function (x, y) { return KV_REKKEFOLGE.indexOf(x) - KV_REKKEFOLGE.indexOf(y); });
    var navn = {};
    navn[ka === 'fryktsom-unnvikende' ? 'fryktsom' : ka] = navnPa(a, 1);
    navn[kb === 'fryktsom-unnvikende' ? 'fryktsom' : kb] = navnPa(b, 2);
    navn.a = navnPa(a, 1); navn.b = navnPa(b, 2);
    return { a: ka, b: kb, nokkel: sortert.join('|'), tekst: fyll(P.tilknytning[sortert.join('|')], navn) };
  }

  function sporsmal(domener, lik, ulik, tk) {
    var S = P.sporsmal, spesifikke = [];
    domener.forEach(function (d) {
      if (d.type === 'ulike' && S.ulike[d.kode]) spesifikke.push(S.ulike[d.kode]);
      if (d.type === 'beggeHoy' && S.beggeHoy[d.kode]) spesifikke.push(S.beggeHoy[d.kode]);
      if (d.type === 'beggeLav' && S.beggeLav[d.kode]) spesifikke.push(S.beggeLav[d.kode]);
    });
    if (tk.a === 'trygg' && tk.b === 'trygg') spesifikke.push(S.tilknytning.beggeTrygg);
    [tk.a, tk.b].filter(function (k, i, arr) { return k !== 'trygg' && arr.indexOf(k) === i; })
      .forEach(function (k) { spesifikke.push(S.tilknytning[k]); });
    if (ulik.length) spesifikke.push(fyll(S.ulikFasett, { fasett: ulik[0].navn.toLowerCase() }));
    if (lik.length) spesifikke.push(fyll(S.likFasett, { fasett: lik[0].navn.toLowerCase() }));

    var liste = S.alltid.slice(0, 2).concat(spesifikke, S.alltid.slice(2));
    for (var i = 0; liste.length < 8 && i < S.reserve.length; i++) liste.push(S.reserve[i]);
    var unike = liste.filter(function (s, i) { return liste.indexOf(s) === i; });
    return unike.slice(0, 12);
  }

  function analyser(a, b) {
    var domener = DOMENER.map(function (d) { return sammenlignDomene(d, a, b); });
    var fasetter = fasettListe(a, b);
    var lik = likheter(fasetter.slice()), ulik = ulikheter(fasetter.slice());
    var tk = tilknytning(a, b);
    return { domener: domener, fasetter: fasetter, likheter: lik, ulikheter: ulik, tilknytning: tk,
      sporsmal: sporsmal(domener, lik, ulik, tk) };
  }

  // ---------- Tekst til en Claude-samtale ----------

  function profilTekst(x, nr) {
    var p = x.profil, linjer = [];
    var navn = navnPa(x, nr);
    linjer.push('## ' + navn);
    linjer.push('');
    linjer.push('Big Five (IPIP-NEO-120). Prosent av skalaen, 0–100. Nivå: lav ≤ 37,5, høy ≥ 62,5.');
    DOMENER.forEach(function (d) {
      linjer.push('- ' + T.domener[d].navn + ' (' + PT_DATA.ipip.domener.filter(function (x) { return x.kode === d; })[0].en + '): ' +
        Math.round(p.domener[d].prosent) + ' % (' + { lav: 'lav', midt: 'middels', hoy: 'høy' }[PT.tolkning.nivaa(p.domener[d].prosent)] + ')');
      PT_DATA.ipip.fasetter.filter(function (f) { return f.kode.charAt(0) === d; }).forEach(function (f) {
        linjer.push('  - ' + f.kode + ' ' + f.no + ' (' + f.en + '): ' + Math.round(p.fasetter[f.kode].prosent) + ' %');
      });
    });
    var t = p.tilknytning;
    linjer.push('');
    linjer.push('Tilknytning (ECR-R, skala 1–7):');
    linjer.push('- Tilknytningsangst: ' + t.ANX.snitt.toFixed(2) + ' (omtrent persentil ' + t.ANX.persentil + ' i Fraleys nettutvalg, M = 3,56, SD = 1,12)');
    linjer.push('- Tilknytningsunngåelse: ' + t.AVO.snitt.toFixed(2) + ' (omtrent persentil ' + t.AVO.persentil + ', M = 2,92, SD = 1,19)');
    linjer.push('- Nærmeste felt: ' + T.tilknytning.kvadranter[p.kvadrant.navn].navn + (p.kvadrant.naerGrensen ? ' (nær en skillelinje)' : ''));
    return linjer.join('\n');
  }

  function claudeTekst(a, b) {
    var na = navnPa(a, 1), nb = navnPa(b, 2);
    return [
      'Hei! Vi er et par, ' + na + ' og ' + nb + ', og vi har begge tatt to anerkjente personlighetstester. Vi vil gjerne bli bedre kjent med oss selv og hverandre, og vi ønsker en grundig og personlig analyse av resultatene våre.',
      '',
      '# Om testene',
      '- Big Five: IPIP-NEO-120 (Johnson, 2014), 5 hovedtrekk og 30 fasetter, svar på en skala fra 1 til 5. Skårene er prosent av skalaen (0 = laveste mulige, 100 = høyeste mulige). Det er IKKE persentiler, fordi det ikke finnes publiserte normer.',
      '- Tilknytning: ECR-R (Fraley, Waller og Brennan, 2000), to dimensjoner (angst og unngåelse), skala fra 1 til 7. Persentilene er grove anslag ut fra Fraleys nettnormer.',
      '- Dette er selvrapportering på ett tidspunkt, ikke en klinisk vurdering.',
      '',
      '# Resultatene',
      '',
      profilTekst(a, 1),
      '',
      profilTekst(b, 2),
      '',
      '# Det vi ønsker oss fra deg',
      '1. En kort, varm beskrivelse av hver av oss: hva som kjennetegner personligheten og tilknytningsstilen, med vekt på styrker og mulige utfordringer.',
      '2. Hva kombinasjonen vår kan bety i hverdagen: kommunikasjon, konflikt, nærhet, planlegging, sosialt liv og stress. Trekk gjerne fram samspill mellom fasetter, ikke bare hovedtrekkene.',
      '3. Hva tilknytningskombinasjonen vår typisk betyr i praksis, og hvordan vi kan støtte hverandre.',
      '4. Konkrete, små ting vi kan prøve den neste måneden.',
      '5. Noen gode spørsmål vi kan snakke om sammen.',
      '',
      'Viktig:',
      '- Bygg på etablert forskning (for eksempel om nevrotisisme, medmenneskelighet, tilknytning og tilfredshet i forholdet), og si fra når noe er usikkert eller bare gjelder i gjennomsnitt.',
      '- Beskriv tendenser, ikke dommer. Høy eller lav skår er aldri bra eller dårlig i seg selv.',
      '- Ikke still diagnoser. Husk at skårene kan variere med dagsform og livssituasjon.',
      '- Skriv på norsk, med en varm, nysgjerrig og styrkebasert tone.',
      '- Spør oss gjerne om noe underveis hvis det vil gjøre analysen bedre.'
    ].join('\n');
  }

  return { analyser: analyser, claudeTekst: claudeTekst, fyll: fyll };
})();
