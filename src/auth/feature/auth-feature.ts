import { loginBodySchema, registerSchema } from '@api/auth/data-access'
import { ACCESS_TOKEN_EXP, appJwt, data, REFRESH_TOKEN_EXP } from '@api/core/data-access'
import { userFindUnique } from '@api/user/data-access'
import { Elysia } from 'elysia'
import { authPlugin, createAccessRefreshToken } from '../data-access/auth-plugin'

export const authFeature = new Elysia({ prefix: '/auth', tags: ['auth'] })
  .use(appJwt)
  .post(
    '/login',
    async ({ body, jwt, cookie, set }) => {
      type jwtType = typeof jwt
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
    },
  )
  .post(
    '/register',
    async ({ body }) => {
      const password = await Bun.password.hash(body.password, { algorithm: 'bcrypt', cost: 10 })

      const created = await data.user.create({ data: { ...body, password } })

      return { ...created, password: null }
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
    },
  )
  .post('/refresh', async ({ cookie, jwt, set }) => {
    if (!cookie.refreshToken.value) {
      // handle error for refresh token is not available
      set.status = 'Unauthorized'
      throw new Error('Refresh token is missing')
    }
    // get refresh token from cookie
    const jwtPayload = await jwt.verify(cookie.refreshToken.value)
    if (!jwtPayload) {
      // handle error for refresh token is tempted or incorrect
      set.status = 'Forbidden'
      throw new Error('Refresh token is invalid')
    }

    // get user from refresh token
    const userId = jwtPayload.sub

    // verify user exists or not
    const user = await data.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      // handle error for user not found from the provided refresh token
      set.status = 'Forbidden'
      throw new Error('Refresh token is invalid')
    }

    const [accessToken, refreshToken] = await createAccessRefreshToken({ jwt, sub: user.id })
    cookie.accessToken.set({ httpOnly: true, maxAge: ACCESS_TOKEN_EXP, path: '/', value: accessToken })
    cookie.refreshToken.set({ httpOnly: true, maxAge: REFRESH_TOKEN_EXP, path: '/', value: refreshToken })

    return true
  })
  .use(authPlugin)
  .post('/logout', async ({ cookie: { accessToken, refreshToken } }) => {
    // remove refresh token and access token from cookies
    accessToken.remove()
    refreshToken.remove()
    return true
  })
  .use(authPlugin)
  .get('/me', ({ user }) => {
    return user
  })
