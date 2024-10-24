import { capitalize } from "#pruvious";
import { query } from "#pruvious/server";
import { ensureUser } from "./user";
import type { MiddlewareConfig } from "@erpgap/odoo-sdk-api-client";
// @ts-ignore
import { createApiClient } from "@erpgap/odoo-sdk-api-client/server";
import { type Endpoints } from "@erpgap/odoo-sdk-api-client/server";
import { nanoid } from 'nanoid'
import { Queries } from "../server/queries";
import { Mutations } from "../server/mutations";
import { logError, logInfo } from "./logger";

export interface CollectionSyncResult {
  created: any[]
  updated: any[]
  errors: { [syncId: string]: any }
}

export class SyncableOdooCollection {
  protected apolloClientApi!: Endpoints

  constructor(protected collection: 'events' | 'posts') {}

  /**
   * Sync records from Odoo to Pruvious.
   * Records are modified in Pruvious to match the Odoo records.
   * 
   * - Create records that do not exist in Pruvious.
   * - Update records that are outdated in Pruvious.
   * - Delete records that do not exist in `odooRecords` by comparing the `syncId`.
   */
  async syncFromOdoo() {
    try {
      await this.ensureApolloClient()
  
      const queryName = `Get${capitalize(this.collection)}Query`
      const odooRecordsResponse = await this.apolloClientApi.query<any, any>({ queryName } as any, {} as any)
      const odooRecords = await this.filterRecordsForThisSite(odooRecordsResponse.data[this.collection][this.collection])
      const result: CollectionSyncResult = { created: [], updated: [], errors: {} }

      // Delete Pruvious records that are not in Odoo
      await (query as any)(this.collection)
        .whereNotIn('syncId', odooRecords.map((odooRecord) => odooRecord.syncId))
        .delete()
  
      for (const odooRecord of odooRecords) {  
        // Find matching record in Pruvious
        let record = await (query as any)(this.collection)
          .selectAll()
          .where('syncId', odooRecord.syncId)
          .first()
    
        // Update Pruvious record if it is outdated
        if (record && record.updatedAt < new Date((odooRecord as any).writeDate).getTime()) {
          const qr = await (query as any)(this.collection)
            .selectAll()
            .where('id', record.id)
            .update(await this.mapOdooToPruviousFields(odooRecord))
    
          if (qr.success) {
            result.updated.push(qr.records[0])
          } else {
            result.errors[`update:${odooRecord.syncId}`] = qr.message ?? qr.errors
          }
        }
        
        // Create record if it does not exist in Pruvious
        if (!record) {
          const qr = await (query as any)(this.collection)
            .select(['id'])
            .create(await this.mapOdooToPruviousFields(odooRecord))
    
          if (qr.success) {
            result.created.push(qr.record)
          } else {
            result.errors[`create:${odooRecord.syncId}`] = qr.message ?? qr.errors
          }
        }
      }

      const logMessage = [
        `Synced collection '${this.collection}' from Odoo to Pruvious.`,
        '',
        JSON.stringify(result, null, 2)
      ]
  
      if (Object.keys(result.errors).length) {
        await logError('odoo-sync', logMessage.join('\n'))
      } else {
        await logInfo('odoo-sync', logMessage.join('\n'))
      }
  
      return result
    } catch (e: any) {
      await logError(
        'odoo-sync',
        `Unexpected error syncing collection '${this.collection}' from Odoo to Pruvious: ${e.message}`
      )
      throw e
    }
  }

  /**
   * Sync a single record from Pruvious to Odoo.
   */
  async syncRecordToOdoo(recordId: number) {
    try {
      await this.ensureApolloClient()

      const record = await (query as any)(this.collection)
        .where('id', recordId)
        .populate()
        .first()
  
      const mutationName = `Add${capitalize(this.collection)}Mutation`
      const odooRecord = await this.mapPruviousToOdooFields(record)
      const odooResponse = await this.apolloClientApi.mutation<any, any>({ mutationName } as any, odooRecord as any)
  
      return odooResponse // @todo handle result
    } catch (e: any) {
      await logError(
        'odoo-sync',
        `Unexpected error creating '${this.collection}' record from Pruvious to Odoo: ${e.message}`
      )
      throw e
    }
  }

