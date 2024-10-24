import { defineNuxtRouteMiddleware, useCookie } from '#imports'

export default defineNuxtRouteMiddleware(async () => {
  if (process.client) {
    const { getRawToken, removeToken, setToken, useAuth } = await import('#pruvious/client')
    const cookie = useCookie('odoo-user') as Ref<{ id: number }>
    const auth = useAuth()
    
    if (!cookie.value?.id) {
      removeToken()
    } else if (!getRawToken()) {
      setToken(await createToken({ userId: cookie.value.id }))
    }
    
    auth.value.userId = cookie.value?.id ?? null
    auth.value.isLoggedIn = !!cookie.value?.id
  }
})

async function createToken(payload: any) {
  const header = { typ: 'JWT', alg: 'HS256' }

  const segments: string[] = []
  segments.push(encodeBase64Url(JSON.stringify(header)))
  segments.push(encodeBase64Url(JSON.stringify(payload)))

  const footer = await sign(segments.join('.'))

  segments.push(footer)

  return segments.join('.')
}

async function sign(data: string) {
  return window.crypto.subtle
    .importKey(
      'jwk',
      {
        kty: 'oct',
        k: 'jwt',
        alg: 'HS256',
        ext: true,
      },
      {
        name: 'HMAC',
        hash: { name: 'SHA-256' },
      },
      true,
      ['sign', 'verify'],
    )
    .then((key) => {
      const jsonString = JSON.stringify(data)
      const encodedData = new TextEncoder().encode(jsonString)

      return window.crypto.subtle.sign(
        {
          name: 'HMAC',
        },
        key,
        encodedData,
      )
    })
    .then((token) => {
      const u8 = new Uint8Array(token)
      const b64encoded = btoa(String.fromCharCode.apply(null, u8 as any))

      return b64encoded
    })
}

function encodeBase64Url(data: string) {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
