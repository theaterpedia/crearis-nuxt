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
 * Returns empty string for times that appear to be midnight UTC offsets (0-4 AM),
 * which typically indicate date-only values parsed as UTC midnight.
 * @example formatTime(new Date('2026-03-05T18:00')) // '18:00'
 * @example formatTime(new Date('2026-03-05')) // '' (midnight UTC = early AM local)
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const hours = d.getHours()
  const minutes = d.getMinutes()
  
  // Dates without explicit time are parsed as midnight UTC
  // In European timezones (UTC+1 to UTC+2), this shows as 1:00-2:00 AM
  // Treat early morning times (0-4 AM) with 0 minutes as "no time specified"
  if (hours >= 0 && hours <= 4 && minutes === 0) return ''
  
  return `${hours}:${String(minutes).padStart(2, '0')}`
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
  publish?: string // 'draft' = exclude from public listings
  image?: { src?: string; alt?: string }
  hero?: Record<string, unknown>
  ctype?: string // Must be 'event' to be included in event listings
  [key: string]: unknown
}

/**
 * Check if event is published (not draft)
 */
export function isPublished(event: EventContent): boolean {
  return event.publish !== 'draft'
}

/**
 * Check if content is a valid, published event
 * - Must have ctype: event
 * - Must not be draft (publish: draft)
 */
export function isValidEvent(event: EventContent): boolean {
  return (event.ctype === 'event' || (event as any).listAsEvent === true) && isPublished(event)
}

/**
 * Filter events to relevant date range
 * - Future events only (date_start >= today)
 * - Max 20 months into future
 * - Excludes invalid events (missing ctype or draft)
 */
