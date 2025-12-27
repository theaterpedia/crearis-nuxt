import db from '../../database/db'

export default defineEventHandler(async (event) => {
  const { id, cimg, heading, description, event_ids } = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required'
    })
  }

  try {
    // Check if this is an event update or hero override
    const isEvent = id.startsWith('_demo.event_')

    if (isEvent) {
      // Update event
      const stmt = db.prepare(`
        UPDATE events 
        SET cimg = ?, rectitle = ?, teaser = ?
        WHERE id = ?
      `)
      stmt.run(cimg, heading, description, id)
    } else {
      // Insert or update hero override
      const stmt = db.prepare(`
        INSERT INTO hero_overrides (id, cimg, heading, description, event_ids, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          cimg = excluded.cimg,
          heading = excluded.heading,
          description = excluded.description,
          event_ids = excluded.event_ids,
          updated_at = CURRENT_TIMESTAMP
      `)
      stmt.run(id, cimg, heading, description, event_ids || '')
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating hero:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update hero'
    })
  }
})
