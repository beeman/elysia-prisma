import { PrismaClient } from '@prisma/client'

export * from './prisma/barrel'
export { Prisma } from '@prisma/client'
export const data = new PrismaClient()
