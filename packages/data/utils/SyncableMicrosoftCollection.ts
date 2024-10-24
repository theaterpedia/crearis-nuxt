import { query } from "#pruvious/server"
import { logError, logInfo } from "./logger"
import { getMSToken } from "./msal"

export class SyncableMicrosoftCollection {
  constructor(protected collection: 'taxonomies') {}

  /**
   * Sync records from Microsoft to Pruvious.
   * Records are modified in Pruvious to match the Microsoft records.
   * 
   * - Create records that do not exist in Pruvious.
   * - Update records that are outdated in Pruvious.
   * - Delete records that do not exist in `msRecords` by comparing the `msId`.
   */
  async syncFromMicrosoft() {
    try { 
      const token = await getMSToken()
      const url = `https://graph.microsoft.com/v1.0/sites/${process.env[`NUXT_MS_${this.collection.toUpperCase()}_SITE_ID`]}/lists/${process.env[`NUXT_MS_${this.collection.toUpperCase()}_LIST_ID`]}/items?$select=${this.getSelectedMicrosoftFields()}`
      const { value: msRecords } = await $fetch<any>(url, { headers: { Authorization: `Bearer ${token}` }})
      const result: CollectionSyncResult = { created: [], updated: [], errors: {} }

      // Delete Pruvious records that are not in Microsoft
      await (query as any)(this.collection)
        .whereNotIn('msId', msRecords.map((msRecord: any) => msRecord.id))
        .delete()
  
      for (const msRecord of msRecords) {  
        // Find matching record in Pruvious
        let record = await (query as any)(this.collection)
          .selectAll()
          .where('msId', msRecord.id)
          .first()
    
        // Update Pruvious record if it is outdated
        if (record && record.lastModifiedDateTime < new Date(msRecord.lastModifiedDateTime).getTime()) {
          const qr = await (query as any)(this.collection)
            .selectAll()
            .where('id', record.id)
            .update(await this.mapMicrosoftToPruviousFields(msRecord))
    
          if (qr.success) {
            result.updated.push(qr.records[0])
          } else {
            result.errors[`update:${msRecord.id}`] = qr.message ?? qr.errors
          }
        }
        
        // Create record if it does not exist in Pruvious
        if (!record) {
          const qr = await (query as any)(this.collection)
            .select(['id'])
            .create(await this.mapMicrosoftToPruviousFields(msRecord))
    
          if (qr.success) {
            result.created.push(qr.record)
          } else {
            result.errors[`create:${msRecord.id}`] = qr.message ?? qr.errors
          }
        }
      }

      const logMessage = [
        `Synced collection '${this.collection}' from Microsoft to Pruvious.`,
        '',
        JSON.stringify(result, null, 2)
      ]
  
      if (Object.keys(result.errors).length) {
        await logError('ms-sync', logMessage.join('\n'))
      } else {
        await logInfo('ms-sync', logMessage.join('\n'))
      }
  
      return result
    } catch (e: any) {
      await logError(
        'ms-sync',
        `Unexpected error syncing collection '${this.collection}' from Microsoft to Pruvious: ${e.message}`
      )
      throw e
    }
  }

  /**
   * Map Microsoft fields to Pruvious fields.
   */
  async mapMicrosoftToPruviousFields(msRecord: Record<string, any>) {
    const base: Record<string, any> = {
      msId: msRecord.id,
      lastModifiedDateTime: msRecord.lastModifiedDateTime ? new Date(msRecord.lastModifiedDateTime).getTime() : null,
    }

    if (this.collection === 'taxonomies') {
      return {
        ...base,
        title: msRecord.fields.Title,
        termDescription: msRecord.fields.term_description,
        termPath: msRecord.fields.term_path,
        termId: msRecord.fields.term_id,
        level: msRecord.fields.Level,
        parentId: msRecord.fields.parent_id,
        kapitel: msRecord.fields.Kapitel,
      }
    }
  }

  protected getSelectedMicrosoftFields() {
    switch (this.collection) {
      case 'taxonomies':
        return 'Id,lastModifiedDateTime&$expand=fields($select=title,term_description,term_path,level,term_id,parent_id,kapitel)'
    }
  }
}
