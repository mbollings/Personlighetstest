// del.js – kopiering til utklippstavlen, brukt av flere sider.

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

  return { kopier: kopier, lenkeTil: lenkeTil };
})();
