import { defineNitroPlugin } from 'nitropack/runtime'
import { query } from '#pruvious/server'

/**
 * Server plugin to check and import countries on application startup.
 * 
 * DISABLED: Auto-import on startup can interfere with database initialization
 * and admin setup. Countries should be imported manually via:
 * POST /api/admin/import-countries
 * 
 * This plugin runs when the Nitro server starts up and checks if countries
 * are initialized in the database. If not, it imports them.
 * Uses a flag to ensure it only runs once per server lifetime.
 */
let jobTriggered = false

export default defineNitroPlugin(async (nitroApp) => {
  // DISABLED: Uncomment to re-enable auto-import on startup
  // Auto-import is disabled to prevent database reset issues
  
  /*
  // Use the request hook to ensure this runs after Pruvious is initialized
  // but only trigger the check once
  nitroApp.hooks.hook('request', async () => {
    if (jobTriggered) {
      return
    }
    
    jobTriggered = true
    
    // Delay slightly to ensure Pruvious routes are fully initialized
    await new Promise(resolve => setTimeout(resolve, 100))
    
    try {
      console.log('[init-countries] Checking countries on first request...')
      
      // Check if countries already exist
      const existingCount = await query('countries').count()
      
      if (existingCount > 0) {
        console.log(`[init-countries] Countries already imported (${existingCount} found)`)
        return
      }
      
      console.log('[init-countries] No countries found, importing via API...')
      
      // Use $fetch to call our own API endpoint instead of processJob
      // This is more reliable during startup as the HTTP routes are ready
      const result = await $fetch('/api/admin/import-countries', {
        method: 'POST',
      })
      
      console.log('[init-countries] Import result:', result)
    } catch (error) {
      console.error('[init-countries] Failed to check/import countries:', error)
      // Don't throw - let the server start even if import fails
    }
  })
  */
})
