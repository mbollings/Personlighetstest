// kode.js – gjør en profil om til en kort resultatkode, og tilbake igjen.
//
// Koden inneholder bare summene per fasett og per tilknytningsdimensjon, pluss fornavn.
// De enkelte svarene er ikke med. Eksempel:  1a7c...k3-Kari
//
//   tegn 1       versjon ("1")
//   tegn 2–31    de 30 fasettsummene, ett tegn hver (0–16, skrevet i 36-tallsystemet: 0–9 og a–z)
//   tegn 32–35   angst og unngåelse, to tegn hver (0–108)
//   tegn 36      kontrolltegn som avslører skrivefeil (0–9, a–z eller _)
//   "-" + navn   fornavn (valgfritt)
//
// Koden legges etter # i lenken (resultat.html#kode). Nettleseren sender aldri
// den delen av adressen til noen server.

window.PT = window.PT || {};

PT.kode = (function () {
  'use strict';

  var VERSJON = '1';
  var TEGN = '0123456789abcdefghijklmnopqrstuvwxyz';
  var MAKS_NAVN = 30;

  function tilTegn(tall, bredde) {
    var s = tall.toString(36);
    while (s.length < bredde) s = '0' + s;
    if (s.length > bredde) throw new Error('Tallet ' + tall + ' får ikke plass i ' + bredde + ' tegn');
    return s;
  }

  // Kontrolltegnet vekter hvert tegn med plassen det står på, så det fanger både
  // feilskrevne tegn og to tegn som har byttet plass. Vi regner med rest etter deling
  // på 37 (et primtall). Da kan ingen enkeltfeil "gå opp i opp", og 37 krever ett
  // ekstra symbol (_), som bare brukes i kontrolltegnet.
  var KONTROLL = TEGN + '_';
  function kontrolltegn(tekst) {
    var sum = 0;
    for (var i = 0; i < tekst.length; i++) sum += (i + 1) * TEGN.indexOf(tekst.charAt(i));
    return KONTROLL.charAt(sum % 37);
  }

  // Laveste mulige sum og bredden på hver verdi, hentet fra datafilene.
  function oppsett(ipip, ecr) {
    var S = PT.skaring;
    var nF = S.antallPerGruppe(ipip, 'fasett');
    var nD = S.antallPerGruppe(ecr, 'dimensjon');
    var felt = [];
    ipip.fasetter.forEach(function (f) {
      felt.push({ type: 'fasett', kode: f.kode, min: nF[f.kode] * ipip.svarskala.min,
        maks: nF[f.kode] * ipip.svarskala.max, bredde: 1 });
    });
    ['ANX', 'AVO'].forEach(function (k) {
      felt.push({ type: 'ecr', kode: k, min: nD[k] * ecr.svarskala.min,
        maks: nD[k] * ecr.svarskala.max, bredde: 2 });
    });
    return felt;
  }

  // profil: resultatet fra PT.skaring.lagProfil. navn: fornavn (valgfritt).
  function lagKode(profil, navn, ipip, ecr) {
    var tekst = VERSJON;
    oppsett(ipip, ecr).forEach(function (f) {
      var sum = f.type === 'fasett' ? profil.fasetter[f.kode].sum : profil.tilknytning[f.kode].sum;
      tekst += tilTegn(sum - f.min, f.bredde);
    });
    tekst += kontrolltegn(tekst);
    var rentNavn = (navn || '').trim().slice(0, MAKS_NAVN);
    return rentNavn ? tekst + '-' + encodeURIComponent(rentNavn) : tekst;
  }

  // Leser en kode og returnerer { navn, profil }. Kaster en feil med en forklaring
  // hvis koden er ødelagt. Godtar også en hel lenke (alt før # fjernes).
  function lesKode(kode, ipip, ecr) {
    var tekst = String(kode || '').trim();
    var hash = tekst.indexOf('#');
    if (hash >= 0) tekst = tekst.slice(hash + 1);
    var strek = tekst.indexOf('-');
    var navn = '';
    if (strek >= 0) {
      try { navn = decodeURIComponent(tekst.slice(strek + 1)); }
      catch (e) { throw new Error('Navnet i koden er ødelagt.'); }
      tekst = tekst.slice(0, strek);
    }
    tekst = tekst.toLowerCase();

    var felt = oppsett(ipip, ecr);
    var lengde = 1 + felt.reduce(function (s, f) { return s + f.bredde; }, 0) + 1;
    if (tekst.charAt(0) !== VERSJON) throw new Error('Ukjent kodeversjon. Er hele koden kopiert?');
    if (tekst.length !== lengde) throw new Error('Koden har feil lengde (' + tekst.length + ' tegn, skal være ' + lengde + '). Er hele koden kopiert?');
    for (var i = 0; i < tekst.length; i++) {
      var lovlige = i === tekst.length - 1 ? KONTROLL : TEGN;
      if (lovlige.indexOf(tekst.charAt(i)) < 0) throw new Error('Koden inneholder et ugyldig tegn: «' + tekst.charAt(i) + '».');
    }
    var innhold = tekst.slice(0, -1);
    if (kontrolltegn(innhold) !== tekst.slice(-1)) throw new Error('Koden ser ut til å ha en skrivefeil (kontrolltegnet stemmer ikke).');

    var fasettSummer = {}, ecrSummer = {}, pos = 1;
    felt.forEach(function (f) {
      var verdi = parseInt(innhold.substr(pos, f.bredde), 36) + f.min;
      pos += f.bredde;
      if (verdi < f.min || verdi > f.maks) throw new Error('Koden inneholder en umulig verdi for ' + f.kode + '.');
      if (f.type === 'fasett') fasettSummer[f.kode] = verdi; else ecrSummer[f.kode] = verdi;
    });

    return { navn: navn, profil: PT.skaring.profilFraSummer(fasettSummer, ecrSummer, ipip, ecr) };
  }

  // Finner alt som ser ut som resultatkoder i en tekst: en kode, en lenke, en parlenke
  // (to koder med + imellom) eller innholdet i en lagret fil. Samme kode tas med én gang.
  // Kodene er ikke kontrollert her; det gjør lesKode.
  function finnKoder(tekst) {
    var monster = /(?:^|[^0-9a-z])(1[0-9a-z]{34}[0-9a-z_](?:-[^\s<>"+]*)?)(?![0-9a-z_])/gi;
    var funnet = [], t;
    while ((t = monster.exec(String(tekst || ''))) !== null) {
      if (funnet.indexOf(t[1]) < 0) funnet.push(t[1]);
    }
    return funnet;
  }

  return { lagKode: lagKode, lesKode: lesKode, finnKoder: finnKoder, kontrolltegn: kontrolltegn };
})();
