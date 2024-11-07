import { createApiClient } from '../../packages/odoo-sdk-api-client/src/index.server'
// import { MiddlewareConfig } from "@crearis-nuxt/odoo-sdk-api-client/server";

import type { MiddlewareConfig } from '@crearis-nuxt/odoo-sdk-api-client'
import { Mutations } from '../mutations'
import { Queries } from '../queries'

export default defineEventHandler((event) => {
  const config: MiddlewareConfig = {
    odooGraphqlUrl: `${process.env.NUXT_PUBLIC_ODOO_BASE_URL}graphql/vsf`,
    queries: { ...Queries, ...Mutations },
    headers: {
      'REAL-IP': getRequestIP(event) || '',
      'resquest-host': getRequestHost(event),
    },
  }
  if (parseCookies(event).session_id) {
    ;(config.headers as Record<string, string>).Cookie = `session_id=${parseCookies(event).session_id}`
  }

  event.context.apolloClient = createApiClient(config)
})
