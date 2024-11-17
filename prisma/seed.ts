import { Prisma, PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

const users: Prisma.UserCreateInput[] = [
  {
    username: 'alice',
  },
  {
    username: 'bob',
  },
  {
    username: 'charlie',
  },
]

async function main() {
  console.log(`Create ${users.length} users`)
  for (const user of users) {
    console.log(` -> Creating user ${user.username}`)
    await prisma.user.create({ data: user })
  }
}

await main()
  .then(() => {
    console.log(`Db seed done!`)
  })
  .catch((err) => {
    console.error(`Something went wrong: ${err}`)
  })
