<template>
  <div class="page-wrapper" :class="`page-bg-${backgroundColor}`">
    <!-- Alert Banner (conditionally displayed) -->
    <div v-if="alertBanner" class="alert-wrapper" :class="{ 'fullwidth-padded': fullwidthMode && fullwidthPadding }">
      <AlertBanner :alertType="alertBanner.alertType">
        <p>{{ alertBanner.message }}</p>
      </AlertBanner>
    </div>

    <!-- Top Navigation -->
    <div class="topnav-wrapper" :class="{ 'fullwidth-padded': fullwidthMode && fullwidthPadding && wideTopnav }">
      <TopNav :items="mainMenuItems" :scrollStyle="scrollStyle" :wide="wideTopnav">
                <template #actions>
          <!-- 
            ToggleMenu Bindings:
            - v-model: Two-way binding for selected layout (toggleOptions)
            - @update:arrayOption: Event handler for toggle switches (arrayOptions)
          -->
          <ToggleMenu 
            v-model="siteLayout" 
            :toggleOptions="layoutToggleOptions"
            :arrayOptions="layoutArrayOptions"
            header="Layout Options"
            @update:arrayOption="handleArrayOptionUpdate"
          />
        </template>
      </TopNav>
    </div>

    <!-- Header/Hero Section -->
    <div class="header-wrapper" :class="{ 'fullwidth-padded': fullwidthMode && fullwidthPadding && wideHeader }">
      <header class="page-header" :class="{ 'page-header-boxed': !wideHeader }">
      <Hero contentType="banner" imgTmpAlignX="cover" imgTmp="https://pruvious.com/uploads/dasei/banner.jpg">
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
      </Hero>
      </header>
    </div>

    <!-- 2-Column Layout Container (Main + Aside) -->
    <Box :layout="wideContent ? 'full-width' : 'centered'" :fullwidthPadding="fullwidthMode && fullwidthPadding">
      <!-- Left Side Content (only for fullThree layout) -->
      <SideContent v-if="showLeftSidebar" placement="left">
        <Section>
          <Prose>
            <h3><strong>Navigation</strong></h3>
            <ul>
              <li><a href="#">Link 1</a></li>
              <li><a href="#">Link 2</a></li>
              <li><a href="#">Link 3</a></li>
            </ul>
          </Prose>
        </Section>
      </SideContent>

      <!-- Main Content -->
      <main class="main-content">
        <Section>
          <Container>
            <Columns>
              <Column>
                <Prose>
                  <h2><strong>Worum geht´s?</strong></h2>
                  <p class="h3"><strong>Anfangen lernen, Anfänge gestalten lernen!</strong></p>
                  <p>
                    Der Anfang soll einfach sein, so einfach wie nur irgendwie möglich. Dies gilt für Menschen, die mit
                    Theater noch wenig Kontakt hatten. Aber auch wer das halbe Leben mit Theater verbracht hat, wird das
                    kaum anders sehen.
                  </p>
                  <p><strong>Wir sehen zwei Wege für einfache Anfänge:</strong></p>
                  <ul>
                    <li>entweder wir können ‚lebendig erklären'</li>
                    <li>oder wir lassen es einfach losgehen, möglichst ‚ohne Worte'</li>
                  </ul>
                  <p>
                    Die Fortbildung 'Einstiege ins Theaterspiel' vermittelt dazu die
                    <strong>grundlegende Didaktik</strong>
                    und
                    <strong>Methodik</strong>
                    . Das 'lebendige Erklären' bezeichnen wir als Szenische Animation und jene Prozesse, wo es einfach
                    losgeht nennen wir
                    <a href="#">Elementare Animation</a>
                    .
                  </p>
                </Prose>
              </Column>
              <Column width="1/4">
                <img
                  src="https://24ai.tech/en/wp-content/uploads/sites/3/2023/10/01_product_1_sdelat-kvadratnym-5-scaled.jpg"
                  alt="Demo image"
                />
              </Column>
            </Columns>
          </Container>
        </Section>

        <Section background="muted">
          <Container>
            <Prose>
              <h2><strong>Für wen ist dieser Kurs?</strong></h2>
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
          </Container>
        </Section>

        <Section>
          <Container>
            <Prose>
              <h2><strong>Anmeldung</strong></h2>
              <p>
                Die Anmeldung erfolgt zum vollen Programm bestehend aus Basistag und 5 Kurseinheiten A1 – A5. Zunächst
                legst Du mindestens den Termin des Basistags fest und gibst Deinen bevorzugten Seminarort an (München,
                Nürnberg oder Burgstallmühle Nähe Bechhofen).
              </p>
              <h3><strong>Kosten & Konditionen</strong></h3>
              <ul>
                <li>Anmeldegebühr (inkl. Basistag): € 40,00</li>
                <li>Kursraten für 5 Einheiten A1 – A5: 5 Raten * € 190,00</li>
                <li>Stornofrist bis 10 Tage nach Basistag</li>
              </ul>
            </Prose>
          </Container>
        </Section>
      </main>

      <!-- Right Side Content (conditionally displayed) -->
      <SideContent v-if="showRightSidebar" placement="right">
        <!-- CardHero Section -->
        <Section>
          <CardHero
            heightTmp="medium"
            imgTmp="https://24ai.tech/en/wp-content/uploads/sites/3/2023/10/01_product_1_sdelat-kvadratnym-5-scaled.jpg"
          >
            <Prose>
              <h3><strong>Aktuelles</strong></h3>
              <p>Entdecke unsere neuesten Programme und Workshops.</p>
              <Button size="small" variant="plain">Mehr erfahren</Button>
            </Prose>
          </CardHero>
        </Section>

        <!-- Timeline Section -->
        <Section>
          <Timeline>
            <li>
              <mark>31. März</mark>
              <div>
                <Prose>
                  <h4><strong>Aktueller Status</strong></h4>
                  <p>Grafisches Design und Proof-of-Concept abgeschlossen.</p>
                </Prose>
              </div>
            </li>
            <li>
              <mark>31. Mai</mark>
              <div>
                <Prose>
                  <h4><strong>Relaunch</strong></h4>
                  <p>Neuprogrammierung basierend auf neuem Code.</p>
                </Prose>
              </div>
            </li>
            <li>
              <mark>1. Juni</mark>
              <div>
                <Prose>
                  <h4><strong>Beta-Testing</strong></h4>
                  <p>Private Previews und Testing-Phase.</p>
                </Prose>
              </div>
            </li>
          </Timeline>
        </Section>
      </SideContent>
    </Box>

    <!-- Bottom Content (conditionally displayed) -->
    <div v-show="showBottom" class="bottom-wrapper" :class="{ 'fullwidth-padded': fullwidthMode && fullwidthPadding && bottomWide }">
      <div class="bottom-content" :class="{ 'bottom-content-boxed': !bottomWide }">
      <!-- Slider Section -->
      <Section background="accent">
        <Container>
          <Prose>
            <h2><strong>Unsere Kurseinheiten</strong></h2>
            <p>Entdecke die verschiedenen Module unserer Fortbildung:</p>
          </Prose>

          <Slider>
            <Slide>
              <Columns gap="small">
                <Column width="1/5">
                  <img
                    src="https://24ai.tech/en/wp-content/uploads/sites/3/2023/10/01_product_1_sdelat-kvadratnym-5-scaled.jpg"
                    alt="Basistag"
                  />
                </Column>
                <Column>
                  <Prose>
                    <h3>
                      <small>Praxis, Theorie & Ausbildung bei DAS Ei</small>
                      <strong>Basistag Theaterpädagogik</strong>
                    </h3>
                    <p>
                      Am Basistag erlebst Du die grundsätzlichen Zusammenhänge der Theaterpädagogik von DAS Ei
                      konzentriert und ganz praktisch am eigenen Leib.
                    </p>
                  </Prose>
                </Column>
              </Columns>
            </Slide>

            <Slide>
              <Columns gap="small">
                <Column width="1/5">
                  <img
                    src="https://24ai.tech/en/wp-content/uploads/sites/3/2023/10/01_product_1_sdelat-kvadratnym-5-scaled.jpg"
                    alt="Modul A"
                  />
                </Column>
                <Column>
                  <Prose>
                    <h3>
                      <small>Modul A</small>
                      <strong>Einstiege ins Theaterspiel</strong>
                    </h3>
                    <p>
                      Lerne die grundlegenden Methoden kennen, um Menschen spielerisch in theatrale Prozesse
                      einzuführen.
                    </p>
                    <ul>
                      <li>Elementare Animation</li>
                      <li>Szenische Animation</li>
                      <li>Reflexion und Anleitung</li>
                    </ul>
                  </Prose>
                </Column>
              </Columns>
            </Slide>

            <Slide>
              <Columns gap="small">
                <Column width="1/5">
                  <img
                    src="https://24ai.tech/en/wp-content/uploads/sites/3/2023/10/01_product_1_sdelat-kvadratnym-5-scaled.jpg"
                    alt="Modul B"
                  />
                </Column>
                <Column>
                  <Prose>
                    <h3>
                      <small>Modul B</small>
                      <strong>Szenische Themenarbeit</strong>
                    </h3>
                    <p>
                      Vertiefe Deine Kenntnisse in der thematischen Arbeit und lerne, wie Du Inhalte szenisch
                      erarbeitest.
                    </p>
                  </Prose>
                </Column>
              </Columns>
            </Slide>
          </Slider>
        </Container>
      </Section>

      <!-- Two Columns Section -->
      <Section background="muted">
        <Container>
          <Prose>
            <h2><strong>Unsere Standorte</strong></h2>
          </Prose>

          <Columns>
            <Column>
              <Prose>
                <h3><strong>München</strong></h3>
                <p>
                  Unser Standort in München bietet ideale Bedingungen für theaterpädagogische Arbeit mit großen
                  Räumlichkeiten und moderner Ausstattung.
                </p>
                <ul>
                  <li>Zentrale Lage</li>
                  <li>Moderne Ausstattung</li>
                  <li>Flexible Kurszeiten</li>
                </ul>
                <Button size="small">Mehr über München</Button>
              </Prose>
            </Column>
            <Column>
              <Prose>
                <h3><strong>Nürnberg</strong></h3>
                <p>
                  In Nürnberg findest Du unseren zweiten Standort mit familiärer Atmosphäre und exzellenter
                  Verkehrsanbindung.
                </p>
                <ul>
                  <li>Gute Erreichbarkeit</li>
                  <li>Persönliche Betreuung</li>
                  <li>Wochenendkurse</li>
                </ul>
                <Button size="small">Mehr über Nürnberg</Button>
              </Prose>
            </Column>
          </Columns>
        </Container>
      </Section>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-wrapper" :class="{ 'fullwidth-padded': fullwidthMode && fullwidthPadding && footerWide }">
      <footer class="page-footer" :class="{ 'page-footer-boxed': !footerWide }">
      <Footer>
        <p>© 2023 DAS Ei - Theaterpädagogik Bayern</p>

      <ul>
        <li><a href="#">Datenschutzerklärung</a></li>
        <li><a href="#">Impressum</a></li>
        <li><a href="#">Kontakt</a></li>
      </ul>

      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Ausbildung</a></li>
        <li><a href="#">Institut</a></li>
        <li><a href="#">AGB</a></li>
      </ul>

      <Prose>
        <p class="h3 primary"><strong>30 Jahre Theaterpädagogik in Bayern.</strong></p>
      </Prose>
      </Footer>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  AlertBanner,
  Banner,
  Box,
  Button,
  CardHero,
  Column,
  Columns,
  Container,
  Footer,
  Hero,
  ToggleMenu,
  Prose,
  Section,
  SideContent,
  Slide,
  Slider,
  Timeline,
  TopNav,
  type TopnavParentItem,
  type ToggleOption,
  type ArrayOption,
} from '@/index'
import { ref, computed, watch, type Ref } from 'vue'
import { 
  pageSettings, 
  layoutSettings, 
  navbarSettings, 
  mainMenuItems as mainMenuItemsConfig,
  layoutToggleOptions as layoutToggleOptionsConfig,
  type SiteLayout 
} from '../settings'

