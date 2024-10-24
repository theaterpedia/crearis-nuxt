import { defineHook } from "#pruvious";
import { SyncableOdooCollection } from '../../utils/SyncableOdooCollection'

export default defineHook('posts', 'afterCreate', async ({ query, record, user }) => {
  if (user && record.id) {
    await query('posts').where('id', record.id).update({ syncId: `${process.env.NUXT_DOMAIN_CODE}.blog-pruv.${record.id}` })
    await new SyncableOdooCollection('posts').syncRecordToOdoo(record.id)
  }
})
