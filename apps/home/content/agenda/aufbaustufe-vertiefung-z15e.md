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
        - **E1 Seminarwoche** _40 UE_ — Praxis, Theorie & Reflexion (Herbst 2026)
        - **E2 Kompaktwoche** _40 UE_ — Vertiefung & Transfer (Frühjahr 2027)
        - **SUMME** 80 UE
      hinweis: |
        #### Hinweis
        Die Vertiefung kann einzeln gebucht werden. Sie ist auch Bestandteil der vollständigen Aufbaustufe (Profil Theatrales Lernen oder Profil Performance & Interkult. Theater).
  konditionen:
    title: Kosten & Konditionen
    header: |
      ## Kosten & Konditionen
    info:
      kosten: |
        ### Kosten
        - **Modul E: Vertiefung** € 660,00
        - Ratenzahlung möglich (2 Raten)
      storno: |
        ### Widerruf & Storno
        - 14-tägiges Widerrufsrecht ab Datum der Anmeldung
        - Stornobedingungen gemäß AGB
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