// Page Props - imported from settings
const showAside = ref(pageSettings.showAside)
const showBottom = ref(pageSettings.showBottom)
const alertBanner = ref(pageSettings.alertBanner)

// Site Layout - imported from settings
const siteLayout = ref<SiteLayout>(layoutSettings.siteLayout)

// Base Layout Props - imported from settings
const baseWideHeader = ref(layoutSettings.baseWideHeader)
const baseWideTopnav = ref(layoutSettings.baseWideTopnav)
const baseWideContent = ref(layoutSettings.baseWideContent)
const baseBottomWide = ref(layoutSettings.baseBottomWide)
const baseFooterWide = ref(layoutSettings.baseFooterWide)
const fullwidthPadding = ref(layoutSettings.fullwidthPadding)
const backgroundColor = ref(layoutSettings.backgroundColor)

// Navbar behavior options - imported from settings
const scrollStyle = ref(navbarSettings.scrollStyle)
const navbarSticky = ref(navbarSettings.navbarSticky)
const navbarReappear = ref(navbarSettings.navbarReappear)

// Computed: Is fullwidth mode active?
const fullwidthMode = computed(() => {
  return siteLayout.value === 'fullTwo' || 
         siteLayout.value === 'fullThree' || 
         siteLayout.value === 'sidebar' || 
         siteLayout.value === 'fullSidebar'
})

