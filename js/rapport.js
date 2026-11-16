// rapport.js – bygger den individuelle rapporten ut fra resultatkoden i lenken (#kode).

(function () {
  'use strict';

  var IPIP = PT_DATA.ipip, ECR = PT_DATA.ecr, T = PT_DATA.tolkninger;
  var D = PT.diagrammer, esc = D.esc;
  var DOMENER = ['N', 'E', 'O', 'A', 'C'];
  var main = document.getElementById('rapport');

  function pst(x) { return Math.round(x) + ' %'; }
  function komma(x, des) { return x.toFixed(des).replace('.', ','); }
  function fasetterFor(d) { return IPIP.fasetter.filter(function (f) { return f.kode.charAt(0) === d; }); }
  var nivaaNavn = { hoy: 'Høy', midt: 'Middels', lav: 'Lav' };

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
    var hvem = navn || 'deg';
    document.title = 'Rapport – ' + (navn || 'Personlighetstest');

    // --- Topp ---
    h += '<p class="svak liten">Personlig rapport</p>';
    h += '<h1>' + esc(navn ? navn + (/[sxz]$/i.test(navn) ? '’' : 's') + ' profil' : 'Profilen din') + '</h1>';

    h += '<div class="kort uthevet"><h2 class="kort-tittel">Deg i et nøtteskall</h2>';
    var ns = PT.tolkning.notteskall(profil);
    if (ns.punkter.length) {
      h += '<p style="margin-bottom:6px">Slik beskriver du deg selv:</p><ul class="notteskall">';
      ns.punkter.forEach(function (s) { h += '<li>' + esc(s) + '</li>'; });
      h += '</ul>';
    }
    ns.setninger.forEach(function (s) { h += '<p>' + esc(s) + '</p>'; });
    h += '</div>';

    // Det utbroderte portrettet
    var po = PT.portrett.individ(profil);
    h += '<section class="kort portrett" id="portrett"><p class="svak liten" style="margin:0">Portrett</p><h2 class="kort-tittel">' + esc(po.tittel) + '</h2>' +
      '<p class="ingress">' + esc(po.ingress) + '</p>';
    po.avsnitt.forEach(function (a) { h += '<h3>' + esc(a.overskrift) + '</h3><p>' + esc(a.tekst) + '</p>'; });
    h += '<p class="svak liten" style="margin:12px 0 0"><em>' + esc(po.forbehold) + '</em></p></section>';

    h += '<div class="forbehold"><strong>Selvinnsikt, ikke diagnose</strong>Dette er ikke en klinisk eller diagnostisk test. ' +
      'Resultatet viser hvordan du beskrev deg selv akkurat nå, og det kan variere med dagsformen. Høy eller lav skår er aldri bra eller dårlig i seg selv.</div>';

    // --- Big Five-oversikt ---
    h += '<section><h2>De fem hovedtrekkene</h2>';
    h += '<p class="svak liten">Prosenten viser hvor på skalaen du plasserte deg selv: 0 % betyr at du svarte «stemmer svært dårlig» på alt som trekker opp, 100 % betyr «stemmer svært godt». 50 % er midt på skalaen. Det er <em>ikke</em> en sammenligning med andre mennesker, fordi det ikke finnes publiserte normer for denne testen.</p>';
    h += '<div class="kort diagram-kort">' + D.radar(
      DOMENER.map(function (d) { return T.domener[d].navn; }),
      [{ navn: navn, verdier: DOMENER.map(function (d) { return profil.domener[d].prosent; }) }]) + '</div>';
    h += '<nav class="trekk-meny">';
    DOMENER.forEach(function (d) {
      var p = profil.domener[d].prosent;
      h += '<a class="trekk-lenke" href="#" data-mal="trekk-' + d + '"><span class="trekk-navn">' + esc(T.domener[d].navn) +
        '</span><span class="trekk-tall">' + pst(p) + '</span>' + D.soyle([{ prosent: p, serie: 0 }]) + '</a>';
    });
    h += '</nav></section>';

    // --- Hvert trekk med fasetter ---
    DOMENER.forEach(function (d) {
      var dom = T.domener[d], p = profil.domener[d].prosent, t = PT.tolkning.domeneTekst(d, p);
      h += '<section class="kort trekk" id="trekk-' + d + '">';
      h += '<div class="trekk-hode"><div><h2 class="kort-tittel">' + esc(dom.navn) + '</h2><p class="svak liten" style="margin:0">' + esc(dom.undertittel) + '</p></div>' +
        '<div class="trekk-skaar"><span class="stort-tall">' + Math.round(p) + '</span><span class="svak liten"> %</span><br><span class="merkelapp nivaa-' + t.nivaa + '">' + nivaaNavn[t.nivaa] + '</span></div></div>';
      h += D.soyle([{ prosent: p, serie: 0 }]);
      h += '<p style="margin-top:12px">' + esc(dom.beskrivelse) + '</p>';
      if (t.nivaa === 'midt') {
        h += '<p>' + esc(t.tekst) + '</p>';
        h += '<div class="to-kolonner"><div><h3>Hvis du kjenner deg igjen i høy side</h3><p>' + esc(dom.hoy.styrker) + '</p></div>' +
          '<div><h3>Hvis du kjenner deg igjen i lav side</h3><p>' + esc(dom.lav.styrker) + '</p></div></div>';
      } else {
        h += '<div class="to-kolonner"><div><h3>Styrker</h3><p>' + esc(t.styrker) + '</p></div>' +
          '<div><h3>Mulige utfordringer</h3><p>' + esc(t.utfordringer) + '</p></div></div>';
      }
      h += '<h3 class="fasett-tittel">Fasettene</h3><div class="fasetter">';
      fasetterFor(d).forEach(function (f) {
        var fp = profil.fasetter[f.kode].prosent, ft = PT.tolkning.fasettTekst(f.kode, fp), ftx = T.fasetter[f.kode];
        h += '<details class="fasett"><summary><span class="fasett-navn">' + esc(f.no) + '</span><span class="fasett-tall">' + pst(fp) + '</span>' +
          D.soyle([{ prosent: fp, serie: 0 }]) + '</summary>' +
          '<p class="svak liten">' + esc(ftx.beskrivelse) + '</p><p>' + esc(ft.tekst) + '</p>' +
          (ft.merknad ? '<p class="svak liten"><em>' + esc(ft.merknad) + '</em></p>' : '') + '</details>';
      });
      h += '</div><p class="svak liten" style="margin:10px 0 0">Trykk på en fasett for å lese mer.</p></section>';
    });

    // --- Tilknytning ---
    var tk = T.tilknytning, kv = tk.kvadranter[profil.kvadrant.navn], norm = ECR.normer.hele_utvalget;
    var kvNavn = {};
    Object.keys(tk.kvadranter).forEach(function (k) { kvNavn[k] = tk.kvadranter[k].navn; });
    h += '<section id="tilknytning"><h2>Deg i nære relasjoner</h2><p>' + esc(tk.innledning) + '</p>';
    h += '<div class="kort diagram-kort">' + D.tilknytning([{ navn: navn || 'Du', angst: profil.tilknytning.ANX.snitt, unngaelse: profil.tilknytning.AVO.snitt, serie: 0 }], norm, kvNavn) +
      '<p class="svak liten" style="margin:6px 0 0">Skillelinjene går ved gjennomsnittet i Fraleys nettutvalg (over 17 000 personer).</p></div>';

    ['ANX', 'AVO'].forEach(function (k) {
      var v = profil.tilknytning[k], n = dimensjonNivaa(k, v.snitt);
      h += '<div class="kort"><div class="trekk-hode"><div><h3 class="kort-tittel">' + esc(tk[k].navn) + '</h3><p class="svak liten" style="margin:0">' + esc(tk[k].beskrivelse) + '</p></div>' +
        '<div class="trekk-skaar"><span class="stort-tall">' + komma(v.snitt, 1) + '</span><span class="svak liten"> av 7</span></div></div>';
      h += D.soyle([{ prosent: v.prosent, serie: 0 }]);
      h += '<p style="margin-top:12px">' + esc(n === 'midt' ? 'Du ligger omtrent på gjennomsnittet i Fraleys utvalg.' : tk[k][n]) + '</p>';
      h += '<p class="svak liten" style="margin:0">Omtrent ' + v.persentil + ' % i Fraleys nettutvalg har lavere skår. Dette er et grovt anslag: normene er fra en nettundersøkelse tidlig på 2000-tallet, og Fraley ber selv om at de tas med en klype salt.</p></div>';
    });

    h += '<div class="kort uthevet"><p class="svak liten" style="margin:0">Nærmeste felt</p><h3 class="kort-tittel">' + esc(kv.navn) + '</h3>';
    if (profil.kvadrant.naerGrensen) h += '<p><em>' + esc(tk.naerGrensen) + '</em></p>';
    h += '<p>' + esc(kv.tekst) + '</p><div class="to-kolonner"><div><h3>Styrker</h3><p>' + esc(kv.styrker) + '</p></div><div><h3>Mulige utfordringer</h3><p>' + esc(kv.utfordringer) + '</p></div></div></div>';
    h += '<p class="svak">' + esc(tk.glidende) + '</p></section>';

    // --- Deling ---
    h += '<section class="kort"><h2 class="kort-tittel">Del med partneren din</h2>' +
      '<p class="svak">Når dere begge har tatt testen, kan dere legge inn begge kodene på parsiden og få en felles rapport.</p>' +
      '<p class="kode">' + esc(kode) + '</p><div class="knapper">' +
      '<button class="knapp sekundar" id="knapp-kopier">Kopier koden</button>' +
      '<a class="knapp" href="par.html#' + esc(kode) + '">Gå til parsiden</a></div>' +
      '<p class="svak liten" id="kopier-melding" aria-live="polite"></p></section>';

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

  // Lenkene i trekkmenyen ruller ned til trekket uten å endre #-delen av adressen
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
