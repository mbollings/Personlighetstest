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
  // akseKlasser (valgfritt): f.eks. ["t-N", "t-E", …] gir aksenavn og prikker trekkets farge.
  function radar(akser, serier, akseKlasser) {
    var kl = function (i) { return akseKlasser ? ' ' + akseKlasser[i] : ''; };
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
      s += '<text class="akse' + kl(i) + '" x="' + r1(tekst[0]) + '" y="' + r1(y) + '" text-anchor="' + anker + '">' + esc(navn);
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
        s += '<circle class="prikk ' + (serier.length === 1 && akseKlasser ? akseKlasser[i] : 'serie-' + si) + '" cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="' + (serier.length === 1 ? 5.5 : 4) + '"/>';
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

  // ---------- Fingeravtrykk ----------
  // En myk, organisk figur tegnet ut fra de fem trekkene. Hver person får sin egen form.
  // serier: [{ verdier: [5 tall 0–100] }]. Én serie: tre lag i ulike nyanser + fargeprikker per trekk.
  // To serier: to figurer oppå hverandre i personfargene.
  var TREKK = ['N', 'E', 'O', 'A', 'C'];

  function myktOmriss(punkter) {
    // Lukket Catmull–Rom-kurve gjennom punktene, omregnet til kubiske Bézier-kurver.
    var n = punkter.length, d = 'M' + r1(punkter[0][0]) + ' ' + r1(punkter[0][1]);
    for (var i = 0; i < n; i++) {
      var p0 = punkter[(i - 1 + n) % n], p1 = punkter[i], p2 = punkter[(i + 1) % n], p3 = punkter[(i + 2) % n];
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      var c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ' C' + r1(c1[0]) + ' ' + r1(c1[1]) + ' ' + r1(c2[0]) + ' ' + r1(c2[1]) + ' ' + r1(p2[0]) + ' ' + r1(p2[1]);
    }
    return d + 'Z';
  }

  function avtrykkPunkter(verdier, cx, cy, skala) {
    // Ett punkt per trekk, og et litt innsunket punkt mellom hvert par (gir en blomsteraktig form).
    var pkt = [], n = verdier.length;
    for (var i = 0; i < n; i++) {
      var v = (-90 + i * 360 / n) * Math.PI / 180, r = (38 + verdier[i] * 0.88) * skala;
      pkt.push([cx + Math.cos(v) * r, cy + Math.sin(v) * r]);
      var v2 = (-90 + (i + 0.5) * 360 / n) * Math.PI / 180;
      var r2 = (38 + (verdier[i] + verdier[(i + 1) % n]) / 2 * 0.88) * skala * 0.8;
      pkt.push([cx + Math.cos(v2) * r2, cy + Math.sin(v2) * r2]);
    }
    return pkt;
  }

  // lagFarger (valgfritt, én person): trekk-koder for de to indre lagene, f.eks. ['C', 'A'].
  function fingeravtrykk(serier, lagFarger) {
    var S = 300, c = 150;
    var s = '<svg class="avtrykk" viewBox="0 0 ' + S + ' ' + S + '" role="img" aria-label="Personlig fingeravtrykk tegnet ut fra de fem trekkene">';
    s += '<circle class="avtrykk-strek" cx="' + c + '" cy="' + c + '" r="' + (38 + 50 * 0.88) + '" stroke-dasharray="2 4"/>';
    s += '<circle class="avtrykk-strek" cx="' + c + '" cy="' + c + '" r="' + (38 + 100 * 0.88) + '"/>';
    if (serier.length === 1) {
      var v = serier[0].verdier;
      [[1, 0.16, 'serie-0'], [0.74, 0.3, lagFarger ? 't-' + lagFarger[0] : 'serie-0'], [0.48, 0.42, lagFarger ? 't-' + lagFarger[1] : 'serie-0']].forEach(function (lag) {
        s += '<path class="avtrykk-lag ' + lag[2] + '" fill-opacity="' + lag[1] + '" d="' + myktOmriss(avtrykkPunkter(v, c, c, lag[0])) + '"/>';
      });
      v.forEach(function (verdi, i) {
        var a = (-90 + i * 72) * Math.PI / 180, r = 38 + verdi * 0.88;
        s += '<circle class="avtrykk-prikk t-' + TREKK[i] + '" cx="' + r1(c + Math.cos(a) * r) + '" cy="' + r1(c + Math.sin(a) * r) + '" r="7.5"/>';
      });
    } else {
      serier.forEach(function (serie, si) {
        s += '<path class="avtrykk-lag serie-' + si + '" fill-opacity=".28" d="' + myktOmriss(avtrykkPunkter(serie.verdier, c, c, 1)) + '"/>';
        s += '<path class="avtrykk-lag serie-' + si + '" fill-opacity=".22" d="' + myktOmriss(avtrykkPunkter(serie.verdier, c, c, 0.55)) + '"/>';
      });
    }
    return s + '</svg>';
  }

  // ---------- Skala med ord i begge ender ----------
  // merker: [{ prosent, serie }]. Én person: fyll i trekkets farge + merke. To personer: to merker.
  function spektrum(poler, merker, opts) {
    opts = opts || {};
    var h = '<div class="spektrum' + (opts.stor ? ' stor' : '') + (opts.trekk ? ' t-' + opts.trekk : '') + '">' +
      '<div class="spektrum-poler"><span>' + esc(poler[0]) + '</span><span>' + esc(poler[1]) + '</span></div>' +
      '<div class="spektrum-spor">';
    if (merker.length === 1) h += '<div class="spektrum-fyll" style="width:' + merker[0].prosent.toFixed(1) + '%"></div>';
    h += '<div class="spektrum-midt" aria-hidden="true"></div>';
    merker.forEach(function (m) {
      h += '<span class="spektrum-merke' + (merker.length > 1 ? ' serie-' + m.serie : '') + '" style="left:' +
        Math.min(98.5, Math.max(1.5, m.prosent)).toFixed(1) + '%"></span>';
    });
    return h + '</div></div>';
  }

  return { radar: radar, soyle: soyle, tilknytning: tilknytning, fingeravtrykk: fingeravtrykk, spektrum: spektrum, esc: esc };
})();
