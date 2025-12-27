import { defineJob } from '#pruvious'
import { query } from '#pruvious/server'

interface CountryData {
  odooId: number
  name: string
  code: string
  imageUrl?: string
}

/**
 * All European countries with their Odoo IDs
 * Max Odoo ID: 254 (Kosovo)
 */
const EUROPEAN_COUNTRIES: CountryData[] = [
  { odooId: 3, name: 'Albanien', code: 'AL' },
  { odooId: 6, name: 'Andorra', code: 'AD' },
  { odooId: 14, name: 'Österreich', code: 'AT' },
  { odooId: 23, name: 'Belarus', code: 'BY' },
  { odooId: 21, name: 'Belgien', code: 'BE' },
  { odooId: 27, name: 'Bosnien und Herzegowina', code: 'BA' },
  { odooId: 33, name: 'Bulgarien', code: 'BG' },
  { odooId: 98, name: 'Kroatien', code: 'HR' },
  { odooId: 54, name: 'Zypern', code: 'CY' },
  { odooId: 58, name: 'Tschechien', code: 'CZ' },
  { odooId: 59, name: 'Dänemark', code: 'DK' },
  { odooId: 63, name: 'Estland', code: 'EE' },
  { odooId: 73, name: 'Finnland', code: 'FI' },
  { odooId: 76, name: 'Frankreich', code: 'FR' },
  { odooId: 57, name: 'Deutschland', code: 'DE' },
  { odooId: 88, name: 'Griechenland', code: 'GR' },
  { odooId: 99, name: 'Ungarn', code: 'HU' },
  { odooId: 109, name: 'Island', code: 'IS' },
  { odooId: 105, name: 'Irland', code: 'IE' },
  { odooId: 110, name: 'Italien', code: 'IT' },
  { odooId: 254, name: 'Kosovo', code: 'XK' },
  { odooId: 125, name: 'Lettland', code: 'LV' },
  { odooId: 124, name: 'Liechtenstein', code: 'LI' },
  { odooId: 126, name: 'Litauen', code: 'LT' },
  { odooId: 127, name: 'Luxemburg', code: 'LU' },
  { odooId: 148, name: 'Malta', code: 'MT' },
  { odooId: 134, name: 'Moldau', code: 'MD' },
  { odooId: 135, name: 'Monaco', code: 'MC' },
  { odooId: 140, name: 'Montenegro', code: 'ME' },
  { odooId: 156, name: 'Niederlande', code: 'NL' },
  { odooId: 130, name: 'Nordmazedonien', code: 'MK' },
  { odooId: 165, name: 'Norwegen', code: 'NO' },
  { odooId: 176, name: 'Polen', code: 'PL' },
  { odooId: 179, name: 'Portugal', code: 'PT' },
  { odooId: 181, name: 'Rumänien', code: 'RO' },
  { odooId: 182, name: 'Russland', code: 'RU' },
  { odooId: 203, name: 'San Marino', code: 'SM' },
  { odooId: 239, name: 'Serbien', code: 'RS' },
  { odooId: 201, name: 'Slowakei', code: 'SK' },
  { odooId: 202, name: 'Slowenien', code: 'SI' },
  { odooId: 69, name: 'Spanien', code: 'ES' },
  { odooId: 210, name: 'Schweden', code: 'SE' },
  { odooId: 214, name: 'Schweiz', code: 'CH' },
  { odooId: 230, name: 'Ukraine', code: 'UA' },
  { odooId: 233, name: 'Vereinigtes Königreich', code: 'GB' },
  { odooId: 235, name: 'Vatikanstadt', code: 'VA' },
]

const MAX_ODOO_ID = 254 // Kosovo has the highest Odoo ID among European countries

/**
 * Job to import European countries with matching Odoo IDs.
 *
 * Since Pruvious auto-generates IDs and doesn't allow setting them manually,
 * this job uses a 3-step approach:
 *
 * 1. Create placeholder records from 1 to MAX_ODOO_ID (254)
 *    - Each placeholder has odooId set to match its sequence number
 *
 * 2. Delete all non-European country placeholders
 *    - Keeps only the 46 European countries
 *
 * 3. Update the remaining records with correct names and codes
 *    - Sets proper country names, codes, and optional image URLs
 *
 * This ensures the odooId field matches the Odoo country IDs for foreign key references.
 */
export default defineJob({
  name: 'import-countries',
  callback: async () => {
    const startTime = Date.now()

    try {
      // Check if countries already exist
      const existingCount = await query('countries').count()

      if (existingCount > 0) {
        return {
          success: true,
          imported: 0,
          skipped: existingCount,
          message: `Countries already imported. Found ${existingCount} existing countries.`,
        }
      }

      console.log('[import-countries] Starting country import...')
      console.log(`[import-countries] Step 1: Creating ${MAX_ODOO_ID} placeholder records...`)

      // STEP 1: Create placeholder records from ID 1 to MAX_ODOO_ID
      const createdIds: number[] = []
      for (let i = 1; i <= MAX_ODOO_ID; i++) {
        try {
          const result = await query('countries').create({
            name: `Placeholder ${i}`,
            code: `__${i}__`,
            odooId: i,
          })
          if (result.success && result.record) {
            createdIds.push(result.record.id)
          }
        } catch (error) {
          console.error(`[import-countries] Failed to create placeholder ${i}:`, error)
        }
      }

      console.log(`[import-countries] Created ${createdIds.length} placeholder records`)
      console.log('[import-countries] Step 2: Deleting non-European country placeholders...')

      // STEP 2: Delete all records that are NOT in the European countries list
      const europeanOdooIds = EUROPEAN_COUNTRIES.map((c) => c.odooId)
      const allRecords = await query('countries').select(['id', 'odooId']).all()

      let deletedCount = 0
      for (const record of allRecords) {
        if (record.odooId && !europeanOdooIds.includes(record.odooId)) {
          try {
            await query('countries').where('id', record.id).delete()
            deletedCount++
          } catch (error) {
            console.error(
              `[import-countries] Failed to delete non-European record ${record.id}:`,
              error,
            )
          }
        }
      }

      console.log(`[import-countries] Deleted ${deletedCount} non-European country records`)
      console.log('[import-countries] Step 3: Updating European countries with correct data...')

      // STEP 3: Update the remaining records with correct country names and codes
      const updatedCountries = []
      const updateErrors = []

      for (const country of EUROPEAN_COUNTRIES) {
        try {
          const result = await query('countries')
            .where('odooId', country.odooId)
            .update({
              name: country.name,
              code: country.code,
              imageUrl: country.imageUrl,
            })

          if (result.success && result.records && result.records.length > 0) {
            updatedCountries.push({
              odooId: country.odooId,
              pruviousId: result.records[0].id,
              name: country.name,
              code: country.code,
            })
          }
        } catch (error) {
          updateErrors.push({
            odooId: country.odooId,
            name: country.name,
            error: error instanceof Error ? error.message : String(error),
          })
        }
      }

      console.log(`[import-countries] Updated ${updatedCountries.length} European countries`)

      const duration = Date.now() - startTime

      return {
        success: updateErrors.length === 0,
        imported: updatedCountries.length,
        placeholdersCreated: createdIds.length,
        deleted: deletedCount,
        errors: updateErrors.length,
        duration: `${duration}ms`,
        details: {
          europeanCountries: updatedCountries,
          failed: updateErrors,
        },
      }
    } catch (error) {
      return {
        success: false,
        imported: 0,
        errors: 1,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  },
  interval: false, // No automatic execution
  priority: 100, // High priority when manually triggered
})
