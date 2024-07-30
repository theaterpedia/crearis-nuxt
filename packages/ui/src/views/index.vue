<template>
  <Box>
    <Sidebar>
      <img
        alt="DAS Ei"
        src="https://pruvious.com/uploads/logo-dasei.svg"
        style="display: block; width: 100%; height: auto"
      />

      <MainMenu
        :items="[
          {
            label: 'Ausbildung Theaterpädagogik',
            type: 'group',
            children: [
              { label: 'Einstiege ins Theaterspiel', link: '#' },
              { label: 'Grundlagen Theaterpädagogik (BuT)', link: '#' },
              { label: 'Profil Performance & Interkulturelles Theater', link: '#' },
            ],
          },
          {
            label: 'Workshops & Projekte',
            type: 'link',
            link: '#',
          },
          {
            label: 'Team & Institut',
            type: 'link',
            link: '#',
          },
        ]"
      />
    </Sidebar>

    <Main>
      <Parallax
        backgroundImage="https://res.cloudinary.com/little-papillon/image/upload/c_crop,g_north_west,h_1100,w_1600/c_crop,g_center,h_1500,q_70,r_0,w_1600,y_100/v1594701917/dasei/einstiege_lampe_nora.jpg"
        placement="above"
      >
        <Banner transparent>
          <Prose>
            <h1>
              Juni – Dezember 2023 // München, Nürnberg
              <strong>Einstiege ins Theaterspiel</strong>
            </h1>
            <p>
              <strong>Fortbildung in 6 Wochenenden:</strong>
              <br />
              <strong>Elementare und Szenische Animation</strong>
            </p>
            <Button size="small" variant="plain">Jetzt anmelden</Button>
          </Prose>
        </Banner>
      </Parallax>

      <Section>
        <Container>
          <Prose>
            <h2><strong>Worum geht´s?</strong></h2>
            <p class="h3"><strong>Anfangen lernen, Anfänge gestalten lernen!</strong></p>
            <p>
              Der Anfang soll einfach sein, so einfach wie nur irgendwie möglich. Dies gilt für Menschen, die mit
              Theater noch wenig Kontakt hatten. Aber auch wer das halbe Leben mit Theater verbracht hat, wird das kaum
              anders sehen.
            </p>
            <p><strong>Wir sehen zwei Wege für einfache Anfänge:</strong></p>
            <ul>
              <li>entweder wir können ‚lebendig erklären‘</li>
              <li>oder wir lassen es einfach losgehen, möglichst ‚ohne Worte‘</li>
            </ul>
            <p>
              Die Fortbildung 'Einstiege ins Theaterspiel' vermittelt dazu die
              <strong>grundlegende Didaktik</strong>
              und
              <strong>Methodik</strong>
              . Das 'lebendige Erklären' bezeichnen wir als Szenische Animation und jene Prozesse, wo es einfach losgeht
              nennen wir
              <a href="#">Elementare Animation</a>
              .
            </p>
          </Prose>
        </Container>
      </Section>

      <Section background="muted">
        <Container>
          <Prose>
            <ul>
              <li>Du bist ErzieherIn, KünstlerIn, LehrerIn, SozialpädagogIn</li>
              <li>oder Du bist in Ausbildung oder studierst in einem dieser Bereiche</li>
              <li>Du willst die Arbeit zunächst am eigenen Leib erleben, dann in die Anleitung kommen</li>
            </ul>
          </Prose>
        </Container>
      </Section>

      <Section background="accent">
        <Container>
          <Prose>
            <h2><strong>6 Kurseinheiten</strong></h2>
            <p>
              In 6 prägnanten Einheiten wirst Du beide Wege erleben, verstehen und selber anleiten: Du lernst die
              Methoden, die Leitungshaltung und typische Abläufe. Egal, welche Vorerfahrungen Du mitbringst sind wir
              sicher, dass Du dabei viel mitnehmen wirst.
            </p>
            <p class="narrow">
              Du kannst auch gern einen detaillierten Kursplan als
              <a href="#">PDF herunterladen</a>
              .
            </p>
          </Prose>

          <Slider>
            <Slide v-for="i in 6">
              <Prose>
                <h3>
                  <small>{{ i }} Praxis, Theorie & Ausbildung bei DAS Ei</small>
                  <strong>Basistag Theaterpädagogik</strong>
                </h3>
                <p>
                  Am Basistag erlebst Du die grundsätzlichen Zusammenhänge der Theaterpädagogik von DAS Ei konzentriert
                  und ganz praktisch am eigenen Leib. Du erarbeitest Dir ausgehend von drei Zwischenreflexionen ein
                  Grundverständnis der Module
                </p>
                <ul>
                  <li>‚Einstiege in’s Theaterspiel‘ (Modul A)</li>
                  <li>‚Szenische Themenarbeit‘ (Modul B)</li>
                  <li>‚Pädagogische Regie‘ (Modul C).</li>
                </ul>
              </Prose>
            </Slide>
          </Slider>
        </Container>
      </Section>

      <Section>
        <Container>
          <Prose>
            <h2><strong>Anmeldung</strong></h2>
            <p>
              Die Anmeldung erfolgt zum vollen Programm bestehend aus Basistag und 5 Kurseinheiten A1 – A5. Zunächst
              legst Du mindestens den Termin des Basistags fest und gibst Deinen bevorzugten Seminarort an (München,
              Nürnberg oder Burgstallmühle Nähe Bechhofen). Wir nehmen Deine Anmeldung als Grundlage einer kleinen
              Beratung, damit Dein Seminarverlauf optimal passt:
            </p>
            <ul>
              <li>Sollten einzelne Termine nicht passen, so werden wir dazu Ersatztermine vorschlagen</li>
              <li>
                Du kannst bis zu 10 Tage nach Absolvierung des Basistags die weitere Teilnahme am Programm kündigen, es
                sind dann nur € 40,00 Anmeldegebühr zu bezahlen (wir berechnen keine Kursgebühren)
              </li>
            </ul>
            <h3><strong>Kosten & Konditionen</strong></h3>
            <ul>
              <li>Anmeldegebühr (inkl. Basistag): € 40,00</li>
              <li>Kursraten für 5 Einheiten A1 – A5: 5 Raten * € 190,00</li>
              <li>Stornofrist bis 10 Tage nach Basistag</li>
            </ul>
            <h3>Deinen Seminarverlauf planen</h3>
            <div>form</div>
          </Prose>
        </Container>
      </Section>

      <Parallax
        backgroundImage="https://res.cloudinary.com/little-papillon/image/upload/c_crop,g_south_west,h_1100,w_1600/c_crop,g_center,h_1500,q_70,r_0,w_1600,y_100/v1594701917/dasei/einstiege_lampe_nora.jpg"
        placement="below"
      >
        <Banner transparent>
          <Prose>
            <p class="h2"><strong>Du hast Fragen?</strong></p>
            <p>
              <strong>Tel. 0911 / 780 84 76</strong>
            </p>
            <Button size="small" variant="plain">Oder probier mal unsere FAQ</Button>
          </Prose>
        </Banner>
      </Parallax>
    </Main>
  </Box>

  <Footer>
    <p>© 2023 DAS Ei</p>

    <ul>
      <li><a href="#">Datenschutzerklärung</a></li>
      <li><a href="#">Impressum</a></li>
      <li><a href="#">Kontakt</a></li>
    </ul>

    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">Ausbildung</a></li>
      <li><a href="#">Workshops</a></li>
      <li><a href="#">Institut</a></li>
      <li><a href="#">AGB</a></li>
    </ul>

    <Prose>
      <p class="h3 primary"><strong>30 Jahre Theaterpädagogik in Bayern.</strong></p>
    </Prose>
  </Footer>
</template>

<script lang="ts" setup>
import {
  Banner,
  Box,
  Button,
  Container,
  Footer,
  Main,
  MainMenu,
  Parallax,
  Prose,
  Section,
  Sidebar,
  Slide,
  Slider,
} from '@/index'
</script>