  /**
   * Map Odoo fields to Pruvious fields.
   */
  async mapOdooToPruviousFields(odooRecord: Record<string, any>) {
    const base: Record<string, any> = {
      syncId: odooRecord.syncId,
      version: odooRecord.version,
    }

    if (this.collection === 'posts') {
      return {
        ...base,
        path: odooRecord.slugBlog + odooRecord.slugPost, // @todo catch noslug-error via nanoid,
        title: odooRecord.headline || '',
        overline: odooRecord.overline || '',
        metaTags: odooRecord.metaKeywords ? [{ name: 'keywords', content: odooRecord.metaKeywords }] : [],
        blocks: odooRecord.blocks ? odooRecord.blocks : [], 
        publishDate: odooRecord.postDate ? new Date(odooRecord.postDate).getTime() : null,
        author: odooRecord.author ? (await ensureUser(odooRecord.author.email))?.id : null,
      }
    } else if (this.collection === 'events') {
      return {
        ...base,
        editMode: odooRecord.editMode,
        path: odooRecord.slug || nanoid(),
        title: odooRecord.headline || '',
        overline: odooRecord.overline || '',
        metaTags: odooRecord.metaKeywords ? [{ name: 'keywords', content: odooRecord.metaKeywords }] : [],
        blocks: odooRecord.blocks ? odooRecord.blocks : [], 
        dateBegin: odooRecord.dateBegin ? new Date(odooRecord.dateBegin).getTime() : null,
        dateEnd: odooRecord.dateEnd ? new Date(odooRecord.dateEnd).getTime() : null,
        organizer: odooRecord.organizer ? (await ensureUser(odooRecord.organizer.email))?.id : null,
      }
    }
  }

  /**
   * Map Pruvious fields to Odoo fields.
   */
  async mapPruviousToOdooFields(record: Record<string, any>) {
    const base: Record<string, any> = {
      version: record.version,
    }

    if (this.collection === 'posts') {
      const secondPathSlash = record.path.slice(1).indexOf('/')

      return {
        ...base,
        slugBlog: secondPathSlash > -1 ? record.path.slice(0, secondPathSlash) : '',
        slugPost: secondPathSlash > -1 ? record.path.slice(secondPathSlash + 1) : record.path,
        headline: record.title,
        overline: record.overline,
        metaKeywords: record.metaTags.find((tag: any) => tag.name === 'keywords')?.content ?? '',
        blocks: record.blocks, 
        publishDate: record.publishDate ? new Date(record.publishDate).toISOString() : null,
        author: record.author.email,
      }
    } else if (this.collection === 'events') {
      return {
        ...base,
      }
    }
  }

  /**
   * Filter Odoo records for the current site by checking the `syncId` prefix against the domain code.
   */
  protected async filterRecordsForThisSite<T extends { syncId: string }>(odooRecords: T[]): Promise<T[]> {
    const domainCode = process.env.NUXT_DOMAIN_CODE
    return odooRecords.filter((odooRecord) => odooRecord.syncId.startsWith(`${domainCode}.`))
  }

  /**
   * Ensure that the Apollo Client is initialized.
   */
  protected async ensureApolloClient() {
    if (this.apolloClientApi) {
      return
    }

    const baseConfig: MiddlewareConfig = {
      odooGraphqlUrl: `${process.env.NUXT_PUBLIC_ODOO_BASE_URL}graphql/vsf`,
      queries: { ...Queries, ...Mutations },
    };

    const loginClient = createApiClient(baseConfig)
    const loginResponse = await loginClient.api.mutation(
      { mutationName: 'LoginMutation' } as any,
      { email: process.env.NUXT_ODOO_SYNC_USER_EMAIL, password: process.env.NUXT_ODOO_SYNC_USER_PASSWORD } as any
    )
 
    if (loginResponse.errors?.length || !loginResponse.data?.cookie) {
      throw new Error(loginResponse.errors[0].message)
    }    
    
    this.apolloClientApi = createApiClient({ ...baseConfig, headers: { Cookie: loginResponse.data.cookie } }).api
  }
}
