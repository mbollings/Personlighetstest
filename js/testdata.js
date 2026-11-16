// testdata.js – to fiktive personer, så rapportene kan prøves uten å ta hele testen.
// Svarene lages ut fra et "ønsket nivå" (1–5) per fasett og (1–7) per tilknytningsdimensjon.
// For reverserte påstander snus svaret, akkurat slik en ekte person ville svart.
// Litt fast variasjon (ikke tilfeldig) gjør svarene mer realistiske og gir samme resultat hver gang.

window.PT = window.PT || {};

PT.testdata = (function () {
  'use strict';

  var personer = {
    ingrid: {
      navn: 'Ingrid',
      // Rolig, varm, nysgjerrig og strukturert. Lav angst, litt unnvikende.
      fasett: {
        N1: 2, N2: 2, N3: 1.5, N4: 2.5, N5: 3, N6: 1.5,
        E1: 4, E2: 2.5, E3: 3.5, E4: 3.5, E5: 2.5, E6: 4,
        O1: 3.5, O2: 4.5, O3: 4, O4: 3.5, O5: 4.5, O6: 3.5,
        A1: 4, A2: 4.5, A3: 4.5, A4: 4, A5: 3.5, A6: 4.5,
        C1: 4.5, C2: 4.5, C3: 4.5, C4: 4, C5: 4, C6: 4
      },
      tilknytning: { ANX: 2.5, AVO: 3.5 }
    },
    erik: {
      navn: 'Erik',
      // Sosial, spontan og eventyrlysten, mer følelsesmessig reaktiv. Engstelig tilknytning.
      fasett: {
        N1: 3.5, N2: 3.5, N3: 2.5, N4: 2, N5: 4, N6: 3,
        E1: 4.5, E2: 4.5, E3: 4, E4: 4, E5: 4.5, E6: 4.5,
        O1: 4, O2: 2.5, O3: 3.5, O4: 4.5, O5: 3, O6: 3,
        A1: 3.5, A2: 4, A3: 4, A4: 3, A5: 2.5, A6: 3.5,
        C1: 3, C2: 1.5, C3: 3, C4: 3, C5: 2, C6: 1.5
      },
      tilknytning: { ANX: 5, AVO: 2 }
    }
  };

  // Fast mønster av små avvik (−1, 0, +1), så ikke alle svarene på en fasett er like.
  var avvik = [0, 1, 0, -1, 0, 0, 1, -1];

  function begrens(x, min, max) { return Math.min(max, Math.max(min, x)); }

  function lagSvar(data, mal, gruppefelt) {
    var min = data.svarskala.min, max = data.svarskala.max;
    var teller = {}; // hvilken påstand i rekken innen hver fasett/dimensjon (0, 1, 2 …)
    var svarListe = [];
    data.pastander.forEach(function (p) {
      var g = p[gruppefelt];
      var k = teller[g] = (teller[g] === undefined ? 0 : teller[g] + 1);
      var niva = mal[g];
      var svar;
      if (niva % 1 !== 0) {
        // Halve nivåer (f.eks. 3,5) besvares annenhver gang rundet ned og opp.
        svar = k % 2 === 0 ? Math.floor(niva) : Math.ceil(niva);
      } else {
        svar = niva + avvik[k % avvik.length];
      }
      svar = begrens(svar, min, max);
      svarListe[p.nr - 1] = p.nokkel === '-' ? min + max - svar : svar;
    });
    return svarListe;
  }

  function svarFor(id) {
    var p = personer[id];
    return {
      navn: p.navn,
      ipip: lagSvar(PT_DATA.ipip, p.fasett, 'fasett'),
      ecr: lagSvar(PT_DATA.ecr, p.tilknytning, 'dimensjon')
    };
  }

  return { personer: personer, svarFor: svarFor };
})();
