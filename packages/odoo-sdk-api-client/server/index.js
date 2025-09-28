const buildClient = require('./clientSetup')
const { apiClientFactory } = require('@vue-storefront/middleware')

const onCreate = (settings) => {
  const client = buildClient(settings)

  return {
    config: settings,
    client,
  }
}

// Note: This is a minimal build - full functionality may require proper build process
const { createApiClient } = apiClientFactory({
  onCreate,
  api: {},
  extensions: [],
})

module.exports = { createApiClient }