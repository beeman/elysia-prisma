import { Elysia } from 'elysia'

export const coreFeature = new Elysia({ tags: ['core'] })
  // Add more core routes here
  .get('/uptime', () => process.uptime())
