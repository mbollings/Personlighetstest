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

  // Sjekker om nettleseren faktisk lagrer noe. Bruker en egen nøkkel, så svarene ikke røres.
  // Merk: en privat fane kan svare ja her, men slette alt når fanen lukkes.
  function virker() {
    try {
      window.localStorage.setItem(NOKKEL + '-prove', '1');
      var ok = window.localStorage.getItem(NOKKEL + '-prove') === '1';
      window.localStorage.removeItem(NOKKEL + '-prove');
      return ok;
    } catch (e) {
      return false;
    }
  }

  // Ber nettleseren om ikke å rydde bort dataene av seg selv. Den kan si nei.
  function beOmVarig() {
    try {
      if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () { /* nei er greit */ });
    } catch (e) { /* ikke støttet */ }
  }

  return { les: les, skriv: skriv, slett: slett, virker: virker, beOmVarig: beOmVarig };
})();
