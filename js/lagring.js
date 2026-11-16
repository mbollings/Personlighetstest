// lagring.js – lagrer fremdriften i nettleseren på denne telefonen (localStorage).
// Ingenting sendes noe sted. Hvis lagring ikke er mulig (f.eks. privat nettlesing),
// virker testen likevel, men den husker ikke svarene hvis siden lukkes.

window.PT = window.PT || {};

PT.lagring = (function () {
  'use strict';

  var NOKKEL = 'personlighetstest-v1';

  function les() {
    try {
      var tekst = window.localStorage.getItem(NOKKEL);
      return tekst ? JSON.parse(tekst) : null;
    } catch (e) {
      return null;
    }
  }

  function skriv(tilstand) {
    try {
      window.localStorage.setItem(NOKKEL, JSON.stringify(tilstand));
      return true;
    } catch (e) {
      return false;
    }
  }

  function slett() {
    try { window.localStorage.removeItem(NOKKEL); } catch (e) { /* ingenting å gjøre */ }
  }

  return { les: les, skriv: skriv, slett: slett };
})();