// Computed Layout Props based on siteLayout
const wideHeader = computed(() => {
  if (siteLayout.value === 'fullTwo' || siteLayout.value === 'fullThree') return true
  return baseWideHeader.value
})

const wideTopnav = computed(() => {
  if (siteLayout.value === 'fullTwo' || siteLayout.value === 'fullThree') return true
  return baseWideTopnav.value
})

const wideContent = computed(() => {
  if (siteLayout.value === 'fullTwo' || siteLayout.value === 'fullThree') return true
  return baseWideContent.value
})

const bottomWide = computed(() => {
  if (siteLayout.value === 'fullTwo' || siteLayout.value === 'fullThree') return true
  return baseBottomWide.value
})

const footerWide = computed(() => {
  if (siteLayout.value === 'fullTwo' || siteLayout.value === 'fullThree') return true
  return baseFooterWide.value
})

// Show left sidebar only for fullThree layout
const showLeftSidebar = computed(() => siteLayout.value === 'fullThree')

// Show right sidebar for default, fullTwo, and fullThree layouts (when showAside is true)
const showRightSidebar = computed(() => {
  if (siteLayout.value === 'sidebar' || siteLayout.value === 'fullSidebar') return false
  return showAside.value
})

/**
 * Watch navbar options and sync with scrollStyle
 * - If navbarSticky is true: scrollStyle = 'overlay' (sticky at top)
 * - If navbarReappear is true: scrollStyle = 'overlay_reappear' (reappears on scroll up)
 * - If both false: scrollStyle = 'simple' (no overlay behavior)
 */
