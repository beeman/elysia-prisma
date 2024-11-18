import { treaty } from '@elysiajs/eden'
import { beforeAll, describe, expect, it } from 'bun:test'
import { app } from '../src'

const { api } = treaty(app, {})

function uniq(str: string): string {
  const timestamp = Date.now() // Current timestamp in milliseconds
  return `${str}_${timestamp}`
}

describe('auth', () => {
  let username: string
  let password: string
  let cookie: string

  beforeAll(async () => {
    username = uniq('user')
    password = uniq('password')
  })

  describe('Expected Usage', () => {
    it('should successfully register a new user', async () => {
      const response = await api.auth.register.post({
        username,
        password,
      })
      expect(response.status).toBe(200)
      expect(response.data).toHaveProperty('username', username)
      expect(response.data?.admin).toBeFalse()
      expect(response.data?.avatarUrl).toBeNull()
      expect(response.data?.name).toBeNull()
      expect(response.data?.password).toBeNull()
    })

    it('should successfully login with valid credentials', async () => {
      const response = await api.auth.login.post({
        username,
        password,
      })
      expect(response.status).toBe(200)
      cookie = (response.headers as Headers).getSetCookie().join(';')

      expect(cookie).toContain('accessToken')
      expect(cookie).toContain('refreshToken')
      expect(response.data).toHaveProperty('username', username)
    })

    it('should return user details for /me with valid token', async () => {
      const loginResponse = await api.auth.login.post({
        username,
        password,
      })
      const response = await api.auth.me.get({
        headers: { cookie },
      })
      expect(response.status).toBe(200)
      expect(response.data).toHaveProperty('username', username)
    })

    it('should refresh tokens successfully', async () => {
      const loginResponse = await api.auth.login.post({
        username,
        password,
      })
      const response = await api.auth.refresh.post(undefined, {
        headers: { cookie },
      })
      expect(response.status).toBe(200)
      // expect(response.cookies).toHaveProperty('accessToken')
      // expect(response.cookies).toHaveProperty('refreshToken')
    })

    it('should logout successfully and clear cookies', async () => {
      const loginResponse = await api.auth.login.post({
        username,
        password,
      })
      const response = await api.auth.logout.post(undefined, {
        headers: { cookie },
      })
      expect(response.status).toBe(200)
      // expect(response.cookies.accessToken).toBeUndefined()
      // expect(response.cookies.refreshToken).toBeUndefined()
    })
  })

  describe('Unexpected Usage', () => {
    it('should return an error when registering with an existing username', async () => {
      const response = await api.auth.register.post({
        username,
        password: 'password123',
      })
      expect(response.error?.status).toBe(409)
      expect(response.error?.value).toHaveProperty('name', `Error`)
      expect(response.error?.value).toHaveProperty('message', `The username ${username} already exists`)
    })

    it('should return an error when logging in with invalid credentials', async () => {
      const response = await api.auth.login.post({
        username,
        password: 'wrongpassword',
      })
      expect(response.error?.status).toBe(400)
      expect(response.error?.value).toHaveProperty('message', 'The username or password you entered is incorrect')
    })

    it('should return an error when refreshing with a missing token', async () => {
      const response = await api.auth.refresh.post()
      expect(response.error?.status).toBe(401)
      expect(response.error?.value).toHaveProperty('message', 'Refresh token is missing')
    })

    it('should return an error for /me without a valid token', async () => {
      const response = await api.auth.me.get({ headers: { cookie: '' } })
      expect(response.error?.status).toBe(401)
      expect(response.error?.value).toHaveProperty('message', 'Access token is missing')
    })
  })
})
