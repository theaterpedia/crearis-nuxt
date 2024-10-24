import { defineEventHandler } from 'h3'
import { SyncableMicrosoftCollection } from '../../utils/SyncableMicrosoftCollection';

export default defineEventHandler((event) => {
  if (!event.context.auth.isLoggedIn) {
    setResponseStatus(event, 401)
    return 'Unauthorized'
  }

  if (!event.context.auth.user.isAdmin) {
    setResponseStatus(event, 403)
    return "You don't have permission to perform this action"
  }

  return new SyncableMicrosoftCollection('taxonomies').syncFromMicrosoft()
})
