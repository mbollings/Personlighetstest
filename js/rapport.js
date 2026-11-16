// rapport.js – bygger den individuelle rapporten ut fra resultatkoden i lenken (#kode).
// Oppbygning: forside med fingeravtrykk og arketype → 01 Portrett → 02 De fem trekkene →
// 03 Trekk for trekk → 04 Nære relasjoner → 05 Del med partneren.

(function () {
  'use strict';

  var IPIP = PT_DATA.ipip, ECR = PT_DATA.ecr, T = PT_DATA.tolkninger;
  var D = PT.diagrammer, esc = D.esc;
  var DOMENER = ['N', 'E', 'O', 'A', 'C'];
  var main = document.getElementById('rapport');

  function pst(x) { return Math.round(x) + ' %'; }
  function komma(x, des) { return x.toFixed(des).replace('.', ','); }
  function fasetterFor(d) { return IPIP.fasetter.filter(function (f) { return f.kode.charAt(0) === d; }); }
  function genitiv(navn) { return navn + (/[sxz]$/i.test(navn) ? '’' : 's'); }
  var nivaaNavn = { hoy: 'Høy', midt: 'Middels', lav: 'Lav' };

  function kapittel(nr, tittel, id) {
    return '<div class="kapittel"' + (id ? ' id="' + id + '"' : '') + '><span class="kapittel-nr">0' + nr + '</span><h2>' + esc(tittel) + '</h2></div>';
  }

  // Tekst for en tilknytningsdimensjon, sammenlignet med Fraleys normutvalg.
  function dimensjonNivaa(k, snitt) {
    var n = ECR.normer.hele_utvalget[k];
    if (snitt >= n.M + 0.5 * n.SD) return 'hoy';
    if (snitt <= n.M - 0.5 * n.SD) return 'lav';
    return 'midt';
  }

  function visFeil(melding) {
    main.innerHTML = '<h1>Fant ingen rapport</h1><div class="kort"><p>' + esc(melding) + '</p>' +
      '<p class="svak" style="margin:0">Lenken til rapporten skal slutte med # og en kode. Ta testen, eller be partneren din sende lenken på nytt.</p></div>' +
      '<p><a href="index.html">← Til forsiden</a></p>';
  }

  function bygg(navn, profil, kode) {
    var h = '';
    var po = PT.portrett.individ(profil);
    document.title = (navn ? genitiv(navn) + ' portrett' : 'Portrettet ditt') + ' – Personlighetstest';

    // --- Forside ---
    h += '<header class="rapport-topp">';
    h += '<p class="overlinje">' + esc(navn ? genitiv(navn) + ' portrett' : 'Portrettet ditt') + '</p>';
    var tydelige = DOMENER.slice().sort(function (a, b) {
      return Math.abs(profil.domener[b].prosent - 50) - Math.abs(profil.domener[a].prosent - 50);
    });
    h += '<div class="hero-figur">' + D.fingeravtrykk([{ verdier: DOMENER.map(function (d) { return profil.domener[d].prosent; }) }], tydelige.slice(0, 2)) + '</div>';
    h += '<h1 class="arketype">' + esc(po.tittel) + '</h1>';
    h += '<p class="ingress">' + esc(po.ingress) + '</p>';
    h += '<p class="liten svak" style="margin-top:14px">Formen er ditt personlige fingeravtrykk, tegnet ut fra de fem trekkene. Prikkene viser ' +
      DOMENER.map(function (d) { return '<span class="t-' + d + '" style="color:var(--t);font-weight:600">' + esc(T.domener[d].navn.toLowerCase()) + '</span>'; }).join(', ').replace(/, ([^,]*)$/, ' og $1') + '.</p>';
    h += '</header>';

    // --- 01 Portrett ---
    h += kapittel(1, 'Portrett');
    var ns = PT.tolkning.notteskall(profil);
    h += '<div class="kort uthevet"><h3 class="kort-tittel">Deg i et nøtteskall</h3>';
    if (ns.punkter.length) {
      h += '<ul class="notteskall">';
      ns.punkter.forEach(function (s) { h += '<li>' + esc(s) + '</li>'; });
      h += '</ul>';
    }
    ns.setninger.forEach(function (s) { h += '<p>' + esc(s) + '</p>'; });
    h += '</div>';
    h += '<section class="portrett-del" id="portrett">';
    po.avsnitt.forEach(function (a) {
      // Relasjonsavsnittet løftes fram som et sitat, de andre er vanlige avsnitt.
      if (a.overskrift === 'I nære relasjoner') h += '<h3>' + esc(a.overskrift) + '</h3><p class="sitat">' + esc(a.tekst) + '</p>';
      else h += '<h3>' + esc(a.overskrift) + '</h3><p>' + esc(a.tekst) + '</p>';
    });
    h += '<p class="svak liten"><em>' + esc(po.forbehold) + '</em></p></section>';
    h += '<div class="forbehold"><strong>Selvinnsikt, ikke diagnose</strong>Dette er ikke en klinisk eller diagnostisk test. ' +
      'Resultatet viser hvordan du beskrev deg selv akkurat nå, og det kan variere med dagsformen. Ingen ende av skalaene er bedre enn den andre.</div>';

    // --- 02 De fem trekkene ---
    h += kapittel(2, 'De fem trekkene');
    h += '<p class="svak liten">Markøren viser hvor på skalaen du plasserte deg selv. Midtstreken er midt på skalaen, ikke et gjennomsnitt av andre mennesker, for det finnes ingen publiserte normer for denne testen.</p>';
    h += '<nav class="trekk-oversikt">';
    DOMENER.forEach(function (d) {
      var p = profil.domener[d].prosent;
      h += '<a class="trekk-lenke t-' + d + '" href="#" data-mal="trekk-' + d + '"><div class="navn"><strong>' + esc(T.domener[d].navn) + '</strong><span>' + pst(p) + '</span></div>' +
        D.spektrum(T.poler[d], [{ prosent: p, serie: 0 }], { trekk: d, stor: true }) + '</a>';
    });
    h += '</nav>';
    h += '<div class="kort diagram-kort">' + D.radar(DOMENER.map(function (d) { return T.domener[d].navn; }),
      [{ navn: navn, verdier: DOMENER.map(function (d) { return profil.domener[d].prosent; }) }],
      DOMENER.map(function (d) { return 't-' + d; })) + '</div>';

    // --- 03 Trekk for trekk ---
    h += kapittel(3, 'Trekk for trekk');
    DOMENER.forEach(function (d) {
      var dom = T.domener[d], p = profil.domener[d].prosent, t = PT.tolkning.domeneTekst(d, p);
      h += '<section class="trekk t-' + d + '" id="trekk-' + d + '">';
      h += '<div class="trekk-hode"><div><h3 style="font-size:1.45rem;color:var(--t)">' + esc(dom.navn) + '</h3><p class="undertittel">' + esc(dom.undertittel) + '</p></div>' +
        '<div class="trekk-skaar"><span class="stort-tall">' + Math.round(p) + '</span><span class="svak liten"> %</span><br><span class="merkelapp">' + nivaaNavn[t.nivaa] + '</span></div></div>';
      h += D.spektrum(T.poler[d], [{ prosent: p, serie: 0 }], { trekk: d, stor: true });
      h += '<p style="margin-top:16px">' + esc(dom.beskrivelse) + '</p>';
      if (t.nivaa === 'midt') {
        h += '<p>' + esc(t.tekst) + '</p>';
        h += '<div class="to-kolonner"><div><h3>' + esc(T.poler[d][1]) + ' side</h3><p>' + esc(dom.hoy.styrker) + '</p></div>' +
          '<div><h3>' + esc(T.poler[d][0]) + ' side</h3><p>' + esc(dom.lav.styrker) + '</p></div></div>';
      } else {
        h += '<div class="to-kolonner"><div><h3>Styrker</h3><p>' + esc(t.styrker) + '</p></div>' +
          '<div><h3>Mulige utfordringer</h3><p>' + esc(t.utfordringer) + '</p></div></div>';
      }
      h += '<h4 class="fasett-tittel">Fasettene · trykk for å lese mer</h4><div class="fasetter">';
      fasetterFor(d).forEach(function (f) {
        var fp = profil.fasetter[f.kode].prosent, ft = PT.tolkning.fasettTekst(f.kode, fp), ftx = T.fasetter[f.kode];
        h += '<details class="fasett"><summary><div class="fasett-rad"><span class="fasett-navn">' + esc(f.no) + '</span><span class="fasett-tall">' + pst(fp) + '</span></div>' +
          D.spektrum(T.poler[f.kode], [{ prosent: fp, serie: 0 }], { trekk: d }) + '</summary>' +
          '<p class="svak liten">' + esc(ftx.beskrivelse) + '</p><p>' + esc(ft.tekst) + '</p>' +
          (ft.merknad ? '<p class="svak liten"><em>' + esc(ft.merknad) + '</em></p>' : '') + '</details>';
      });
      h += '</div></section>';
    });

    // --- 04 Nære relasjoner ---
    var tk = T.tilknytning, kv = tk.kvadranter[profil.kvadrant.navn], norm = ECR.normer.hele_utvalget;
    var kvNavn = {};
    Object.keys(tk.kvadranter).forEach(function (k) { kvNavn[k] = tk.kvadranter[k].navn; });
    h += kapittel(4, 'Nære relasjoner', 'tilknytning');
    h += '<p>' + esc(tk.innledning) + '</p>';
    h += '<div class="kort diagram-kort">' + D.tilknytning([{ navn: navn || 'Du', angst: profil.tilknytning.ANX.snitt, unngaelse: profil.tilknytning.AVO.snitt, serie: 0 }], norm, kvNavn) +
      '<p class="svak liten sentrert" style="margin:6px 0 0">Skillelinjene går ved gjennomsnittet i Fraleys nettutvalg (over 17 000 personer).</p></div>';
    ['ANX', 'AVO'].forEach(function (k) {
      var v = profil.tilknytning[k], n = dimensjonNivaa(k, v.snitt);
      h += '<section class="trekk t-tk"><div class="trekk-hode"><div><h3 style="color:var(--t)">' + esc(tk[k].navn) + '</h3><p class="undertittel">' + esc(tk[k].beskrivelse) + '</p></div>' +
        '<div class="trekk-skaar"><span class="stort-tall">' + komma(v.snitt, 1) + '</span><span class="svak liten"> av 7</span></div></div>';
      h += D.spektrum(T.poler[k], [{ prosent: v.prosent, serie: 0 }], { trekk: 'tk', stor: true });
      h += '<p style="margin-top:16px">' + esc(n === 'midt' ? 'Du ligger omtrent på gjennomsnittet i Fraleys utvalg.' : tk[k][n]) + '</p>';
      h += '<p class="svak liten" style="margin:0">Omtrent ' + v.persentil + ' % i Fraleys nettutvalg har lavere skår. Dette er et grovt anslag: normene er fra en nettundersøkelse tidlig på 2000-tallet, og Fraley ber selv om at de tas med en klype salt.</p></section>';
    });
    h += '<div class="kort uthevet"><p class="overlinje">Nærmeste felt</p><h3 class="kort-tittel" style="font-size:1.5rem">' + esc(kv.navn) + '</h3>';
    if (profil.kvadrant.naerGrensen) h += '<p><em>' + esc(tk.naerGrensen) + '</em></p>';
    h += '<p>' + esc(kv.tekst) + '</p><div class="to-kolonner"><div><h3>Styrker</h3><p>' + esc(kv.styrker) + '</p></div><div><h3>Mulige utfordringer</h3><p>' + esc(kv.utfordringer) + '</p></div></div></div>';
    h += '<p class="svak">' + esc(tk.glidende) + '</p>';

    // --- 05 Del ---
    h += kapittel(5, 'Del med partneren din');
    h += '<p class="svak">Når dere begge har tatt testen, kan dere legge inn begge kodene på parsiden og få en felles rapport.</p>' +
      '<p class="kode">' + esc(kode) + '</p><div class="knapper">' +
      '<a class="knapp" href="par.html#' + esc(kode) + '">Gå til parsiden</a>' +
      '<button class="knapp sekundar" id="knapp-kopier">Kopier koden</button></div>' +
      '<p class="svak liten" id="kopier-melding" aria-live="polite"></p>';

    // --- Kilder ---
    h += '<footer class="kilder svak liten"><p><strong>Kilder.</strong> Big Five: IPIP-NEO-120 (Johnson, 2014, <em>Journal of Research in Personality</em>, 51, 78–89). ' +
      'Tilknytning: ECR-R (Fraley, Waller og Brennan, 2000, <em>Journal of Personality and Social Psychology</em>, 78, 350–365). ' +
      'Normer for tilknytning: Fraleys nettside om ECR-R. Forklaringstekstene er skrevet for denne appen.</p>' +
      '<p><a href="index.html">← Til forsiden</a></p></footer>';

    main.innerHTML = h;

    document.getElementById('knapp-kopier').addEventListener('click', function () {
      PT.del.kopier(kode, function (ok) {
        document.getElementById('kopier-melding').textContent = ok ? 'Koden er kopiert.' : 'Kunne ikke kopiere automatisk. Merk koden og kopier den selv.';
      });
    });
  }

  function start() {
    var kode = location.hash.replace(/^#/, '');
    if (!kode) return visFeil('Det er ingen resultatkode i lenken.');
    try {
      var r = PT.kode.lesKode(kode, IPIP, ECR);
      bygg(r.navn, r.profil, kode);
    } catch (e) {
      visFeil(e.message);
    }
  }

  // Lenkene i trekkoversikten ruller ned til trekket uten å endre #-delen av adressen
  // (den inneholder jo resultatkoden).
  main.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.trekk-lenke');
    if (!a) return;
    e.preventDefault();
    var mal = document.getElementById(a.getAttribute('data-mal'));
    if (mal) mal.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  window.addEventListener('hashchange', start);
  start();
})();
