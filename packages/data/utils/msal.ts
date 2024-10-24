const msalConfig = {
  auth: {
    clientId: process.env.NUXT_MS_CLIENT_ID!,
    authority: 'https://login.microsoftonline.com/' + process.env.NUXT_MS_TENANT_ID,
    clientSecret: process.env.NUXT_MS_CLIENT_SECRET,
  }
}

export async function getMSToken() {
  const msal = await import('@azure/msal-node')
  return new msal.ConfidentialClientApplication(msalConfig)
    .acquireTokenByClientCredential({ scopes: ['https://graph.microsoft.com/.default'] })
    .then(response => response?.accessToken)
}
