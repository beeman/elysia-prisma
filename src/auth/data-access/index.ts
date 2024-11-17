import { t } from 'elysia'

export const registerSchema = t.Object({
  name: t.Optional(t.String({ maxLength: 60, minLength: 1 })),
  username: t.String({ minLength: 3 }),
  password: t.String({ minLength: 8 }),
})

export const loginBodySchema = t.Object({
  username: t.String({ minLength: 3 }),
  password: t.String({ minLength: 8 }),
})
