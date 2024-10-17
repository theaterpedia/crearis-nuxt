<template>
  <ContentRenderer :value="data">
    <Heading
      v-if="data.heading"
      :content="heading ? heading : data.heading ? data.heading.toString() : default_heading"
      is="h3"
    ></Heading>
    <br />
    <MdBlock v-if="data.product?.header" :content="data.product?.header" htag="h2" />
    <Slider>
      <Slide v-for="(item, index) in data.items">
        <Columns gap="small">
          <Column v-if="item.image" width="1/5">
            <img :src="item.image.url" />
            <p>{{ item.tag }}</p>
          </Column>
          <Column>
            <Heading v-if="item.title" :content="shortcodeTitle(item.shortcode, item.title)" is="h3" />
            <Prose>
              <div v-html="renderMdProp(item.body, 'h3')" />
            </Prose>
          </Column>
        </Columns>
      </Slide>
    </Slider>

    <ButtonTmp :to="{ path: '/details', props: src, query: { src: `/${src}` } }" id="cta" style="margin-top: 3em">
      Anmeldung und Konditionen
    </ButtonTmp>
  </ContentRenderer>
</template>

<script lang="ts" setup>
import { renderMdProp } from '~/utils/md-renderer'
import MainMenuItem from '../../../../packages/ui/dist/components/MainMenuItem.vue'
/* This belongs to the DataView + DataViewTab component
- it should NOT be availabe in the component-spec
*/

/* Todo: 
- create simple product view based on file: /content/agenda/einstiege-ins-theaterspiel-m16e.md  
- take data in from yaml:items (view:product)
- product is a course > so the product view should be a course view > we take the slider>slides for now
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
   *
   * @default 'default'
   */
  type: {
    type: String as PropType<'yaml' | 'md' | 'all'>,
    default: 'yaml',
  },
  /**
   *
   */
  data: {
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
const default_heading = '## Default Heading'
</script>
