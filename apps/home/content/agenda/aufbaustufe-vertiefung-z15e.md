---
navigation: false
navigation_highlight: /ausbildung-theaterpaedagogik/vertiefung
shortcode: z15e
heading: "Modul E — September 2026 bis Februar 2027 **VERTIEFUNG Theaterpädagogik**"
date_start: 2026-09-30
end: 2027-02-28
ctype: course
tag: course
description: Aufbaustufe Theaterpädagogik (BuT) - Modul E Vertiefung SEP 2026 – FEB 2027
title: Vertiefung Theaterpädagogik
cssclasses:
  - course
views:
  - product
  - details
#
# ── CN IMPLEMENTATION NOTES ──────────────────────────────────────────────
# SAC Persona: LENKA (Vertiefung only)
# Shortcode: z15e → Odoo product MOD-E (single product, no bundle)
# Checkout tier: manual_review (z* prefix)
# Stepper: 2 custom + 2 standard (kontakt + checks) = 4 steps total
#
# Custom steps:
#   1. vertiefung — Programme overview (E1 + E2 events)
#   2. konditionen — Pricing & cancellation terms
# Standard steps (appended by DataViewDetails.vue):
#   3. kontakt — Contact form (existing component)
#   4. checks — AGB/Datenschutz/booking (existing component)
#
# Debug priority: ★★★ FIRST (Lenka = proof-of-concept against CO instance)
# CN sends productRef "z15e" → CO resolves to MOD-E via _parse_product_ref()
# Result: 1 sale.order.line (MOD-E) + event.registration for E1, E2
# ─────────────────────────────────────────────────────────────────────────
#
details:
  vertiefung:
    title: Vertiefung
    header: |
      ## Vertiefung: Modul E
    info:
      struktur: |
        ### Dein Programm SEP 2026 – FEB 2027
        - **E1 Seminarwoche** 6 Tage, Burgstallmühle
        - **E2 Workshop** 5 Tage, München
        - **+ 2 Seminare** Offenes Programm (freie Wahl)
        - **+ 5 Online-Sessions** monatlich, 2h
        - **+ 3 Coaching-Sessions** flexibel terminierbar
        - **SUMME** ca. 160 UE über 5 Monate
      hinweis: |
        #### Erweiterung möglich
        Nach der Vertiefung kannst Du Dich für ein **Profiljahr** (Theatrales Lernen oder Performance & Interkult. Theater) und die **Abschlussphase** entscheiden.
        
        - Erweiterung buchbar bis **28. Februar 2027**
        - Profilwahl nach den Info-Teasern T0/R0 (DEZ 26 – FEB 27)
        - Persönliche **Beratung** ist Teil der Vertiefung
  konditionen:
    title: Kosten & Konditionen
    header: |
      ## Kosten & Konditionen
    info:
      kosten: |
        ### Kosten
        - **Anmeldegebühr (einmalig)** € 80,00
        - **8 Kursraten × € 220,00** € 1.760,00
        - **GESAMT** € 1.840,00
        
        Ratenzahlung: SEP 2026 – APR 2027 (monatlich)
      storno: |
        ### Frühbuchung & Storno
        - **Frühbuchung bis 10.04.26:** 1 zusätzl. Seminar Offenes Programm frei
        - **Storno bis 10 Tage nach E1:** Kündigung ohne zusätzliche Kosten
        - **Kündigung nach E1:** € 220 Stornogebühr
        - Bereits gebuchte Seminare → Erstattung
      erweiterung: |
        ### Erweiterungsoptionen (später buchbar)
        - **Profiljahr** (Profil + K2-K3) 12 Raten × € 220,00 = € 2.640,00
        - **Abschlussphase** (K4-K6 + P1-P6) 9 Raten × € 220,00 = € 1.980,00
        - **Frühbucher Aufbaustufe** bis 31.10.26: € 440 Ersparnis
      uebernachtung: |
        ### Übernachtung E1 (Burgstallmühle)
        Übernachtung + Verpflegung direkt vor Ort bezahlen:
        - Saalübernachtung: € 15/Nacht
        - Mehrbettzimmer: € 25–35/Nacht
        - Einzelzimmer: € 50/Nacht (begrenzt)
