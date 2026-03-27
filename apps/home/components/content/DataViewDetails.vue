
<script lang="ts" setup>
import { Hero, Prose } from '#components'
import { SfIconPerson, SfIconTune, SfIconArrowBack, SfIconShoppingCartCheckout, SfIconViewList, SfIconInfo } from '#components'
import { ref, onMounted, computed, watch } from 'vue'
import type { CheckoutStep, Product, FormContactInformationProps, CheckoutRecord, FormChecksAndSummaryProps } from '../../utils/checkout'
import { StepperDescription, StepperIndicator, StepperItem, StepperRoot, StepperSeparator, StepperTitle, StepperTrigger } from 'radix-vue'
import { useCheckout } from '~/composables/useCheckout'
/* This belongs to the DataView + DataViewTab component
- it should NOT be availabe in the component-spec
*/

/* Todo: 
- create simple stepper view based on file: /content/agenda/einstiege-ins-theaterspiel-m16e.md  
- take data it from yaml:items (view:details)
- product is a course > so the stepper creates list views and summaries, refererence-Implementation of the catalog-component here
*/


const activestep = defineModel('activestep', {
  type: Number,
  default: 0,
})

const props = defineProps({
  /**
   * typically undefined (if defined it overwrites the heading-entry of the product)
   */
  heading: {
    type: String,
    default: undefined
  },
  /**
   *
   */
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
  /**
   *
   */
  src: {
    type: String,
    required: true,
  },
})

const contactInfo = ref<FormContactInformationProps>({
  email: '',
  vorname: '',
  nachname: '',
  plz: '',
  ort: '',
  strasse: '',
  mobil: '',
})

const checksAndSummary = ref<FormChecksAndSummaryProps>({
  agb: false,
  datenschutz: false,
  ruecktritt: false,
  anmerkungen: '',
})

// Derive productRef for Odoo GraphQL checkout
// Priority: sku > meta_product > shortcode > id
const productRef = computed(() => {
  return props.product.sku || props.product.meta_product || props.product.shortcode || props.product.id || ''
})

// Derive domainCode for SaaS config lookup
// Priority: root-level > nested consulting.domainCode
const domainCode = computed(() => {
  return props.product.domainCode || props.product.consulting?.domainCode || undefined
})

// Lazy checkout initialization - will be created on first use if productRef is available
let checkout: ReturnType<typeof useCheckout> | null = null
const getCheckout = () => {
  if (!checkout && productRef.value) {
    checkout = useCheckout(productRef.value, domainCode.value)
  }
  return checkout
}

const checkoutRecord: CheckoutRecord = {
  basistag: '-',
  ratentyp: 'Standard',
  kursumfang: '-',
  strasse: '',
  kurs: '-',
  verification: false,
  plz: '',
  ort: '',
  vorname: '',
  geburtsdatum: '-',
  geschlecht: '',
  anmerkungen: '',
  tel: '',
  mobil: '',
  name: '',
  email: '',
  storno: '',
  bemerkungen: '-',
  individualprogramm: '-',
  details: '-',
  start: '',
  ende: '',
  actionstep: '',
  mailbody: '',
  ratenzahl: '',
  json: ''
}

const steps_outro: CheckoutStep[] = [
  {
    name: 'kontakt',
    title: 'Kontaktangaben',
    header: '### bitte Namen und Kontaktdaten eintragen',
    completed: false,
  },  
  {
    name: 'checks',
    title: 'Buchung',
    header: '### **Buchung**',
    description: 'Anmeldung vorläufig nur per eMail möglich',
    completed: false,
  },
]

// map all steps from product.details to an array of steps
// map every step-index to the new prop stepname


// map every step-index to the new prop stepname, every step-content to the new prop stepcontent
const product_steps = props.product.details ? Object.entries(props.product.details).map(([key, value]) => {
  return Object.assign({name: key, completed: false}, value)
}) : []

// map product_steps 'kontakt' and 'agb' to steps_outro and remove them from product_steps
Object.assign(steps_outro[0], product_steps.find(step => step.name === 'kontakt'))
Object.assign(steps_outro[1], product_steps.find(step => step.name === 'checks'))


