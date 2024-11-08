import axios from 'axios'
import hash from 'ohash'

const axiosInstance = axios.create()
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
      const cacheKey = metadata.cacheKey || hash({ ...metadata, ...params })
      return options.ofetch('/api/odoo/query', {
        method: 'POST',
        body: [metadata, params],
        cache: 'no-cache',
        key: cacheKey,
        ...options.ofetchOptions,
      })
    }
    queryNoCache = async (metadata, params) => {
      const cacheKey = metadata.cacheKey || hash({ ...metadata, ...params })
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

export { OdooModule, client }
//# sourceMappingURL=index.es.js.map