watch([navbarSticky, navbarReappear], ([sticky, reappear]) => {
  if (sticky) {
    scrollStyle.value = 'overlay'
  } else if (reappear) {
    scrollStyle.value = 'overlay_reappear'
  } else {
    scrollStyle.value = 'simple'
  }
}, { immediate: true })

// Navigation menu items - imported from settings
const mainMenuItems: Ref<TopnavParentItem[]> = ref(mainMenuItemsConfig)

/**
 * LayoutToggle Component - State Management Pattern
 * 
 * The LayoutToggle component uses two different binding patterns:
 * 
 * 1. TOGGLE OPTIONS (Radio-style selection):
 *    - Uses ref<ToggleOption[]>() for the options array
 *    - Binds to a single value via v-model (here: siteLayout ref)
 *    - Pattern: v-model="siteLayout" (two-way binding)
 *    - When user clicks an option, v-model automatically updates siteLayout
 * 
 * 2. ARRAY OPTIONS (Toggle switches):
 *    - Uses computed<ArrayOption[]>() that reads from individual refs
 *    - Each option's state is derived from a separate ref (here: fullwidthPadding)
 *    - Pattern: @update:arrayOption="handler" (event-based updates)
 *    - When user toggles, event handler updates the individual ref
 *    - Computed rebuilds the array, causing reactive UI update
 * 
 * Why this pattern?
 * - Toggle options: Single selection, one source of truth (siteLayout ref)
 * - Array options: Multiple independent toggles, each with own ref
 * - Computed ensures array always reflects current state of underlying refs
 * - Event handler provides clear update path: UI → handler → ref → computed → UI
 */

