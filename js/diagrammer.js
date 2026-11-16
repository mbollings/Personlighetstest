// diagrammer.js – tegner diagrammene som SVG og HTML, uten eksterne biblioteker.
// Alle funksjonene tar en liste med "serier" (én per person), så de samme diagrammene
// brukes både i den individuelle rapporten (én serie) og i parrapporten (to serier).
// Fargene settes i CSS (.serie-0, .serie-1), så de virker i både lys og mørk modus.

window.PT = window.PT || {};

PT.diagrammer = (function () {
  'use strict';

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function r1(x) { return Math.round(x * 10) / 10; }

  // ---------- Radardiagram ----------
  // akser: ["Nevrotisisme", ...]  serier: [{ navn, verdier: [0–100, ...] }]
  function radar(akser, serier) {
    var B = 420, H = 320, cx = 210, cy = 160, R = 96, n = akser.length;
    function punkt(i, verdi) {
      var v = (-90 + i * 360 / n) * Math.PI / 180;
      return [cx + Math.cos(v) * R * verdi / 100, cy + Math.sin(v) * R * verdi / 100];
    }
    var s = '<svg class="radar" viewBox="0 0 ' + B + ' ' + H + '" role="img" aria-label="Radardiagram over de fem hovedtrekkene">';
    [25, 50, 75, 100].forEach(function (ring) {
      var pts = akser.map(function (_, i) { return punkt(i, ring).map(r1).join(','); }).join(' ');
      s += '<polygon class="rutenett' + (ring === 50 ? ' midt' : '') + '" points="' + pts + '"/>';
    });
    akser.forEach(function (navn, i) {
      var ytre = punkt(i, 100), tekst = punkt(i, 114);
      s += '<line class="rutenett" x1="' + cx + '" y1="' + cy + '" x2="' + r1(ytre[0]) + '" y2="' + r1(ytre[1]) + '"/>';
      var anker = Math.abs(tekst[0] - cx) < 5 ? 'middle' : (tekst[0] > cx ? 'start' : 'end');
      // Toppaksen får teksten over punktet. De andre får navnet på én linje og tallet under.
      var topp = tekst[1] < cy - R * 0.9;
      var y = topp ? tekst[1] - (serier.length === 1 ? 18 : 4) : tekst[1] + (tekst[1] > cy + 10 ? 10 : 0);
      s += '<text class="akse" x="' + r1(tekst[0]) + '" y="' + r1(y) + '" text-anchor="' + anker + '">' + esc(navn);
      if (serier.length === 1) {
        s += '<tspan class="akse-verdi" x="' + r1(tekst[0]) + '" dy="15">' + Math.round(serier[0].verdier[i]) + ' %</tspan>';
      }
      s += '</text>';
    });
    serier.forEach(function (serie, si) {
      var pts = serie.verdier.map(function (v, i) { return punkt(i, Math.max(v, 2)).map(r1).join(','); }).join(' ');
      s += '<polygon class="flate serie-' + si + '" points="' + pts + '"/>';
      serie.verdier.forEach(function (v, i) {
        var p = punkt(i, Math.max(v, 2));
        s += '<circle class="prikk serie-' + si + '" cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="4"/>';
      });
    });
    return s + '</svg>';
  }

  // ---------- Liggende søyle (0–100) ----------
  // verdier: [{ prosent, serie }]  En søyle per person, stablet tett.
  function soyle(verdier) {
    var h = '<div class="soyle' + (verdier.length > 1 ? ' flere' : '') + '">';
    verdier.forEach(function (v) {
      h += '<div class="soyle-spor"><div class="soyle-fyll serie-' + v.serie + '" style="width:' + Math.max(1.5, v.prosent).toFixed(1) + '%"></div></div>';
    });
    return h + '<div class="soyle-midt" aria-hidden="true"></div></div>';
  }

  // ---------- Tilknytningsdiagram (angst × unngåelse) ----------
  // punkter: [{ navn, angst, unngaelse, serie }]  norm: { ANX:{M}, AVO:{M} }  navn: kvadrantnavn
  function tilknytning(punkter, norm, navn) {
    var B = 340, H = 330, x0 = 46, x1 = 326, y0 = 14, y1 = 286;
    function x(v) { return x0 + (v - 1) / 6 * (x1 - x0); }
    function y(v) { return y1 - (v - 1) / 6 * (y1 - y0); }
    var mx = x(norm.AVO.M), my = y(norm.ANX.M);
    var s = '<svg class="tilknytning" viewBox="0 0 ' + B + ' ' + H + '" role="img" aria-label="Tilknytningsdiagram: angst og unngåelse">';
    // Fire felt
    s += '<rect class="felt felt-trygg" x="' + x0 + '" y="' + r1(my) + '" width="' + r1(mx - x0) + '" height="' + r1(y1 - my) + '"/>';
    s += '<rect class="felt felt-engstelig" x="' + x0 + '" y="' + y0 + '" width="' + r1(mx - x0) + '" height="' + r1(my - y0) + '"/>';
    s += '<rect class="felt felt-unnvikende" x="' + r1(mx) + '" y="' + r1(my) + '" width="' + r1(x1 - mx) + '" height="' + r1(y1 - my) + '"/>';
    s += '<rect class="felt felt-fryktsom" x="' + r1(mx) + '" y="' + y0 + '" width="' + r1(x1 - mx) + '" height="' + r1(my - y0) + '"/>';
    s += '<text class="felt-navn" x="' + (x0 + 8) + '" y="' + (y1 - 8) + '">' + esc(navn['trygg']) + '</text>';
    s += '<text class="felt-navn" x="' + (x0 + 8) + '" y="' + (y0 + 16) + '">' + esc(navn['engstelig']) + '</text>';
    s += '<text class="felt-navn" x="' + (x1 - 8) + '" y="' + (y1 - 8) + '" text-anchor="end">' + esc(navn['unnvikende']) + '</text>';
    s += '<text class="felt-navn" x="' + (x1 - 8) + '" y="' + (y0 + 16) + '" text-anchor="end">' + esc(navn['fryktsom-unnvikende']) + '</text>';
    // Skillelinjer og ramme
    s += '<line class="skille" x1="' + r1(mx) + '" y1="' + y0 + '" x2="' + r1(mx) + '" y2="' + y1 + '"/>';
    s += '<line class="skille" x1="' + x0 + '" y1="' + r1(my) + '" x2="' + x1 + '" y2="' + r1(my) + '"/>';
    s += '<rect class="ramme" x="' + x0 + '" y="' + y0 + '" width="' + (x1 - x0) + '" height="' + (y1 - y0) + '"/>';
    // Akser
    for (var v = 1; v <= 7; v++) {
      s += '<text class="akse-tall" x="' + r1(x(v)) + '" y="' + (y1 + 14) + '" text-anchor="middle">' + v + '</text>';
      s += '<text class="akse-tall" x="' + (x0 - 6) + '" y="' + r1(y(v) + 4) + '" text-anchor="end">' + v + '</text>';
    }
    s += '<text class="akse" x="' + ((x0 + x1) / 2) + '" y="' + (H - 4) + '" text-anchor="middle">Unngåelse →</text>';
    s += '<text class="akse" transform="translate(12 ' + ((y0 + y1) / 2) + ') rotate(-90)" text-anchor="middle">Angst →</text>';
    // Punkter
    punkter.forEach(function (p) {
      var px = x(p.unngaelse), py = y(p.angst);
      s += '<circle class="punkt-glorie serie-' + p.serie + '" cx="' + r1(px) + '" cy="' + r1(py) + '" r="13"/>';
      s += '<circle class="punkt serie-' + p.serie + '" cx="' + r1(px) + '" cy="' + r1(py) + '" r="6.5"/>';
      if (p.navn) {
        var hoyre = px < x1 - 70;
        s += '<text class="punkt-navn serie-' + p.serie + '" x="' + r1(px + (hoyre ? 12 : -12)) + '" y="' + r1(py - 10) + '" text-anchor="' + (hoyre ? 'start' : 'end') + '">' + esc(p.navn) + '</text>';
      }
    });
    return s + '</svg>';
  }

  return { radar: radar, soyle: soyle, tilknytning: tilknytning, esc: esc };
})();
