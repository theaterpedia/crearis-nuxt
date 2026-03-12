---
navigation: false
navigation_highlight: /ausbildung-theaterpaedagogik/aufbaustufe
shortcode: z15v
heading: "BERATEN & AUSPROBIEREN"
start: 2026-02-01
end: 2026-09-30
ctype: course
tag: course
description: Aufbaustufe Theaterpädagogik (BuT) - Beratung und Orientierungsprogramm 2026
title: Beraten & Ausprobieren
cssclasses:
  - course
views:
  - product
  - details
#
# ── CN IMPLEMENTATION NOTES ──────────────────────────────────────────────
# SAC Persona: RIKE 3b (Beratungspfad / late entry)
# Shortcode: z15v (orientation, no product booking — contact form only)
# Checkout tier: manual_review (contact request, no sale.order)
# Stepper: 1 custom + 2 standard (kontakt + checks) = 3 steps total
#
# Custom steps:
#   1. beratung — Cover slide explaining Beraten & Ausprobieren
# Standard steps (appended by DataViewDetails.vue):
#   2. kontakt — Contact form (existing component)
#   3. checks — AGB/Datenschutz (existing component)
#
# Entered via 4th tab on /ausbildung-theaterpaedagogik/aufbaustufe
# No bundle resolution needed — z15v triggers manual_review in CO
# Result: partner created + manager notification email
#
# Upload placeholder: "bitte per Email schicken an: service@dasei.eu"
# (real upload deferred to post-SAC)
#
# Debug priority: ★ THIRD (lowest — simple form)
# ─────────────────────────────────────────────────────────────────────────
#
details:
  beratung:
    title: Beratung & Orientierung
    header: |
      ## Beraten & Ausprobieren
    info:
      ueberblick: |
        ### Dein Einstieg in die Aufbaustufe
        Du interessierst dich für die Aufbaustufe Theaterpädagogik (BuT), möchtest aber zunächst das Team und das Programm kennenlernen? Stelle dir aus unseren Beratungsformaten und Praxiseinheiten deinen individuellen Orientierungsprozess zusammen:
        - **EZ** Online-Zusammenfassung — kompakter Überblick über die Aufbaustufe
        - **Theaterpedia-Konferenz** — DAS Ei live erleben, Team und Absolvent:innen treffen
        - **T1** Profilorientierung Theatrales Lernen — Praxis-Schnuppern
        - **R1** Profilorientierung Performance & Interkult. Theater — Praxis-Schnuppern
      kontakt: |
        ### Persönliche Beratung
        Für eine ausführliche persönliche Beratung melde dich direkt bei uns:
        **service@dasei.eu**
        Wenn du Unterlagen hast (Lebenslauf, Zertifikate), schicke sie bitte per Email an: **service@dasei.eu**
consulting:
  intro: |
    Du hast Grundlagen bei einem anderen Institut absolviert?
    Willkommen! So funktioniert dein Einstieg:
  process_steps: |
    1. Fülle das Kontaktformular aus
    2. Wir rufen dich zurück (1-2 Werktage)
    3. Beratungsgespräch: Was musst du nachholen?
    4. Individueller Vertrag
  upload_note: |
    Falls du Unterlagen hast, kannst du sie jetzt schon einreichen:
    - Berufsabschluss (Zeugnis/Zertifikat) → bitte per Email an service@dasei.eu
    - Bescheinigung Grundlagen (anderes Institut) → bitte per Email an service@dasei.eu
  cta:
    submit: Absenden
  success:
    submit: Danke! Wir melden uns in 1-2 Werktagen bei dir.
product:
  header: |
    Probiere das Team und das Programm aus. Stelle aus Beratungsformaten und Praxiseinheiten deinen Orientierungsprozess zusammen. Jede Veranstaltung gibt einen Einblick in ein spezifisches Thema der Aufbaustufe.
  footer: |
    ## 2026 **Beraten & Ausprobieren — Aufbaustufe Theaterpädagogik**
