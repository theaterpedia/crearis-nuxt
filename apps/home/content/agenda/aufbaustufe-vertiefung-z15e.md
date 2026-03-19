---
navigation: false
navigation_highlight: /ausbildung-theaterpaedagogik/vertiefung
shortcode: z15e
heading: "VERTIEFUNG Theaterpädagogik"
start: 2026-09-30
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
        - **Frühbuchung bis 10.04.26:** 1 Seminar Offenes Programm frei → nur 7 Raten = **€ 1.620**
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
      teaser: "EUR 1.840 in 8 Raten (€ 80 Anmeldegebühr + 8 × € 220). Bei Frühbuchung bis 10.04.26 sparst du € 220 — das sind nur 7 Raten. Storno bis 10 Tage nach E1 ohne Zusatzkosten. Bei finanziellen Engpässen gibt es eine Härtefall-Regelung, und für Solo-Selbstständige prüfen wir KOMPASS-Förderung."
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
  e1_blind:
    ctype: event
    shortcode: E1
    title: "Blind geführt — Vertrauen **Dicht an der Grenze**"
    tag: SEP 30 – OKT 5, 2026 · Burgstallmühle
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_400,h_400,g_auto,q_auto,f_auto/dasei/E1_slide1_blind_gefuehrt.jpg
      caption: Blind geführt — Vertrauen als Methode
    body: |
      Du wirst blind durch den Raum geführt — und erlebst dabei Vertrauen als Methode. Das ist E1: Der vollständige Themen- und Gruppenprozess der Szenischen Themenarbeit. 6 intensive Tage auf der Burgstallmühle in der Fränkischen Schweiz.
    start: 2026-09-30T17:00
    ende: 2026-10-05T14:00
    ort: |
      Burgstallmühle
      Burgstallmühle 1
      91338 Igensdorf
    ablauf: |
      MI 30.09. Anreise bis 16:00, Beginn 17:00
      MO 05.10. Ende ca. 14:00 nach Mittagessen
    mit: Hans Dönitz, Rosalin Hertrich
  e1_rollenspiel:
    ctype: event
    shortcode: E1
    title: "Rollenspiel ohne Textvorlage **Szenische Themenarbeit**"
    tag: E1 · „Dicht an der Grenze" · 6 Tage
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_400,h_400,g_auto,q_auto,f_auto/dasei/305_dasei2022_grundlagen.jpg
      caption: Rollenspiel ohne Textvorlage
    body: |
      „Dicht an der Grenze" — das meint auch: dicht an dem, was wirklich wichtig ist. Keine komplizierten Übungen, keine Textvorlagen. Du gibst Geschichten Raum, wechselst Perspektiven, und lernst, wie Themen szenisch bearbeitet werden.
    start: 2026-09-30T17:00
    ende: 2026-10-05T14:00
    ort: |
      Burgstallmühle, Fränkische Schweiz
    ablauf: |
      6 Tage / 5 Nächte
      Übernachtung + Verpflegung vor Ort
    mit: Hans Dönitz, Rosalin Hertrich
  e2_bewegung:
    ctype: event
    shortcode: E2
    title: "Bewegte Themenarbeit **Offene Themen – offene Gruppen?**"
    tag: JAN 7–11, 2027 · München
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_400,h_400,g_auto,q_auto,f_auto/dasei/E2_bewegte_themenarbeit.jpg
      caption: Bewegte Themenarbeit
    body: |
      Bewegung bringt Themen in Fluss — der Raum wird zum Denkwerkzeug. In E2 fokussierst du auf Transfer: Wie gestaltest du solche Prozesse selbst? In deiner Praxis, mit deinen Gruppen, mit offenen Themen?
    start: 2027-01-07T09:00
    ende: 2027-01-11T17:00
    ort: |
      München (Seminarraum TBD)
    ablauf: |
      MI-SO 09:00-17:00 (5 Tage)
    mit: Hans Dönitz, Rosalin Hertrich
  e2_soziometrie:
    ctype: event
    shortcode: E2
    title: "Soziometrische Verfahren **Transfer & Methodik**"
    tag: E2 · „Offene Themen – offene Gruppen?" · 5 Tage
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_400,h_400,g_auto,q_auto,f_auto/dasei/E2_Soziometrie.jpg
      caption: Soziometrische Verfahren
    body: |
      Wo stehst du? Soziometrische Verfahren machen die Gruppe sichtbar: Positionen abfragen, Unterschiede zeigen, ins Gespräch kommen. E2 bringt dir die Werkzeuge für deine eigene Praxis.
    start: 2027-01-07T09:00
    ende: 2027-01-11T17:00
    ort: |
      München
    ablauf: |
      Workshop- und Kursformate
    mit: Hans Dönitz, Rosalin Hertrich
  offenes_wellenmodell:
    ctype: event
    shortcode: OP
    title: "Praktische Didaktik **Wochenenden**"
    tag: Offenes Programm · freie Wahl
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_400,h_400,g_auto,q_auto,f_auto/dasei/K1_praktische_didaktik_wellenmodell.jpg
      caption: Praktische Didaktik — Wellenmodell
    body: |
      Wann mache ich was? Das Wellenmodell wird dein Kompass. Praktische Didaktik für Theaterpädagog:innen: Wie du Prozesse strukturierst, ohne sie zu erdrücken. Das Offene Programm bietet dir freie Wahl.
      - Empfehlung: LC „Soziometrie"
      - Alternative: LA „Anfänge verstehen"
      - Oder: RD „Verkörperungen"
    start: 2026-10-01
    ende: 2027-02-28
    ort: |
      Seminartermine siehe dasei.eu/agenda
    ablauf: |
      2 Wochenendseminare (freie Wahl aus LA, LC, RD etc.)
    mit: Verschiedene Dozent:innen
  offenes_programm:
    ctype: event
    shortcode: OP
    title: "Dein Programm **2 Wochenenden**"
    tag: + 2 Seminare aus dem Offenen Programm
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_400,h_400,g_auto,q_auto,f_auto/dasei/Offenes_Programm.jpg
      caption: Offenes Programm — freie Wahl
    body: |
      LA, LC, RD oder ein anderes Wochenendseminar: Du wählst aus dem Offenen Programm, was dich interessiert. Die 2 Seminare sind Teil deiner Vertiefung — sie kosten nichts extra.
      - 2 Wochenenden, frei wählbar
      - Termine laufend (OKT 2026 – FEB 2027)
      - München oder Nürnberg
    start: 2026-10-01
    ende: 2027-02-28
    ort: |
      München oder Nürnberg
    ablauf: |
      z.B. LC Soziometrie (Empfehlung)
    mit: 'Empfehlung: LC „Soziometrie"'
  erweiterung:
    ctype: pricing
    shortcode: AS
    title: "Nach der Vertiefung **Profiljahr oder Abschluss**"
    tag: Erweiterung buchbar bis FEB 2027
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_400,h_400,g_auto,q_auto,f_auto/dasei/E_vertiefung_modelle_der_szenischen_themenarbeit.jpg
      caption: Erweiterung zur vollen Aufbaustufe
    body: |
      **Du entscheidest bis Februar 2027:**
      
      - **Profiljahr (Phase 2)** 12 Raten × € 220 = € 2.640
      - **Abschlussphase (Phase 3)** 9 Raten × € 220 = € 1.980
      - **Frühbucher bis 31.10.26** € 440 Ersparnis auf die gesamte Aufbaustufe
      
      → [Aufbaustufe anschauen](/ausbildung-theaterpaedagogik/aufbaustufe)
---
<!-- PUBLISH-FROM-HERE -->
