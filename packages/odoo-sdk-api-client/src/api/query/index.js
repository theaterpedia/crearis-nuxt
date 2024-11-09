import consola from 'consola'

export const query = async (context, metadata, params) => {
  if (!metadata || !metadata.queryName) {
    const msg = 'Developer Error: queryName is required'
    consola.error(msg)
    throw msg
  }

  if (!context.config.queries || Object.keys(context.config?.queries)?.length == 0) {
    const msg = 'Developer Error: queries must be configured (MiddlewareConfig.queries)'
    consola.error(msg)
    throw msg
  }

  const query = context.config.queries[metadata.queryName]

  if (!query) {
    const msg = `Developer Error: query ${metadata.queryName} is not configured in middleware`
    consola.error(msg)
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
