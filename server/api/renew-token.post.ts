import { __, generateToken, getBearerToken } from '#pruvious/server'
import { defineEventHandler, setResponseStatus } from 'h3'
import jwt, { type JwtPayload } from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  if (!event.context.auth.isLoggedIn) {
    setResponseStatus(event, 401)
    return __(event, 'pruvious-server', 'Unauthorized due to either invalid credentials or missing authentication')
  }

  const currentToken = getBearerToken(event)

  try {
    const { iat, exp } = jwt.decode(currentToken) as JwtPayload
    const newToken = generateToken(event.context.auth.user.id, exp! - iat!)

    return newToken
  } catch {
    return currentToken
  }
})