//  ? props.product.details.concat(steps_outro) : steps_outro
const allsteps = ref<CheckoutStep[]>(product_steps.filter(s => s.name !== 'kontakt' && s.name !== 'checks').concat(steps_outro))

const handle_completestep = () => {
  if(stepProps.value.name === 'checks') {
    handle_checkout()
    .then(() => {
      allsteps.value[activestep.value - 1].completed = true
    })
    .catch((err) => {
      const errorMsg = err instanceof Error ? err.message : 'Unbekannter Fehler'
      console.error('[DataViewDetails] Checkout error:', errorMsg)
      alert(`Fehler bei der Anmeldung: ${errorMsg}\n\nBitte melde dich per eMail an: service@dasei.eu`)
    })
  } else if(stepProps.value.name === 'kontakt') {
    handle_update_contact()
    allsteps.value[activestep.value - 1].completed = true
    activestep.value++
  } else {
    allsteps.value[activestep.value - 1].completed = true
    activestep.value++
  }
}

const handle_backwards = () => {
  if(activestep.value > 0) {
    activestep.value = activestep.value - 1
  } else {
    alert('Rückschritt nicht möglich')
  }
}

const handle_update_contact = () => {
  checkoutRecord.mailbody = mailbody.value
  checkoutRecord.email = contactInfo.value.email  ?? ''
  checkoutRecord.name = contactInfo.value.nachname  ?? ''
  checkoutRecord.vorname = contactInfo.value.vorname  ?? ''
  checkoutRecord.strasse = contactInfo.value.strasse  ?? ''
  checkoutRecord.ort = contactInfo.value.ort  ?? ''
  checkoutRecord.plz = contactInfo.value.plz  ?? ''
  checkoutRecord.mobil = contactInfo.value.mobil  ?? ''
}

const handle_checkout = async () => {
  checkoutRecord.anmerkungen = checksAndSummary.value.anmerkungen ?? ''
  checkoutRecord.start = props.product.date_start ? props.product.date_start.toString() : ''
  checkoutRecord.ende = props.product.date_end ? props.product.date_end.toString() : ''
  checkoutRecord.actionstep = props.product.id ? props.product.id : props.product.shortcode ? props.product.shortcode : ''
  checkoutRecord.json = JSON.stringify(checkoutRecord)
  
  // Use Odoo GraphQL checkout if available and configured
  const odooCheckout = getCheckout()
  if (odooCheckout && productRef.value) {
    console.log('[DataViewDetails] Using Odoo checkout with productRef:', productRef.value)
    // Sync form state to composable
    odooCheckout.setContact({
      email: contactInfo.value.email || '',
      vorname: contactInfo.value.vorname || '',
      nachname: contactInfo.value.nachname || '',
      strasse: contactInfo.value.strasse,
      plz: contactInfo.value.plz,
      ort: contactInfo.value.ort,
      mobil: contactInfo.value.mobil,
    })
    odooCheckout.setAcceptances({
      terms: checksAndSummary.value.agb || false,
      privacy: checksAndSummary.value.datenschutz || false,
      cancellation: checksAndSummary.value.ruecktritt || false,
    })
    odooCheckout.setNotes(checksAndSummary.value.anmerkungen || '')
    
    const result = await odooCheckout.submit()
    
    if (!result.success) {
      console.error('[DataViewDetails] Checkout failed:', result.error)
      throw new Error(result.error || 'Checkout failed')
    }
    
    console.log('[DataViewDetails] Checkout successful:', result)
    console.log('[DataViewDetails] checkoutType:', result.checkoutType)
    
    // Show tier-specific confirmation message
    if (result.checkoutType === 'manual_review') {
      alert('Vielen Dank! Ihre Anmeldung wird innerhalb von 1-2 Werktagen bearbeitet. Sie erhalten eine Bestätigung per E-Mail.')
    } else {
      alert('Ihre Buchung wurde bestätigt. Sie erhalten eine Bestätigung per E-Mail.')
    }
    return
  }
  
  // Fallback to Power Automate (legacy) — updated URL 2026-02
  // old link: https://prod-53.westeurope.logic.azure.com:443/workflows/e24e854998a44b8990cb883f006b0612/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lQRSV83cnOJ69qBn_SWojAazlEcoZu8yntN4m_ZhFec
  console.warn('[DataViewDetails] Using legacy Power Automate checkout. Configure NUXT_PUBLIC_ODOO_GRAPHQL_URL to use Odoo.')
  const data = await $fetch('https://default430c53e6651e45efa53c004ea96dd2.16.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/e24e854998a44b8990cb883f006b0612/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=dW-If8W3p85RTFP0mE2PD-r0sgu9opFXOmmwKuJ7xwU', {
      method: 'post',
      body: checkoutRecord,
      responseType: 'stream'
  })
  // Create a new ReadableStream from the response with TextDecoderStream to get the data as text
  const reader = data.pipeThrough(new TextDecoderStream()).getReader()

  // Read the chunk of data as we get it
  while (true) {
    const { value, done } = await reader.read()

    if (done)
      break

    console.log('Received:', value)
  }
}


