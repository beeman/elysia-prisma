import { ACCESS_TOKEN_EXP, appJwt, getExpTimestamp, REFRESH_TOKEN_EXP } from '@api/core/data-access'
import { userFindUnique } from '@api/user/data-access'
import { JWTPayloadSpec } from '@elysiajs/jwt'
import { Elysia } from 'elysia'

export function authPlugin(app: Elysia) {
  return (
    app
      .use(appJwt)
      // Derive
      .derive(
        async ({
          //
          jwt,
          cookie: { accessToken },
          set,
        }) => {
          if (!accessToken.value) {
            // handle error for access token is not available
            set.status = 'Unauthorized'
            throw new Error('Access token is missing')
          }

          const jwtPayload = await jwt.verify(accessToken.value)
          if (!jwtPayload || !jwtPayload?.sub) {
            // handle error for access token is tempted or incorrect
            set.status = 'Forbidden'
            throw new Error('Access token is invalid')
          }

          const user = await userFindUnique(jwtPayload.sub)

          if (!user) {
            // handle error for user not found from the provided access token
            set.status = 'Forbidden'
            throw new Error('Access token is invalid')
          }

          return {
            user: { ...user, password: undefined },
          }
        },
      )
  )
}

export type JwtSigner = {
  readonly sign: (morePayload: Record<string, string | number> & JWTPayloadSpec) => Promise<string>
}

export async function createAccessRefreshToken({ jwt, sub }: { jwt: JwtSigner; sub: string }) {
  return Promise.all([
    await jwt.sign({
      sub,
      exp: getExpTimestamp(ACCESS_TOKEN_EXP),
      iat: Date.now(),
    }),
    await jwt.sign({
      sub,
      exp: getExpTimestamp(REFRESH_TOKEN_EXP),
      iat: Date.now(),
    }),
  ])
}
