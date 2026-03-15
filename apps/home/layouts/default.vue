<template>
  <Box>
    <Sidebar
      footerText="30 Jahre Theaterädagogik Bayern"
      logo="https://pruvious.com/uploads/logo-dasei.svg"
      logoAlt="DAS Ei"
      logoSmall="https://pruvious.com/uploads/logo-dasei-small.svg"
    >
      <MainMenu v-model:items="mainMenu.items" :linkComponent="NuxtLink" />
    </Sidebar>

    <Main>
      <slot name="header">
        <Hero
          v-if="hero"
          :contentAlignY="hero.content_y"
          :contentType="hero.content ? hero.content : 'text'"
          :contentWidth="hero.content_width"
          :gradient_depth="hero.gradientDepth ? hero.gradientDepth : undefined"
          :gradient_type="hero.gradientType"
          :heightTmp="hero.height"
          :imgTmp="image.src"
          :imgTmpAlignX="hero.image_focus_x"
          :imgTmpAlignY="hero.image_focus_y"
        >
          <Component
            :card="hero.content === 'banner' && page?._path?.startsWith('/agenda')"
            :is="hero.content === 'banner' ? 'Banner' : 'div'"
            transparent
          >
            <Heading
              v-if="page?.heading || page?.title"
              :content="page?.heading ? page.heading : page?.title"
              is="h1"
            ></Heading>
            <br v-if="(page?.heading || page?.title) && page?.teaser" />
            <MdBlock v-if="page?.teaser" :content="page.teaser" :htag="page?.heading ? 'h3' : 'h1'" />
            <div v-if="hero.cta || hero.link">
              <ButtonTmp
                v-if="hero.cta"
                :size="hero.content_width === 'full' ? 'medium' : 'small'"
                :to="hero.cta.link ? hero.cta.link : '#cta'"
                variant="plain"
              >
                {{ hero.cta.title }}
              </ButtonTmp>
              <NuxtLink
                v-if="hero.link"
                :to="hero.link.link"
                style="margin-left: 2em; text-decoration: underline"
                :style="hero.content_width === 'full' ? 'font-weight:bold' : ''"
              >
                {{ hero.link.title }}
              </NuxtLink>
            </div>
          </Component>
        </Hero>
        <SectionContainer v-else>
          <Heading
            v-if="page?.heading || page?.title"
            :content="page?.heading ? page.heading : page?.title"
            is="h1"
          ></Heading>
          <MdBlock v-if="page?.teaser" :content="page.teaser" :htag="page?.heading ? 'h3' : 'h1'" />
        </SectionContainer>
      </slot>
      <slot />
      <ButtonTmp
        v-if="details"
        :to="{ path: '/details', props: route.path, query: { src: route.path } }"
        id="cta"
        style="margin-top: 3em"
      >
        Anmeldung und Konditionen
      </ButtonTmp>
      <PageBottom
        v-if="pageBottom"
        :topline="pageBottom.topline !== false"
        :heightTmp="pageBottom.height || 'medium'"
        :contentAlignY="pageBottom.content_y || 'top'"
        :contentWidth="pageBottom.content_width || 'full'"
        :imgTmp="pageBottomImage"
        :imgTmpGravity="pageBottom.image_gravity || 'south'"
        :overlay="pageBottomOverlay"
      >
        <ConsultingDialog
          v-if="consultingConfig"
          :variant="consultingConfig.variant || 'default'"
          :fancy="consultingConfig.fancy !== false"
          :title="consultingConfig.title"
          :overline="consultingConfig.overline"
          :pageTitle="page?.title"
          :navHighlight="route.path"
          :description="consultingConfig.description || consultingConfig.intro"
          :productRef="consultingConfig.productRef || route.query.tab as string || undefined"
          :domainCode="effectiveDomainCode || consultingConfig.domainCode"
          :consultationType="consultingConfig.consultationType"
          :callPhone="consultingConfig.callPhone"
          :callLabel="consultingConfig.callLabel"
          :email="consultingConfig.email"
          :emailLabel="consultingConfig.emailLabel"
          :categories="consultingConfig.categories || []"
          :success="consultingConfig.success"
        />
        <div v-else-if="pageBottom.heading || pageBottom.teaser">
          <Heading v-if="pageBottom.heading" :content="pageBottom.heading" is="h2" />
          <MdBlock v-if="pageBottom.teaser" :content="pageBottom.teaser" htag="p" />
        </div>
      </PageBottom>
      <!-- Minimal PageBottom for events without explicit pageBottom -->
      <PageBottom
        v-else-if="consultingConfig"
        :topline="false"
        heightTmp="mini"
        contentAlignY="center"
        contentWidth="full"
        :imgTmp="image.src"
        imgTmpGravity="center"
        :overlay="getoverlay('bottom', 0.7)"
      >
        <ConsultingDialog
          :variant="consultingConfig.variant || 'email-only'"
          :fancy="consultingConfig.fancy !== false"
          :title="consultingConfig.title || 'Fragen?'"
          :overline="consultingConfig.overline"
          :pageTitle="page?.title"
          :navHighlight="route.path"
          :description="consultingConfig.description || consultingConfig.intro"
          :productRef="consultingConfig.productRef || page?.id"
          :domainCode="effectiveDomainCode || consultingConfig.domainCode"
          :consultationType="consultingConfig.consultationType"
          :email="consultingConfig.email"
          :emailLabel="consultingConfig.emailLabel"
          :categories="consultingConfig.categories || []"
          :success="consultingConfig.success"
        />
      </PageBottom>
    </Main>
  </Box>

  <FooterDasei />
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components'
import { PageBottom } from '@crearis/ui'
import { getoverlay } from '@crearis/theme/utils/BackgroundHelpers'
import { provide, computed } from 'vue'
const { page } = useContent()