const stepProps = ref<CheckoutStep>({
  name: 'kontakt',
  title: 'Programm & Struktur',
  header: 'Programm & Struktur',
  completed: false
})


watch(() => activestep.value, (value) => {
  stepProps.value = allsteps.value[value - 1]
})

onMounted(() => {
  activestep.value = 1
})


const zahlungsmodell = computed(() => {
  const md = allsteps.value.find(step => step.name === 'konditionen')?.info?.kosten
  if (md) {
    return renderMdProp(md, 'h2', true)
  }
})

const storno = computed(() => {
  const md = allsteps.value.find(step => step.name === 'konditionen')?.info?.storno
  if (md) {
    return renderMdProp(md, 'h2', true)
  }
})

const agb = computed(() => {
    return 'Die <a target="_blank" href="https://dasei.eu/agb">Allgemeinen Geschäftsbedingungen (https://www.dasei.eu/agb) von DAS Ei - theaterpädagogisches Institut Bayern e.V.</a> habe ich gelesen. Ich bestätige sie hiermit.'
})

const datenschutz = computed(() => {
    return 'Die <a target="_blank" href="https://dasei.eu/datenschutz">Datenschutzerklärung (https://www.dasei.eu/datenschutz) von DAS Ei - theaterpädagogisches Institut Bayern e.V.</a> habe ich gelesen und stimme der entsprechenden Verarbeitung meiner Daten zu.'
})
//return 'Ich habe ein 14-tägiges Rücktrittsrecht von dieser Online-Anmeldung, gültig ab Eingang der EMail-Bestätigung von service@dasei.eu in mein Postfach unter: ' + this.email + '.'

const ruecktritt = computed(() => {
    return 'Ich habe ein 14-tägiges Rücktrittsrecht von dieser Online-Anmeldung, gültig ab Eingang der EMail-Bestätigung von service@dasei.eu in mein Postfach unter: ' + contactInfo.value.email + '.'
})

const person = computed(() => {
  return `\n\r<strong>Diese Anmeldung wurde erstellt von:</strong><br />${contactInfo.value.vorname} ${contactInfo.value.nachname}<br>${contactInfo.value.strasse}<br>${contactInfo.value.plz} ${contactInfo.value.ort}<br>Telefon: ${contactInfo.value.mobil}<br>Email: ${contactInfo.value.email}`
})

const programm = computed(() => {
  return `\n\r<h2 style='font-size:20px; font-weight:700;'>Programm</h2>\n\r<p>Das detaillierte Programm inklusive Veranstaltungs-Ort(en) schicken wir nach einer Bearbeitungszeit von ca. 1 Woche</p>`
})


const mailheading = computed(() => {
  const headtext = props.heading ? props.heading : props.product.heading ? props.product.heading.toString() : 'Details'
  if (headtext) {
    if (!headtext.startsWith('#')) {
      return renderMdProp('## ' + headtext, 'h1', true)
    }
    return renderMdProp(headtext, 'h1', true)
  }
})