export function filterEventsByDateRange(
  events: EventContent[],
  options: { now?: Date; maxMonths?: number; includeInvalid?: boolean } = {}
): EventContent[] {
  const { now = new Date(), maxMonths = 20, includeInvalid = false } = options
  
  // Start of today (midnight)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  // Max date: 20 months from now
  const maxDate = new Date(today)
  maxDate.setMonth(maxDate.getMonth() + maxMonths)
  
  return events.filter(event => {
    // Exclude invalid events (missing ctype or drafts) unless explicitly including
    if (!includeInvalid && !isValidEvent(event)) return false
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
 * Get the first upcoming valid event from a group (or first valid if all past)
 * Excludes drafts and events missing ctype: event
 */
export function getFirstUpcoming(events: EventContent[], now = new Date()): EventContent | undefined {
  const validEvents = events.filter(isValidEvent)
  const upcoming = validEvents.filter(e => {
    if (!e.date_start) return false
    return new Date(e.date_start) >= now
  })
  return upcoming[0] || validEvents[0]
}

/**
 * Get sibling events (same shortcode) for an event
 * Excludes drafts and events missing ctype: event
 */
export function getSiblingEvents(event: EventContent, allEvents: EventContent[]): EventContent[] {
  const shortcode = getShortcode(event.id)
  if (!shortcode) return []
  
  return allEvents
    .filter(e => isValidEvent(e) && getShortcode(e.id) === shortcode && e._path !== event._path)
    .sort((a, b) => {
      const dateA = a.date_start ? new Date(a.date_start).getTime() : 0
      const dateB = b.date_start ? new Date(b.date_start).getTime() : 0
      return dateA - dateB
    })
}

/**
 * Parse location from details.programm.info.location markdown format
 * 
 * Expected format:
 * ```
 * ### Veranstaltungsort
 * Tanzerei
 * 90763 Fürth, Kaiserstr. 177
 * (gut erreichbar per ÖPNV)
 * ```
 * 
 * Returns: { venue: 'Tanzerei', city: 'Fürth', plz: '90763', address: 'Kaiserstr. 177' }
 */
export interface ParsedLocation {
  venue?: string
  city?: string
  plz?: string
  address?: string
  isOnline: boolean
}

export function parseLocationInfo(locationMarkdown: string | undefined): ParsedLocation {
  if (!locationMarkdown) return { isOnline: false }
  
  const lines = locationMarkdown.split('\n').map(l => l.trim()).filter(Boolean)
  
  // Check for online
  const lowerContent = locationMarkdown.toLowerCase()
  if (lowerContent.includes('online') || lowerContent.includes('digital') || lowerContent.includes('teams') || lowerContent.includes('zoom')) {
    return { isOnline: true }
  }
  
  let venue: string | undefined
  let city: string | undefined
  let plz: string | undefined
  let address: string | undefined
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Skip headings
    if (line.startsWith('#')) continue
    
    // Skip parenthetical notes
    if (line.startsWith('(')) continue
    
    // Check for PLZ + City, Address pattern: "90763 Fürth, Kaiserstr. 177"
    const plzMatch = line.match(/^(\d{5})\s+([^,]+)(?:,\s*(.+))?$/)
    if (plzMatch) {
      plz = plzMatch[1]
      city = plzMatch[2].trim()
      address = plzMatch[3]?.trim()
      continue
    }
    
    // First non-heading, non-plz line is likely the venue
    if (!venue && !line.match(/^\d{5}/)) {
      venue = line
    }
  }
  
  return { venue, city, plz, address, isOnline: false }
}

/**
 * Get location info from event's details structure
 */
export function getEventLocation(event: EventContent): ParsedLocation {
  // Try details.programm.info.location first
  const details = event.details as Record<string, { info?: Record<string, string> }> | undefined
  if (details?.programm?.info?.location) {
    return parseLocationInfo(details.programm.info.location)
  }
  
  // Try other detail steps
  if (details) {
    for (const step of Object.values(details)) {
      if (step?.info?.location) {
        return parseLocationInfo(step.info.location)
      }
    }
  }
  
  // Fallback to tag field for online detection
  if (event.tag?.toLowerCase().includes('online')) {
    return { isOnline: true }
  }
  
  return { isOnline: false }
}

/**
 * Format location for display
 * Returns: "Tanzerei, Fürth" or "Online"
 */
export function formatLocation(location: ParsedLocation): string {
  if (location.isOnline) return 'Online'
  
  const parts: string[] = []
  if (location.venue) parts.push(location.venue)
  if (location.city) parts.push(location.city)
  
  return parts.join(', ') || ''
}

/**
 * Generate full sibling line for Catalog component
 * Format: "**15.5 18:00-17.5 15:00** Tanzerei, Fürth"
 * 
 * @returns Object with date part and location part for flexible rendering
 */
export function generateSiblingLine(event: EventContent): { dateRange: string; location: string; full: string } {
  const start = event.date_start ? new Date(event.date_start) : null
  const end = event.date_end ? new Date(event.date_end) : null
  
  if (!start) {
    return { dateRange: '', location: '', full: '' }
  }
  
  // Format date range
  const startDay = start.getDate()
  const startMonth = start.getMonth() + 1
  const startTime = formatTime(start)
  
  let dateRange: string
  if (end && !isSameDay(start, end)) {
    // Multi-day: "1.5 19:00-3.5 15:00"
    const endDay = end.getDate()
    const endMonth = end.getMonth() + 1
    const endTime = formatTime(end)
    
    if (startMonth === endMonth) {
      dateRange = `${startDay}.${startMonth}${startTime ? ' ' + startTime : ''}-${endDay}.${endMonth}${endTime ? ' ' + endTime : ''}`
    } else {
      dateRange = `${startDay}.${startMonth}${startTime ? ' ' + startTime : ''}-${endDay}.${endMonth}${endTime ? ' ' + endTime : ''}`
    }
  } else {
    // Single day: "15.5 18:00"
    dateRange = `${startDay}.${startMonth}${startTime ? ' ' + startTime : ''}`
    if (end) {
      const endTime = formatTime(end)
      if (endTime && endTime !== startTime) {
        dateRange += `-${endTime}`
      }
    }
  }
  
  // Get location
  const parsedLocation = getEventLocation(event)
  const location = formatLocation(parsedLocation)
  
  // Generate full line for Catalog: "- **dateRange** location"
  const full = location 
    ? `- **${dateRange}** ${location}`
    : `- **${dateRange}**`
  
  return { dateRange, location, full }
}
