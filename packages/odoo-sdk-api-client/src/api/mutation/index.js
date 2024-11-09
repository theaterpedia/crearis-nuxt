import consola from 'consola'

export const mutation = async (context, metadata, params) => {
  if (!metadata || !metadata.mutationName) {
    const msg = 'Developer Error: mutationName is required'
    consola.error(msg)
    throw msg
  }

  if (!context.config.queries || Object.keys(context.config?.queries)?.length == 0) {
    const msg = 'Developer Error: mutations must be configured (MiddlewareConfig.queries)'
    consola.error(msg)
    throw msg
  }

  const mutation = context.config.queries[metadata.mutationName]

  if (!mutation) {
    const msg = `Developer Error: mutation ${metadata.mutationName} is not configured in middleware`
    consola.error(msg)
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
