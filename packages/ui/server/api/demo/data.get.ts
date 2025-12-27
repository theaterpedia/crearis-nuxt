import db from '../../database/db'

export default defineEventHandler(() => {
  try {
    // Get all events
    const events = db.prepare('SELECT * FROM events').all()
    
    // Get all posts
    const posts = db.prepare('SELECT * FROM posts').all()
    
    // Get all locations
    const locations = db.prepare('SELECT * FROM locations').all()
    
    // Get all instructors
    const instructors = db.prepare('SELECT * FROM instructors').all()
    
    // Get all participants
    const participants = db.prepare('SELECT * FROM participants').all()
    
    // Get hero overrides
    const heroOverrides = db.prepare('SELECT * FROM hero_overrides').all()

    return {
      events,
      posts,
      locations,
      instructors,
      participants,
      heroOverrides
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch data'
    })
  }
})
