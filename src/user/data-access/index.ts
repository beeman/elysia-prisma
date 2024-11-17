import { data, Prisma } from '@api/core/data-access'
import { InternalServerError } from 'elysia'

export async function userCreate(input: Prisma.UserCreateInput) {
  try {
    return data.user.create({ data: input })
  } catch (e) {
    throw new InternalServerError(`Error creating user: ${e}`)
  }
}

export async function userDelete(id: string) {
  try {
    return data.user.delete({ where: { id } })
  } catch (e) {
    throw new InternalServerError(`Error deleting user: ${e}`)
  }
}

export async function userFindMany() {
  try {
    return data.user.findMany()
  } catch (e) {
    throw new InternalServerError(`Error fetching users: ${e}`)
  }
}

export async function userFindUnique(id: string) {
  try {
    return data.user.findUnique({ where: { id } })
  } catch (e) {
    throw new InternalServerError(`Error fetching user: ${e}`)
  }
}

export async function userUpdate(id: string, input: Prisma.UserUpdateInput) {
  try {
    return data.user.update({ where: { id }, data: input })
  } catch (e) {
    throw new InternalServerError(`Error updating user: ${e}`)
  }
}
