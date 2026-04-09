/**
 * JSON-LD Structured Data Plugin
 *
 * Injects EducationalOrganization schema site-wide,
 * and Course schema on product pages (detected via cssclasses: product).
 */
export default defineNuxtPlugin(() => {
  const siteUrl = 'https://dasei.eu'

  const organization = {
    '@type': 'EducationalOrganization',
    'name': 'DAS Ei — Theaterpädagogisches Institut Bayern e.V.',
    'url': siteUrl,
    'logo': `${siteUrl}/logo.svg`,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Fürther Str. 174a',
      'postalCode': '90429',
      'addressLocality': 'Nürnberg',
      'addressRegion': 'Bayern',
      'addressCountry': 'DE',
    },
    'areaServed': 'Bayern',
    'foundingDate': '1994',
  }

  // Site-wide EducationalOrganization
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          ...organization,
        }),
      },
    ],
  })
})
