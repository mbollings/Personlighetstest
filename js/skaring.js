// skaring.js – all regning for testen samlet ett sted.
// Her ligger bare rene funksjoner: tall inn, tall ut. Ingenting tegnes på skjermen,
// og det er derfor enkelt å teste alt sammen automatisk (se tester.html).
//
// Prinsipp: svarene gjøres om til SUMMER per fasett (IPIP) og per dimensjon (ECR-R).
// Alt annet (snitt, prosent, persentil, kvadrant) regnes ut fra summene.
// Resultatkoden lagrer de samme summene, så en profil som er bygd fra en kode,
// blir helt lik profilen som ble bygd fra de opprinnelige svarene.

window.PT = window.PT || {};

PT.skaring = (function () {
  'use strict';

  // ---------- Grunnleggende ----------

  // Snur et svar på en skala: på 1–5 blir 1→5, 2→4 og 3→3. På 1–7 blir 1→7 (8 − svar).
  function reverser(svar, min, max) {
    return min + max - svar;
  }

  // Sjekker at svaret er et heltall innenfor skalaen. Kaster en feil ellers.
  function sjekkSvar(svar, min, max, hvor) {
    if (typeof svar !== 'number' || !Number.isInteger(svar) || svar < min || svar > max) {
      throw new Error('Ugyldig svar ' + JSON.stringify(svar) + ' på ' + hvor +
        ' (må være et heltall fra ' + min + ' til ' + max + ')');
    }
  }

  // Poeng for én påstand: svaret som det er, eller snudd hvis påstanden er reversert ("-").
  function poeng(svar, nokkel, min, max) {
    if (nokkel === '+') return svar;
    if (nokkel === '-') return reverser(svar, min, max);
    throw new Error('Ukjent nøkkel: ' + nokkel);
  }

  // Gjør et gjennomsnitt om til prosent av skalaen: laveste mulige = 0, høyeste = 100.
  function tilProsent(snitt, min, max) {
    return (snitt - min) / (max - min) * 100;
  }

  // ---------- Fra svar til summer ----------

  // svar: liste der svar[nr - 1] er svaret på påstand nr (1-basert, som i kildene).
  // gruppefelt: "fasett" (IPIP) eller "dimensjon" (ECR-R).
  // Returnerer { gruppekode: sum av poeng }.
  function summerPerGruppe(svar, data, gruppefelt) {
    var min = data.svarskala.min, max = data.svarskala.max;
    if (!Array.isArray(svar) || svar.length !== data.pastander.length) {
      throw new Error('Forventet ' + data.pastander.length + ' svar, fikk ' +
        (Array.isArray(svar) ? svar.length : typeof svar));
    }
    var summer = {};
    data.pastander.forEach(function (p) {
      var s = svar[p.nr - 1];
      sjekkSvar(s, min, max, data.instrument + ' påstand ' + p.nr);
      var g = p[gruppefelt];
      summer[g] = (summer[g] || 0) + poeng(s, p.nokkel, min, max);
    });
    return summer;
  }

  // Hvor mange påstander hver gruppe har (4 per IPIP-fasett, 18 per ECR-R-dimensjon).
  function antallPerGruppe(data, gruppefelt) {
    var antall = {};
    data.pastander.forEach(function (p) {
      antall[p[gruppefelt]] = (antall[p[gruppefelt]] || 0) + 1;
    });
    return antall;
  }

  // ---------- Normalfordeling (bare for ECR-R-persentiler) ----------

  // Feilfunksjonen, tilnærmet etter Abramowitz & Stegun 7.1.26 (feil < 0,0000002).
  function erf(x) {
    var fortegn = x < 0 ? -1 : 1;
    x = Math.abs(x);
    var t = 1 / (1 + 0.3275911 * x);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return fortegn * y;
  }

  // Andelen av en normalfordeling som ligger under z.
  function normalFordeling(z) {
    return 0.5 * (1 + erf(z / Math.SQRT2));
  }

  // Omtrentlig persentil: hvor mange prosent i normutvalget som skårer lavere.
  // Begrenses til 1–99, fordi ytterpunktene er usikre.
  function persentil(verdi, M, SD) {
    var p = Math.round(normalFordeling((verdi - M) / SD) * 100);
    return Math.min(99, Math.max(1, p));
  }

  // ---------- Tilknytningskvadrant ----------

  // Skillelinjene er gjennomsnittene i Fraleys normutvalg. Fraley anbefaler å dele
  // ved medianen hvis man må dele, og gjennomsnittet er det nærmeste han publiserer.
  // "naerGrensen" er sann når punktet ligger mindre enn et kvart standardavvik fra en
  // skillelinje. Da gir kvadrantnavnet et ekstra grovt bilde.
  function kvadrant(angst, unngaelse, norm) {
    var hoyAngst = angst >= norm.ANX.M;
    var hoyUnngaelse = unngaelse >= norm.AVO.M;
    var navn;
    if (!hoyAngst && !hoyUnngaelse) navn = 'trygg';
    else if (hoyAngst && !hoyUnngaelse) navn = 'engstelig';
    else if (!hoyAngst && hoyUnngaelse) navn = 'unnvikende';
    else navn = 'fryktsom-unnvikende';
    var naerGrensen =
      Math.abs(angst - norm.ANX.M) < 0.25 * norm.ANX.SD ||
      Math.abs(unngaelse - norm.AVO.M) < 0.25 * norm.AVO.SD;
    return { navn: navn, naerGrensen: naerGrensen };
  }

  // ---------- Fra summer til ferdig profil ----------

  // fasettSummer: { N1: 14, ... } (30 stk). ecrSummer: { ANX: 60, AVO: 40 }.
  // Brukes både rett etter testen og når en resultatkode leses inn.
  function profilFraSummer(fasettSummer, ecrSummer, ipip, ecr) {
    var iMin = ipip.svarskala.min, iMax = ipip.svarskala.max;
    var eMin = ecr.svarskala.min, eMax = ecr.svarskala.max;
    var antallFasett = antallPerGruppe(ipip, 'fasett');
    var antallDim = antallPerGruppe(ecr, 'dimensjon');

    var fasetter = {};
    ipip.fasetter.forEach(function (f) {
      var sum = fasettSummer[f.kode];
      if (typeof sum !== 'number') throw new Error('Mangler sum for fasett ' + f.kode);
      var snitt = sum / antallFasett[f.kode];
      fasetter[f.kode] = { sum: sum, snitt: snitt, prosent: tilProsent(snitt, iMin, iMax) };
    });

    // Et trekk = gjennomsnittet av alle 24 påstandene. Siden hver fasett har like mange
    // påstander, er det det samme som gjennomsnittet av fasettenes gjennomsnitt.
    var domener = {};
    ipip.domener.forEach(function (d) {
      var sum = 0, n = 0;
      ipip.fasetter.forEach(function (f) {
        if (f.kode.charAt(0) === d.kode) { sum += fasetter[f.kode].sum; n += antallFasett[f.kode]; }
      });
      var snitt = sum / n;
      domener[d.kode] = { snitt: snitt, prosent: tilProsent(snitt, iMin, iMax) };
    });

    var norm = ecr.normer.hele_utvalget;
    var tilknytning = {};
    ['ANX', 'AVO'].forEach(function (k) {
      var sum = ecrSummer[k];
      if (typeof sum !== 'number') throw new Error('Mangler sum for ' + k);
      var snitt = sum / antallDim[k];
      tilknytning[k] = {
        sum: sum,
        snitt: snitt,
        prosent: tilProsent(snitt, eMin, eMax),
        persentil: persentil(snitt, norm[k].M, norm[k].SD)
      };
    });

    return {
      fasetter: fasetter,
      domener: domener,
      tilknytning: tilknytning,
      kvadrant: kvadrant(tilknytning.ANX.snitt, tilknytning.AVO.snitt, norm)
    };
  }

  // Hovedfunksjonen: alle svar inn, ferdig profil ut.
  function lagProfil(ipipSvar, ecrSvar, ipip, ecr) {
    return profilFraSummer(
      summerPerGruppe(ipipSvar, ipip, 'fasett'),
      summerPerGruppe(ecrSvar, ecr, 'dimensjon'),
      ipip, ecr);
  }

  return {
    reverser: reverser,
    poeng: poeng,
    tilProsent: tilProsent,
    summerPerGruppe: summerPerGruppe,
    antallPerGruppe: antallPerGruppe,
    normalFordeling: normalFordeling,
    persentil: persentil,
    kvadrant: kvadrant,
    profilFraSummer: profilFraSummer,
    lagProfil: lagProfil
  };
})();
