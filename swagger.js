import fs from "node:fs";
import path from "node:path";

const objectId = {
  type: "string",
  pattern: "^[0-9a-fA-F]{24}$",
  example: "665f1f77bcf86cd799439011",
};

const errorResponse = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "Error message",
    },
  },
};

const validationErrorResponse = {
  type: "object",
  properties: {
    statusCode: { type: "integer", example: 400 },
    error: { type: "string", example: "Bad Request" },
    message: { type: "string", example: "Validation failed" },
    validation: { type: "object" },
  },
};

const unauthorizedResponses = {
  401: {
    description: "Unauthorized. Missing, invalid, or expired session cookies.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/Error" },
        examples: {
          missingSession: {
            value: { message: "Missing session credentials" },
          },
          sessionNotFound: {
            value: { message: "Session not found" },
          },
          expired: {
            value: { message: "Access token expired" },
          },
        },
      },
    },
  },
};

const validationResponse = {
  400: {
    description: "Bad request or validation error.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ValidationError" },
      },
    },
  },
};

const serverErrorResponse = {
  500: {
    description: "Internal server error.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/Error" },
        example: { message: "Server Error" },
      },
    },
  },
};

const recipeListResponse = {
  description: "Paginated list of recipes.",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/PaginatedRecipes" },
    },
  },
};

const recipeQueryParameters = [
  {
    name: "page",
    in: "query",
    schema: { type: "integer", minimum: 1, default: 1 },
    description: "Page number.",
  },
  {
    name: "perPage",
    in: "query",
    schema: { type: "integer", minimum: 5, maximum: 20, default: 10 },
    description: "Items per page.",
  },
  {
    name: "category",
    in: "query",
    schema: objectId,
    description: "Category ObjectId. Must reference an existing category.",
  },
  {
    name: "ingredient",
    in: "query",
    schema: { type: "string", example: "Chicken" },
    description: "Ingredient name (case-insensitive, partial match).",
  },
  {
    name: "search",
    in: "query",
    schema: { type: "string", example: "soup" },
    description: "Case-insensitive search by recipe title.",
  },
  {
    name: "maxTime",
    in: "query",
    schema: { type: "integer", minimum: 1, example: 30 },
    description: "Maximum cooking time in minutes.",
  },
  {
    name: "maxCalories",
    in: "query",
    schema: { type: "number", minimum: 0, example: 500 },
    description: "Maximum calories per serving.",
  },
];