#
# ── Items: EZ (renamed from AZ) + Theaterpedia + T1 + R1 ────────────────
# Note: Theaterpedia-Konferenz is placeholder — HA will redo content
# ─────────────────────────────────────────────────────────────────────────
#
items:
  ez_1192:
    ctype: event
    shortcode: ez
    title: Online-Zusammenfassung **Überblick Aufbaustufe Theaterpädagogik (BuT)**
    tag: 23.10.2025 18:00-20:00 WEB (MS Teams)
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_crop,h_1050,q_60,w_1390,x_50,y_50/v1756048022/dasei/das_glas_voll_machen_h34pwb.png
      caption: das Glas voll machen
    body: |
      Gesamtüberblick über die Struktur der Aufbaustufe Theaterpädagogik (BuT) 2026-2028 und der beiden Profile "Theatrales Lernen" und "Performance und Interkult. Theater". Fragen und Antworten.
    start: 2025-10-23T18:00
    ende: 2025-10-23T20:00
    ort: |
      ONLINE (MS Teams)
    ablauf: |
      DO 18:00-20:00 _online_
    mit: Hans Dönitz (Rosalin Hertrich, Cornelia Jung)
  a0_1276:
    ctype: event
    shortcode: a0
    title: Praxis, Theorie & Ausbildung bei DAS Ei **Theaterpedia-Konferenz**
    tag: DO-SO 20.-23. NOV München
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_fill,w_500,h_500,g_auto/v1666847011/pedia_ipsum/core/theaterpedia.jpg
      caption: 'Theaterpedia: Theaterpädagogik suchen und finden'
    body: |
      Auf der Theaterpedia-Konferenz sind das Team von DAS Ei und viele Absolvent:innen der Aufbaustufe Theaterpädagogik (BuT) von DAS Ei anwesend. [PLACEHOLDER — HA will redo this content]
    start: 2025-11-20T18:00
    ende: 2025-11-23T15:00
    ort: |
      Eine-Welt-Haus
      Schwanthaler Str. 81
      80336 München
    ablauf: |
      DO 18:00-21:30
      FR 09:30-19:30
      SA 09:00-19:00 (danach Party)
      SO 09:30-15:00
    mit: Hans Dönitz, Team DAS Ei
  t1_1190:
    ctype: event
    shortcode: t1
    title: Profilorientierung 'Theatrales Lernen' **Thematische Warm-Ups**
    tag: FR 27.2 - SO 1.3.2026 Fürth/Nürnberg
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/v1676100503/dasei/377_dasei2022_I8A6515_p6aee7.jpg
      caption: Thematische Warm-Ups
    body: |
      Profilorientierung: Ein Wochenende lang die Methoden und Inhalte des Profils "Theatrales Lernen" erleben und ausprobieren.
    start: 2026-02-27T18:00
    ende: 2026-03-01T15:00
    ort: |
      Tanzerei
      Kaiserstr. 81
      90766 Fürth
    ablauf: |
      Fr. 18:30-21:30
      SA 09:00-18:00
      SO 09:00-15:00
    mit: Cornelia Jung
  r1_1190:
    ctype: event
    shortcode: r1
    title: Profilorientierung 'Performance & Interkult. Theater' **die künstlerische Aktion**
    tag: SA 4. - SO 5.7.2026 München
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/v1676100655/dasei/412_dasei2022_I8A6597_b0seuo.jpg
      caption: die künstlerische Aktion
    body: |
      Profilorientierung: Ein Wochenende lang die Methoden und Inhalte des Profils "Performance und Interkult. Theater" erleben und ausprobieren.
    start: 2026-07-04T09:30
    ende: 2026-07-05T18:00
    ort: |
      Schwanthaler Str 91
      80336 München
    ablauf: |
      Fr. 18:30-21:30
      SA 09:00-18:00
      SO 09:00-15:00
    mit: Rosalin Hertrich
---
<!-- PUBLISH-FROM-HERE -->
