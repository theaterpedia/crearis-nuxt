<template>
  <div>
    <SectionContainer background="accent">
      <Heading
        v-if="product.heading"
        :content="heading ? heading : product.heading ? product.heading.toString() : 'Details'"
        is="h3"
      ></Heading>
    </SectionContainer>

    <StepperRoot v-model="step" style="margin-top: 1.5em" :default-value="1" class="flex gap-2 w-full">
      <StepperItem
        v-for="(step, index) in allsteps"
        :step="index + 1"
        :key="index"
        class="w-full flex justify-center gap-2 cursor-pointer group data-[disabled]:pointer-events-none relative px-4"
        :title="step.title"
      >
        <StepperTrigger class="flex items-center gap-2">
          <StepperIndicator :step="index" />
          <StepperTitle :title="step.title" />
          <StepperSeparator v-if="index < allsteps.length"
            class="absolute block top-5 left-[calc(50%+30px)] right-[calc(-50%+20px)] h-0.5 rounded-full group-data-[disabled]:bg-gray-300 bg-gray-300 group-data-[state=completed]:bg-white bg-primary shrink-0"
          />
          <StepperDescription v-if="step.info.description" :description="step.info.description" />
        </StepperTrigger>
      </StepperItem>
    </StepperRoot>        
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
      <Column class="checkout-card">
        <Heading v-if="stepProps.header" :content="stepProps.header" is="h3" />
        <div v-if="stepProps.info">
          <template v-for="(column, index) in stepProps.info" :key="index">
            <CatBlock :content="column" htag="h4" style="padding-bottom: 1rem" />
          </template>
        </div>
        <div v-else-if="stepProps.catalog">
          <Catalog :catalog="stepProps.catalog" />
        </div>
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
      </Column>
    </Columns>
  </div>
</template>

<script lang="ts" setup>
import { Hero } from '#components'
import { ref } from 'vue'
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


const step = defineModel({
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
    title: 'abschicken',
    info: 
      {
        title: 'Abschicken',
        description: 'Anmeldung vorläufig nur per eMail möglich'
      },
  },
]

// map all steps from product.details to an array of steps
// map every step-index to the new prop stepname


// map every step-index to the new prop stepname, every step-content to the new prop stepcontent
const product_steps = props.product.details ? Object.entries(props.product.details).map(([key, value]) => {
  return {
    title: key,
    info: value,
  }
}) : []


//  ? props.product.details.concat(steps_outro) : steps_outro
const allsteps = ref<CheckoutStep[]>(product_steps.concat(steps_outro))


const stepProps = ref<CheckoutInfo>({
  title: 'Programm & Struktur',
  header: 'Programm & Struktur',
})

watch(() => step.value, (value) => {
  console.log('step', value - 1)
  console.log('step', allsteps.value[value - 1])
  stepProps.value = allsteps.value[value - 1].info
})

step.value = 1

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

<style scoped>
.checkout-card {
  margin-top: 3rem;
  padding: 1rem;
  box-shadow:
    0px 4px 6px 1px rgba(0, 0, 0, 0.1),
    0px 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