const mailbody = computed(() => {
  return mailheading.value + '\n\r' + zahlungsmodell.value + '\n\r' + storno.value + '\n\r' + [checkoutRecord.anmerkungen.length > 1 ? "<br /> " + checkoutRecord.anmerkungen : ''] + '\n\r<br />' + programm.value + '\n\r<br />' + person.value + '\n\r<br />' + datenschutz.value + '\n\r<br />' + agb.value + '\n\r<br />' + ruecktritt.value
})

const shortcodeTitle = (shortcode: String | undefined, title: String) => {
  if (!shortcode) return title
  return `_${shortcode.toUpperCase()}_ ${title}`
}

// Convert to plain inline format for h4 headings: "K1: Overline (Headline...)" 
const oneLineTitle = (shortcode: String | undefined, title: String, maxLength: number = 50) => {
  // Extract overline (before **) and headline (inside **)
  const match = title.match(/^(.*)\*\*([^*]+)\*\*$/)
  const prefix = shortcode ? `${shortcode.toUpperCase()}: ` : ''
  
  if (match) {
    const overline = match[1].trim()
    const headline = match[2].trim()
    const baseText = prefix + overline + ' '
    const availableForHeadline = maxLength - baseText.length - 2 // account for ()
    
    if (headline.length > availableForHeadline) {
      return baseText + '(' + headline.slice(0, availableForHeadline - 3) + '...)'
    }
    return baseText + '(' + headline + ')'
  }
  
  // Fallback: no bold pattern found, just use title as-is
  const fullText = prefix + title
  if (fullText.length > maxLength) {
    return fullText.slice(0, maxLength - 3) + '...'
  }
  return fullText
}

// Filter out items with ctype starting with 'slide_' from left panel
const filteredItems = computed(() => {
  if (!props.product.items) return []
  return Object.values(props.product.items).filter(
    (item: any) => !item.ctype || !item.ctype.startsWith('slide_')
  )
})

// Helper: check if date ranges overlap (for ctype:lines stacking)
const datesOverlap = (a: any, b: any): boolean => {
  // If either item has no dates, treat as "always overlapping"
  if (!a.date_start || !a.date_end || !b.date_start || !b.date_end) {
    return true
  }
  return new Date(a.date_start) <= new Date(b.date_end) && 
         new Date(b.date_start) <= new Date(a.date_end)
}

// Group consecutive ctype:lines items into timeline cards
// - Max 3 items per card, only if dates overlap
// - Regular items (ctype:event etc.) become single-item cards
interface TimelineCard {
  items: any[]
  isLinesCard: boolean
  ueValues: (number | null)[]  // Individual UE values for display
  totalUe: number | null       // Sum if ALL items have numeric ue
}

const groupedTimelineItems = computed((): TimelineCard[] => {
  const items = filteredItems.value
  const cards: TimelineCard[] = []
  let i = 0
  
  while (i < items.length) {
    const item = items[i]
    
    if (item.ctype === 'lines') {
      // Start a new lines card
      const cardItems = [item]
      i++
      
      // Try to add up to 2 more items (max 3 total)
      while (i < items.length && 
             items[i].ctype === 'lines' && 
             cardItems.length < 3) {
        const nextItem = items[i]
        // Check overlap with last item in cardItems
        if (datesOverlap(cardItems[cardItems.length - 1], nextItem)) {
          cardItems.push(nextItem)
          i++
        } else {
          break // No overlap, start new card
        }
      }
      
      // Collect UE values
      const ueValues = cardItems.map(item => 
        typeof item.ue === 'number' ? item.ue : null
      )
      
      // Calculate total UE only if ALL items have numeric ue
      let totalUe: number | null = null
      if (ueValues.every(ue => ue !== null)) {
        totalUe = ueValues.reduce((sum, ue) => sum! + ue!, 0)
      }
      
      cards.push({
        items: cardItems,
        isLinesCard: true,
        ueValues,
        totalUe,
      })
    } else {
      // Regular item (event, etc.) - single-item card
      cards.push({
        items: [item],
        isLinesCard: false,
        ueValues: [],
        totalUe: null,
      })
      i++
    }
  }
  
  return cards
})

