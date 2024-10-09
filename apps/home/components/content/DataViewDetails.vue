<template>
  <div>
    <SectionContainer background="accent">
      <Heading
        v-if="product.heading"
        :content="heading ? heading : product.heading ? product.heading.toString() : default_heading"
        is="h3"
      ></Heading>
    </SectionContainer>

    <Tabs style="margin-top:1.5em">
      <Tab
        v-for="(tab, key, index) in product.details"
        :active="index === 0"
        :key="key"
        :title="tab.title ? tab.title : key"
      >
        <Columns gap="medium">
          <Column>
            <ContentQuery :path="product.meta_product ? getRootPath(product.root) : src" find="one" v-slot="{ data }">
              <ContentRenderer :value="data">
                <Hero contentType="banner" target="card" :contentType="data.hero.content ? data.hero.content : 'text'" :imgTmp="data.image.src" :contentAlignY="data.hero.content_y" :contentWidth="data.hero.content_width"  :heightTmp="data.hero.height" :imgTmpAlignX="data.hero.image_focus_x" :imgTmpAlignY="data.hero.image_focus_y" v-if="data.hero">
                  <Banner card transparent>
                    <Heading is="h3" :content="data.heading ? data.heading : data.title" v-if="data.heading || data.title"></Heading>
                    <br v-if="(data.heading || data.page.title) && data.teaser"/>
                    <MdBlock :htag="data.heading ? 'h3' : 'h1'" :content="data.teaser" v-if="data.teaser"/>
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
                <column width="2/5" style="line-height:1.62em">
                  <p>{{ item.tag }}</p>               
                </column>
                <column>
                  <MdBlock style="margin-top:-0.3em" narrow htag="h3" :content="item.ablauf"/>
                </column>
              </columns>
            </SectionContainer>
          </Column>
          <Column class="checkout-card">
            <h2>Checkout</h2>
          </Column>        
        </Columns>
      </Tab>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import { Hero } from '#components';
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
  box-shadow: 0px 4px 6px 1px rgba(0, 0, 0, 0.10), 0px 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>