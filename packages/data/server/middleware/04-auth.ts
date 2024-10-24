import { query } from '#pruvious/server'
import { type Endpoints } from '@erpgap/odoo-sdk-api-client'
import { defineEventHandler, getCookie } from 'h3'
import { type Partner } from '../../graphql'

export default defineEventHandler(async (event) => {
  const api: Endpoints = event.context.apolloClient.api
  const cookie = getCookie(event, 'session_id')
 
  if (cookie) {
    const response = await api.query<any, { partner: Partner }>({ queryName: 'LoadUserQuery' } as any, null as any)
   
    if (response.data?.partner) {
      const user = await query('users')
        .deselect({ password: true })
        .where('email', response.data.partner.email)
        .populate()
        .first()
      
      event.context.auth = user ? { isLoggedIn: true, user } : { isLoggedIn: false, user }
    } else {
      event.context.auth = { isLoggedIn: false, user: null }
    }
  } else {
    event.context.auth = { isLoggedIn: false, user: null }
  }
})
