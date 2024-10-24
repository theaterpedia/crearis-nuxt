import { __ } from '#pruvious/server'
import { type Endpoints } from '@erpgap/odoo-sdk-api-client'
import { defineEventHandler, deleteCookie, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  if (!event.context.auth.isLoggedIn) {
    setResponseStatus(event, 401)
    return __(event, 'pruvious-server', 'Unauthorized due to either invalid credentials or missing authentication')
  }

  const api: Endpoints = event.context.apolloClient.api;
  await api.mutation({ mutationName: 'LogoutMutation' } as any, null as any);

  deleteCookie(event, 'session_id')
  deleteCookie(event, 'odoo-user')

  return true
})
