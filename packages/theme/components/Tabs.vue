<template>
  <div>
    <div class="tab-headers">
      <ul>
        <li v-for="(tabTitle, i) in tabTitles" @click="activeTab = i" :class="activeTab === i ? 'active' : ''">
          <Heading :content="tabTitle" is="span" />
        </li>
      </ul>
    </div>

    <div ref="tabContent" class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick } from 'vue'
const activeTab = ref(0)
const tabTitles = ref<string[]>([])
const tabContent = ref<HTMLDivElement | null>(null)

const slots = defineSlots<{
  default(): any
}>()

onMounted(() => {
  watch(slots.default()[0].children, () => {
    if (!slots.default()[0].children) return
    debugger
    tabTitles.value = [...(slots.default!()[0].children as any)].map((tab: any) => tab.props.title)
  })
  // console.log(slots.default!()[0].children)
  // tabTitles.value = [...(slots.default!()[0].children as any)].map((tab: any) => tab.props.title)
})

watch(activeTab, () => {
  for (const [i, el] of [...tabContent.value!.children].entries()) {
    ;(el as HTMLElement).style.display = i === activeTab.value ? 'block' : 'none'
  }
})
</script>

<style>
.tab-headers ul {
  margin: 0;
  padding: 0;
  display: flex;
  min-height: 3.25rem;
  border-bottom: 2px solid #ddd;
}

.tab-headers ul li {
  list-style: none;
  padding: 1rem 1.25rem;
  position: relative;
  cursor: pointer;
}

.tab-headers ul li.active {
  color: #008438;
  font-weight: bold;
}

.tab-headers ul li.active:after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 2px;
  width: 100%;
  background: #008438;
}

.tab-content,
.tab-headers {
  width: 100%;
}

.tab-content {
  padding: 0.75rem;
}

.tab-content > :not(:first-child) {
  display: none;
}
</style>
