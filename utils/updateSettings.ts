import { query } from '#pruvious/server'

// Single-entry collection
export const updateSettings = async (vars: { themeId: number; themeConfig: string }) => {
  const resultSingle = await query('settings').update({
    theme: vars.themeId,
    themeConfig: vars.themeConfig,
  })
  if (resultSingle.success) {
    console.log('Updated record:', resultSingle.record)
  } else {
    console.error('Update failed:', resultSingle.errors)
  }
}
