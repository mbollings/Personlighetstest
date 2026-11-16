// testflyt.js – styrer selve testen: forside → del 1 → del 2 → ferdig.
// All fremdrift lagres i nettleseren etter hvert svar (se lagring.js).

(function () {
  'use strict';

  var IPIP = PT_DATA.ipip, ECR = PT_DATA.ecr;
  var N_IPIP = IPIP.pastander.length;          // 120
  var N_TOTALT = N_IPIP + ECR.pastander.length; // 156
  var PAUSE_FOR_NESTE = 220;                    // millisekunder før neste påstand vises

  var tilstand = null;   // alt som lagres; se nyTilstand()
  var laast = false;     // hindrer dobbelttrykk mens vi bytter påstand

  function $(id) { return document.getElementById(id); }
  function tom(n) { var a = []; for (var i = 0; i < n; i++) a.push(null); return a; }

  // Fisher–Yates-stokking. ECR-R-påstandene skal vises i tilfeldig rekkefølge (Fraley).
  function stokk(liste) {
    var a = liste.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function nyTilstand(navn) {
    return {
      versjon: 1,
      navn: navn,
      ipip: tom(N_IPIP),
      ecr: tom(ECR.pastander.length),
      ecrRekkefolge: stokk(ECR.pastander.map(function (p) { return p.nr; })),
      steg: 0,                            // 0–119 = del 1, 120–155 = del 2
      visning: { type: 'intro', del: 1 },
      ferdig: false,
      kode: null
    };
  }

  function lagre() { PT.lagring.skriv(tilstand); }

  // Hvilken påstand hører til et gitt steg?
  function pastandFor(steg) {
    if (steg < N_IPIP) return { del: 1, data: IPIP, p: IPIP.pastander[steg], plass: steg };
    var nr = tilstand.ecrRekkefolge[steg - N_IPIP];
    return { del: 2, data: ECR, p: ECR.pastander[nr - 1], plass: nr - 1 };
  }
  function svarListe(del) { return del === 1 ? tilstand.ipip : tilstand.ecr; }
  function antallBesvart() {
    return tilstand.ipip.concat(tilstand.ecr).filter(function (s) { return s !== null; }).length;
  }

  // ---------- Visninger ----------

  function vis(id) {
    ['vis-start', 'vis-intro', 'vis-sporsmal', 'vis-ferdig'].forEach(function (v) {
      $(v).classList.toggle('skjult', v !== id);
    });
    window.scrollTo(0, 0);
  }

  function visStart() {
    tilstand = PT.lagring.les();
    var paGang = tilstand && !tilstand.ferdig;
    var ferdig = tilstand && tilstand.ferdig;
    $('fortsett-boks').classList.toggle('skjult', !paGang);
    $('ferdig-boks').classList.toggle('skjult', !ferdig);
    $('ny-boks').classList.toggle('skjult', !!tilstand);
    if (paGang) {
      $('fortsett-tekst').textContent = (tilstand.navn ? tilstand.navn + ', du' : 'Du') +
        ' har svart på ' + antallBesvart() + ' av ' + N_TOTALT + ' påstander.';
    }
    if (ferdig) $('lenke-se-resultat').href = 'resultat.html#' + tilstand.kode;
    vis('vis-start');
  }

  function visIntro(del) {
    tilstand.visning = { type: 'intro', del: del };
    lagre();
    var data = del === 1 ? IPIP : ECR;
    $('intro-del').textContent = 'Del ' + del + ' av 2';
    $('intro-tittel').textContent = del === 1 ? 'Personlighet' : 'Nære relasjoner';
    $('intro-instruks').textContent = data.instruks.no;
    $('knapp-intro-videre').textContent = del === 1 ? 'Start del 1' : 'Start del 2';
    $('intro-fyll').style.width = (antallBesvart() / N_TOTALT * 100) + '%';
    vis('vis-intro');
  }

  function visSporsmal() {
    tilstand.visning = { type: 'sporsmal' };
    lagre();
    var info = pastandFor(tilstand.steg);
    var valgt = svarListe(info.del)[info.plass];
    var iDelen = info.del === 1 ? tilstand.steg + 1 : tilstand.steg - N_IPIP + 1;
    var delLengde = info.del === 1 ? N_IPIP : N_TOTALT - N_IPIP;

    $('fremdrift-del').textContent = info.del === 1 ? 'Del 1 · Personlighet' : 'Del 2 · Nære relasjoner';
    $('fremdrift-tall').textContent = iDelen + ' av ' + delLengde;
    $('fremdrift-fyll').style.width = (tilstand.steg / N_TOTALT * 100) + '%';
    $('pastand').textContent = info.p.no;

    var boks = $('svarvalg');
    boks.innerHTML = '';
    if (info.del === 1) {
      // 5-punkts skala: alle svaralternativene med full tekst, under hverandre
      boks.className = 'svarliste';
      IPIP.svarskala.ankere.forEach(function (a) { boks.appendChild(svarKnapp(a.verdi, a.no, valgt)); });
    } else {
      // 7-punkts skala: tallene 1–7 på rad, med forklaring på endepunktene
      boks.className = '';
      var rad = document.createElement('div');
      rad.className = 'skala7';
      for (var v = ECR.svarskala.min; v <= ECR.svarskala.max; v++) rad.appendChild(svarKnapp(v, String(v), valgt));
      var ankere = document.createElement('div');
      ankere.className = 'skala7-ankere';
      ankere.innerHTML = '<span></span><span></span>';
      ankere.children[0].textContent = '1 = ' + ECR.svarskala.ankere[0].no;
      ankere.children[1].textContent = '7 = ' + ECR.svarskala.ankere[1].no;
      boks.appendChild(rad);
      boks.appendChild(ankere);
    }
    vis('vis-sporsmal');
  }

  function svarKnapp(verdi, tekst, valgt) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'svar' + (verdi === valgt ? ' valgt' : '');
    b.textContent = tekst;
    b.setAttribute('aria-pressed', verdi === valgt ? 'true' : 'false');
    b.addEventListener('click', function () { velg(verdi, b); });
    return b;
  }

  // ---------- Handlinger ----------

  function velg(verdi, knapp) {
    if (laast) return;
    laast = true;
    var info = pastandFor(tilstand.steg);
    svarListe(info.del)[info.plass] = verdi;
    lagre();
    Array.prototype.forEach.call($('svarvalg').querySelectorAll('.svar'), function (b) {
      b.classList.toggle('valgt', b === knapp);
    });
    setTimeout(function () { laast = false; neste(); }, PAUSE_FOR_NESTE);
  }

  function neste() {
    if (tilstand.steg === N_TOTALT - 1) return fullfor();
    tilstand.steg++;
    if (tilstand.steg === N_IPIP) return visIntro(2);
    visSporsmal();
  }

  function forrige() {
    if (laast) return;
    if (tilstand.steg === 0) return visIntro(1);
    if (tilstand.steg === N_IPIP) return visIntro(2);
    tilstand.steg--;
    visSporsmal();
  }

  function fullfor() {
    // Sikkerhetsnett: hopp til første ubesvarte påstand hvis noe mangler.
    for (var s = 0; s < N_TOTALT; s++) {
      var info = pastandFor(s);
      if (svarListe(info.del)[info.plass] === null) { tilstand.steg = s; return visSporsmal(); }
    }
    var profil = PT.skaring.lagProfil(tilstand.ipip, tilstand.ecr, IPIP, ECR);
    var kode = PT.kode.lagKode(profil, tilstand.navn, IPIP, ECR);
    // Når testen er ferdig, beholder vi bare navn og kode. De enkelte svarene slettes.
    tilstand = { versjon: 1, navn: tilstand.navn, ferdig: true, kode: kode };
    lagre();
    visFerdig();
  }

  function visFerdig() {
    $('ferdig-navn').textContent = tilstand.navn || 'for at du tok testen';
    $('resultatkode').textContent = tilstand.kode;
    $('lenke-resultat').href = 'resultat.html#' + tilstand.kode;
    $('kopier-melding').textContent = '';
    vis('vis-ferdig');
  }

  function kopier(tekst, melding) {
    PT.del.kopier(tekst, function (ok) {
      $('kopier-melding').textContent = ok ? melding : 'Kunne ikke kopiere automatisk. Merk koden og kopier den selv.';
    });
  }

  function delLenke() {
    var lenke = PT.del.lenkeTil('resultat.html', tilstand.kode);
    if (location.protocol === 'file:') {
      kopier(lenke, 'Lenken er kopiert. Merk: den virker først for andre når siden er publisert på nett.');
      return;
    }
    if (navigator.share) {
      navigator.share({ title: 'Resultatet mitt fra personlighetstesten', url: lenke }).catch(function () { /* avbrutt */ });
    } else {
      kopier(lenke, 'Lenken er kopiert. Lim den inn i en melding til partneren din.');
    }
  }

  function startPaNytt() {
    if (!window.confirm('Vil du slette svarene dine på denne telefonen og begynne helt på nytt?')) return;
    PT.lagring.slett();
    tilstand = null;
    visStart();
  }

  // Demo: index.html?demo viser lenker som fyller ut testen som en av testpersonene.
  function settOppDemo() {
    if (!/[?&]demo\b/.test(location.search)) return;
    var p = $('demo-lenker');
    p.innerHTML = 'Demo: fyll ut som <a href="#" data-id="ingrid">Ingrid</a> · <a href="#" data-id="erik">Erik</a>';
    Array.prototype.forEach.call(p.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var s = PT.testdata.svarFor(a.getAttribute('data-id'));
        tilstand = nyTilstand(s.navn);
        tilstand.ipip = s.ipip; tilstand.ecr = s.ecr; tilstand.steg = N_TOTALT - 1;
        fullfor();
      });
    });
  }

  // ---------- Kobling av knapper ----------

  $('knapp-start').addEventListener('click', function () {
    tilstand = nyTilstand($('navn').value.trim().slice(0, 30));
    lagre();
    visIntro(1);
  });
  $('navn').addEventListener('keydown', function (e) { if (e.key === 'Enter') $('knapp-start').click(); });
  $('knapp-fortsett').addEventListener('click', function () {
    if (tilstand.visning && tilstand.visning.type === 'intro') visIntro(tilstand.visning.del);
    else visSporsmal();
  });
  $('knapp-start-pa-nytt').addEventListener('click', startPaNytt);
  $('knapp-ta-pa-nytt').addEventListener('click', startPaNytt);
  $('knapp-intro-videre').addEventListener('click', function () {
    tilstand.steg = tilstand.visning.del === 1 ? 0 : N_IPIP;
    visSporsmal();
  });
  $('knapp-intro-tilbake').addEventListener('click', function () {
    if (tilstand.visning.del === 1) { lagre(); visStart(); }
    else { tilstand.steg = N_IPIP - 1; visSporsmal(); }
  });
  $('knapp-tilbake').addEventListener('click', forrige);
  $('knapp-pause').addEventListener('click', function () { lagre(); visStart(); });
  $('knapp-kopier-kode').addEventListener('click', function () {
    kopier(tilstand.kode, 'Koden er kopiert. Lim den inn i en melding til partneren din.');
  });
  $('knapp-del-lenke').addEventListener('click', delLenke);

  // Tastatur (nyttig på PC): tallene velger svar, venstrepil går tilbake.
  document.addEventListener('keydown', function (e) {
    if ($('vis-sporsmal').classList.contains('skjult')) return;
    var tall = parseInt(e.key, 10);
    var knapper = $('svarvalg').querySelectorAll('.svar');
    if (tall >= 1 && tall <= knapper.length) knapper[tall - 1].click();
    else if (e.key === 'ArrowLeft') forrige();
  });

  settOppDemo();
  visStart();
})();
