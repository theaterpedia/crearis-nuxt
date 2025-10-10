import { defineEventHandler } from 'h3'
import { processJob } from '#pruvious/server'

/**
 * API endpoint to manually trigger partner synchronization.
 * 
 * POST /api/admin/sync-partners
 * 
 * Triggers the sync-partners job immediately, regardless of schedule.
 * Useful for manual syncs or testing.
 * 
 * @returns Job execution result with sync statistics
 */
export default defineEventHandler(async (event) => {
  try {
    console.log('[api:sync-partners] Manual sync triggered')

    // Process the sync-partners job
    const result = await processJob('sync-partners')

    return {
      success: true,
      message: 'Partner sync job triggered successfully',
      result,
    }
  } catch (error) {
    console.error('[api:sync-partners] Error triggering sync:', error)

    return {
      success: false,
      message: 'Failed to trigger partner sync',
      error: error instanceof Error ? error.message : String(error),
    }
  }
})
