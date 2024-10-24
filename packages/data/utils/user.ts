import { getCapabilities } from '#pruvious'
import { query } from '#pruvious/server'
import { nanoid } from 'nanoid'

/**
 * Ensure that a user exists in the Pruvious database.
 * 
 * @returns The user record.
 * @throws An error if the user could not be created.
 */
export async function ensureUser(email: string) {
  let user = await query('users')
    .selectAll()
    .where('email', email)
    .populate()
    .first()

  if (!user) {
    const createResult = await query('users')
      .selectAll()
      .populate()
      .create({ email, password: nanoid(), isActive: true } as any)

    if (createResult.success) {
      user = createResult.record
    } else {
      throw new Error(createResult.message ?? JSON.stringify(createResult.errors))
    }
  }

  // @todo resolve capabilities
  // @see https://www.mindomo.com/mindmap/7379ca4f82216d606f843655be7ad166?t=8e9071a55a6c8ea26cf6e2d0eac28c64
  const capabilities = getCapabilities(user)

  return user
}
