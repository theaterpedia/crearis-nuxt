import type { IntegrationContext } from '@vue-storefront/middleware'
import type { MiddlewareConfig, ContextualizedEndpoints } from '../index'
import { ApolloClient } from '@apollo/client/core/core.cjs'

/**
 * Runtime integration context, which includes API client instance, settings, and endpoints that will be passed via middleware server.
 **/
export type OdooIntegrationContext = IntegrationContext<ApolloClient<any>, MiddlewareConfig, ContextualizedEndpoints>

/**
 * Global context of the application which includes runtime integration context.
 **/
export interface Context {
  $odoo: OdooIntegrationContext
}