const doc = {
  openapi: "3.0.3",
  info: {
    title: "Fullstack Force Recipes API",
    version: "1.0.0",
    description:
      "API for authentication, users, recipe categories, ingredients, recipes, own recipes, and favorite recipes.",
  },
  servers: [
    {
      url: "https://final-project-fullstack-force-back-r48i.onrender.com",
      description: "Production server",
    },
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Auth", description: "Registration, login, refresh and logout." },
    { name: "Users", description: "User profile endpoints." },
    { name: "Categories", description: "Recipe categories." },
    { name: "Ingredients", description: "Recipe ingredients." },
    { name: "Recipes", description: "Recipe search and details." },
    { name: "Own Recipes", description: "Authenticated user recipes." },
    { name: "Favorites", description: "Authenticated user favorites." },
  ],
  components: {
    securitySchemes: {
      sessionIdCookie: {
        type: "apiKey",
        in: "cookie",
        name: "sessionId",
        description: "Session id cookie set after register/login/refresh.",
      },
      accessTokenCookie: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
        description: "Access token cookie set after register/login/refresh.",
      },
      refreshTokenCookie: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
        description: "Refresh token cookie used by /api/auth/refresh.",
      },
    },
    schemas: {
      ObjectId: objectId,
      Error: errorResponse,
      ValidationError: validationErrorResponse,
      User: {
        type: "object",
        properties: {
          _id: objectId,
          name: { type: "string", example: "John" },
          email: { type: "string", format: "email", example: "john@mail.com" },
          avatar: {
            type: "string",
            format: "uri",
            example:
              "https://ac.goit.global/fullstack/react/default-avatar.jpg",
          },
          favorites: {
            type: "array",
            items: objectId,
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PublicUserResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 200 },
          message: {
            type: "string",
            example: "Successfully found current user",
          },
          data: {
            type: "object",
            properties: {
              id: objectId,
              name: { type: "string", example: "John" },
              email: {
                type: "string",
                format: "email",
                example: "john@mail.com",
              },
              avatar: { type: "string", format: "uri" },
            },
          },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", maxLength: 16, example: "John" },
          email: {
            type: "string",
            format: "email",
            maxLength: 128,
            example: "john@mail.com",
          },
          password: {
            type: "string",
            minLength: 8,
            maxLength: 128,
            example: "password123",
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "john@mail.com",
          },
          password: { type: "string", example: "password123" },
        },
      },
      RegisterResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Registration successful" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      Category: {
        type: "object",
        properties: {
          _id: objectId,
          name: { type: "string", example: "Breakfast" },
        },
      },
      Ingredient: {
        type: "object",
        properties: {
          _id: objectId,
          name: { type: "string", example: "Chicken" },
          desc: { type: "string", example: "Fresh chicken fillet" },
          img: { type: "string", format: "uri" },
        },
      },
      RecipeIngredient: {
        type: "object",
        properties: {
          ingredient: objectId,
          amount: { type: "string", example: "200 g" },
        },
      },
      Recipe: {
        type: "object",
        properties: {
          _id: objectId,
          title: { type: "string", example: "Chicken Soup" },
          description: {
            type: "string",
            example: "Simple homemade chicken soup.",
          },
          instructions: {
            type: "string",
            example: "Boil chicken, add vegetables, season and serve.",
          },
          thumb: {
            type: "string",
            format: "uri",
            example: "https://res.cloudinary.com/demo/image/upload/recipe.jpg",
          },
          time: { type: "integer", example: 45 },
          calories: { type: "number", nullable: true, example: 320 },
          category: objectId,
          owner: { ...objectId, nullable: true },
          ingredients: {
            type: "array",
            items: { $ref: "#/components/schemas/RecipeIngredient" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PaginatedRecipes: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          perPage: { type: "integer", example: 10 },
          totalRecipes: { type: "integer", example: 42 },
          totalPages: { type: "integer", example: 5 },
          recipes: {
            type: "array",
            items: { $ref: "#/components/schemas/Recipe" },
          },
        },
      },
      CreateRecipeResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 201 },
          message: {
            type: "string",
            example: "Recipe created successfully",
          },
          data: { $ref: "#/components/schemas/Recipe" },
        },
      },
      CreateRecipeRequest: {
        type: "object",
        required: [
          "title",
          "description",
          "ingredients",
          "instructions",
          "category",
          "photo",
        ],
        properties: {
          title: {
            type: "string",
            description: "Recipe title.",
            example: "Chicken Soup",
          },
          description: {
            type: "string",
            description: "Short recipe description.",
            example: "Simple homemade chicken soup.",
          },
          ingredients: {
            type: "string",
            description:
              'JSON string with recipe ingredients. Each item must contain ingredient ObjectId and amount, for example: [{"ingredient":"665f1f77bcf86cd799439011","amount":"200 g"}].',
            example:
              '[{"ingredient":"665f1f77bcf86cd799439011","amount":"200 g"}]',
          },
          instructions: {
            type: "string",
            description: "Step-by-step cooking instructions.",
            example: "Boil chicken, add vegetables, season and serve.",
          },
          category: {
            ...objectId,
            description: "Recipe category ObjectId.",
          },
          time: {
            type: "integer",
            minimum: 1,
            description: "Cooking time in minutes.",
            example: 45,
          },
          calories: {
            type: "number",
            description: "Approximate calories per serving.",
            example: 320,
          },
          photo: {
            type: "string",
            format: "binary",
            description:
              "Recipe image file. Allowed formats: JPEG, PNG, WebP. Max size: 5 MB.",
          },
        },
      },
      MessageResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Operation successful" },
        },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a user",
        description:
          "Creates a new user, creates a session, and sets sessionId, accessToken, and refreshToken cookies.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Registration successful.",
            headers: {
              "Set-Cookie": {
                schema: { type: "string" },
                description:
                  "Sets sessionId, accessToken, and refreshToken cookies.",
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterResponse" },
              },
            },
          },
          ...validationResponse,
          500: serverErrorResponse[500],
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login a user",
        description:
          "Authenticates a user, replaces the previous session, and sets session cookies.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful.",
            headers: {
              "Set-Cookie": {
                schema: { type: "string" },
                description:
                  "Sets sessionId, accessToken, and refreshToken cookies.",
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          401: {
            description: "Invalid credentials.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { message: "Invalid credentials" },
              },
            },
          },
          ...validationResponse,
          ...serverErrorResponse,
        },
      },
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh user session",
        description:
          "Uses sessionId and refreshToken cookies to issue a new session and cookies.",
        security: [{ sessionIdCookie: [], refreshTokenCookie: [] }],
        responses: {
          200: {
            description: "Session refreshed.",
            headers: {
              "Set-Cookie": {
                schema: { type: "string" },
                description:
                  "Sets new sessionId, accessToken, and refreshToken cookies.",
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
                example: { message: "Session refreshed" },
              },
            },
          },
          401: {
            description: "Missing, invalid, or expired refresh session.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                  missing: {
                    value: { message: "Missing session credentials" },
                  },
                  notFound: { value: { message: "Session not found" } },
                  expired: { value: { message: "Session token expired" } },
                },
              },
            },
          },
          ...serverErrorResponse,
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout a user",
        description: "Clears the refreshToken cookie for the current user.",
        security: [{ sessionIdCookie: [], accessTokenCookie: [] }],
        responses: {
          204: { description: "Logout successful. No content." },
          ...unauthorizedResponses,
          ...serverErrorResponse,
        },
      },
    },
    "/api/user/{userId}": {
      get: {
        tags: ["Users"],
        summary: "Get user by id",
        description:
          "Returns public profile data for the requested user id. Current route is /api/user/:userId.",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: objectId,
            description: "User id.",
          },
        ],
        responses: {
          200: {
            description: "User found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PublicUserResponse" },
              },
            },
          },
          400: {
            description: "Invalid user id format.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationError" },
              },
            },
          },
          ...unauthorizedResponses, // <-- додає 401 відповіді (missing/session not found/expired)
          404: {
            description: "User not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { message: "User not found" },
              },
            },
          },
          ...serverErrorResponse,
        },
      },
    },
    "/api/categories": {
      get: {
        tags: ["Categories"],
        summary: "Get recipe categories",
        responses: {
          200: {
            description: "List of categories.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Category" },
                },
              },
            },
          },
          ...serverErrorResponse,
        },
      },
    },
    "/api/ingredients": {
      get: {
        tags: ["Ingredients"],
        summary: "Get ingredients",
        responses: {
          200: {
            description: "List of ingredients sorted by name.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Ingredient" },
                },
              },
            },
          },
          ...serverErrorResponse,
        },
      },
    },
    "/api/recipes": {
      get: {
        tags: ["Recipes"],
        summary: "Search recipes",
        description:
          "Searches recipes by category, ingredient, title, max cooking time, and max calories, with pagination.",
        parameters: recipeQueryParameters,
        responses: {
          200: recipeListResponse,
          400: {
            description:
              "Invalid category, ingredient not found, or query validation error (e.g. invalid page/perPage/maxTime/maxCalories).",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    { $ref: "#/components/schemas/Error" },
                    { $ref: "#/components/schemas/ValidationError" },
                  ],
                },
                examples: {
                  invalidCategory: { value: { message: "Invalid category" } },
                  ingredientNotFound: {
                    value: { message: "Ingredient not found" },
                  },
                  queryValidation: {
                    value: {
                      statusCode: 400,
                      error: "Bad Request",
                      message: '"maxTime" must be a number',
                    },
                  },
                },
              },
            },
          },
          ...serverErrorResponse,
        },
      },
      post: {
        tags: ["Own Recipes"],
        summary: "Create own recipe",
        description:
          "Creates a recipe for the authenticated user and uploads photo to Cloudinary folder recipes. Send ingredients as a JSON string in multipart/form-data.",
        security: [{ sessionIdCookie: [], accessTokenCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/CreateRecipeRequest" },
              encoding: {
                photo: {
                  contentType: "image/jpeg, image/png, image/webp",
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Recipe created successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateRecipeResponse" },
              },
            },
          },
          ...validationResponse,
          ...unauthorizedResponses,
          ...serverErrorResponse,
        },
      },
    },
    "/api/recipes/{id}": {
      get: {
        tags: ["Recipes"],
        summary: "Get recipe by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: objectId,
            description: "Recipe id.",
          },
        ],
        responses: {
          200: {
            description: "Recipe details.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Recipe" },
              },
            },
          },
          404: {
            description: "Recipe not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { message: "Recipe not found" },
              },
            },
          },
          ...serverErrorResponse,
        },
      },
    },
    "/api/recipes/own": {
      get: {
        tags: ["Own Recipes"],
        summary: "Get own recipes",
        security: [{ sessionIdCookie: [], accessTokenCookie: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "perPage",
            in: "query",
            schema: { type: "integer", minimum: 4, maximum: 20, default: 12 },
          },
          {
            name: "category",
            in: "query",
            schema: objectId,
            description: "Category ObjectId.",
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description: "Case-insensitive search by recipe title.",
          },
        ],
        responses: {
          200: recipeListResponse,
          ...validationResponse,
          ...unauthorizedResponses,
          ...serverErrorResponse,
        },
      },
    },
    "/api/recipes/favorites": {
      get: {
        tags: ["Favorites"],
        summary: "Get favorite recipes",
        security: [{ sessionIdCookie: [], accessTokenCookie: [] }],
        responses: {
          200: {
            description: "List of favorite recipes.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Recipe" },
                },
              },
            },
          },
          ...unauthorizedResponses,
          ...serverErrorResponse,
        },
      },
    },
    "/api/recipes/favorites/{recipeId}": {
      post: {
        tags: ["Favorites"],
        summary: "Add recipe to favorites",
        security: [{ sessionIdCookie: [], accessTokenCookie: [] }],
        parameters: [
          {
            name: "recipeId",
            in: "path",
            required: true,
            schema: objectId,
          },
        ],
        responses: {
          200: {
            description: "Recipe added to favorites.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
                example: { message: "Recipe added to favorites" },
              },
            },
          },
          404: {
            description: "Recipe not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { message: "Recipe not found" },
              },
            },
          },
          409: {
            description: "Recipe already in favorites.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { message: "Recipe already in favorites" },
              },
            },
          },
          ...unauthorizedResponses,
          ...serverErrorResponse,
        },
      },
      delete: {
        tags: ["Favorites"],
        summary: "Remove recipe from favorites",
        security: [{ sessionIdCookie: [], accessTokenCookie: [] }],
        parameters: [
          {
            name: "recipeId",
            in: "path",
            required: true,
            schema: objectId,
          },
        ],
        responses: {
          200: {
            description: "Recipe removed from favorites.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
                example: { message: "Recipe removed from favorites" },
              },
            },
          },
          404: {
            description: "Recipe not found in favorites.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { message: "Recipe not found in favorites" },
              },
            },
          },
          ...unauthorizedResponses,
          ...serverErrorResponse,
        },
      },
    },
  },
};

const outputFile = path.resolve("src", "swagger-output.json");

fs.writeFileSync(outputFile, `${JSON.stringify(doc, null, 2)}\n`);
console.log(`Swagger documentation generated: ${outputFile}`);
