import { createClient, type RedisClientType } from 'redis'
import { sleep } from '#pruvious'

export type LogCode = 'ms-sync' | 'odoo-sync'

let client: RedisClientType | undefined
let status: 'initial' | 'connecting' | 'ready' = 'initial'

/**
 * Return the Redis database client used for logging.
 *
 * @throws an error if the connection cannot be established.
 */
export async function redisLogClient(force = false) {
  if (status === 'initial' || (!client && force)) {
    const url = useRuntimeConfig().redisLogUrl

    if (url) {
      client = createClient({ url })
      status = 'connecting'
      await client.connect()
    }

    status = 'ready'
  }

  while (status === 'connecting') {
    sleep(50)
  }

  return client!
}

/**
 * Log an informational message to the Redis database.
 */
export async function logInfo(code: LogCode, message: string) {
  await log(code, `[Info] ${message}`, 'info')
}

/**
 * Log a warning message to the Redis database.
 */
export async function logWarning(code: LogCode, message: string) {
  await log(code, `[Warning] ${message}`, 'warning')
}

/**
 * Log an error message to the Redis database.
 */
export async function logError(code: LogCode, message: string) {
  await log(code, `[Error] ${message}`, 'error')
}

async function log(code: LogCode, message: string, type: 'info' | 'warning' | 'error') {
  try {
    const client = await redisLogClient()
  
    await client.rPush('logs', JSON.stringify({
      domainCode: process.env.NUXT_DOMAIN_CODE,
      logCode: code,
      loggedAt: Date.now(),
      type,
      message,
    }))
  } catch {}
}
