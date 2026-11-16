// tolkning.js – velger riktige tekster ut fra skårene. Rene funksjoner, testet i tester.html.

window.PT = window.PT || {};

PT.tolkning = (function () {
  'use strict';

  var T = PT_DATA.tolkninger;

  // "lav", "midt" eller "hoy" ut fra prosent av skalaen.
  function nivaa(prosent) {
    if (prosent <= T.grenser.lav) return 'lav';
    if (prosent >= T.grenser.hoy) return 'hoy';
    return 'midt';
  }

  function domeneTekst(kode, prosent) {
    var d = T.domener[kode], n = nivaa(prosent);
    return { nivaa: n, tekst: n === 'midt' ? d.midt : null, styrker: n === 'midt' ? null : d[n].styrker, utfordringer: n === 'midt' ? null : d[n].utfordringer };
  }

  function fasettTekst(kode, prosent) {
    var f = T.fasetter[kode], n = nivaa(prosent);
    return { nivaa: n, tekst: n === 'midt' ? T.fasettMidt : f[n], merknad: f.merknad || null };
  }

  function sett(liste) {
    if (liste.length <= 1) return liste.join('');
    return liste.slice(0, -1).join(', ') + ' og ' + liste[liste.length - 1];
  }

  function storForbokstav(t) { return t.charAt(0).toUpperCase() + t.slice(1); }

  // «Deg i et nøtteskall»: de inntil tre trekkene som skiller seg mest fra midten,
  // pluss setninger om trekkene i midten og om tilknytning.
  // Returnerer { punkter: [korte beskrivelser], setninger: [hele setninger] }.
  function notteskall(profil) {
    var koder = ['N', 'E', 'O', 'A', 'C'];
    var tydelige = koder
      .map(function (k) { return { k: k, p: profil.domener[k].prosent }; })
      .filter(function (x) { return nivaa(x.p) !== 'midt'; })
      .sort(function (a, b) { return Math.abs(b.p - 50) - Math.abs(a.p - 50); })
      .slice(0, 3);

    var punkter = tydelige.map(function (x) {
      var d = T.domener[x.k];
      return storForbokstav(nivaa(x.p) === 'hoy' ? d.kortHoy : d.kortLav) + '.';
    });

    var setninger = [];
    if (!tydelige.length) {
      setninger.push('Du beskriver deg som balansert: ingen av de fem hovedtrekkene skiller seg tydelig ut, og du tilpasser deg trolig godt ulike situasjoner.');
    }
    var midt = koder.filter(function (k) { return nivaa(profil.domener[k].prosent) === 'midt'; });
    if (tydelige.length && midt.length) {
      setninger.push('På ' + sett(midt.map(function (k) { return T.domener[k].navn.toLowerCase(); })) +
        ' ligger du rundt midten, med trekk fra begge sider.');
    }
    var kv = T.tilknytning.kvadranter[profil.kvadrant.navn];
    setninger.push('I nære relasjoner ligger du ' + (profil.kvadrant.naerGrensen ? 'nær grensen, men nærmest ' : 'nærmest ') +
      'det feltet som kalles «' + kv.navn.toLowerCase() + '».');
    return { punkter: punkter, setninger: setninger };
  }

  return { nivaa: nivaa, domeneTekst: domeneTekst, fasettTekst: fasettTekst, notteskall: notteskall };
})();
