import { defineHook } from '#pruvious'
import { SyncableOdooCollection } from '../../utils/SyncableOdooCollection'
// import { pruviousToasterShow } from '#pruvious/dashboard'

export default defineHook('events', 'afterUpdate', async ({ query, record, user }) => {
  if (user && record.id) {
    const odooResponse = await new SyncableOdooCollection('events').updateRecordOnOdoo(record.id)

    if (odooResponse.errors?.length) {
      const { errors } = odooResponse
      // pruviousToasterShow({
      //   message: `Could not save<br>(errors: ${errors})`,
      // })
    }
  }
})
