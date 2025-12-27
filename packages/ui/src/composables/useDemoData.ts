import { ref, computed, watch } from 'vue'

// CSV data import simulation - in real app this would come via GraphQL
import eventsCSV from '../assets/csv/events.csv?raw'
import postsCSV from '../assets/csv/posts.csv?raw'
import locationsCSV from '../assets/csv/locations.csv?raw'
import instructorsCSV from '../assets/csv/instructors.csv?raw'
import childrenCSV from '../assets/csv/children.csv?raw'
import teensCSV from '../assets/csv/teens.csv?raw'
import adultsCSV from '../assets/csv/adults.csv?raw'

interface Event {
  id: string
  name: string
  date_begin: string
  date_end: string
  address_id: string
  user_id: string
  seats_max: number
  cimg: string
  header_type: string
  rectitle: string
  teaser: string
}

interface Post {
  id: string
  name: string
  subtitle: string
  teaser: string
  'author_id/id': string
  'event_id/id': string
  cimg: string
  post_date: string
}

interface Location {
  id: string
  name: string
  phone: string
  email: string
  city: string
  zip: string
  street: string
  cimg: string
  md: string
  event_id: string
}

interface Instructor {
  id: string
  name: string
  email: string
  phone: string
  city: string
  cimg: string
  description: string
  'event_id/id': string
}

interface Participant {
  id: string
  name: string
  age: number
  city: string
  cimg: string
  description: string
  'event_id/id': string
}

function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.replace(/"/g, ''))
  
  return lines.slice(1).map(line => {
    const values: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"' && (i === 0 || line[i-1] === ',')) {
        inQuotes = true
      } else if (char === '"' && (i === line.length - 1 || line[i+1] === ',')) {
        inQuotes = false
      } else if (char === ',' && !inQuotes) {
        values.push(current)
        current = ''
      } else if (!(char === '"' && (i === 0 || line[i-1] === ',' || i === line.length - 1 || line[i+1] === ','))) {
        current += char
      }
    }
    values.push(current)
    
    const obj: any = {}
    headers.forEach((header, index) => {
      obj[header] = values[index] || ''
    })
    return obj
  })
}

export const useDemoData = () => {
  const currentEventId = ref('_demo.event_forum_theater_schwabing')
  const dataSource = ref<'csv' | 'sql'>('csv')
  const sqlData = ref<any>(null)
  
  // Fetch SQL data when source is SQL
  const fetchSqlData = async () => {
    try {
      const response = await fetch('/api/demo/data')
      sqlData.value = await response.json()
    } catch (error) {
      console.error('Failed to fetch SQL data:', error)
    }
  }
  
  // Watch data source and fetch SQL data if needed
  watch(dataSource, async (newSource) => {
    if (newSource === 'sql' && !sqlData.value) {
      await fetchSqlData()
    }
  })
  
  // Parse CSV or return SQL data
  const events = computed(() => {
    if (dataSource.value === 'sql' && sqlData.value) {
      return sqlData.value.events as Event[]
    }
    return parseCSV(eventsCSV) as Event[]
  })
  
  const posts = computed(() => {
    if (dataSource.value === 'sql' && sqlData.value) {
      return sqlData.value.posts.map((p: any) => ({
        ...p,
        'author_id/id': p.author_id,
        'event_id/id': p.event_id
      })) as Post[]
    }
    return parseCSV(postsCSV) as Post[]
  })
  
  const locations = computed(() => {
    if (dataSource.value === 'sql' && sqlData.value) {
      return sqlData.value.locations as Location[]
    }
    return parseCSV(locationsCSV) as Location[]
  })
  
  const instructors = computed(() => {
    if (dataSource.value === 'sql' && sqlData.value) {
      return sqlData.value.instructors.map((i: any) => ({
        ...i,
        'event_id/id': i.event_id
      })) as Instructor[]
    }
    return parseCSV(instructorsCSV) as Instructor[]
  })
  
  const children = computed(() => {
    if (dataSource.value === 'sql' && sqlData.value) {
      return sqlData.value.participants
        .filter((p: any) => p.type === 'child')
        .map((p: any) => ({
          ...p,
          'event_id/id': p.event_id
        })) as Participant[]
    }
    return parseCSV(childrenCSV) as Participant[]
  })
  
  const teens = computed(() => {
    if (dataSource.value === 'sql' && sqlData.value) {
      return sqlData.value.participants
        .filter((p: any) => p.type === 'teen')
        .map((p: any) => ({
          ...p,
          'event_id/id': p.event_id
        })) as Participant[]
    }
    return parseCSV(teensCSV) as Participant[]
  })
  
  const adults = computed(() => {
    if (dataSource.value === 'sql' && sqlData.value) {
      return sqlData.value.participants
        .filter((p: any) => p.type === 'adult')
        .map((p: any) => ({
          ...p,
          'event_id/id': p.event_id
        })) as Participant[]
    }
    return parseCSV(adultsCSV) as Participant[]
  })
  
  // Get current event
  const currentEvent = computed(() => 
    events.value.find(event => event.id === currentEventId.value)
  )
  
  // Helper function to check if an item's event_id field contains the current event
  const hasEvent = (eventIdField: string, targetEventId: string): boolean => {
    if (!eventIdField) return false
    // Split by comma and trim whitespace, then check if any matches
    const eventIds = eventIdField.split(',').map(id => id.trim())
    return eventIds.includes(targetEventId)
  }

  // Get data related to current event
  const currentEventPosts = computed(() => 
    posts.value.filter(post => hasEvent(post['event_id/id'], currentEventId.value)).slice(0, 4)
  )
  
  const currentEventLocations = computed(() => 
    locations.value.filter(location => hasEvent(location.event_id, currentEventId.value)).slice(0, 3)
  )
  
  const currentEventInstructors = computed(() => 
    instructors.value.filter(instructor => hasEvent(instructor['event_id/id'], currentEventId.value)).slice(0, 3)
  )
  
  const currentEventChildren = computed(() => 
    children.value.filter(child => hasEvent(child['event_id/id'], currentEventId.value)).slice(0, 4)
  )
  
  const currentEventTeens = computed(() => 
    teens.value.filter(teen => hasEvent(teen['event_id/id'], currentEventId.value)).slice(0, 4)
  )
  
  const currentEventAdults = computed(() => 
    adults.value.filter(adult => hasEvent(adult['event_id/id'], currentEventId.value)).slice(0, 4)
  )
  
  const switchEvent = (eventId: string) => {
    currentEventId.value = eventId
  }
  
  return {
    // Data
    events,
    currentEvent,
    currentEventPosts,
    currentEventLocations,
    currentEventInstructors,
    currentEventChildren,
    currentEventTeens,
    currentEventAdults,
    
    // Actions
    switchEvent,
    refreshSqlData: fetchSqlData,
    
    // State
    currentEventId,
    dataSource
  }
}