consulting:
  intro: Schreib uns — wir melden uns innerhalb von 2 Werktagen.
  extension_note: |
    💡 Nach der Vertiefung entscheidest du, ob du ein Profil (Theatrales Lernen oder Performance) buchst.
  fancy: true
  categories:
    - key: terms_and_options
      overline: Kosten & Optionen
      label: Finanzierung
      teaser: "EUR 1.840 in 8 Raten (€ 80 Anmeldegebühr + 8 × € 220). Bei Frühbuchung bis 10.04.26 ist ein zusätzliches Seminar aus dem Offenen Programm inkludiert (im Wert € 220, auch später noch belegbar). Storno bis 10 Tage nach E1 ohne Zusatzkosten. Bei finanziellen Engpässen gibt es eine Härtefall-Regelung, und für Solo-Selbstständige prüfen wir KOMPASS-Förderung."
      options:
        - Frühbucherrabatt
        - Stornierung & Pausieren
        - Zahlungsplan
        - Härtefall
        - label: KOMPASS-Förderung (Solo-Selbstständige)
          url: /blog/aktuelles/dasei-unterstuetzt-kompass-foerderung-27
        - label: Fördermöglichkeiten Überblick
          url: /blog/aktuelles/foerdermoeglichkeiten-29
    - key: prerequisites
      overline: Zulassung & Anerkennung
      label: Zulassung & Quereinstieg
      teaser: "Voraussetzung: abgeschlossene Grundlagenbildung (bei DAS Ei oder BuT-Institut) plus eines der Kriterien A-B-C-D — pädagogische/therapeutische Ausbildung, künstlerische Ausbildung, Studium oder 3+ Jahre Vollzeittätigkeit. Quereinstieg mit Praxiserfahrung möglich; wir erkennen auch externe Grundlagenbildung an."
      options:
        - Zulassung (A-B-C-D Kriterien)
        - Bildungs- und Berufsabschlüsse
        - Anerkennung von Praxiserfahrung
        - Grundlagenbildung extern (BuT-Institute)
        - Erfülle ich die Voraussetzungen?
    - key: schedules
      overline: Termine & Zeitplanung
      label: Verläufe
      teaser: "Kompakt in 5 Monaten: E1 Ende September (Burgstallmühle, 6 Tage), E2 im Januar (München, 5 Tage), dazwischen 2 Wochenenden aus dem Offenen Programm. Nachholung flexibel möglich. Profilwahl bis Februar 2027 — du entscheidest erst nach der Vertiefung, wie es weitergeht."
      options:
        - label: Vertiefung (Einstiegsphase)
          url: /ausbildung-theaterpaedagogik/aufbaustufe
        - Offenes Programm
        - Nachholung
        - Letzter Einstieg
    - key: topics
      overline: Themenschwerpunkte
      label: Profile
      teaser: "Nach der Vertiefung wählst du dein Profil: Theatrales Lernen richtet sich an Schule, Bildung, Vermittlung. Performance & Interkult. Theater fokussiert auf Kunst, Inszenierung, interkulturelle Praxis. Die Profilwahl ist nicht Teil dieses Vertrages — du entscheidest erst, wenn du E1 und E2 erlebt hast."
      options:
        - label: Profil Performance
          url: /ausbildung-theaterpaedagogik/profil_performance
        - label: Profil Theatrales Lernen
          url: /ausbildung-theaterpaedagogik/profil_theatrales_lernen
        - Profilwechsel — bis wann möglich?
  email: service@dasei.eu
  emailLabel: per Email klären
  callPhone: "+49 911 7808476"
  callLabel: direkt klären (Videocall oder Telefon)
  success:
    email: ✨ abgeschickt! Wir melden uns bei dir.
    call: Bis bald! Wir rufen dich an.
product:
  header: |
    Die Vertiefung (Modul E) umfasst zwei intensive Seminarwochen plus persönliches Coaching: Du vertiefst die Methoden aus der Grundstufe und erhältst wichtige didaktische Werkzeuge für deine theaterpädagogische Praxis.
  footer: |
    ## September 2026 – Februar 2027 **Vertiefung Theaterpädagogik**
