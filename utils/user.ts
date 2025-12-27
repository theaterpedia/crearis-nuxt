import { getCapabilities } from '#pruvious'
import { query } from '#pruvious/server'
import { nanoid } from 'nanoid'

/**
 * Ensure that a user exists in the Pruvious database.
 *
 * @returns The user record.
 * @throws An error if the user could not be created.
 */
export async function ensureUser(email: string, firstName?: string, lastName?: string) {
  let user = await query('users').selectAll().where('email', email).populate().first()

  if (!user) {
    const createResult = await query('users')
      .selectAll()
      .populate()
      .create({ email, password: nanoid(), isActive: true, firstName, lastName } as any)

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

/**
 * Ensure that a partner exists in the Pruvious database.
 * Looks up partner by Odoo ID (oid field) and creates if not found.
 *
 * @param odooId - The Odoo ID of the partner
 * @param name - The partner name
 * @param email - Optional email address
 * @param phone - Optional phone number
 * @returns The partner record or null if odooId is not provided
 * @throws An error if the partner could not be created
 */
export async function ensurePartner(odooId?: number, name?: string, email?: string, phone?: string) {
  if (!odooId) {
    return null
  }

  let partner = await query('partners').selectAll().where('oid', odooId).first()

  if (!partner) {
    const createResult = await query('partners')
      .selectAll()
      .create({ 
        oid: odooId, 
        name: name || `Partner ${odooId}`,
        email: email || undefined,
        phone: phone || undefined,
      } as any)

    if (createResult.success) {
      partner = createResult.record
    } else {
      throw new Error(createResult.message ?? JSON.stringify(createResult.errors))
    }
  }

  return partner
}
