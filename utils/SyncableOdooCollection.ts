import { capitalize } from '#pruvious'
import { query } from '#pruvious/server'
import { ensureUser, ensurePartner } from './user'
import type { MiddlewareConfig } from '@crearis/odoo-sdk-api-client'
// @ts-ignore
import { createApiClient } from '../packages/odoo-sdk-api-client/src/index.server'
import { type Endpoints } from '@crearis/odoo-sdk-api-client'
import { nanoid } from 'nanoid'
import { Queries } from '../server/queries'
import { Mutations } from '../server/mutations'
import { logError, logInfo } from './logger'
import { resultKeyNameFromField } from '@apollo/client/utilities'
import type { UpdateEventInput } from '~/graphql'
import type content from '~/server/plugins/content'

export interface CollectionSyncResult {
  created: any[]
  updated: any[]
  errors: { [cid: string]: any }
}

export class SyncableOdooCollection {
  protected apolloClientApi!: Endpoints

  constructor(protected collection: 'events' | 'posts' | 'domainusers') {}
  get dataType() {
    // strip the 's' from the collection name
    return this.collection.slice(0, -1)
  }

  /**
   * Sync records from Odoo to Pruvious.
   * Records are modified in Pruvious to match the Odoo records.
   *
   * - Create records that do not exist in Pruvious.
   * - Update records that are outdated in Pruvious.
   * - Delete records that do not exist in `odooRecords` by comparing the `cid`.
   */
  async syncFromOdoo() {
    try {
      await this.ensureApolloClient()

      const queryName = `Get${capitalize(this.collection)}Query`
      const odooRecordsResponse = await this.apolloClientApi.query<any, any>({ queryName } as any, {} as any)
      // console.log('odooRecordsResponse', odooRecordsResponse)

      if (odooRecordsResponse.errors?.length) {
        throw new Error(odooRecordsResponse.errors[0].message)
      }
      // Filter Odoo records for the current site
      // is not needed here, as the Odoo API should already return only the relevant records.
      // maybe we need this, if we want to separate read-only and writeable records

      // const odooRecords = await this.filterRecordsForThisSite(
      //  odooRecordsResponse.data[this.collection][this.collection],
      // )

      const odooRecords = odooRecordsResponse.data[this.collection][this.collection]
      const result: CollectionSyncResult = { created: [], updated: [], errors: {} }

      // Delete Pruvious records that are not in Odoo
      await (query as any)(this.collection)
        .whereNotIn(
          'cid',
          odooRecords.map((odooRecord: any) => odooRecord.cid),
        )
        .delete()

      for (const odooRecord of odooRecords) {
        // Find matching record in Pruvious
        let record = await (query as any)(this.collection).selectAll().where('cid', odooRecord.cid).first()

        // Update Pruvious record if it is outdated
        if (record && record.updatedAt < new Date((odooRecord as any).writeDate).getTime()) {
          const qr = await (query as any)(this.collection)
            .selectAll()
            .where('id', record.id)
            .update(await this.mapOdooToPruviousFields(odooRecord))

          if (qr.success) {
            result.updated.push(qr.records[0])
          } else {
            result.errors[`update:${odooRecord.cid}`] = qr.message ?? qr.errors
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
            result.errors[`create:${odooRecord.cid}`] = qr.message ?? qr.errors
          }
        }
      }

      const logMessage = [
        `Synced collection '${this.collection}' from Odoo to Pruvious.`,
        '',
        JSON.stringify(result, null, 2),
      ]

      if (Object.keys(result.errors).length) {
        await logError('odoo-sync', logMessage.join('\n'))
      } else {
        await logInfo('odoo-sync', logMessage.join('\n'))
      }

      return result
    } catch (e: any) {
      if (e.cause !== undefined) {
        for (const error of e.cause.result.errors) {
          console.error(`Get${capitalize(this.collection)}Query`, error)
        }
        // console.log('e.cause.result.errors', e.cause.result.errors)
        await logError(
          'odoo-sync',
          `Unexpected error syncing collection '${this.collection}' from Odoo to Pruvious: ${e.cause.result.errors}`,
        )
      } else {
        await logError(
          'odoo-sync',
          `Unexpected error syncing collection '${this.collection}' from Odoo to Pruvious: ${e.message}`,
        )
      }
      throw e
    }
  }

