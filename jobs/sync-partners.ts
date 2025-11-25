import { defineJob } from '#pruvious'
import { query } from '#pruvious/server'
import { getPartnersNeedingSync, bulkUpdatePartnerSyncTimestamps } from '../server/utils/partnerSync'

/**
 * Job to synchronize partner data from Odoo/GraphQL.
 * 
 * This job:
 * 1. Finds partners with no sync timestamp or older than 1 day
 * 2. Fetches updated data from Odoo via GraphQL
 * 3. Updates partner records in Pruvious
 * 4. Updates sync timestamps
 * 
 * Runs daily at interval, but can also be triggered manually.
 */
export default defineJob({
  name: 'sync-partners',
  callback: async () => {
    const startTime = Date.now()
    console.log('[sync-partners] Starting partner synchronization...')

    try {
      // Step 1: Find partners needing sync
      const partnerIds = await getPartnersNeedingSync()

      if (partnerIds.length === 0) {
        console.log('[sync-partners] No partners need synchronization')
        return {
          success: true,
          message: 'No partners need sync',
          synced: 0,
          errors: 0,
          duration: Date.now() - startTime,
        }
      }

      console.log(`[sync-partners] Found ${partnerIds.length} partners to sync`)

      // Step 2: Fetch partner data from Odoo via GraphQL
      const odooPartners = await fetchPartnersFromOdoo(partnerIds)

      if (!odooPartners || odooPartners.length === 0) {
        console.warn('[sync-partners] No data returned from Odoo')
        return {
          success: false,
          message: 'No data from Odoo',
          synced: 0,
          errors: partnerIds.length,
          duration: Date.now() - startTime,
        }
      }

      console.log(`[sync-partners] Fetched ${odooPartners.length} partners from Odoo`)

      // Step 3: Update partners in Pruvious
      const updateResults = await updatePartnersInPruvious(odooPartners)

      // Step 4: Update sync timestamps
      const successfulIds = updateResults.filter((r) => r.success).map((r) => r.partnerId)
      if (successfulIds.length > 0) {
        await bulkUpdatePartnerSyncTimestamps(successfulIds)
      }

      const result = {
        success: updateResults.every((r) => r.success),
        synced: successfulIds.length,
        errors: updateResults.filter((r) => !r.success).length,
        duration: Date.now() - startTime,
        details: updateResults,
      }

      console.log(
        `[sync-partners] Completed: ${result.synced} synced, ${result.errors} errors, ${result.duration}ms`,
      )

      return result
    } catch (error) {
      console.error('[sync-partners] Job failed:', error)
      throw error
    }
  },
  interval: 60 * 60 * 24, // 24 hours (daily)
  priority: 50,
})

/**
 * Fetch partner data from Odoo via GraphQL API.
 */
async function fetchPartnersFromOdoo(partnerIds: number[]) {
  try {
    const queryName = 'GetPartnersQuery' // Changed from GetPartnerQuery to GetPartnersQuery (plural)
    const variables = {
      filter: {
        ids: partnerIds,
      },
    }

    // Log GraphQL query for debugging on Odoo side
    console.log('[sync-partners] GraphQL Query:', {
      queryName,
      variables,
      partnerIds,
    })

    // Use the internal API endpoint to query Odoo
    const response = await $fetch('/api/odoo/query', {
      method: 'POST',
      body: [
        { queryName }, // API expects an object with queryName property
        variables,
      ],
    })

    return response?.partners || []
  } catch (error) {
    console.error('[sync-partners] Error fetching from Odoo:', error)
    return []
  }
}

/**
 * Update partners in Pruvious with data from Odoo.
 */
async function updatePartnersInPruvious(odooPartners: any[]) {
  const results = []

  for (const odooPartner of odooPartners) {
    try {
      // Check if partner exists in Pruvious
      const existingPartner = await query('partners').where('id', odooPartner.id).first()

      if (!existingPartner) {
        // Create new partner
        await query('partners').create(mapOdooPartnerToPruvious(odooPartner))
        console.log(`[sync-partners] Created partner ${odooPartner.id}`)
      } else {
        // Update existing partner
        await query('partners')
          .where('id', odooPartner.id)
          .update(mapOdooPartnerToPruvious(odooPartner))
        console.log(`[sync-partners] Updated partner ${odooPartner.id}`)
      }

      results.push({ partnerId: odooPartner.id, success: true })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      results.push({ partnerId: odooPartner.id, success: false, error: errorMessage })
      console.error(`[sync-partners] Failed to update partner ${odooPartner.id}:`, error)
    }
  }

  return results
}

/**
 * Map Odoo partner data to Pruvious partner fields.
 */
function mapOdooPartnerToPruvious(odooPartner: any) {
  return {
    name: odooPartner.name || '',
    public: odooPartner.public || false,
    addressType: odooPartner.addressType || null,
    firstName: odooPartner.firstName || null,
    lastName: odooPartner.lastName || null,
    isCompany: odooPartner.isCompany || false,
    street: odooPartner.street || null,
    street2: odooPartner.street2 || null,
    city: odooPartner.city || null,
    zip: odooPartner.zip || null,
    country: odooPartner.country?.id || null,
    email: odooPartner.email || null,
    phone: odooPartner.phone || null,
    websiteLink: odooPartner.websiteLink || null,
    company: odooPartner.company?.id || null,
    contacts: odooPartner.contacts?.map((c: any) => ({ contactId: c.id })) || [],
    signupValid: odooPartner.signupValid || null,
    md: odooPartner.md || null,
    imagePath: odooPartner.imagePath || null,
    billingAddress: odooPartner.billingAddress?.id || null,
    // Don't update lastSyncedAt here - it's updated by bulkUpdatePartnerSyncTimestamps
  }
}
