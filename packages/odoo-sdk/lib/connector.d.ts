import { Options } from './types'
import * as methods from './methods/index'
/**
 * Connector methods.
 */
type Methods = typeof methods
/**
 * Initialize the Odoo connector.
 */
export declare const odooConnector: (options: Options) => Methods
export {}
//# sourceMappingURL=connector.d.ts.map
