/**
 * Generic server-side proxy for Odoo GraphQL operations.
 * 
 * Routes all GraphQL queries/mutations through Nitro server to avoid CORS.
 * This allows CORS to be disabled on prod Odoo while supporting:
 * - Checkout mutations
 * - Consulting slot queries
 * - Consulting slot booking mutations
 * - Future GraphQL operations
 * 
 * @see _meta/Act26/03-06-SCL_consulting_loop.md#CN-Proxy-Strategy
 */

import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  
  // Validate request has query
  if (!body?.query) {
    throw createError({
      statusCode: 400,
      message: 'Missing GraphQL query'
    })
  }
  
  // Use NUXT_PUBLIC_ODOO_GRAPHQL_URL from runtime config
  const graphqlUrl = config.public.odooGraphqlUrl as string
  
  if (!graphqlUrl) {
    throw createError({
      statusCode: 500,
      message: 'NUXT_PUBLIC_ODOO_GRAPHQL_URL not configured'
    })
  }
  
  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: body.query,
        variables: body.variables || {}
      })
    })
    
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: `Odoo returned ${response.status}: ${response.statusText}`
      })
    }
    
    const json = await response.json()
    
    // Return full GraphQL response (let client handle errors/data)
    return json
    
  } catch (error) {
    console.error('[graphql.post] Fetch error:', error)
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Network error'
    })
  }
})
