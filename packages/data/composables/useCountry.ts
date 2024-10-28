import type { Country, QueryCountriesArgs, CountryListResponse } from '../graphql'
import { QueryName } from '../server/queries'

export const useCountry = () => {
  const { useSdk } = useNuxtApp()

  const loading = ref(false)
  const countries = useState<Country[]>('countries', () => [])

  const loadCountryList = async () => {
    if (countries.value.length) {
      return
    }
    loading.value = true
    try {
      const { data } = await useAsyncData('country-list', async () => {
        const { data } = await useSdk().odoo.query<QueryCountriesArgs, CountryListResponse>({
          queryName: QueryName.GetCountriesQuery,
        })
        return data.value
      })

      if (data.value) {
        countries.value = data.value.countries.countries
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loadCountryList,
    countries,
    loading,
  }
}
