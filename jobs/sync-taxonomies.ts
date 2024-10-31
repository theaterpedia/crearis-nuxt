import { defineJob } from "#pruvious"
import { SyncableMicrosoftCollection } from "../utils/SyncableMicrosoftCollection"

export default defineJob({
  name: 'sync-taxonomies',
  callback: () => new SyncableMicrosoftCollection('taxonomies').syncFromMicrosoft(),
  interval: 60 * 60 * 24, // 24 hours
})