  /**
   * Add a single record from Pruvious to Odoo.
   */
  async addRecordToOdoo(recordId: number) {
    try {
      await this.ensureApolloClient()

      const record = await (query as any)(this.collection).where('id', recordId).populate().first()

      const mutationName = `Add${capitalize(this.dataType)}`
      const odooRecord = await this.mapPruviousToOdooFields(record)
      const odooResponse = await this.apolloClientApi.mutation<any, any>({ mutationName } as any, odooRecord as any, {
        event: 5,
      })

      return odooResponse // @todo handle result
    } catch (e: any) {
      if (e.cause !== undefined) {
        for (const error of e.cause.result.errors) {
          console.error(`Add${capitalize(this.dataType)} Mutation`, error)
        }
      }
      await logError(
        'odoo-sync',
        `Unexpected error creating '${this.collection}' record from Pruvious to Odoo: ${e.message}`,
      )
      throw e
    }
  }

  /**
   * Update a single record from Pruvious to Odoo.
   */
  async updateRecordOnOdoo(recordId: number) {
    try {
      await this.ensureApolloClient()

      const record = await (query as any)(this.collection).where('id', recordId).populate().first()

      const mutationName = `Update${capitalize(this.dataType)}`
      const odooRecord = await this.mapPruviousToOdooFields(record)
      const contentRec = { [this.dataType]: odooRecord } as any

      const odooResponse = await this.apolloClientApi.mutation<any, any>({ mutationName } as any, contentRec)
      if (odooResponse.errors?.length) {
        const errorMessages = odooResponse.errors?.map((error: any) => error.message).join(', ')
        await logError(
          'odoo-sync',
          `Error updating '${this.collection}' record from Pruvious to Odoo: ${errorMessages}`,
        )
        throw new Error(`Could not update '${this.collection}' - got this Error: ${errorMessages}`)
      } else {
        const qr = await (query as any)(this.collection)
          .selectAll()
          .where('id', record.id)
          .update('version', odooResponse.data.version ?? null)
        return odooResponse
      }
    } catch (e: any) {
      let error = ''
      if (e.cause !== undefined) {
        error = e.cause.result.errors?.map((error: any) => error.message).join(', ')
      } else {
        error = e.message
      }
      await logError(
        'odoo-sync',
        `Unexpected error creating '${this.collection}' record from Pruvious to Odoo: ${error}`,
      )
      throw new Error(`Could not save '${this.collection}' record from Pruvious to Odoo: ${error}`)
    }
  }

  /**
   * Intelligent mapping for description field from Odoo to Pruvious.
   * Uses meta_description if available (or plain description for domainusers), 
   * otherwise falls back to teasertext (max 200 chars).
   * 
   * @param odooRecord - The Odoo record containing description fields
   * @param useDescriptionField - If true, uses 'description' instead of 'metaDescription' (for domainusers)
   */
  private mapDescription(odooRecord: Record<string, any>, useDescriptionField: boolean = false): string {
    // For domainusers: prefer 'description' field if it has content
    // For posts/events: prefer 'metaDescription' field if it has content
    const primaryField = useDescriptionField ? odooRecord.description : odooRecord.metaDescription
    if (primaryField && primaryField.trim().length > 0) {
      return primaryField
    }
    
    // Fallback to teasertext, shortened to 200 chars
    if (odooRecord.teasertext && odooRecord.teasertext.trim().length > 0) {
      const teaser = odooRecord.teasertext.trim()
      return teaser.length > 200 ? teaser.substring(0, 200) + '...' : teaser
    }
    
    return ''
  }

