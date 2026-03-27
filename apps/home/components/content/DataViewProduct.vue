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
        <!-- slide_2cols: Two-column layout with vertical separator -->
        <div v-if="item.ctype === 'slide_2cols'" class="slide-2cols">
          <Heading v-if="item.title" :content="item.title" is="h2" class="slide-2cols-title" />
          <div class="slide-2cols-content">
            <div class="slide-2cols-left">
              <Prose>
                <div v-html="renderMdProp(getSlide2ColsLeft(item.body), 'h4')" />
              </Prose>
            </div>
            <div class="slide-2cols-divider"></div>
            <div class="slide-2cols-right">
              <Prose>
                <div v-html="renderMdProp(getSlide2ColsRight(item.body), 'h4')" />
              </Prose>
              <div v-if="getSlide2ColsFooter(item.body)" class="slide-2cols-footer">
                <Prose>
                  <div v-html="renderMdProp(getSlide2ColsFooter(item.body), 'h4')" />
                </Prose>
              </div>
            </div>
          </div>
        </div>
        <!-- Default slide layout -->
        <Columns v-else gap="small">
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

// slide_2cols helpers: split body by '---' delimiter
const getSlide2ColsLeft = (body: string) => {
  if (!body) return ''
  const parts = body.split(/^---$/m)
  return parts[0]?.trim() || ''
}

const getSlide2ColsRight = (body: string) => {
  if (!body) return ''
  const parts = body.split(/^---$/m)
  return parts[1]?.trim() || ''
}

const getSlide2ColsFooter = (body: string) => {
  if (!body) return ''
  const parts = body.split(/^---$/m)
  return parts[2]?.trim() || ''
}
</script>

<style scoped>
/* slide_2cols: Two-column bordered layout */
.slide-2cols {
  border: 2px solid var(--color-contrast, currentColor);
  padding: 1.5rem;
}

.slide-2cols-title {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-contrast, currentColor);
}

.slide-2cols-content {
  display: flex;
  gap: 1.5rem;
}

.slide-2cols-left,
.slide-2cols-right {
  flex: 1;
}

.slide-2cols-divider {
  width: 2px;
  background-color: var(--color-contrast, currentColor);
  flex-shrink: 0;
}

.slide-2cols-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid var(--color-contrast, currentColor);
}

@media (max-width: 768px) {
  .slide-2cols-content {
    flex-direction: column;
  }
  
  .slide-2cols-divider {
    width: 100%;
    height: 2px;
  }
}
</style>
