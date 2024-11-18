import { loginBodySchema, registerSchema } from '@api/auth/data-access'
import { ACCESS_TOKEN_EXP, appJwt, data, REFRESH_TOKEN_EXP, User } from '@api/core/data-access'
import { userCreate, userFindUnique } from '@api/user/data-access'
import { Elysia, t } from 'elysia'
import { authPlugin, createAccessRefreshToken } from '../data-access/auth-plugin'

export const authFeature = new Elysia({ prefix: '/auth', tags: ['auth'] })
  .use(appJwt)
  .post(
    '/login',
    async ({ body, jwt, cookie, set }) => {
      // match user username
      const user = await data.user.findUnique({
        where: { username: body.username },
        select: {
          id: true,
          username: true,
          password: true,
        },
      })

      if (!user) {
        set.status = 'Bad Request'
        throw new Error('The username or password you entered is incorrect')
      }

      // match password
      const matchPassword = await Bun.password.verify(body.password, user.password ?? '', 'bcrypt')
      if (!matchPassword) {
        set.status = 'Bad Request'
        throw new Error('The username or password you entered is incorrect')
      }

      const [accessToken, refreshToken] = await createAccessRefreshToken({ jwt, sub: user.id })
      cookie.accessToken.set({ httpOnly: true, maxAge: ACCESS_TOKEN_EXP, path: '/', value: accessToken })
      cookie.refreshToken.set({ httpOnly: true, maxAge: REFRESH_TOKEN_EXP, path: '/', value: refreshToken })

      return userFindUnique(user.id)
    },
    {
      body: loginBodySchema,
      response: t.Nullable(User),
    },
  )
  .post(
    '/register',
    async ({ body }) => {
      const password = await Bun.password.hash(body.password, { algorithm: 'bcrypt', cost: 10 })

      const created = await userCreate({ ...body, password })

      return { ...created, password: undefined }
    },
    {
      body: registerSchema,
      error({ code, set, body }) {
        if ((code as unknown) === 'P2002') {
          set.status = 'Conflict'
          return {
            name: 'Error',
            message: `The username ${body.username} already exists`,
          }
        }
      },
      response: User,
    },
  )
  .post(
    '/refresh',
    async ({ cookie, jwt, set }) => {
      if (!cookie.refreshToken.value) {
        // handle error for refresh token is not available
        set.status = 'Unauthorized'
        throw new Error('Refresh token is missing')
      }
      // get refresh token from cookie
      const jwtPayload = await jwt.verify(cookie.refreshToken.value)
      if (!jwtPayload || !jwtPayload.sub) {
        // handle error for refresh token is tempted or incorrect
        set.status = 'Forbidden'
        throw new Error('Refresh token is invalid')
      }

      // verify user exists or not
      const user = await userFindUnique(jwtPayload.sub)

      if (!user) {
        // handle error for user not found from the provided refresh token
        set.status = 'Forbidden'
        throw new Error('Refresh token is invalid')
      }

      const [accessToken, refreshToken] = await createAccessRefreshToken({ jwt, sub: user.id })
      cookie.accessToken.set({ httpOnly: true, maxAge: ACCESS_TOKEN_EXP, path: '/', value: accessToken })
      cookie.refreshToken.set({ httpOnly: true, maxAge: REFRESH_TOKEN_EXP, path: '/', value: refreshToken })

      return true
    },
    { response: t.Boolean() },
  )
  .use(authPlugin)
  .post(
    '/logout',
    async ({ cookie: { accessToken, refreshToken } }) => {
      // remove refresh token and access token from cookies
      accessToken.remove()
      refreshToken.remove()
      return true
    },
    { response: t.Boolean() },
  )
  .use(authPlugin)
  .get('/me', ({ user }) => user, { response: User })