const image = page.value?.image
  ? page.value.image
  : { src: 'https://pruvious.com/uploads/dasei/banner.jpg', alt: 'DAS Ei' }
const hero = page.value?.hero ? page.value.hero : undefined
const details = page.value?.details ? true : false
const pageBottom = page.value?.pageBottom ? page.value.pageBottom : undefined

const route = useRoute()

/**
 * Effective domainCode for the current page.
 * 
 * Priority chain (first defined wins):
 * 1. URL query param (?domain=dasei3) — deep-links from Odoo CRM
 * 2. Root-level YAML: page.domainCode — explicit page context
 * 3. Preset fallback from ctype — default for content type
 * 
 * @see _meta/Whitepaper/products_dasei_abcd.md#SaaS Architecture
 */
const effectiveDomainCode = computed(() => {
  // 1. URL override (deep-linking from Odoo CRM)
  if (route.query.domain) return route.query.domain as string
  
  // 2. Root-level page.domainCode (explicit YAML)
  if (page.value?.domainCode) return page.value.domainCode as string
  
  // 3. Nested consulting.domainCode (legacy, will be migrated)
  if (page.value?.consulting?.domainCode) return page.value.consulting.domainCode as string
  
  // 4. Preset-based fallback (from consultingConfig)
  return null
})

/**
 * Consulting presets by content type (ctype).
 * 
 * | ctype       | Use case                          | Variant     | Behavior                        |
 * |-------------|-----------------------------------|-------------|---------------------------------|
 * | event       | Single events (workshops, etc.)   | email-only  | → crm.lead, event context       |
 * | product     | Course pages (Einstiege, etc.)    | dual-lane   | → /beratung stepper             |
 * | contact     | Team page                         | email-only  | → Route to specific team member |
 * | newsletter  | Blog/footer subscription          | email-only  | → Mailing list (consultationType: newsletter) |
 * | default     | Fallback for undefined ctype      | email-only  | → General inquiry               |
 */
type ConsultingCtype = 'event' | 'product' | 'contact' | 'newsletter' | 'default'

interface ConsultingPreset {
  variant: 'email-only' | 'dual-lane'
  email: string
  emailLabel: string
  callLabel?: string
  callPhone?: string
  title?: string
  intro?: string
  domainCode: string
  consultationType?: string  // For CO routing
  fancy?: boolean
  success: {
    email: string
    call?: string
  }
}

const CONSULTING_PRESETS: Record<ConsultingCtype, ConsultingPreset> = {
  event: {
    variant: 'email-only',
    email: 'service@dasei.eu',
    emailLabel: 'Fragen?',
    intro: 'Wir melden uns innerhalb von 2 Werktagen.',
    domainCode: 'dasei2',  // Events typically Grundstufe
    consultationType: 'event_inquiry',
    fancy: true,
    categories: [
      {
        key: 'teilnahme',
        label: 'Teilnahme',
        teaser: 'Anmeldung, Voraussetzungen, Ablauf',
        options: [
          'Anmeldung & Buchung',
          'Voraussetzungen',
          'Ablauf & Programm',
        ],
      },
      {
        key: 'termin',
        label: 'Termin & Ort',
        teaser: 'Zeiten, Anfahrt, Unterkunft',
        options: [
          'Genaue Zeiten',
          'Anfahrt & Parken',
          'Unterkunft',
        ],
      },
      {
        key: 'sonstiges',
        label: 'Sonstiges',
        teaser: 'Weitere Fragen',
      },
    ],
    success: {
      email: '✨ abgeschickt! Wir melden uns bei dir.',
    },
  },
  product: {
    variant: 'dual-lane',
    email: 'service@dasei.eu',
    emailLabel: 'per Email klären',
    callLabel: 'direkt klären',
    callPhone: '+49 911 7808476',
    title: 'FRAGEN und ANTWORTEN',
    intro: 'Wähle deine Themen und Punkte, lass uns konkreter werden.',
    domainCode: 'dasei3',  // Products typically Aufbaustufe
    consultationType: 'purchase_consultation',
    fancy: true,
    success: {
      email: '✨ abgeschickt! Wir melden uns bei dir.',
      call: 'Bis bald! Wir rufen dich an.',
    },
  },
  contact: {
    variant: 'email-only',
    email: 'service@dasei.eu',
    emailLabel: 'Nachricht senden',
    title: 'Fragen oder Vorschläge?',
    intro: 'Schreib uns direkt — wir melden uns.',
    domainCode: 'dasei',  // General domain (category can override)
    consultationType: 'contact_inquiry',
    fancy: true,
    success: {
      email: '✨ Nachricht gesendet!',
    },
  },
  newsletter: {
    variant: 'email-only',
    email: 'service@dasei.eu',
    emailLabel: 'Anmelden',
    title: 'Newsletter',
    intro: 'Bleib auf dem Laufenden zu Events und Programmen.',
    domainCode: 'dasei',
    consultationType: 'newsletter_subscription',
    success: {
      email: '✅ Angemeldet! Du erhältst eine Bestätigung per Email.',
    },
  },
  default: {
    variant: 'email-only',
    email: 'service@dasei.eu',
    emailLabel: 'Kontakt',
    intro: 'Wir melden uns innerhalb von 2 Werktagen.',
    domainCode: 'dasei',
    consultationType: 'general_inquiry',
    success: {
      email: '✨ abgeschickt! Wir melden uns bei dir.',
    },
  },
}

