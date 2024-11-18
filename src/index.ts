import * as process from 'node:process'
import { app } from './app'

app.listen(process.env.PORT ?? 3000, (server) => {
  console.log(`🦊 Elysia is running at ${server?.url}`)
})
