/**
 * Utilities for handling repeating events
 * 
 * Events are grouped by "shortcode" - the first part of their id before underscore.
 * Example: id "aa_1583" → shortcode "aa"
 * 
 * Tag-extract formatting:
 * - Online single-day: "16.9 18:00"
 * - City single-day: "NÜ 16.9 18:00" 
 * - City multi-day: "NÜ 27.2-1.3"
 */

/**
 * Extract shortcode from event id
 * @example getShortcode('aa_1583') // 'aa'
 * @example getShortcode('t0_50') // 't0'
 */
export function getShortcode(id: string | undefined): string | undefined {
  if (!id) return undefined
  const match = id.match(/^([a-z0-9]+)_/)
  return match?.[1]
}

/**
 * City abbreviation mapping
 */
const CITY_ABBREV: Record<string, string> = {
  'münchen': 'M',
  'munich': 'M',
  'nürnberg': 'NÜ',
  'nuremberg': 'NÜ',
  'fürth': 'NÜ', // Treat Fürth as Nürnberg region
  'online': '',
}

/**
 * Extract city from location string
 * @example extractCity('Kaiserstr. 175 (Tanzerei)\n90763 Fürth') // 'NÜ'
 * @example extractCity('online (MS Teams)') // ''
 */
export function extractCity(location: string | undefined, tag: string | undefined): string {
  // First check the tag field for common patterns
  if (tag) {
    const tagLower = tag.toLowerCase()
    if (tagLower === 'online' || tagLower.includes('online')) return ''
    for (const [city, abbrev] of Object.entries(CITY_ABBREV)) {
      if (tagLower.includes(city)) return abbrev
    }
  }
  
  // Then check location
  if (location) {
    const locLower = location.toLowerCase()
    for (const [city, abbrev] of Object.entries(CITY_ABBREV)) {
      if (locLower.includes(city)) return abbrev
    }
    // Check postal codes (90xxx = Nürnberg/Fürth region, 80xxx = München)
    if (/\b90\d{3}\b/.test(location)) return 'NÜ'
    if (/\b80\d{3}\b|\b81\d{3}\b/.test(location)) return 'M'
  }
  
  return ''
}

/**
 * Format date as compact string
 * @example formatDateCompact(new Date('2026-03-05')) // '5.3'
 * @example formatDateCompact(new Date('2026-03-05'), new Date('2026-03-07')) // '5.-7.3'
 */
export function formatDateCompact(dateStart: Date | string, dateEnd?: Date | string | null): string {
  const start = typeof dateStart === 'string' ? new Date(dateStart) : dateStart
  const end = dateEnd ? (typeof dateEnd === 'string' ? new Date(dateEnd) : dateEnd) : null
  
  const startDay = start.getDate()
  const startMonth = start.getMonth() + 1
  
  if (!end || isSameDay(start, end)) {
    return `${startDay}.${startMonth}`
  }
  
  const endDay = end.getDate()
  const endMonth = end.getMonth() + 1
  
  if (startMonth === endMonth) {
    return `${startDay}.-${endDay}.${startMonth}`
  }
  
  // Different months
  return `${startDay}.${startMonth}-${endDay}.${endMonth}`
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate()
}

/**
 * Format time as HH:MM
 * @example formatTime(new Date('2026-03-05T18:00')) // '18:00'
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  // Check if time is actually set (not midnight)
  if (d.getHours() === 0 && d.getMinutes() === 0) return ''
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

/**
 * Generate tag-extract for event card chip
 * 
 * Rules:
 * 1. Online single-day: "16.9 18:00"
 * 2. City single-day: "NÜ 16.9 18:00"
 * 3. City multi-day: "NÜ 27.2-1.3"
 */
export function generateTagExtract(event: {
  date_start?: string | Date
  date_end?: string | Date
  end?: string | Date // alternative field name
  location?: string
  tag?: string
}): string {
  const dateStart = event.date_start
  const dateEnd = event.date_end || event.end
  
  if (!dateStart) return ''
  
  const city = extractCity(event.location, event.tag)
  const dateStr = formatDateCompact(dateStart, dateEnd)
  
  // Check if single day (for time display)
  const start = typeof dateStart === 'string' ? new Date(dateStart) : dateStart
  const end = dateEnd ? (typeof dateEnd === 'string' ? new Date(dateEnd) : dateEnd) : null
  const isSingleDay = !end || isSameDay(start, end)
  
  // For single-day events with time, show time
  const timeStr = isSingleDay ? formatTime(start) : ''
  
  const parts = [city, dateStr, timeStr].filter(Boolean)
  return parts.join(' ')
}

export interface EventContent {
  _path?: string
  id?: string
  title?: string
  heading?: string
  date_start?: string
  date_end?: string
  end?: string
  location?: string
  tag?: string
  image?: { src?: string; alt?: string }
  hero?: Record<string, unknown>
  [key: string]: unknown
}

/**
 * Filter events to relevant date range
 * - Future events only (date_start >= today)
 * - Max 20 months into future
 */
export function filterEventsByDateRange(
  events: EventContent[],
  options: { now?: Date; maxMonths?: number } = {}
): EventContent[] {
  const { now = new Date(), maxMonths = 20 } = options
  
  // Start of today (midnight)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  // Max date: 20 months from now
  const maxDate = new Date(today)
  maxDate.setMonth(maxDate.getMonth() + maxMonths)
  
  return events.filter(event => {
    if (!event.date_start) return false
    const eventDate = new Date(event.date_start)
    return eventDate >= today && eventDate <= maxDate
  })
}

/**
 * Group events by shortcode
 * Returns map of shortcode → array of events
 */
export function groupEventsByShortcode(events: EventContent[]): Map<string, EventContent[]> {
  const groups = new Map<string, EventContent[]>()
  
  for (const event of events) {
    const shortcode = getShortcode(event.id)
    if (!shortcode) {
      // Events without shortcode go in their own "group" of 1
      groups.set(event._path || event.id || Math.random().toString(), [event])
      continue
    }
    
    const existing = groups.get(shortcode) || []
    existing.push(event)
    groups.set(shortcode, existing)
  }
  
  // Sort events within each group by date
  for (const [shortcode, eventList] of groups) {
    eventList.sort((a, b) => {
      const dateA = a.date_start ? new Date(a.date_start).getTime() : 0
      const dateB = b.date_start ? new Date(b.date_start).getTime() : 0
      return dateA - dateB
    })
  }
  
  return groups
}

/**
 * Get the first upcoming event from a group (or first if all past)
 */
export function getFirstUpcoming(events: EventContent[], now = new Date()): EventContent | undefined {
  const upcoming = events.filter(e => {
    if (!e.date_start) return false
    return new Date(e.date_start) >= now
  })
  return upcoming[0] || events[0]
}

/**
 * Get sibling events (same shortcode) for an event
 */
export function getSiblingEvents(event: EventContent, allEvents: EventContent[]): EventContent[] {
  const shortcode = getShortcode(event.id)
  if (!shortcode) return []
  
  return allEvents
    .filter(e => getShortcode(e.id) === shortcode && e._path !== event._path)
    .sort((a, b) => {
      const dateA = a.date_start ? new Date(a.date_start).getTime() : 0
      const dateB = b.date_start ? new Date(b.date_start).getTime() : 0
      return dateA - dateB
    })
}
