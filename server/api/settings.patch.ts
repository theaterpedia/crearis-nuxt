import { defineEventHandler, readBody, createError } from 'h3'
import { query } from '#pruvious/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate the request body
  if (!body || typeof body.themeId !== 'number' || typeof body.themeConfig !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body. Expected { themeId: number, themeConfig: string }'
    })
  }

  try {
    // Update settings using Pruvious query
    const result = await query('settings').update({
      theme: body.themeId,
      themeConfig: body.themeConfig,
    })

    if (result.success) {
      return {
        success: true,
        record: result.record
      }
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'Failed to update settings',
        data: result.errors
      })
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
      data: error
    })
  }
})