// portrett.js – setter sammen det utbroderte portrettet (individ) og fortellingen om
// pardynamikken ut fra skårene. Rene funksjoner, testet i tester.html.

window.PT = window.PT || {};

PT.portrett = (function () {
  'use strict';

  var R = PT_DATA.portretter, T = PT_DATA.tolkninger;
  var DOMENER = ['N', 'E', 'O', 'A', 'C'];
  var nivaa = function (p) { return PT.tolkning.nivaa(p); };
  var NIVAA_ORD = { hoy: 'høyt', lav: 'lavt', midt: 'rundt midten' };

  function fyll(tekst, v) {
    return tekst.replace(/\{(\w+)\}/g, function (m, k) { return v[k] !== undefined ? v[k] : m; });
  }
  function liste(ord) {
    if (ord.length <= 1) return ord.join('');
    return ord.slice(0, -1).join(', ') + ' og ' + ord[ord.length - 1];
  }
  function retning(p) { return p >= 50 ? '+' : '-'; }

  // Trekkene sortert etter hvor langt de ligger fra midten (mest tydelige først).
  function tydeligste(profil) {
    return DOMENER
      .map(function (d) { var p = profil.domener[d].prosent; return { d: d, p: p, n: nivaa(p), avstand: Math.abs(p - 50) }; })
      .sort(function (x, y) { return y.avstand - x.avstand; });
  }

  // ---------- Individ ----------

  function arketype(profil) {
    var t = tydeligste(profil);
    if (t[0].n === 'midt') return R.balansert;
    if (t[1].n === 'midt') return R.enkelt[t[0].d + retning(t[0].p)];
    var to = [t[0], t[1]].sort(function (x, y) { return DOMENER.indexOf(x.d) - DOMENER.indexOf(y.d); });
    return R.arketyper[to[0].d + retning(to[0].p) + '|' + to[1].d + retning(to[1].p)];
  }

  // Fasetter som skiller seg tydelig fra sitt eget hovedtrekk (minst 25 prosentpoeng).
  function nyanser(profil) {
    var funn = [];
    PT_DATA.ipip.fasetter.forEach(function (f) {
      var d = f.kode.charAt(0), fp = profil.fasetter[f.kode].prosent, dp = profil.domener[d].prosent;
      if (Math.abs(fp - dp) >= 25 && nivaa(fp) !== 'midt') funn.push({ f: f, d: d, fp: fp, dp: dp, avvik: Math.abs(fp - dp) });
    });
    return funn.sort(function (x, y) { return y.avvik - x.avvik; }).slice(0, 3);
  }

  function individ(profil) {
    var ark = arketype(profil), avsnitt = [];
    var n = {}; DOMENER.forEach(function (d) { n[d] = nivaa(profil.domener[d].prosent); });

    avsnitt.push({ overskrift: 'Slik kan andre oppleve deg', tekst: R.andre[n.E + '|' + n.A] });
    avsnitt.push({ overskrift: 'Under press', tekst: R.press[n.N + '|' + n.C] });

    var ny = nyanser(profil);
    if (ny.length) {
      avsnitt.push({
        overskrift: 'Nyanser verdt å merke seg',
        tekst: ny.map(function (x, i) {
          var dom = T.domener[x.d].navn.toLowerCase(), fas = x.f.no.toLowerCase(), pr = ' (' + Math.round(x.fp) + ' %). ';
          var start = [
            'Selv om du ligger ' + NIVAA_ORD[nivaa(x.dp)] + ' på ' + dom + ', skiller ' + fas + ' seg ut' + pr,
            'Også innenfor ' + dom + ' trekker ' + fas + ' i en egen retning' + pr,
            'Og ' + fas + ' stikker seg ut fra resten av ' + dom + pr
          ][i];
          return start + PT.tolkning.fasettTekst(x.f.kode, x.fp).tekst;
        }).join(' ')
      });
    }

    avsnitt.push({ overskrift: 'I nære relasjoner', tekst: R.relasjon[profil.kvadrant.navn] });

    var t = tydeligste(profil)[0];
    avsnitt.push({
      overskrift: 'En mulig vekstkant',
      tekst: t.n === 'midt'
        ? 'Når man har litt av alt, kan det være lett å tilpasse seg andre og glemme seg selv. En mulig vekstkant er å bli tydeligere på hva du selv trenger og ønsker.'
        : T.domener[t.d][t.n].utfordringer + ' Å kjenne igjen dette når det skjer, er ofte halve jobben.'
    });

    return { tittel: ark.tittel, ingress: ark.tekst, avsnitt: avsnitt, forbehold: R.forbehold };
  }

  // ---------- Par ----------

  function par(a, b, analyse) {
    var P = R.par;
    var na = a.navn || 'Person 1', nb = b.navn || 'Person 2';
    var dom = analyse.domener.slice();
    function hoyLav(d) { return d.diff > 0 ? { hoy: na, lav: nb } : { hoy: nb, lav: na }; }

    var ulike = dom.filter(function (d) { return d.type === 'ulike'; })
      .sort(function (x, y) { return Math.abs(y.diff) - Math.abs(x.diff); });
    var felles = dom.filter(function (d) { return d.type === 'beggeHoy' || d.type === 'beggeLav'; })
      .sort(function (x, y) { return Math.abs((y.a + y.b) / 2 - 50) - Math.abs((x.a + x.b) / 2 - 50); });
    function fellesNokkel(d) { return d.kode + (d.type === 'beggeHoy' ? '+' : '-'); }

    // Tittel og ingress
    var tittel, ingress;
    if (ulike.length) {
      tittel = P.ulikeTittel[ulike[0].kode].tittel;
      ingress = fyll(P.ulikeTittel[ulike[0].kode].tekst, hoyLav(ulike[0]));
    } else if (felles.length) {
      tittel = P.likeTittel[fellesNokkel(felles[0])].tittel;
      ingress = P.likeTittel[fellesNokkel(felles[0])].tekst;
    } else {
      tittel = P.balansert.tittel; ingress = P.balansert.tekst;
    }

    var avsnitt = [];

    // Scener fra hverdagen: de mest talende trekkene, høyst tre.
    ulike.concat(felles).slice(0, 3).forEach(function (d) {
      var s = P.scener[d.kode];
      avsnitt.push({ overskrift: s.overskrift, tekst: fyll(s[d.type], hoyLav(d)) });
    });

    // Tilknytningsdansen
    var tk = analyse.tilknytning, navn = {};
    navn[tk.a === 'fryktsom-unnvikende' ? 'fryktsom' : tk.a] = na;
    navn[tk.b === 'fryktsom-unnvikende' ? 'fryktsom' : tk.b] = nb;
    avsnitt.push({ overskrift: 'Nærhet og avstand', tekst: fyll(P.dans[tk.nokkel], navn) });

    // Det dere gir hverandre
    var forskjellige = dom.filter(function (d) { return d.type === 'ulike' || d.type === 'litt'; })
      .sort(function (x, y) { return Math.abs(y.diff) - Math.abs(x.diff); }).slice(0, 3);
    var gir = [];
    if (forskjellige.length) {
      var verb = ['bidrar med', 'gir', 'tilfører'];
      gir.push(forskjellige.map(function (d, i) {
        var hl = hoyLav(d);
        return hl.hoy + ' ' + verb[i] + ' ' + P.bidrag[d.kode].hoy + ', og ' + hl.lav + ' ' + verb[i] + ' ' + P.bidrag[d.kode].lav + '.';
      }).join(' '));
    }
    var deler = felles.map(function (d) { return P.bidragFelles[fellesNokkel(d)]; }).filter(Boolean);
    if (deler.length) gir.push('Det dere deler, er ' + liste(deler) + '.');
    if (!gir.length) gir.push('Dere ligger nær hverandre på det meste, og det gir et felles språk: Dere forstår ofte hverandre uten mange ord.');
    avsnitt.push({ overskrift: 'Det dere gir hverandre', tekst: gir.join(' ') });

    // Fallgruven
    var fg;
    if (ulike.length) fg = fyll(P.fallgruve[ulike[0].kode], hoyLav(ulike[0]));
    else {
      var f = felles.filter(function (d) { return P.fallgruveFelles[fellesNokkel(d)]; })[0];
      fg = f ? P.fallgruveFelles[fellesNokkel(f)] : P.fallgruveGenerell;
    }
    avsnitt.push({ overskrift: 'Fallgruven å se opp for', tekst: 'Den kanskje største fallgruven for dere er ' + fg +
      '. Å sette ord på mønsteret mens alt er rolig, gjør det mye lettere å oppdage det når det skjer.' });

    return { tittel: tittel, ingress: ingress, avsnitt: avsnitt, forbehold: P.forbehold };
  }

  return { individ: individ, par: par, arketype: arketype };
})();
