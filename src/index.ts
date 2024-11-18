import { authFeature } from '@api/auth/feature'
import { coreFeature } from '@api/core/feature'
import { userFeature } from '@api/user/feature'
import swagger from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import * as process from 'node:process'

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

app.listen(process.env.PORT ?? 3000, (server) => {
  console.log(`🦊 Elysia is running at ${server?.url}`)
})
