import { authFeature } from '@api/auth/feature'
import { coreFeature } from '@api/core/feature'
import { userFeature } from '@api/user/feature'
import swagger from '@elysiajs/swagger'
import { Elysia } from 'elysia'

export const app = new Elysia()
  // Plugins
  .use(swagger({ provider: 'swagger-ui' }))
  // Routes
  .group('/api', (app) =>
    app
      // Add features here
      .use(authFeature)
      .use(coreFeature)
      .use(userFeature),
  )