// Compute consulting config with fallback chain:
// 1. pageBottom.consulting (explicit per-page)
// 2. page.consulting (top-level YAML)
// 3. ctype-based preset (event, product, contact, newsletter)
// 4. null (no consulting shown)
const consultingConfig = computed(() => {
  // Explicit pageBottom.consulting takes full priority
  if (pageBottom?.consulting) return pageBottom.consulting
  
  // ctype-based presets with page.consulting merge
  const ctype = page.value?.ctype as ConsultingCtype | undefined
  if (ctype && ctype in CONSULTING_PRESETS) {
    const preset = CONSULTING_PRESETS[ctype]
    const pageConsulting = page.value?.consulting || {}
    
    return {
      ...preset,
      ...pageConsulting,  // Page YAML overrides preset defaults
      productRef: page.value?.id || page.value?.shortcode,
      // For contact ctype: use team member for overline
      ...(ctype === 'contact' && page.value?.teamMember && {
        teamMember: page.value.teamMember,
        overline: `${page.value.teamMember} kontaktieren`,
      }),
    }
  }
  
  // Standalone page.consulting (no ctype preset)
  if (page.value?.consulting) return page.value.consulting
  
  return null
})

// Provide hero image so PageBottom can inherit it if needed
provide('heroImage', image.src)

// Compute PageBottom image (inherit from hero or use explicit)
const pageBottomImage = computed(() => {
  if (!pageBottom) return undefined
  if (pageBottom.inherit_hero_image !== false) {
    return image.src
  }
  return pageBottom.image
})

// Compute PageBottom overlay
const pageBottomOverlay = computed(() => {
  if (!pageBottom) return undefined
  return getoverlay(pageBottom.gradient_type || 'none', pageBottom.gradient_depth || 0.8)
})

// const hideFolders = ['/blog/', '/agenda/']
// .filter((item) => !hideFolders.includes(item.link!)) // filter out items that are in the hideFolders list

const mainMenu = useMainMenu()
// mainMenu.value.items = mainMenu.value.items.filter((item) => item.link !== '/blog/' && item.link !== '/agenda/')

</script>

<style scoped>
:deep() .footnotes {
  /* merged from ui/section + section-muted + ui/container */
  position: relative;
  z-index: 1;
  padding-top: 1.75rem; /* 28px */
  padding-bottom: 1.75rem; /* 28px */
  transform: translate3d(0, 0, 0); /* Fixes z-index in Safari */
  --color-bg: var(--color-muted-bg);
  --color-contrast: var(--color-card-contrast);
  background-color: var(--color-muted-bg);
  color: var(--color-card-contrast);
  width: 100%;
  max-width: 90rem; /* 1440px */
  margin-right: auto;
  margin-left: auto;
  padding-right: 1.75rem; /* 28px */
  padding-left: 1.75rem; /* 28px */
}

:deep() .footnotes > ol {
  /* merged from ui/section + section-muted + ui/container */
  list-style: decimal;
  font-size: 0.9em;
  margin-bottom: 0.5rem;
  max-width: 52rem; /* from prose */
}

:deep() .footnotes > ol > li {
  /* merged from ui/section + section-muted + ui/container */
  list-style: decimal;
  font-size: 0.92em;
  margin-bottom: 0.5rem;
}

:deep() .footnotes > ol {
  /* merged from ui/section + section-muted + ui/container */
  margin-left: 1.6rem;
}

@media (max-width: 767px) {
  :deep() .footnotes {
    padding-right: 1rem;
    padding-left: 1rem;
  }
}
</style>
