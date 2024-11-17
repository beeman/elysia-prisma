import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const UserPlain = t.Object(
  {
    id: t.String({ additionalProperties: false }),
    username: t.String({ additionalProperties: false }),
    name: __nullable__(t.String({ additionalProperties: false })),
    password: __nullable__(t.String({ additionalProperties: false })),
    avatarUrl: __nullable__(t.String({ additionalProperties: false })),
  },
  { additionalProperties: false },
);

export const UserRelations = t.Object({}, { additionalProperties: false });

export const UserPlainInputCreate = t.Object(
  {
    username: t.String({ additionalProperties: false }),
    name: t.Optional(__nullable__(t.String({ additionalProperties: false }))),
    password: t.Optional(
      __nullable__(t.String({ additionalProperties: false })),
    ),
    avatarUrl: t.Optional(
      __nullable__(t.String({ additionalProperties: false })),
    ),
  },
  { additionalProperties: false },
);

export const UserPlainInputUpdate = t.Object(
  {
    username: t.String({ additionalProperties: false }),
    name: __nullable__(t.String({ additionalProperties: false })),
    password: __nullable__(t.String({ additionalProperties: false })),
    avatarUrl: __nullable__(t.String({ additionalProperties: false })),
  },
  { additionalProperties: false },
);

export const UserRelationsInputCreate = t.Object(
  {},
  { additionalProperties: false },
);

export const UserRelationsInputUpdate = t.Partial(
  t.Object({}, { additionalProperties: false }),
  { additionalProperties: false },
);

export const UserWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        username: t.String(),
        name: t.String(),
        password: t.String(),
        avatarUrl: t.String(),
      }),
    { $id: "User" },
  ),
  { additionalProperties: false },
);

export const UserWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(t.Object({ id: t.String(), username: t.String() })),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({ username: t.String() }),
      ]),
      t.Partial(
        t.Object({
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
        }),
      ),
      t.Partial(
        t.Object(
          {
            id: t.String(),
            username: t.String(),
            name: t.String(),
            password: t.String(),
            avatarUrl: t.String(),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "User" },
);

export const UserSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      username: t.Boolean(),
      name: t.Boolean(),
      password: t.Boolean(),
      avatarUrl: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const UserInclude = t.Partial(
  t.Object({ _count: t.Boolean() }, { additionalProperties: false }),
  { additionalProperties: false },
);

export const UserOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      username: t.Union([t.Literal("asc"), t.Literal("desc")]),
      name: t.Union([t.Literal("asc"), t.Literal("desc")]),
      password: t.Union([t.Literal("asc"), t.Literal("desc")]),
      avatarUrl: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const User = t.Composite([UserPlain, UserRelations], {
  additionalProperties: false,
});

export const UserInputCreate = t.Composite(
  [UserPlainInputCreate, UserRelationsInputCreate],
  { additionalProperties: false },
);

export const UserInputUpdate = t.Composite(
  [UserPlainInputUpdate, UserRelationsInputUpdate],
  { additionalProperties: false },
);
