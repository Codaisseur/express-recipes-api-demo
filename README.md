# Express Recipes API

RESTful Express API for Recipes on top of MongoDB.

## Authentication

Create a User with the following attributes:

| Attribute | Type   | Description   |
|-----------|--------|---------------|
| name      | string | Full name     |
| email     | string | Email address |
| password  | string | Password      |

Use the following endpoints to deal with initial authentication and the user.

| HTTP Verb | Path        | Description |
|-----------|-------------|--------------|
| `POST`    | `/users`    | Create a user account |
| `POST`    | `/sessions` | Log in with email and password, and retrieve a JWT token |
| `GET`     | `/users/me` | Retrieve own user data |

To authorize further requests, use Bearer authentication with the provided JWT token:

```
Authorization: Bearer <token here>
```

_**Note**: See `db/seed.js` for an example._

## Recipes

**Note:** See `models/recipe.js` for the Recipe schema attributes.

| HTTP Verb | Path | Description |
|-----------|------|--------------|
| `GET` | `/recipes` | Retrieve all recipes |
| `POST` | `/recipes` | Create a recipe* |
| `GET` | `/recipes/:id` | Retrieve a single recipe by it's `id` |
| `PUT` | `/recipes/:id` | Update a recipe with a specific `id`* |
| `PATCH` | `/recipes/:id` | Patch (partial update) a recipe with a specific `id`* |
| `DELETE` | `/recipes/:id` | Destroy a single recipe by it's `id`* |
| | | _* Needs authentication_ |

_**Note**: Run `yarn run seed` to seed some initial recipes._