  /**
   * Map Odoo fields to Pruvious fields.
   */
  async mapOdooToPruviousFields(odooRecord: Record<string, any>) {
    const base: Record<string, any> = {
      cid: odooRecord.cid,
      version: odooRecord.version,
    }

    if (this.collection === 'posts') {
      // Ensure publicPartner exists (author is the partner directly)
      const publicPartner = odooRecord.author
        ? await ensurePartner(
            odooRecord.author.id,
            odooRecord.author.name,
            odooRecord.author.email,
            undefined // phone not available in postFragment
          )
        : null

      return {
        ...base,
        path: odooRecord.slugBlog + odooRecord.slugPost, // @todo catch noslug-error via nanoid,
        isEditable: false, //odooRecord?.homesite?.domainCode === process.env.NUXT_DOMAIN_CODE ||
        // Simplified heading-logic > could be extended to fullstyle headings
        // Map Odoo 'heading' field to Pruvious 'title' field
        title: odooRecord.heading || '',
        // Intelligent description mapping: prefer meta_description, fallback to teasertext (max 200 chars)
        description: this.mapDescription(odooRecord),
        teaserText: odooRecord.teasertext || '',
        metaTags: odooRecord.metaKeywords ? [{ name: 'keywords', content: odooRecord.metaKeywords }] : [],
        public: odooRecord.public || false,
        publishDate: odooRecord.publishDate ? new Date(odooRecord.publishDate).getDate() : null,
        md: odooRecord.md || '',
        cimg: odooRecord.cimg || '',
        headerType: odooRecord.headerType || '',
        headerSize: odooRecord.headerSize || 'prominent',
        // GraphQL returns formatOptions as GenericScalar (dictionary), stringify for Pruvious string field
        formatOptions: odooRecord.formatOptions ? JSON.stringify(odooRecord.formatOptions) : '',
        blocks: odooRecord.blocks ? odooRecord.blocks : [],
        // TODO: User creation will be handled in a separate step
        // author: odooRecord.author
        //   ? (await ensureUser(odooRecord.author.email, odooRecord.author.firstname, odooRecord.author.lastname))?.id
        //   : null,
        author: null, // Will be populated when user sync is implemented
        layout: odooRecord.layout || 'post',
        // Partner relation (author is partner directly in posts)
        publicPartner: publicPartner?.id || null,
      }
    } else if (this.collection === 'events') {
      // Ensure partners exist and get their Pruvious IDs
      const publicPartner = odooRecord.publicUser?.partner 
        ? await ensurePartner(
            odooRecord.publicUser.partner.id,
            odooRecord.publicUser.partner.name,
            odooRecord.publicUser.partner.email,
            odooRecord.publicUser.partner.phone
          )
        : null

      const companyPartner = odooRecord.company
        ? await ensurePartner(
            odooRecord.company.id,
            odooRecord.company.name,
            odooRecord.company.email,
            odooRecord.company.phone
          )
        : null

      const locationPartner = odooRecord.location
        ? await ensurePartner(
            odooRecord.location.id,
            odooRecord.location.name,
            odooRecord.location.email,
            odooRecord.location.phone
          )
        : null

      const organizerPartner = odooRecord.organizer
        ? await ensurePartner(
            odooRecord.organizer.id,
            odooRecord.organizer.name,
            odooRecord.organizer.email,
            odooRecord.organizer.phone
          )
        : null

      return {
        ...base,
        path: odooRecord.slug || nanoid(),
        cid: odooRecord.cid || null,
        // Simplified heading-logic > could be extended to fullstyle headings
        // Map Odoo 'heading' field to Pruvious 'title' field
        title: odooRecord.heading || '',
        // Intelligent description mapping: prefer meta_description, fallback to teasertext (max 200 chars)
        description: this.mapDescription(odooRecord),
        teaserText: odooRecord.teasertext || '',
        metaTags: odooRecord.metaKeywords ? [{ name: 'keywords', content: odooRecord.metaKeywords }] : [],
        md: odooRecord.md || '',
        cimg: odooRecord.cimg || '',
        headerType: odooRecord.headerType || '',
        headerSize: odooRecord.headerSize || 'prominent',
        // GraphQL returns formatOptions as GenericScalar (dictionary), stringify for Pruvious string field
        formatOptions: odooRecord.formatOptions ? JSON.stringify(odooRecord.formatOptions) : '',        
        blocks: odooRecord.blocks ? odooRecord.blocks : [],
        dateBegin: odooRecord.dateBegin ? new Date(odooRecord.dateBegin).getTime() : null,
        dateEnd: odooRecord.dateEnd ? new Date(odooRecord.dateEnd).getTime() : null,
        editMode: odooRecord.editMode || 'content',
        layout: odooRecord.layout || 'event',
        domainCode: odooRecord.website?.domainCode || '',
        // Partner relations
        publicPartner: publicPartner?.id || null,
        companyPartner: companyPartner?.id || null,
        locationPartner: locationPartner?.id || null,
        organizerPartner: organizerPartner?.id || null,
      }
    } else if (this.collection === 'domainusers') {
      const hasPartner: boolean = odooRecord.user ? odooRecord.user.partner || false : false
      return {
        ...base,
        path: odooRecord.slug || nanoid(),
        title: odooRecord.name || '',
        overline: odooRecord.title || '',
        metaTags: odooRecord.metaKeywords ? [{ name: 'keywords', content: odooRecord.metaKeywords }] : [],
        user: odooRecord.user
          ? (
              await ensureUser(
                odooRecord.user.email,
                odooRecord.user.partner.firstname,
                odooRecord.user.partner.lastname,
              )
            )?.id
          : null,
        role: odooRecord.role || '',
        roleTitle: odooRecord.title || '',
        capabilities: odooRecord.capabilities || '',
        // Simplified non-standardized pattern for domainusers:
        // Both Pruvious 'description' and 'teaserText' map to the same Odoo 'description' field
        // (Odoo does not provide separate teasertext field for domainusers)
        description: odooRecord.description || '',
        teaserText: odooRecord.description || '',
        // GraphQL returns formatOptions as GenericScalar (dictionary), stringify for Pruvious string field
        formatOptions: odooRecord.formatOptions ? JSON.stringify(odooRecord.formatOptions) : '',
        firstname: hasPartner ? odooRecord.user.partner.firstname || '' : '',
        lastname: hasPartner ? odooRecord.user.partner.lastname || '' : '',
        md: hasPartner ? odooRecord.user.partner.md || '' : '',
        mobile: hasPartner ? odooRecord.user.partner.phone || '' : '',
        email: hasPartner ? odooRecord.user.partner.email || '' : '',
        street: hasPartner ? odooRecord.user.partner.street || '' : '',
        street2: hasPartner ? odooRecord.user.partner.street2 || '' : '',
        city: hasPartner ? odooRecord.user.partner.city || '' : '',
        zip: hasPartner ? odooRecord.user.partner.zip || '' : '',
        image: hasPartner ? odooRecord.user.partner.image || '' : '',
        layout: odooRecord.layout || 'contact',
      }
    }
  }

