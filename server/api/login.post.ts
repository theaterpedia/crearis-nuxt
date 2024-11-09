import type { Endpoints } from '@crearis/odoo-sdk-api-client'

import {
  appendResponseHeader,
  defineEventHandler,
  getRequestHost,
  getRequestIP,
  parseCookies,
  setCookie,
  setResponseStatus,
} from 'h3'
import type { LoginUserResponse, MutationLoginArgs, Partner } from '../../graphql'
import { Queries } from '../../server/queries'
import { Mutations } from '../../server/mutations'
import { ensureUser } from '../../utils/user'
import { catchFirstErrorMessage, isKeyOf, isObject } from '#pruvious'
import {
  __,
  booleanValidator,
  booleanishSanitizer,
  emailValidator,
  generateToken,
  getModuleOption,
  pruviousReadBody,
  requiredValidator,
  stringSanitizer,
  stringValidator,
} from '#pruvious/server'

export default defineEventHandler(async (event) => {
  const api: Endpoints = event.context.apolloClient.api
  const body = await pruviousReadBody(event)
  const data: Record<string, any> = isObject(body) ? body : {}
  const email = isKeyOf(data, 'email') ? stringSanitizer({ value: data.email }) : undefined
  const password = isKeyOf(data, 'password') ? stringSanitizer({ value: data.password }) : undefined
  const remember = isKeyOf(data, 'remember') ? booleanishSanitizer({ value: data.remember }) : false
  const errors = await catchFirstErrorMessage({
    email: [
      () => requiredValidator({ __, language: event.context.language, value: email }),
      () => stringValidator({ value: email }),
      () => emailValidator({ value: email }),
    ],
    password: [
      () => requiredValidator({ __, language: event.context.language, value: password }),
      () => stringValidator({ value: password }),
    ],
    remember: [() => booleanValidator({ value: remember })],
  })

  if (Object.keys(errors).length) {
    setResponseStatus(event, 422)
    return errors
  }

  /* const response = await api.mutation<any, any>({ mutationName: 'LoginMutation' } as any, { email, password } as any) */
  const response = await api.mutation<MutationLoginArgs, LoginUserResponse>(
    { mutationName: 'LoginMutation' } as any,
    { email, password } as any,
  )

  if (response.errors?.length || !response.data?.cookie) {
    setResponseStatus(event, 400)
    return response?.errors?.[0].message || 'Error while logging in'
  }

  /*
  FIRST CODE FROM 3/2024, was deactivated 4/2024
  const newClient = createApiClient({
    odooGraphqlUrl: `${process.env.NUXT_PUBLIC_ODOO_BASE_URL}graphql/vsf`,
    queries: { ...Queries, ...Mutations },
    headers: {
      'REAL-IP': getRequestIP(event) || '',
      'Cookie': response.data.cookie,
      'resquest-host': getRequestHost(event),
    },
  })
    */

  /* old code from 4/2024 > This code does not work anymore, because the 'loadUserQuery' is deleted from the API (new UserProfileQuery not active yet)
  const userData = await api.query<any, { partner: Partner }>({ queryName: 'LoadUserQuery' } as any, null)

  if (!userData?.data?.partner) {
    setResponseStatus(event, 400)
    return 'Error while fetching user data'
  }
  */

  // new code 11/2024
  if (!response.data.login?.partner) {
    setResponseStatus(event, 400)
    return 'Error while fetching user data'
  }
  // end new code

  if (response.data.cookie) {
    appendResponseHeader(event, 
      'Set-cookie', 
      response.data?.cookie + 
        '; odoo-user=' + encodeURIComponent(JSON.stringify(response.data.login.partner)) +
        '; SameSite=Strict',
    )
    appendResponseHeader(
      event, 
      'Set-cookie', 
      'odoo-user=' + encodeURIComponent(JSON.stringify(response.data.login.partner)) + 
        '; Path=/' + 
        /* '; expires=' + new Date(Date.now() + 108000000).toUTCString() + */
        '; SameSite=Strict',
    )
  } else {
    setResponseStatus(event, 400)
    return 'Unable to set cookie'
  }

  const user = await ensureUser(email)

  // Dummy token
  const token = generateToken(
    user.id,
    remember ? getModuleOption('jwt').expirationLong : getModuleOption('jwt').expiration,
  )

  return token
})