// Layout Toggle Options - imported from settings
const layoutToggleOptions: Ref<ToggleOption[]> = ref(layoutToggleOptionsConfig)

/**
 * Array options - computed() that derives state from individual refs
 * 
 * This computed property creates a reactive array where each option's state
 * is read from its corresponding ref (here: fullwidthPadding).
 * 
 * Why computed() instead of ref() or reactive()?
 * - The array needs to rebuild when underlying refs change
 * - Computed automatically tracks dependencies (fullwidthPadding.value)
 * - When fullwidthPadding changes → computed re-evaluates → UI updates
 * - This creates a clean reactive data flow
 * 
 * Alternative: You could use reactive() with a watcher, but computed is cleaner
 * for derived state that depends on other refs.
 */
const layoutArrayOptions = computed<ArrayOption[]>(() => [
  {
    text: 'Fullwidth Padding',
    state: fullwidthPadding.value, // Read from ref - computed tracks this dependency
  },
  {
    text: 'Navbar Sticky',
    state: navbarSticky.value,
  },
  {
    text: 'Navbar Reappear',
    state: navbarReappear.value,
  },
])

/**
 * Handle toggle updates from array options
 * 
 * @param option - The option that was toggled (contains text, current state, optional url)
 * @param newState - The new boolean state after toggle
 * 
 * This handler receives events from LayoutToggle when user clicks a toggle switch.
 * It updates the underlying ref, which triggers the computed to rebuild layoutArrayOptions,
 * creating a reactive update cycle:
 * 
 * User clicks toggle → LayoutToggle emits @update:arrayOption → 
 * handleArrayOptionUpdate() → Update fullwidthPadding ref → 
 * layoutArrayOptions computed re-evaluates → UI reflects new state
 * 
 * Pattern: Event-driven updates for array options (vs v-model for toggle options)
 */
function handleArrayOptionUpdate(option: ArrayOption, newState: boolean) {
  // Update the underlying ref based on which option was toggled
  if (option.text === 'Fullwidth Padding') {
    fullwidthPadding.value = newState
  }
  else if (option.text === 'Navbar Sticky') {
    navbarSticky.value = newState
    // If enabling sticky, disable reappear
    if (newState) {
      navbarReappear.value = false
    }
  }
  else if (option.text === 'Navbar Reappear') {
    navbarReappear.value = newState
    // If enabling reappear, disable sticky
    if (newState) {
      navbarSticky.value = false
    }
  }
}
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Background Colors */
.page-bg-default {
  background-color: var(--color-bg);
}

.page-bg-primary {
  background-color: var(--color-primary-bg);
}

.page-bg-secondary {
  background-color: var(--color-secondary-bg);
}

.page-bg-muted {
  background-color: var(--color-muted-bg);
}

.page-bg-accent {
  background-color: var(--color-accent-bg);
}

.page-bg-positive {
  background-color: var(--color-positive-bg);
}

.page-bg-negative {
  background-color: var(--color-negative-bg);
}

.page-bg-warning {
  background-color: var(--color-warning-bg);
}

/* Header */
.page-header {
  width: 100%;
}

.page-header-boxed {
  max-width: 90rem; /* 1440px - matches Box centered */
  margin: 0 auto;
}

/* Main Content */
.main-content {
  flex: 1;
  width: 100%;
  order: 1; /* Main content always in the middle */
}

/**
 * Order for fullThree layout:
 * Desktop (≥1024px): Left (0) | Main (1) | Right (2)
 * Mobile (<1024px):  Main (0 implicit) | Right (1) | Left (2) - Left has lowest priority
 */

/* Fullwidth Padding - applies to wrappers in fullwidth mode */
.fullwidth-padded {
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 1024px) {
  .fullwidth-padded {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

/* Bottom Content */
.bottom-content {
  width: 100%;
}

.bottom-content-boxed {
  max-width: 90rem; /* 1440px - matches Box centered */
  margin: 0 auto;
}

/* Footer */
.page-footer {
  width: 100%;
}

  .page-footer-boxed {
  max-width: 90rem; /* 1440px - matches Box centered */
  margin: 0 auto;
}
</style>