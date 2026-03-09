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
import { ref, onMounted, watch, nextTick, provide } from 'vue'
const route = useRoute()
const router = useRouter()

const activeTab = ref(0)
const tabTitles = ref<string[]>([])
const tabKeys = ref<string[]>([])
const tabContent = ref<HTMLDivElement | null>(null)

// Provide active tab key for child components (e.g., PageBottom/ConsultingDialog)
const activeTabKey = computed(() => tabKeys.value[activeTab.value] || '')
provide('activeTabKey', activeTabKey)

const slots = defineSlots<{
  default(): any
}>()

onMounted(() => {
  const children = [...(slots.default!()[0].children as any)]
  tabTitles.value = children.map((tab: any) => tab.props.title)
  // Extract tab keys from title (e.g., "M18W **München**" → "m18w")
  tabKeys.value = children.map((tab: any) => {
    const title = tab.props.title || ''
    const match = title.match(/^([A-Za-z0-9]+)/)
    return match ? match[1].toLowerCase() : ''
  })
  
  // Initialize from URL param ?tab=m18w
  const tabParam = route.query.tab as string | undefined
  if (tabParam) {
    const idx = tabKeys.value.findIndex(k => k === tabParam.toLowerCase())
    if (idx !== -1) {
      activeTab.value = idx
    }
  }
  
  // Always ensure URL has tab param (set default if missing)
  const currentKey = tabKeys.value[activeTab.value]
  if (currentKey && route.query.tab !== currentKey) {
    router.replace({ query: { ...route.query, tab: currentKey } })
  }
})

watch(activeTab, (newIdx) => {
  // Update display
  for (const [i, el] of [...tabContent.value!.children].entries()) {
    ;(el as HTMLElement).style.display = i === activeTab.value ? 'block' : 'none'
  }
  
  // Update URL param
  const key = tabKeys.value[newIdx]
  if (key) {
    router.replace({ query: { ...route.query, tab: key } })
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