items:
  course_summary:
    meta:
      locked: true
    summary:
      events: [e1_1, e2_69]
      duration: "5 Monate"
      ue: 160
    ctype: slide_2cols
    title: "**Programmbestandteile**"
    body: |
      - **E1** Seminarwoche — Dicht an der Grenze · 6 Tage, Burgstallmühle
      - **K1** Didaktik & Theorie — Online-Programm, z.B. Reflexion „Labor-Box" & TZI · Tiefendimensionen des Lernens

      ---

      - **E2** Workshop & Kursformat + Soziometrie — Offene Themen, Transfer & Methodik · 5 Tage, München
      - **OP** Offenes Programm (freie Wahl), z.B. Eine Rolle – viele Gesichter · Forumtheater
  e1_blind:
    meta:
      source: e1_1
    ctype: event
    shortcode: E1
    title: "Das Format Seminarwoche **Dicht an der Grenze**"
    tag: "1. OKT 09:00 – 5. OKT 16:00 · Burgstallmühle · Anreise: 30. SEP abends"
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_400,h_400,g_auto,q_auto,f_auto/dasei/E1_slide1_blind_gefuehrt.jpg
      caption: Blind geführt — Vertrauen als Methode
    body: |
      Die praktische Seminarwoche (4,5 Tage) zum Thema Demokratie durchläufst du zunächst als Teilnehmer:in. 

      Anschließend (auch im online-Programm) wird der Prozess ausführlich reflektiert und mit Theorie gefüllt. Du vertiefst Methoden der szen. Themenarbeit, Soziometrie, Körperarbeit und lernst didaktische Werkzeuge anzuwenden (z.B. TZI, Tiefendimensionen).  
      
      Inhalte: Themen- & Kennenlernprozess initiieren, Methoden der Szen. Themenarbeit: Standbilder, Denkmal, Rollenspiel, Bewegte Themenarbeit & Körperarbeit, Methoden von Augusto Boal, Deep Democracy, Open Space 
    date_start: 2026-09-30T17:00
    date_end: 2026-10-05T14:00
    location: |
      Burgstallmühle
      Burgstallmühle 1
      91338 Igensdorf
    schedule: |
      MI 30.09. Anreise bis 16:00, Beginn 17:00
      MO 05.10. Ende ca. 14:00 nach Mittagessen
    instructors: Hans Dönitz, Rosalin Hertrich
  k1_didaktik_und_theorie_teil1:
    meta:
      locked: true
    ctype: schedule
    shortcode: K1
    title: Planung & Reflexion von Lernprozessen  **Didaktik & Theorie**
    tag: "Digitalprogramm - mit Recording & Skript"
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_400,h_400,g_auto,q_auto,f_auto/dasei/K1_praktische_didaktik_wellenmodell.jpg
      caption: Praktische Didaktik — Wellenmodell
    body: |
      Im begleitenden online-Programm verbinden wir Reflexionen aus der durchlaufenen Praxis mit prägnanten Theorie Inputs. 
      - Di 22.9. 18:00-20:00 Einführung & Organisation 
      - Do 8.10. 18:30-21:45 Reflexion “Labor-Box” & TZI 
      - Do 15.10. 18:30-21:45 Rollende Planung & Kontrakt  
      - Di 3.11. 18:00-20:00 Input TZI & 3-Spalten-Modell 
      - Do 10.12. 18:30-21:45 Input Soziometrie & Konzeption
    date_start: 2026-09-22
    date_end: 2027-02-28
    location: |
      Seminartermine siehe dasei.eu/agenda
    schedule: |
      7 Online-Einheiten
    instructors: Hans Dönitz, Rosalin Hertrich  
  offenes_programm:
    meta:
      locked: true
    ctype: event
    shortcode: 
    title: "Wähle flexibel 2 Seminare **Offenes Programm**"
    tag: Wahlprogramm  
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_400,h_400,g_auto,q_auto,f_auto/dasei/305_dasei2022_grundlagen.jpg
      caption: Rollenspiel ohne Textvorlage
    body: |
      **Vor-Programm 2026** <br><br>**LD** 1.-3.5. Elementare Animation im Praxisfeld <br>**LA** 15.-17.5. Thematische Warm Ups <br> **RA** 3.-5.7. Die künstlerische Aktion

      **Begleitend 2026/27** <br><br>**LR** 11.-13.12.26 Eine Rolle – viele Gesichter<br>**B7** 23.-24.1.27 Forumtheater<br>**B8** 23.-24.1.27 Bewegte Themenarbeit
    date_start: 2026-09-30T17:00
    date_end: 2026-10-05T14:00
    location: |
      München, Nürnberg, Fürth
    schedule: |
      auf Anfrage
    instructors: Hans Dönitz, Rosalin Hertrich
  e2_bewegung:
    meta:
      source: e2_69
    ctype: event
    shortcode: E2
    title: "Workshop- & Kursformat **Offene Themen – offene Gruppen?**"
    tag: "6. JAN 13:00 – 10. JAN 16:00  München" 
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_400,h_400,g_auto,q_auto,f_auto/dasei/E2_Soziometrie.jpg
      caption: Soziometrische Aufstellung
    body: |
      Kursteilnehmende übernehmen Anleitungen im Kurs- und Workshopformat und erhalten Feedback. Dies dient dem Wissenstransfer von Theorie und Praxis. Praktische Einheiten demonstrieren die Tiefendimensionen des Lernens / Anwendung von Soziometrie, bewegter Themenarbeit und 3-Spalten-Didaktik.
    date_start: 2027-01-07
    date_end: 2027-01-11
    location: |
      München (Seminarraum TBD)
    schedule: |
      MI-SO 09:00-17:00 (5 Tage)
    instructors: Hans Dönitz, Rosalin Hertrich
  k1_didaktik_und_theorie_teil2:
    meta:
      locked: true
    ctype: event
    shortcode: K1
    title: Planung & Reflexion von Lernprozessen (Teil 2)  **Didaktik & Theorie**
    tag: Digitalprogramm - mit Recording & Skript
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_400,h_400,g_auto,q_auto,f_auto/dasei/E2_bewegte_themenarbeit.jpg
      caption: Bewegte Themenarbeit
    body: |
      Im begleitenden online-Programm verbinden wir Reflexionen aus der durchlaufenen Praxis mit prägnanten Theorie Inputs: 
      - Di 19.1. 18:00-20:00 Vertiefung: 3-Spalten Modell 
      - Do 18.2. 18:30-21:45 Tiefendimensionen des Lernens
    date_start: 2026-09-22
    date_end: 2027-02-28
    location: |
      Seminartermine siehe dasei.eu/agenda
    schedule: |
      7 Online-Einheiten
    instructors: Hans Dönitz, Rosalin Hertrich 
  e2_soziometrie:
    inherits: e2_bewegung
    timeline: false
    ctype: event
    shortcode: E2
    title: "Soziometrische Verfahren **Transfer & Methodik**"
    tag: E2 · „Offene Themen – offene Gruppen?" · 5 Tage
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_400,h_400,g_auto,q_auto,f_auto/dasei/E2_Soziometrie.jpg
      caption: Soziometrische Verfahren
    body: |
      Wo stehst du? Soziometrische Verfahren machen die Gruppe sichtbar: Positionen abfragen, Unterschiede zeigen, ins Gespräch kommen. E2 bringt dir die Werkzeuge für deine eigene Praxis.
    date_start: 2027-01-07T09:00
    date_end: 2027-01-11T17:00
    location: |
      München
    schedule: |
      Workshop- und Kursformate
    instructors: Hans Dönitz, Rosalin Hertrich
  erweiterung:
    meta:
      locked: true
    ctype: pricing
    shortcode: Z15
    title: "Das Glas voll machen **Profiljahr und Berufsabschluss**"
    tag: bis FEB 2027 erweitern zur Aufbaustufe Theaterpädagogik (BuT) 
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_400,h_400,g_auto,q_auto,f_auto/dasei/Offenes_Programm.jpg
      caption: Erweiterung zur vollen Aufbaustufe
    body: |
      Du entscheidest bis Februar 2027 wie es weiter geht.<br>Pausieren?<br>Erstmal nur ins Profil? <br>→ Theatrales Lernen: https://dasei.eu/ausbildung-theaterpaedagogik/profil_theatrales_lernen <br>→ Performance & interkulturelles Theater: https://dasei.eu/ausbildung-theaterpaedagogik/profil_performance <br>
      
      Für die Komplettbuchung bis zum Berufsabschluss Theaterpädagogik (BuT), beachte Zugangsvoraussetzungen & Frühbuchungskonditionen.<br>→ Aufbaustufe anschauen: https://dasei.eu/ausbildung-theaterpaedagogik/aufbaustufe
---
<!-- PUBLISH-FROM-HERE -->
