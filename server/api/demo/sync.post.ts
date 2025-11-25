import db, { initDatabase } from '../../database/db'
import { readFileSync } from 'fs'
import { join } from 'path'

// Read CSV files using filesystem
const csvPath = join(process.cwd(), 'packages/ui/src/assets/csv')
const eventsCSV = readFileSync(join(csvPath, 'events.csv'), 'utf-8')
const postsCSV = readFileSync(join(csvPath, 'posts.csv'), 'utf-8')
const locationsCSV = readFileSync(join(csvPath, 'locations.csv'), 'utf-8')
const instructorsCSV = readFileSync(join(csvPath, 'instructors.csv'), 'utf-8')
const childrenCSV = readFileSync(join(csvPath, 'children.csv'), 'utf-8')
const teensCSV = readFileSync(join(csvPath, 'teens.csv'), 'utf-8')
const adultsCSV = readFileSync(join(csvPath, 'adults.csv'), 'utf-8')

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

export default defineEventHandler(async () => {
  try {
    // Reinitialize database (clears existing data)
    initDatabase()

    // Parse CSV data
    const events = parseCSV(eventsCSV)
    const posts = parseCSV(postsCSV)
    const locations = parseCSV(locationsCSV)
    const instructors = parseCSV(instructorsCSV)
    const children = parseCSV(childrenCSV)
    const teens = parseCSV(teensCSV)
    const adults = parseCSV(adultsCSV)

    // Insert events
    const eventStmt = db.prepare(`
      INSERT OR REPLACE INTO events 
      (id, name, date_begin, date_end, address_id, user_id, seats_max, cimg, header_type, rectitle, teaser)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    for (const event of events) {
      eventStmt.run(
        event.id,
        event.name,
        event.date_begin,
        event.date_end,
        event['address_id/id'] || event.address_id,
        event['user_id/id'] || event.user_id,
        event.seats_max || 0,
        event.cimg,
        event.header_type,
        event.rectitle,
        event.teaser
      )
    }

    // Insert posts
    const postStmt = db.prepare(`
      INSERT OR REPLACE INTO posts 
      (id, name, subtitle, teaser, author_id, blog_id, tag_ids, website_published, is_published, post_date, cover_properties, event_id, cimg)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    for (const post of posts) {
      postStmt.run(
        post.id,
        post.name,
        post.subtitle,
        post.teaser,
        post['author_id/id'] || post.author_id,
        post['blog_id/id'] || post.blog_id,
        post['tag_ids/id'] || post.tag_ids,
        post.website_published,
        post.is_published,
        post.post_date,
        post.cover_properties,
        post['event_id/id'] || post.event_id,
        post.cimg
      )
    }

    // Insert locations
    const locationStmt = db.prepare(`
      INSERT OR REPLACE INTO locations 
      (id, name, phone, email, city, zip, street, country_id, is_company, category_id, cimg, header_type, header_size, md, is_location_provider, event_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    for (const location of locations) {
      locationStmt.run(
        location.id,
        location.name,
        location.phone,
        location.email,
        location.city,
        location.zip,
        location.street,
        location['country_id/id'] || location.country_id,
        location.is_company,
        location['category_id/id'] || location.category_id,
        location.cimg,
        location.header_type,
        location.header_size,
        location.md,
        location.is_location_provider,
        location.event_id
      )
    }

    // Insert instructors
    const instructorStmt = db.prepare(`
      INSERT OR REPLACE INTO instructors 
      (id, name, email, phone, city, country_id, cimg, description, event_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    for (const instructor of instructors) {
      instructorStmt.run(
        instructor.id,
        instructor.name,
        instructor.email,
        instructor.phone,
        instructor.city,
        instructor['country_id/id'] || instructor.country_id,
        instructor.cimg,
        instructor.description,
        instructor['event_id/id'] || instructor.event_id
      )
    }

    // Insert participants
    const participantStmt = db.prepare(`
      INSERT OR REPLACE INTO participants 
      (id, name, age, city, country_id, cimg, description, event_id, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    for (const child of children) {
      participantStmt.run(
        child.id,
        child.name,
        parseInt(child.age) || 0,
        child.city,
        child['country_id/id'] || child.country_id,
        child.cimg,
        child.description,
        child['event_id/id'] || child.event_id,
        'child'
      )
    }
    
    for (const teen of teens) {
      participantStmt.run(
        teen.id,
        teen.name,
        parseInt(teen.age) || 0,
        teen.city,
        teen['country_id/id'] || teen.country_id,
        teen.cimg,
        teen.description,
        teen['event_id/id'] || teen.event_id,
        'teen'
      )
    }
    
    for (const adult of adults) {
      participantStmt.run(
        adult.id,
        adult.name,
        parseInt(adult.age) || 0,
        adult.city,
        adult['country_id/id'] || adult.country_id,
        adult.cimg,
        adult.description,
        adult['event_id/id'] || adult.event_id,
        'adult'
      )
    }

    return { 
      success: true,
      message: 'Database synchronized from CSV files',
      counts: {
        events: events.length,
        posts: posts.length,
        locations: locations.length,
        instructors: instructors.length,
        participants: children.length + teens.length + adults.length
      }
    }
  } catch (error) {
    console.error('Error syncing database:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to sync database'
    })
  }
})
