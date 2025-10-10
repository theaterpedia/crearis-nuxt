import { query } from '#pruvious/server'

/**
 * Utility to find partners that need synchronization with Odoo/GraphQL.
 * 
 * Returns partners where:
 * - lastSyncedAt is null/undefined (never synced)
 * - lastSyncedAt is older than 1 day
 * 
 * @returns Array of partner IDs that need syncing
 */
export async function getPartnersNeedingSync(): Promise<number[]> {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000 // 24 hours in milliseconds

  try {
    // Query all partners
    const allPartners = await query('partners')
      .select(['id', 'lastSyncedAt'])
      .all()

    // Filter partners needing sync
    const partnersNeedingSync = allPartners.filter((partner) => {
      // Never synced (null or undefined)
      if (!partner.lastSyncedAt) {
        return true
      }

      // Synced more than 1 day ago
      return partner.lastSyncedAt < oneDayAgo
    })

    const partnerIds = partnersNeedingSync.map((p) => p.id)

    console.log(
      `[partner-sync] Found ${partnerIds.length} partners needing sync (total: ${allPartners.length})`,
    )

    return partnerIds
  } catch (error) {
    console.error('[partner-sync] Error finding partners needing sync:', error)
    throw error
  }
}

/**
 * Update the lastSyncedAt timestamp for a partner.
 * 
 * @param partnerId - The ID of the partner to update
 * @returns Updated partner record
 */
export async function updatePartnerSyncTimestamp(partnerId: number) {
  try {
    return await query('partners')
      .where('id', partnerId)
      .update({ lastSyncedAt: Date.now() })
  } catch (error) {
    console.error(`[partner-sync] Error updating timestamp for partner ${partnerId}:`, error)
    throw error
  }
}

/**
 * Bulk update sync timestamps for multiple partners.
 * 
 * @param partnerIds - Array of partner IDs to update
 */
export async function bulkUpdatePartnerSyncTimestamps(partnerIds: number[]) {
  const timestamp = Date.now()
  const results = []

  for (const partnerId of partnerIds) {
    try {
      await query('partners').where('id', partnerId).update({ lastSyncedAt: timestamp })
      results.push({ partnerId, success: true })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      results.push({ partnerId, success: false, error: errorMessage })
      console.error(`[partner-sync] Failed to update timestamp for partner ${partnerId}:`, error)
    }
  }

  return results
}