// Format UE summary line for stacked items: "_80 UE_ + _75 UE_ = _155 UE_"
const formatUeSummary = (ueValues: (number | null)[], totalUe: number | null): string => {
  if (totalUe === null || ueValues.length === 0) return ''
  if (ueValues.length === 1) {
    return `_${ueValues[0]} UE_`
  }
  const parts = ueValues.map(ue => `_${ue} UE_`).join(' + ')
  return `${parts} = _${totalUe} UE_`
}

const getRootPath = (root: string | undefined) => {
  if (!root) return ''
  if (root.startsWith('/')) return root
  return `/ausbildung-theaterpaedagogik/${root}`
}
</script>

<template>
  <div>
    <SectionContainer background="accent">
      <Heading
        v-if="product.heading"
        :content="heading ? heading : product.heading ? product.heading.toString() : 'Details'"
        is="h3"
      ></Heading>
    </SectionContainer>

    <StepperRoot v-model="activestep" class="flex gap-2 w-full pt-2 pb-14 bg-accent">
      <StepperItem
        v-for="(step, index) in allsteps"
        :step="index + 1"
        :completed="step.completed"
        :disabled="index === allsteps.length-1"
        :key="index"
        class="w-full flex justify-center gap-2 cursor-pointer group data-[disabled]:pointer-events-none relative px-4"
        :title="step.title"
      >
        <template #state>

        </template>
        <StepperTrigger aria-describedby="undefined" class="inline-flex items-center fill-neutral-400 group-data-[disabled]:fill-neutral-600 group-data-[state=completed]:fill-primary group-data-[state=active]:fill-primary-contrast justify-center rounded-full w-10 h-10 shrink-0 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none">
          <StepperIndicator :step="index" class="bg-neutral-200 group-data-[disabled]:bg-accent group-data-[state=completed]:bg-neutral-50 group-data-[state=active]:bg-primary">
            <SfIconViewList class="w-5 h-5" size="lg" v-if="index === 0" />
            <SfIconShoppingCartCheckout size="lg" v-else-if="index === allsteps.length-1" />
            <SfIconPerson size="lg" v-else-if="index === allsteps.length-2" />
            <!-- SfIconEmail size="lg" v-else-if="index === allsteps.length-1" / -->
            <SfIconTune size="lg" v-else />
          </StepperIndicator>
          <div class="absolute text-center top-full left-0 w-full mt-2">
            <StepperTitle :class="index + 1 === activestep ? 'text-primary' : 'text-neutral-300'" class="font-medium text-neutral-400 group-data-[disabled]:text-neutral-600">
              {{ step.title }}
            </StepperTitle>
          </div>  
        </StepperTrigger>
        <StepperSeparator v-if="index < allsteps.length-1"
            class="absolute block top-4 left-[calc(50%+30px)] right-[calc(-50%+20px)] h-0.5 rounded-full group-data-[disabled]:bg-neutral-700 bg-neutral-500 group-data-[state=completed]:bg-primary shrink-0"
          /> 
      </StepperItem>
    </StepperRoot> 
    <SectionContainer>
    <Columns gap="medium" stackReverse>
      <Column class="timeline-column">
        <ContentQuery v-slot="{ data }" :path="product.meta_product ? getRootPath(product.root) : src" find="one">
          <ContentRenderer :value="data">
            <Hero
              v-if="data.hero"
              :contentAlignY="data.hero.content_y"
              :contentType="data.hero.content ? data.hero.content : 'text'"
              :contentWidth="data.hero.content_width"
              :heightTmp="data.hero.height"
              :imgTmp="data.image?.src"
              :imgTmpAlignX="data.hero.image_focus_x"
              :imgTmpAlignY="data.hero.image_focus_y"
              contentType="banner"
              target="card"
            >
              <Banner card transparent>
                <Heading
                  v-if="data.heading || data.title"
                  :content="data.heading ? data.heading : data.title"
                  is="h3"
                ></Heading>
                <br v-if="(data.heading || data.page.title) && data.teaser" />
                <MdBlock v-if="data.teaser" :content="data.teaser" :htag="data.heading ? 'h3' : 'h1'" />
              </Banner>
            </Hero>
          </ContentRenderer>
        </ContentQuery>
        
        <!-- Timeline cards: grouped ctype:lines or single items -->
        <template v-for="(card, cardIndex) in groupedTimelineItems" :key="cardIndex">
          <!-- Lines card: multiple stacked ctype:lines items -->
          <SectionContainer
            v-if="card.isLinesCard"
            :background="cardIndex === 2 || cardIndex === 4 ? 'accent' : 'muted'"
            narrow
          >
            <template v-for="(item, itemIndex) in card.items" :key="itemIndex">
              <!-- First item: full heading (h3, twoliner twocolums pattern) -->
              <template v-if="itemIndex === 0">
                <Heading 
                  v-if="item.title" 
                  :content="item.shortcode ? shortcodeTitle(item.shortcode, item.title) : item.title" 
                  is="h3" 
                />
              </template>
              <!-- 2nd/3rd items: smaller inline heading (h4) -->
              <template v-else>
                <Heading 
                  v-if="item.title" 
                  :content="oneLineTitle(item.shortcode, item.title)" 
                  is="h4"
                  style="margin-top: 1.5rem"
                />
              </template>
              
              <!-- Schedule with dotted-leader styling via CatBlock -->
              <CatBlock 
                v-if="item.schedule" 
                :content="item.schedule" 
                htag="h4" 
                style="margin-top: 0.25rem" 
              />
            </template>
            
            <!-- UE summary at card-bottom (only if all items have numeric ue) -->
            <Prose v-if="card.totalUe !== null" style="margin-top: 1rem">
              <p class="ue-summary">
                <em v-html="formatUeSummary(card.ueValues, card.totalUe).replace(/_([^_]+)_/g, '<em>$1</em>')"></em>
              </p>
            </Prose>
          </SectionContainer>
          
          <!-- Regular card: single event item -->
          <SectionContainer
            v-else
            :background="cardIndex === 2 || cardIndex === 4 ? 'accent' : 'muted'"
            narrow
          >
            <Heading 
              v-if="card.items[0].title" 
              :content="card.items[0].shortcode ? shortcodeTitle(card.items[0].shortcode, card.items[0].title) : card.items[0].title" 
              is="h3" 
            />
            <columns gap="small">
              <column width="2/5" style="line-height: 1.62em">
                <p>{{ card.items[0].tag }}</p>
              </column>
              <column>
                <MdBlock v-if="card.items[0].schedule" :content="card.items[0].schedule" htag="h3" narrow style="margin-top: -0.3em" />
              </column>
            </columns>
          </SectionContainer>
        </template>
      </Column>
      <Column class="checkout-card bg-neutral-50">
        <MdBlock v-if="stepProps.header" :content="stepProps.header" htag="h3" />
        <UiFormContactInformation 
          :vorname="contactInfo.vorname" 
          :nachname="contactInfo.nachname" 
          :plz="contactInfo.plz" 
          :ort="contactInfo.ort" 
          :strasse="contactInfo.strasse" 
          :mobil="contactInfo.mobil" 
          :email="contactInfo.email" 
          @on-save="contactInfo = $event; handle_completestep()" 
          @on-cancel="contactInfo = {email: '',  vorname: '',  nachname: '',  plz: '',  ort: '',  strasse: '',  mobil: '',}; handle_backwards()"
          v-if="stepProps.name === 'kontakt'" 
        />
        <UiFormChecksAndSummary 
          :agb="checksAndSummary.agb" 
          :datenschutz="checksAndSummary.datenschutz" 
          :ruecktritt="checksAndSummary.ruecktritt" 
          :anmerkungen="checksAndSummary.anmerkungen" 
          :alabel="agb" 
          :dlabel="datenschutz" 
          :rlabel="ruecktritt"
          :mailheading="mailheading"
          :kosten="zahlungsmodell"
          @on-save="checksAndSummary = $event; handle_completestep()" 
          @on-cancel="checksAndSummary = {agb: false,  datenschutz: false,  ruecktritt: false,  anmerkungen: ''}; handle_backwards()"
          v-if="stepProps.name === 'checks' && stepProps.completed === false" 
        />
        <div v-else-if="stepProps.name === 'checks' && stepProps.completed">
          <Prose>
            <h2>Vielen Dank für deine Buchung</h2>
            <p class="mb-8">Bitte gib uns ca. 2 Arbeitstage Zeit - Du erhältst in Kürze eine Bestätigung / Rückmeldung von uns.</p>
          </Prose>
          <ButtonTmp to="/" class="cursor-pointer" id="button_home">
            zur Startseite
          </ButtonTmp>  
        </div> 
        <div v-else-if="stepProps.info">
          <template v-for="(column, index) in stepProps.info" :key="index">
            <CatBlock :content="column" htag="h4" style="padding-bottom: 1rem" />
          </template>
        </div>
        <CatBlock v-else-if="stepProps.catalog" :content="stepProps.catalog" :htag="stepProps.header ? 'h4' : 'h3'" />
        
        <div v-else-if="stepProps.columns">
          <template v-for="(column, key, index) in stepProps.columns" :key="index">
            <div v-if="key === 'catalog'">
              <Catalog :catalog="column" />
            </div>
            <div v-else-if="typeof(column)=== 'string'">
              <CatBlock :content="column" htag="h4" style="padding-bottom: 1rem" />
            </div>
          </template>
        </div>
        <!-- div v-else>
          <CatBlock :content="stepProps.toString()" htag="h4" style="padding-bottom: 1rem" />
        </!-->
        <MdBlock v-if="stepProps.footer" :content="stepProps.footer" htag="h4" /> 
        <div v-show="stepProps.name!=='kontakt' && stepProps.name!=='checks'" class="flex flex-row-reverse justify-between" style="margin-top: 3em">
          <ButtonTmp class="cursor-pointer" @click="handle_completestep" id="button_completestep">
            Weiter
          </ButtonTmp>  
          <ButtonTmp is="a" v-if="activestep > 1" class="cursor-pointer" @click="handle_backwards" id="button_completestep">
            <SfIconArrowBack size="lg" />
          </ButtonTmp>            
        </div> 
      </Column>
    </Columns>
    </SectionContainer>

    <!-- Single-event consulting (email-only) -->
    <SectionContainer v-if="product.consulting" background="default" class="mt-8">
      <ConsultingDialog
        :variant="product.consulting.variant || 'email-only'"
        :fancy="product.consulting.fancy || false"
        :title="product.consulting.title || 'Fragen?'"
        :description="product.consulting.intro"
        :productRef="product.consulting.productRef || product.id"
        :domainCode="product.consulting.domainCode"
        :email="product.consulting.email"
        :emailLabel="product.consulting.emailLabel"
        :categories="product.consulting.categories || []"
        :success="product.consulting.success"
      />
    </SectionContainer>
  </div>
</template>

<style scoped>
.checkout-card {
  padding: 1rem;
  box-shadow:
    0px 4px 6px 1px rgba(0, 0, 0, 0.1),
    0px 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* UE summary for ctype:lines cards - subtle formal note */
.ue-summary {
  font-size: 0.875rem;
  color: var(--color-muted-contrast);
  opacity: 0.7;
  border-top: 1px solid var(--color-border);
  padding-top: 0.75rem;
  margin-top: 0.75rem;
}

.ue-summary em {
  font-style: normal;
  font-weight: 500;
}

/* Timeline cards only: muted styling for shortcode and headline */
.timeline-column :deep(.shortcode-float) {
  opacity: 0.55;
}
.timeline-column :deep(.heading.twoliner strong) {
  opacity: 0.75;
}
.timeline-column :deep(h4) {
  opacity: 0.75;
}
</style>
