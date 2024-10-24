import { useRuntimeConfig } from '#imports'
import { cacheModuleOptions } from '#pruvious/server'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()
  cacheModuleOptions(runtimeConfig)
})
