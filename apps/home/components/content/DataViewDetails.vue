<template>
  <div>
    <SectionContainer background="accent">
      <Heading is="h3" :content="heading ? heading : data.heading ? data.heading.toString() : default_heading" v-if="data.heading"></Heading>
    </SectionContainer>

    <SectionContainer background="muted">
      <h2 style="font-size: 1.5em"><b>Programm & Struktur</b>   >>   Kosten & Konditionen   >>   Kontaktangaben   >>   Anmelden</h2>
    </SectionContainer>
    
    <Tabs>
      <!-- TODO: need to get tab:propname if no tab.title is provided -->
      <Tab v-for="(tab, key, index) in data.details" :key="key" :active="index === 0" :title="tab.title">        
        <div v-if="tab.title==='Programm & Struktur' && data.items">
          
          <SectionContainer v-for="(item, index) in data.items" :key="index" :background="index===2||index===4 ? 'default' : 'accent'">
            <hr color="black">
            <Columns gap="small">
              <Column width="1/5" v-if="item.image">
                <img
                  :src="item.image.url"
                />
                <p>{{ item.tag }}</p>
              </Column>
              <Column>
                <Heading is="h3" :content="shortcodeTitle(item.shortcode, item.title)" v-if="item.title" />
                <Prose>
                  <div v-html="renderMdProp(item.body,'h3')" />
                </Prose>
              </Column>
            </Columns>
          </SectionContainer>
        </div>
      </Tab>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
/* This belongs to the DataView + DataViewTab component
- it should NOT be availabe in the component-spec
*/

/* Todo: 
- create simple stepper view based on file: /content/agenda/einstiege-ins-theaterspiel-m16e.md  
- take data it from yaml:items (view:details)
- product is a course > so the stepper creates list views and summaries, refererence-Implementation of the catalog-component here
*/

defineProps({
  /**
   * typically undefined (if defined it overwrites the heading-entry of the src)
   */
   heading: {
    type: String as PropType<'default' | 'muted' | 'accent'>,
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

</script>
