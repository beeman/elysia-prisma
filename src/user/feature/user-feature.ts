import { User, UserInputCreate, UserInputUpdate } from '@api/core/data-access'
import { userCreate, userDelete, userFindMany, userFindUnique, userUpdate } from '@api/user/data-access'
import { Elysia, t } from 'elysia'

export const userFeature = new Elysia({ prefix: 'users', tags: ['user'] })
  .get('/', async () => userFindMany(), {
    response: t.Array(User),
  })
  .get('/:id', async ({ params: { id } }) => userFindUnique(id), {
    params: t.Object({ id: t.String() }),
    response: t.Nullable(User),
  })
  .post('/', async ({ body }) => userCreate(body), {
    body: UserInputCreate,
    response: User,
  })
  .patch('/:id', async ({ body, params: { id } }) => userUpdate(id, body), {
    params: t.Object({ id: t.String() }),
    body: UserInputUpdate,
    response: User,
  })
  .delete('/', async ({ body: { id } }) => userDelete(id), {
    body: t.Object({ id: t.String() }),
    response: User,
  })
