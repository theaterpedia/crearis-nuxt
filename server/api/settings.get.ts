import { defineEventHandler } from 'h3'
import { query } from '#pruvious/server'

export default defineEventHandler(async (event) => {
  try {
    // Get settings using Pruvious query - settings is a singleton collection
    const settings = await query('settings').read()
    
    if (!settings) {
      // Return default/empty settings if none exist
      return {
        theme: null,
        themeConfig: null,
        headerConfigs: null
      }
    }
    
    return {
      theme: settings.theme || null,
      themeConfig: settings.themeConfig || null,
      headerConfigs: settings.headerConfigs || null
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    
    // Return null values on error
    return {
      theme: null,
      themeConfig: null,
      headerConfigs: null
    }
  }
})