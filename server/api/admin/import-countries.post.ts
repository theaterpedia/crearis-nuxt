import { defineEventHandler } from 'h3'
import { processJob } from '#pruvious/server'

/**
 * API endpoint to manually trigger the countries import job.
 * 
 * POST /api/admin/import-countries
 * 
 * This endpoint triggers the import-countries job which:
 * 1. Creates 254 placeholder records (odooId 1-254)
 * 2. Deletes non-European country placeholders (208 records)
 * 3. Updates remaining 46 European countries with correct data
 * 
 * Returns the job execution result including:
 * - success: boolean
 * - imported: number of countries imported
 * - placeholdersCreated: total placeholders created
 * - deleted: number of non-European countries deleted
 * - duration: import execution time
 * - details: array of imported countries and any errors
 */
export default defineEventHandler(async () => {
  try {
    const result = await processJob('import-countries')
    
    return {
      success: true,
      message: 'Country import job triggered successfully',
      result,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to trigger country import job',
      error: error instanceof Error ? error.message : String(error),
    }
  }
})
