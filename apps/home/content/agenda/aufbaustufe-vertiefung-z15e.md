---
navigation: false
navigation_highlight: /ausbildung-theaterpaedagogik/aufbaustufe
shortcode: z15e
heading: "VERTIEFUNG Theaterpädagogik"
start: 2026-09-01
end: 2027-08-01
ctype: course
tag: course
description: Aufbaustufe Theaterpädagogik (BuT) - Modul E Vertiefung 2026-27
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
        ### Struktur
        - **E1 Seminarwoche** Praxis, Theorie & Reflexion (Herbst 2026)
        - **E2 Kompaktwoche** Vertiefung & Transfer (Frühjahr 2027)
        - **+ 2 Seminare** aus dem Offenen Programm (freie Wahl)
        - **SUMME** 80 UE + 2 Seminare
      hinweis: |
        #### Erweiterung möglich
        Nach der Vertiefung kannst Du Dich für ein **Profiljahr** (Theatrales Lernen oder Performance & Interkult. Theater) und die **Abschlussphase** entscheiden.
        
        - Erweiterung buchbar bis **28. Februar 2027**
        - Profilwahl nach den Info-Teasern T0/R0 (DEZ 26 - FEB 27)
        - Persönliche **Beratung** ist Teil der Vertiefung
  konditionen:
    title: Kosten & Konditionen
    header: |
      ## Kosten & Konditionen
    info:
      kosten: |
        ### Kosten
        - **Anmeldegebühr** € 80,00
        - **Vertiefung (E1 + E2)** 6 Raten × € 220,00
        - **Offenes Programm** 2 Raten × € 220,00
        - **SUMME** € 1.840,00
        
        Ratenzahlung: SEP 2026 - APR 2027
      storno: |
        ### Storno & Frühbuchung
        - Frühbuchung bis 10.04.26: 1 Seminar Offenes Programm frei
        - Storno-Option: 1 Rate bis 31.08.26
        - Kündigung: 2 extra Raten
        - Bereits gebuchte Seminare → Erstattung
      erweiterung: |
        ### Erweiterungsoptionen (später buchbar)
        - **Profiljahr** (Profil + K2-K3) 12 Raten × € 220,00 = € 2.640,00
        - **Abschlussphase** (K4-K6 + P1-P6) 9 Raten × € 220,00 = € 1.980,00
consulting:
  intro: Schreib uns — wir melden uns innerhalb von 2 Werktagen.
  extension_note: |
    💡 Nach der Vertiefung entscheidest du, ob du ein Profil (Theatrales Lernen oder Performance) buchst.
  categories:
    - key: terms_and_options
      label: Zahlungsbedingungen
      options:
        - Frühbucherrabatt
        - Stornierung & Pausieren
        - Zahlungsplan
        - Härtefall
    - key: prerequisites
      label: Quereinstieg und Anerkennung
      options:
        - Zulassung
        - Bildungs- und Berufsabschlüsse
        - Anerkennung von Praxiserfahrung
        - Grundlagenbildung extern
        - Erfülle ich die Voraussetzungen?
    - key: schedules
      label: Verläufe
      options:
        - Vertiefung / Einstiegsphase
        - Offenes Programm
        - Nachholung
        - Letzter Einstieg
    - key: topics
      label: Profile
      options:
        - Performance
        - Theatrales Lernen
        - Profilwechsel
  cta:
    email: per Email klären
    call: direkt klären (Videocall oder Telefon)
  success:
    email: ✨ abgeschickt! Wir melden uns bei dir.
    call: Bis bald! Wir rufen dich an.
product:
  header: |
    Die Vertiefung (Modul E) umfasst zwei intensive Seminarwochen: Du vertiefst die Methoden aus der Grundstufe und erhältst wichtige didaktische Werkzeuge für deine theaterpädagogische Praxis.
  footer: |
    ## September 2026 - August 2027 **Vertiefung Theaterpädagogik**
#
# ── CN TODO: Items need real E1/E2 event data from CO/RH ────────────────
# Stub events below — dates/locations TBD
# ─────────────────────────────────────────────────────────────────────────
#
items:
  e1_stub:
    ctype: event
    shortcode: e1
    title: Praxis, Theorie & Reflexion **Seminarwoche E1**
    tag: HERBST 2026 — Datum + Ort TBD
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_crop,h_1050,q_60,w_1390,x_50,y_50/v1756048022/dasei/das_glas_voll_machen_h34pwb.png
      caption: Vertiefung E1
    body: |
      Du durchläufst den Themen- und Gruppenprozess einer Seminarwoche und lernst die Methoden als Teilnehmer:in kennen. Anschließend reflektieren wir den thematischen Selbsterfahrungs- und Gruppenprozess.
    start: 2026-10-01T09:00
    ende: 2026-10-05T18:00
    ort: |
      TBD
    ablauf: |
      MO-FR 09:00-18:00 (5 Tage)
    mit: TBD
  e2_stub:
    ctype: event
    shortcode: e2
    title: Vertiefung & Transfer **Kompaktwoche E2**
    tag: FRÜHJAHR 2027 — Datum + Ort TBD
    image:
      url: https://res.cloudinary.com/little-papillon/image/upload/c_crop,h_1050,q_60,w_1390,x_50,y_50/v1756048022/dasei/das_glas_voll_machen_h34pwb.png
      caption: Vertiefung E2
    body: |
      Die zweite Seminarwoche vertieft die Erkenntnisse aus E1 und fokussiert auf den Transfer in die eigene Praxis.
    start: 2027-03-01T09:00
    ende: 2027-03-05T18:00
    ort: |
      TBD
    ablauf: |
      MO-FR 09:00-18:00 (5 Tage)
    mit: TBD
---
<!-- PUBLISH-FROM-HERE -->
