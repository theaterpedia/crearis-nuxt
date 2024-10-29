import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from '#imports'
import { cacheModuleOptions } from '#pruvious/server'


export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()
  cacheModuleOptions(runtimeConfig)
})
