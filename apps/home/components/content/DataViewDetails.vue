
<script lang="ts" setup>
import { Hero, Prose } from '#components'
import { SfIconPerson, SfIconTune, SfIconArrowBack, SfIconShoppingCartCheckout, SfIconViewList, SfIconInfo } from '#components'
import { ref, onMounted } from 'vue'
import type { CheckoutInfo, CheckoutStep, Product, Catalog } from '../../utils/checkout'
import { StepperDescription, StepperIndicator, StepperItem, StepperRoot, StepperSeparator, StepperTitle, StepperTrigger } from 'radix-vue'
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
  default: 1,
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


const steps_outro: CheckoutStep[] = [
  {
    name: 'kontakt',
    title: 'Kontaktangaben',
    completed: false,
    fields: {geburtsort: 'nicht erforderlich'}
  },  
  {
    name: 'checks',
    title: 'Buchung',
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
  if(activestep.value === allsteps.value.length) {
    alert('Anmeldung vorläufig nur per eMail möglich')
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

const stepProps = ref<CheckoutInfo>({
  title: 'Programm & Struktur',
  header: 'Programm & Struktur',
})


watch(() => activestep.value, (value) => {
  stepProps.value = allsteps.value[value - 1]
})

activestep.value = 1
// stepProps.value = allsteps.value[0]

const shortcodeTitle = (shortcode: String | undefined, title: String) => {
  if (!shortcode) return title
  return `_${shortcode.toUpperCase()}_ ${title}`
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
        :key="index"
        class="w-full flex justify-center gap-2 cursor-pointer group data-[disabled]:pointer-events-none relative px-4"
        :title="step.title"
      >
        <template #state>

        </template>
        <StepperTrigger aria-describedby="undefined" class="inline-flex items-center fill-neutral-400 group-data-[disabled]:fill-neutral-600 group-data-[state=completed]:fill-primary group-data-[state=active]:fill-primary-contrast justify-center rounded-full w-10 h-10 shrink-0 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none">
          <StepperIndicator :step="index" class="bg-neutral-200 group-data-[disabled]:bg-accent group-data-[state=completed]:bg-neutral-50 group-data-[state=active]:bg-primary">
            <SfIconViewList class="w-5 h-5" size="lg" v-if="index === 0" />
            <SfIconTune size="lg" v-else-if="index === 1" />
            <SfIconPerson size="lg" v-else-if="index === 2" />
            <SfIconShoppingCartCheckout size="lg" v-else-if="index === allsteps.length-1" />
            <!-- SfIconEmail size="lg" v-else-if="index === allsteps.length-1" / -->
            <SfIconInfo size="lg" v-else />
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
      <Column>
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
        <SectionContainer
          v-for="(item, index) in product.items"
          :background="index === 2 || index === 4 ? 'accent' : 'muted'"
          :key="index"
        >
          <Heading v-if="item.title" :content="item.shortcode ? shortcodeTitle(item.shortcode, item.title) : item.title" is="h3" />
          <columns gap="small">
            <column width="2/5" style="line-height: 1.62em">
              <p>{{ item.tag }}</p>
            </column>
            <column>
              <MdBlock v-if="item.ablauf" :content="item.ablauf" htag="h3" narrow style="margin-top: -0.3em" />
            </column>
          </columns>
        </SectionContainer>
      </Column>
      <Column class="checkout-card bg-neutral-50">
        <MdBlock v-if="stepProps.header" :content="stepProps.header" htag="h3" />
        <div v-if="stepProps.info">
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
        <div v-else>
          <CatBlock :content="stepProps.toString()" htag="h4" style="padding-bottom: 1rem" />
        </div>
        <MdBlock v-if="stepProps.footer" :content="stepProps.footer" htag="h4" /> 
        <div class="flex flex-row-reverse justify-between">
          <ButtonTmp class="cursor-pointer" @click="handle_completestep" id="button_completestep" style="margin-top: 3em">
            {{ activestep === allsteps.length ? 'Abschicken' : 'Weiter' }}
          </ButtonTmp>  
          <ButtonTmp is="a" v-if="activestep > 1" class="cursor-pointer" @click="handle_backwards" id="button_completestep" style="margin-top: 3em">
            <SfIconArrowBack size="lg" />
          </ButtonTmp>            
        </div> 
      </Column>
    </Columns>
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
</style>
