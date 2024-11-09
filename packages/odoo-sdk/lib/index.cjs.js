'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

var axios = require('axios')
var hash = require('object-hash')

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e }
}

var axios__default = /*#__PURE__*/ _interopDefaultLegacy(axios)
var hash__default = /*#__PURE__*/ _interopDefaultLegacy(hash)

const axiosInstance = axios__default['default'].create()
axiosInstance.defaults.withCredentials = true
const client = axiosInstance

/**
 * Initialize the Odoo connector.
 */
const odooConnector = (options) => {
  let mutation = null
  let query = null
  let queryNoCache = null
  mutation = async (metadata, params) => {
    return await client.post('mutation', [metadata, params])
  }
  query = async (metadata, params) => {
    return await client.post('query', [metadata, params])
  }
  queryNoCache = async (metadata, params) => {
    return await client.post('query=no-cache', [metadata, params])
  }
  if (options.ofetch) {
    mutation = async (metadata, params) => {
      return options.ofetch('/api/odoo/mutation', {
        method: 'POST',
        body: [metadata, params],
        cache: 'no-cache',
        ...options.ofetchOptions,
      })
    }
    query = async (metadata, params) => {
      const cacheKey = metadata.cacheKey || hash__default['default']({ ...metadata, ...params })
      return options.ofetch('/api/odoo/query', {
        method: 'POST',
        body: [metadata, params],
        cache: 'no-cache',
        key: cacheKey,
        ...options.ofetchOptions,
      })
    }
    queryNoCache = async (metadata, params) => {
      const cacheKey = metadata.cacheKey || hash__default['default']({ ...metadata, ...params })
      return options.ofetch('/api/odoo/query-no-cache', {
        method: 'POST',
        body: [metadata, params],
        cache: 'no-cache',
        key: cacheKey,
        ...options.ofetchOptions,
      })
    }
  }
  client.defaults.baseURL = options.apiUrl
  return { query, mutation, queryNoCache }
}

/**
 * Odoo module.
 */
const OdooModule = (options) => ({
  connector: odooConnector({
    apiUrl: options.apiUrl,
    ofetch: options.ofetch,
  }),
  utils: {},
  subscribers: {},
})

exports.OdooModule = OdooModule
exports.client = client
//# sourceMappingURL=index.cjs.js.map
