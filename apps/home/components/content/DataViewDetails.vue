<template>
  <div>
    <SectionContainer background="accent">
      <Heading
        v-if="product.heading"
        :content="heading ? heading : product.heading ? product.heading.toString() : default_heading"
        is="h3"
      ></Heading>
    </SectionContainer>

    <Tabs style="margin-top: 1.5em">
      <Tab
        v-for="(tab, key, index) in product.details"
        :active="index === 0"
        :key="key"
        :title="tab.title ? tab.title : key"
      >
        <Columns gap="medium">
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
              <Heading v-if="item.title" :content="shortcodeTitle(item.shortcode, item.title)" is="h3" />
              <columns gap="small">
                <column width="2/5" style="line-height: 1.62em">
                  <p>{{ item.tag }}</p>
                </column>
                <column>
                  <MdBlock :content="item.ablauf" htag="h3" narrow style="margin-top: -0.3em" />
                </column>
              </columns>
            </SectionContainer>
          </Column>
          <Column class="checkout-card">
            <template v-if="tab.title==='Programm & Struktur' || tab.title==='Kosten & Konditionen'">
              <Heading v-if="tab.header" :content="tab.header" is="h3" />
              <div v-if="tab.info">
                <template v-for="(column, index) in tab.info" :key="index">
                  <CatBlock :content="column" htag="h4" style="padding-bottom:1rem" />
                </template>
              </div>
            </template>
            <template v-else>
              <h2>
                Checkout-Step '{{  tab.title }}' noch nicht implementiert!!
              </h2>
            </template>
          </Column>
        </Columns>
      </Tab>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import { Hero } from '#components'
/* This belongs to the DataView + DataViewTab component
- it should NOT be availabe in the component-spec
*/

/* Todo: 
- create simple stepper view based on file: /content/agenda/einstiege-ins-theaterspiel-m16e.md  
- take data it from yaml:items (view:details)
- product is a course > so the stepper creates list views and summaries, refererence-Implementation of the catalog-component here
*/

const props = defineProps({
  /**
   * typically undefined (if defined it overwrites the heading-entry of the src)
   */
  heading: {
    type: String as PropType<'default' | 'muted' | 'accent'>,
  },
  /**
   *
   */
  product: {
    type: Object as PropType<Record<string, unknown>>,
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

const shortcodeTitle = (shortcode: string | undefined, title: string) => {
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
