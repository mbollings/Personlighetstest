// del.js – kopiering, deling og lagring av resultatet, brukt av flere sider.

window.PT = window.PT || {};

PT.del = (function () {
  'use strict';

  // Kopierer tekst. Kaller ferdig(true) hvis det gikk, ferdig(false) ellers.
  function kopier(tekst, ferdig) {
    function reserve() {
      // Eldre nettlesere og lokale filer: kopier via et midlertidig tekstfelt.
      var t = document.createElement('textarea');
      t.value = tekst; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(t);
      ferdig(ok);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(tekst).then(function () { ferdig(true); }, reserve);
    } else {
      reserve();
    }
  }

  // Lenke til en side i samme mappe, med kode etter #.
  function lenkeTil(side, kode) {
    var base = location.href.split('#')[0].split('?')[0].replace(/[^\/]*$/, '');
    return base + side + '#' + kode;
  }

  // Åpner telefonens delemeny med lenken til resultatet. Finnes den ikke, kopieres lenken.
  // melding(tekst) viser hva som skjedde.
  function delLenke(kode, melding) {
    var lenke = lenkeTil('resultat.html', kode);
    function kopierLenke(tekst) {
      kopier(lenke, function (ok) { melding(ok ? tekst : 'Kunne ikke kopiere automatisk. Merk koden og kopier den selv.'); });
    }
    if (location.protocol === 'file:') {
      kopierLenke('Lenken er kopiert. Merk: den virker først for andre når siden er publisert på nett.');
    } else if (navigator.share) {
      navigator.share({ title: 'Resultat fra personlighetstesten', url: lenke }).catch(function (e) {
        if (!e || e.name !== 'AbortError') kopierLenke('Delemenyen virket ikke, men lenken er kopiert. Lim den inn et trygt sted.');
      });
    } else {
      kopierLenke('Lenken er kopiert. Lim den inn i en melding eller et notat.');
    }
  }

  // Teksten i fila som lastes ned. Kan lastes opp igjen på forsiden.
  function filTekst(kode, navn, lenke, dato) {
    return ['Resultat fra personlighetstesten', navn ? 'Navn: ' + navn : '', 'Lagret: ' + dato, '',
      'Åpne rapporten:', lenke, '', 'Resultatkode:', kode, '',
      'Ta vare på denne fila. Virker ikke lenken, kan du åpne fila eller lime inn koden på forsiden av testen.', '']
      .join('\r\n');
  }

  function lastNed(kode, navn) {
    var tekst = '﻿' + filTekst(kode, navn, lenkeTil('resultat.html', kode), new Date().toLocaleDateString('nb-NO'));
    var url = URL.createObjectURL(new Blob([tekst], { type: 'text/plain;charset=utf-8' }));
    var a = document.createElement('a');
    a.href = url;
    a.download = 'personlighetstest' + (navn ? '-' + navn.replace(/[\\\/:*?"<>|\s]+/g, '-') : '') + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
  }

  // Kortet «Ta vare på resultatet». Brukes på ferdigsiden og i rapporten.
  function lagreBoks(boks, kode, navn) {
    boks.innerHTML = '<h3 class="kort-tittel">Ta vare på resultatet</h3>' +
      '<p>Det ligger bare i denne nettleseren og kan bli borte, for eksempel hvis du bruker privat fane, sletter nettleserdata eller ikke åpner siden på en stund. Lagre det også et annet sted.</p>' +
      '<div class="knapper"><button type="button" class="knapp" data-gjor="send">Send lenken til meg selv</button>' +
      '<button type="button" class="knapp sekundar" data-gjor="fil">Last ned som fil</button></div>' +
      '<p class="svak liten" data-melding aria-live="polite" style="margin-top:10px"></p>';
    function melding(t) { boks.querySelector('[data-melding]').textContent = t; }
    boks.querySelector('[data-gjor=send]').addEventListener('click', function () { delLenke(kode, melding); });
    boks.querySelector('[data-gjor=fil]').addEventListener('click', function () {
      try {
        lastNed(kode, navn);
        melding('Nedlastingen er startet. Sjekk at fila ligger under Nedlastinger eller Filer. Skjer det ingenting, kan du sende lenken til deg selv i stedet.');
      } catch (e) { melding('Kunne ikke laste ned her. Send lenken til deg selv i stedet.'); }
    });
  }

  return { kopier: kopier, lenkeTil: lenkeTil, delLenke: delLenke, filTekst: filTekst, lagreBoks: lagreBoks };
})();