  /**
   * Map Pruvious fields to Odoo fields.
   */
  async mapPruviousToOdooFields(record: Record<string, any>) {
    const base: Record<string, any> = {
      version: record.version,
      cid: record.cid || null,
    }

    if (this.collection === 'posts') {
      const secondPathSlash = record.path.slice(1).indexOf('/')

      return {
        ...base,
        // slugBlog: secondPathSlash > -1 ? record.path.slice(0, secondPathSlash) : '',
        // slugPost: secondPathSlash > -1 ? record.path.slice(secondPathSlash + 1) : record.path,
        // Simplified heading-logic > could be extended to fullstyle headings
        // Map Pruvious 'title' field to Odoo 'heading' field
        heading: record.title,
        // TODO: Synchronize meta_description from Pruvious 'description' field
        teasertext: record.teaserText || '',
        publishDate: record.publishDate ? new Date(record.publishDate) : null,
        md: record.md || '',
        public: record.public || false,
        cimg: record.cimg || '',
        headerType: record.headerType || '',
        headerSize: record.headerSize || '',
        metaKeywords: record.metaTags.find((tag: any) => tag.name === 'keywords')?.content ?? '',
        blocks: record.blocks,
        // publishDate: record.publishDate ? new Date(record.publishDate).toISOString() : null,
        // author: record.author.email,
      }
    } else if (this.collection === 'events') {
      return {
        ...base,
        // slug: record.path,
        // Simplified heading-logic > could be extended to fullstyle headings
        // Map Pruvious 'title' field to Odoo 'heading' field
        heading: record.title,
        // TODO: Synchronize meta_description from Pruvious 'description' field
        md: record.md || '',
        metaKeywords: record.metaTags.find((tag: any) => tag.name === 'keywords')?.content ?? '',
        blocks: record.blocks,
        teasertext: record.teaserText || '',
        // dateBegin: record.dateBegin ? new Date(record.dateBegin).toISOString() : null,
        // dateEnd: record.dateEnd ? new Date(record.dateEnd).toISOString() : null,
        // organizer: record.organizer ? { email: record.organizer.email } : null,
        // editMode: record.editMode || 'content',
      }
    } else if (this.collection === 'domainusers') {
      return {
        ...base,
        // TODO: Implement full upsync for domainusers if needed
        // Simplified non-standardized pattern: Map Pruvious 'description' or 'teaserText' to Odoo 'description'
        // (Odoo does not provide separate teasertext field for domainusers)
        // TODO: Determine which Pruvious field (description vs teaserText) should be prioritized for upsync
        role: record.role || '',
        // Note: Other domainuser fields may need to be mapped here for upsync
      }
    }
  }

  /**
   * Filter Odoo records for the current site by checking the `cid` prefix against the domain code.
   */
  protected async filterRecordsForThisSite<T extends { cid: string }>(odooRecords: T[]): Promise<T[]> {
    const domainCode = process.env.NUXT_DOMAIN_CODE
    return odooRecords.filter((odooRecord) => odooRecord.cid.startsWith(`${domainCode}.`))
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
    }

    const loginClient = createApiClient(baseConfig)
    const loginResponse = await loginClient.api.mutation(
      { mutationName: 'LoginMutation' } as any,
      { email: process.env.NUXT_ODOO_SYNC_USER_EMAIL, password: process.env.NUXT_ODOO_SYNC_USER_PASSWORD } as any,
    )

    if (loginResponse.errors?.length || !loginResponse.data?.cookie) {
      throw new Error(loginResponse.errors[0].message)
    }

    this.apolloClientApi = createApiClient({ ...baseConfig, headers: { Cookie: loginResponse.data.cookie } }).api
  }
}
