import { data, Prisma } from '@api/core/data-access'
import { InternalServerError } from 'elysia'

const select: Prisma.UserFindUniqueArgs['select'] = {
  id: true,
  createdAt: true,
  updatedAt: true,
  username: true,
  admin: true,
  avatarUrl: true,
  name: true,
}

export async function userCreate(input: Prisma.UserCreateInput) {
  try {
    return data.user.create({ data: input, select })
  } catch (e) {
    throw new InternalServerError(`Error creating user: ${e}`)
  }
}

export async function userDelete(id: string) {
  try {
    return data.user.delete({ where: { id }, select })
  } catch (e) {
    throw new InternalServerError(`Error deleting user: ${e}`)
  }
}

export async function userFindMany() {
  try {
    return data.user.findMany({ select })
  } catch (e) {
    throw new InternalServerError(`Error fetching users: ${e}`)
  }
}

export async function userFindUnique(id: string) {
  try {
    return await data.user.findUnique({ where: { id }, select })
  } catch (e) {
    throw new InternalServerError(`Error fetching user: ${e}`)
  }
}

export async function userUpdate(id: string, input: Prisma.UserUpdateInput) {
  try {
    return data.user.update({ where: { id }, data: input, select })
  } catch (e) {
    throw new InternalServerError(`Error updating user: ${e}`)
  }
}
