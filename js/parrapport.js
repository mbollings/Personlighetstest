// parrapport.js – parsiden: legg inn to resultatkoder og vis «Hva betyr dette for oss».
// Adressen blir par.html#kode1+kode2, så rapporten kan åpnes igjen eller deles.

(function () {
  'use strict';

  var IPIP = PT_DATA.ipip, ECR = PT_DATA.ecr, T = PT_DATA.tolkninger, P = PT_DATA.parTekster;
  var D = PT.diagrammer, esc = D.esc;
  var DOMENER = ['N', 'E', 'O', 'A', 'C'];

  function $(id) { return document.getElementById(id); }
  function pst(x) { return Math.round(x) + ' %'; }

  // Henter selve koden ut av en innlimt lenke eller kode.
  function renKode(tekst) {
    var t = String(tekst || '').trim();
    var i = t.indexOf('#');
    return i >= 0 ? t.slice(i + 1) : t;
  }

  // ---------- Inndata ----------

  function visInndata(forslag1, forslag2) {
    $('vis-rapport').classList.add('skjult');
    $('vis-inndata').classList.remove('skjult');
    document.title = 'Parrapport';
    var egen = PT.lagring.les();
    var egenKode = egen && egen.ferdig ? egen.kode : '';
    $('kode1').value = forslag1 || egenKode || '';
    $('kode2').value = forslag2 || (forslag1 && egenKode && forslag1 !== egenKode ? egenKode : '');
    $('egen-kode-info').textContent = egenKode ? 'Din egen kode fra denne telefonen er fylt inn automatisk.' : '';
    window.scrollTo(0, 0);
  }

  function prov() {
    var koder = [renKode($('kode1').value), renKode($('kode2').value)];
    var ok = true;
    koder.forEach(function (k, i) {
      var feil = $('feil' + (i + 1));
      feil.textContent = '';
      if (!k) { feil.textContent = 'Lim inn en kode her.'; ok = false; return; }
      try { PT.kode.lesKode(k, IPIP, ECR); } catch (e) { feil.textContent = e.message; ok = false; }
    });
    if (ok && koder[0] === koder[1]) {
      $('feil2').textContent = 'Dette er den samme koden to ganger. Lim inn partnerens kode her.';
      ok = false;
    }
    if (ok) location.hash = koder[0] + '+' + koder[1];
  }

  // ---------- Rapport ----------

  function navnFor(x, nr) { return x.navn || ('Person ' + nr); }

  // En rad med to merker på en skala (én per person). visA/visB: tallene som vises (standard: prosent).
  function parRad(tittel, a, b, poler, trekk, visA, visB) {
    return '<div class="par-rad' + (trekk ? ' t-' + trekk : '') + '"><div class="par-rad-hode"><span class="fasett-navn">' + esc(tittel) + '</span>' +
      '<span class="par-tall"><span class="tall-serie-0">' + (visA !== undefined ? visA : Math.round(a)) + '</span> · <span class="tall-serie-1">' +
      (visB !== undefined ? visB : Math.round(b)) + '</span></span></div>' +
      D.spektrum(poler, [{ prosent: a, serie: 0 }, { prosent: b, serie: 1 }], { trekk: trekk }) + '</div>';
  }

  function kapittel(nr, tittel, id) {
    return '<div class="kapittel"' + (id ? ' id="' + id + '"' : '') + '><span class="kapittel-nr">0' + nr + '</span><h2>' + esc(tittel) + '</h2></div>';
  }

  function bygg(a, b, kodeA, kodeB) {
    var n1 = navnFor(a, 1), n2 = navnFor(b, 2);
    var an = PT.paranalyse.analyser(a, b);
    var hist = PT.portrett.par(a, b, an);
    document.title = 'Parrapport – ' + n1 + ' og ' + n2;
    var h = '';
    var tegnforklaring = '<div class="forklaring-farger"><span><span class="farge-prikk serie-0"></span>' + esc(n1) + '</span>' +
      '<span><span class="farge-prikk serie-1"></span>' + esc(n2) + '</span></div>';

    // --- Forside ---
    h += '<header class="rapport-topp"><p class="overlinje">Parrapport · ' + esc(n1) + ' og ' + esc(n2) + '</p>';
    h += '<div class="hero-figur">' + D.fingeravtrykk([
      { verdier: DOMENER.map(function (d) { return a.profil.domener[d].prosent; }) },
      { verdier: DOMENER.map(function (d) { return b.profil.domener[d].prosent; }) }]) + '</div>' + tegnforklaring;
    h += '<h1 class="arketype">' + esc(hist.tittel) + '</h1><p class="ingress">' + esc(hist.ingress) + '</p></header>';

    // --- 01 Deres historie ---
    h += kapittel(1, 'Deres historie', 'par-historie');
    var ulikeD = an.domener.filter(function (d) { return d.type === 'ulike'; });
    var likeD = an.domener.filter(function (d) { return d.type !== 'ulike' && d.type !== 'litt'; });
    h += '<div class="kort uthevet"><h3 class="kort-tittel">' + esc(n1) + ' og ' + esc(n2) + ' i korte trekk</h3>';
    if (likeD.length) h += '<p>Dere ligger ganske likt på <strong>' + esc(liste(likeD.map(function (d) { return d.navn.toLowerCase(); }))) + '</strong>.</p>';
    if (ulikeD.length) h += '<p>Dere er tydeligst ulike på <strong>' + esc(liste(ulikeD.map(function (d) { return d.navn.toLowerCase(); }))) + '</strong>. Det er ofte her hverdagen byr på både gnisninger og gode utfyllinger.</p>';
    h += '<p>I nære relasjoner ligger ' + esc(n1) + ' nærmest «' + esc(T.tilknytning.kvadranter[an.tilknytning.a].navn.toLowerCase()) + '» og ' +
      esc(n2) + ' nærmest «' + esc(T.tilknytning.kvadranter[an.tilknytning.b].navn.toLowerCase()) + '».</p></div>';
    var sceneTrekk = {};
    Object.keys(PT_DATA.portretter.par.scener).forEach(function (k) { sceneTrekk[PT_DATA.portretter.par.scener[k].overskrift] = k; });
    h += '<section class="portrett-del">';
    hist.avsnitt.forEach(function (x) {
      var tr = sceneTrekk[x.overskrift];
      if (tr) h += '<div class="scene t-' + tr + '"><h3>' + esc(x.overskrift) + '</h3><p>' + esc(x.tekst) + '</p></div>';
      else if (x.overskrift === 'Nærhet og avstand') h += '<h3>' + esc(x.overskrift) + '</h3><p class="sitat">' + esc(x.tekst) + '</p>';
      else h += '<h3>' + esc(x.overskrift) + '</h3><p>' + esc(x.tekst) + '</p>';
    });
    h += '<p class="svak liten"><em>' + esc(hist.forbehold) + '</em></p></section>';
    h += '<div class="forbehold"><strong>Tendenser, ikke dommer</strong>Dette er et verktøy for selvinnsikt, ikke en klinisk eller diagnostisk test. ' +
      'Resultatene bygger på hvordan dere beskrev dere selv akkurat nå, og de kan variere med dagsformen. Ingen kombinasjon er bra eller dårlig. Det som teller mest, er hvordan dere møter hverandre.</div>';

    // --- 02 De fem trekkene i hverdagen ---
    h += kapittel(2, 'De fem trekkene i hverdagen', 'par-hverdag');
    h += '<p class="svak liten">Merkene viser hvor dere plasserte dere selv på hver skala. Det er ikke en sammenligning med andre mennesker.</p>' + tegnforklaring;
    an.domener.forEach(function (d) {
      h += '<section class="trekk t-' + d.kode + '"><div class="trekk-hode"><div><h3 style="font-size:1.35rem;color:var(--t)">' + esc(d.navn) + '</h3><p class="undertittel">' + esc(d.omraade) + '</p></div>' +
        '<span class="par-tall"><span class="tall-serie-0">' + Math.round(d.a) + '</span> · <span class="tall-serie-1">' + Math.round(d.b) + '</span></span></div>' +
        D.spektrum(T.poler[d.kode], [{ prosent: d.a, serie: 0 }, { prosent: d.b, serie: 1 }], { trekk: d.kode, stor: true }) +
        '<p style="margin:16px 0 0">' + esc(d.tekst) + '</p></section>';
    });
    h += '<div class="kort diagram-kort">' + D.radar(DOMENER.map(function (d) { return T.domener[d].navn; }),
      [{ navn: n1, verdier: DOMENER.map(function (d) { return a.profil.domener[d].prosent; }) },
       { navn: n2, verdier: DOMENER.map(function (d) { return b.profil.domener[d].prosent; }) }],
      DOMENER.map(function (d) { return 't-' + d; })) + tegnforklaring + '</div>';

    // --- 03 Likheter og ulikheter ---
    h += kapittel(3, 'Likheter og ulikheter', 'par-likheter');
    h += '<h3>Der dere ligger nærmest hverandre</h3>';
    if (an.likheter.length) {
      h += '<div class="kort">';
      an.likheter.forEach(function (f) {
        h += parRad(f.navn, f.a, f.b, T.poler[f.kode], f.domene) + '<p class="svak liten par-forklaring">' + esc(T.fasetter[f.kode].beskrivelse) + ' ' + esc(f.tekst) + '</p>';
      });
      h += '</div>';
    } else h += '<p class="svak">Dere har ingen fasetter der dere ligger helt likt.</p>';
    h += '<h3>Der dere er mest ulike</h3>';
    if (an.ulikheter.length) {
      h += '<div class="kort">';
      an.ulikheter.forEach(function (f) {
        h += parRad(f.navn, f.a, f.b, T.poler[f.kode], f.domene) + '<p class="svak liten par-forklaring">' + esc(T.fasetter[f.kode].beskrivelse) + ' ' + esc(f.tekst) +
          ' Ulikhet kan gi gnisninger, men også fylle ut hverandre.</p>';
      });
      h += '</div>';
    } else h += '<p class="svak">Dere har ingen fasetter med store forskjeller (25 prosentpoeng eller mer).</p>';

    // --- 04 Alle fasettene ---
    h += kapittel(4, 'Alle fasettene side om side') + tegnforklaring;
    DOMENER.forEach(function (d) {
      h += '<details class="kort par-gruppe t-' + d + '"><summary><h3>' + esc(T.domener[d].navn) + '</h3><span class="svak liten">6 fasetter +</span></summary>';
      an.fasetter.filter(function (f) { return f.domene === d; }).forEach(function (f) { h += parRad(f.navn, f.a, f.b, T.poler[f.kode], d); });
      h += '</details>';
    });

    // --- 05 Nære relasjoner ---
    var kvNavn = {};
    Object.keys(T.tilknytning.kvadranter).forEach(function (k) { kvNavn[k] = T.tilknytning.kvadranter[k].navn; });
    h += kapittel(5, 'Nære relasjoner', 'par-tilknytning');
    h += '<div class="kort diagram-kort">' + D.tilknytning([
      { navn: n1, angst: a.profil.tilknytning.ANX.snitt, unngaelse: a.profil.tilknytning.AVO.snitt, serie: 0 },
      { navn: n2, angst: b.profil.tilknytning.ANX.snitt, unngaelse: b.profil.tilknytning.AVO.snitt, serie: 1 }
    ], ECR.normer.hele_utvalget, kvNavn) + '</div>';
    function en(x) { return x.toFixed(1).replace('.', ','); }
    var ta = a.profil.tilknytning, tb = b.profil.tilknytning;
    h += '<div class="kort">' + tegnforklaring +
      parRad('Tilknytningsangst (1–7)', ta.ANX.prosent, tb.ANX.prosent, T.poler.ANX, 'tk', en(ta.ANX.snitt), en(tb.ANX.snitt)) +
      parRad('Tilknytningsunngåelse (1–7)', ta.AVO.prosent, tb.AVO.prosent, T.poler.AVO, 'tk', en(ta.AVO.snitt), en(tb.AVO.snitt)) + '</div>';
    h += '<div class="kort uthevet"><p class="overlinje">Kombinasjonen deres</p><p>' + esc(an.tilknytning.tekst) + '</p><p>' + esc(P.tilknytningAvslutning) + '</p></div>';
    h += '<p class="svak liten">' + esc(T.tilknytning.glidende) + '</p>';

    // --- 06 Forskning ---
    h += kapittel(6, 'Hva sier forskningen?');
    h += '<ul class="forskning">';
    P.forskning.forEach(function (f) { h += '<li>' + esc(f.tekst) + (f.kilde ? ' <span class="svak liten">(' + esc(f.kilde) + ')</span>' : '') + '</li>'; });
    h += '</ul>';

    // --- 07 Samtalespørsmål ---
    h += kapittel(7, 'Spørsmål å snakke om sammen', 'par-sporsmal');
    h += '<p class="svak">Ta gjerne ett eller to om gangen, for eksempel på en tur eller over middagen. Lytt mer enn dere forklarer.</p>' +
      '<div class="kort"><ol class="sporsmal">';
    an.sporsmal.forEach(function (s) { h += '<li>' + esc(s) + '</li>'; });
    h += '</ol></div>';

    // --- 08 Claude-eksport ---
    h += kapittel(8, 'Gå dypere med Claude');
    h += '<section>' +
      '<p class="svak">Knappen lager en ferdig tekst med begge profilene, alle skårene og en god instruksjon. Den kopieres til utklippstavlen, så kan du lime den inn i en Claude-samtale og få en dypere og mer personlig analyse.</p>' +
      '<p class="svak liten">Teksten forlater telefonen først når du selv limer den inn et sted.</p>' +
      '<div class="knapper"><button class="knapp" id="knapp-claude">Kopier tekst til Claude</button></div>' +
      '<p class="svak liten" id="claude-melding" aria-live="polite"></p>' +
      '<details class="claude-forhand"><summary class="liten">Vis teksten</summary><textarea id="claude-tekst" readonly rows="14"></textarea></details></section>';

    h += '<footer class="kilder svak liten"><p>Kilder: IPIP-NEO-120 (Johnson, 2014), ECR-R (Fraley, Waller og Brennan, 2000) og forskningen nevnt over. Forklaringstekstene er skrevet for denne appen.</p>' +
      '<p><a href="#" id="lenke-bytt">Bytt koder</a> · <a href="resultat.html#' + esc(kodeA) + '">Rapporten til ' + esc(n1) + '</a> · <a href="resultat.html#' + esc(kodeB) + '">Rapporten til ' + esc(n2) + '</a> · <a href="index.html">Forsiden</a></p></footer>';

    $('vis-rapport').innerHTML = h;
    $('vis-inndata').classList.add('skjult');
    $('vis-rapport').classList.remove('skjult');

    var claude = PT.paranalyse.claudeTekst(a, b);
    $('claude-tekst').value = claude;
    $('knapp-claude').addEventListener('click', function () {
      PT.del.kopier(claude, function (ok) {
        $('claude-melding').textContent = ok ? 'Teksten er kopiert. Åpne claude.ai, start en ny samtale og lim den inn.' : 'Kunne ikke kopiere automatisk. Åpne «Vis teksten» og kopier den selv.';
      });
    });
    $('lenke-bytt').addEventListener('click', function (e) { e.preventDefault(); visInndata(kodeA, kodeB); });
    window.scrollTo(0, 0);
  }

  function liste(ord) {
    if (ord.length <= 1) return ord.join('');
    return ord.slice(0, -1).join(', ') + ' og ' + ord[ord.length - 1];
  }

  function start() {
    var hash = location.hash.replace(/^#/, '');
    var deler = hash.split('+').filter(Boolean);
    if (deler.length === 2) {
      try {
        bygg(PT.kode.lesKode(deler[0], IPIP, ECR), PT.kode.lesKode(deler[1], IPIP, ECR), deler[0], deler[1]);
        return;
      } catch (e) {
        visInndata(deler[0], deler[1]);
        $('feil1').textContent = e.message;
        return;
      }
    }
    visInndata(deler[0] || '', '');
  }

  // Demo: par.html?demo viser en lenke som lager parrapporten for testpersonene.
  if (/[?&]demo\b/.test(location.search)) {
    $('demo-par').classList.remove('skjult');
    $('lenke-demo-par').addEventListener('click', function (e) {
      e.preventDefault();
      var koder = ['ingrid', 'erik'].map(function (id) {
        var s = PT.testdata.svarFor(id);
        return PT.kode.lagKode(PT.skaring.lagProfil(s.ipip, s.ecr, IPIP, ECR), s.navn, IPIP, ECR);
      });
      location.hash = koder[0] + '+' + koder[1];
    });
  }

  $('knapp-vis').addEventListener('click', prov);
  ['kode1', 'kode2'].forEach(function (id) {
    $(id).addEventListener('keydown', function (e) { if (e.key === 'Enter') prov(); });
  });
  window.addEventListener('hashchange', start);
  start();
})();
