'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

var client = require('@apollo/client')
var fetch = require('cross-fetch')
var middleware = require('@vue-storefront/middleware')
var requestIp = require('request-ip')
var consola = require('consola')

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e }
}

var fetch__default = /*#__PURE__*/ _interopDefaultLegacy(fetch)
var requestIp__default = /*#__PURE__*/ _interopDefaultLegacy(requestIp)
var consola__default = /*#__PURE__*/ _interopDefaultLegacy(consola)

const buildClient = (settings) => {
  const httpLink = client.createHttpLink({
    uri: settings.odooGraphqlUrl,
    credentials: 'include',
    fetch: fetch__default['default'],
    fetchOptions: settings.fetchOptions,
    headers: settings.headers,
  })
  const afterwareLink = new client.ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      const context = operation.getContext()
      const authHeader = context.response.headers.get('set-cookie')
      if (response.data) {
        response.data.cookie = authHeader
      }
      return response
    })
  })
  const apolloLink = client.ApolloLink.from([afterwareLink.concat(httpLink)])
  return new client.ApolloClient({
    link: apolloLink,
    cache: new client.InMemoryCache(),
    ssrMode: true,
    credentials: 'include',
    defaultOptions: {
      query: {
        errorPolicy: 'all',
        fetchPolicy: 'no-cache',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  })
}

const sessionHeaderExtension = {
  name: 'sessionHeaderExtension ',
  hooks: (req, res) => {
    return {
      beforeCreate: ({ configuration }) => {
        const clientIp = requestIp__default['default'].getClientIp(req)
        return {
          ...configuration,
          sessionAuth: req.headers.cookie,
          requestHost: req.headers.host,
          realIp: clientIp,
        }
      },
      beforeCall: ({ configuration, callName, args }) => args,
      afterCall: ({ configuration, callName, response }) => {
        if (response?.data?.cookie) {
          res.setHeader('Set-cookie', response?.data?.cookie)
        }
        return response
      },
    }
  },
}

const mutation = async (context, metadata, params) => {
  if (!metadata || !metadata.mutationName) {
    const msg = 'Developer Error: mutationName is required'
    consola__default['default'].error(msg)
    throw msg
  }
  if (!context.config.queries || Object.keys(context.config?.queries)?.length == 0) {
    const msg = 'Developer Error: mutations must be configured (MiddlewareConfig.queries)'
    consola__default['default'].error(msg)
    throw msg
  }
  const mutation = context.config.queries[metadata.mutationName]
  if (!mutation) {
    const msg = `Developer Error: mutation ${metadata.mutationName} is not configured in middleware`
    consola__default['default'].error(msg)
    throw msg
  }
  const response = await context.client.mutate({
    variables: params,
    mutation,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })
  return response
}

const query = async (context, metadata, params) => {
  if (!metadata || !metadata.queryName) {
    const msg = 'Developer Error: queryName is required'
    consola__default['default'].error(msg)
    throw msg
  }
  if (!context.config.queries || Object.keys(context.config?.queries)?.length == 0) {
    const msg = 'Developer Error: queries must be configured (MiddlewareConfig.queries)'
    consola__default['default'].error(msg)
    throw msg
  }
  const query = context.config.queries[metadata.queryName]
  if (!query) {
    const msg = `Developer Error: query ${metadata.queryName} is not configured in middleware`
    consola__default['default'].error(msg)
    throw msg
  }
  const response = await context.client.query({
    variables: params,
    query,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })
  return response
}

var apiEndpoints = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  mutation: mutation,
  query: query,
})

const onCreate = (settings) => {
  const client = buildClient(settings)
  return {
    config: settings,
    client,
  }
}
const { createApiClient } = middleware.apiClientFactory({
  onCreate,
  api: apiEndpoints,
  extensions: [sessionHeaderExtension],
})

exports.createApiClient = createApiClient
//# sourceMappingURL=index.js.map
