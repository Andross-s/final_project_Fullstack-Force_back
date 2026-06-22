# 🍲 Fullstack-Force Backend API

## 📖 About the project

A modern web application for searching and saving favorite recipes.

## 🛠️ Technologies

* **Platform:** Node.js
* **Web Framework:** Express.js
* **Database:** MongoDB + Mongoose (data modeling)
* **Data Validation:** Joi (validation of query body and parameters)
* **File Handling:** Multer + Cloudinary (for storing user avatars)
* **Documentation:** Swagger UI Express
* **Deployment:** Render

## 🚀 How to start a project

### Installing dependencies

```bash
npm install
```

### Starting a dev server

```bash
npm run dev
```

## 📂 Project folder structure

```text
├── src/
│ ├── controllers/ # Route handlers (accept a request, call services, return a response)
│ ├── db/ # Initializing and connecting to the database (initMongoConnection)
│ ├── middlewares/ # Middleware (authenticate, upload, validateBody, isValidId, etc.)
│ ├── models/ # Mongoose schemas for the database and Joi schemas for query validation
│ ├── routes/ # Defining API routes (endpoints)
│ ├── services/ # Business logic (direct interaction with the database via models)
│ ├── utils/ # Auxiliary utilities ( HttpError, saveFileToCloudinary)
│ ├── app.js # Express application configuration (CORS, parsers, routes, error handling)
│ └── index.js # Entry point (starting the server, connecting to the database)
├── .env.example # Template for environment variables
├── .gitignore # Configuration of ignoring files by the Git system
├── package.json # Dependencies and project startup scripts
└── swagger.json # Swagger API configuration and documentation
```

## 📋 Development rules

### Git Workflow

- **Branch `main`** — protected, only through PR
- **Branch names:** `feature/section-name`, `fix/bug-name`
- Before PR — check that the code runs without errors

## 🔑 Environment variables (.env)

To run the backend locally, create a .env file in the root of the project (like .env.example) and fill it with your own keys:

# Port on which the server will run
PORT=3000
# Connection string to your MongoDB Atlas database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/db-name?retryWrites=true&w=majority
# Cloudinary settings (to save images/avatars)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

## 🗺 API Endpoints

### 👤 Users and Authentication (`/api/auth`, `/api/users`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user | Public |
| **POST** | `/api/auth/login` | User login (create a new session and issue tokens) | Public |
| **POST** | `/api/auth/logout` | User logout (delete session and deactivate tokens) | Private |
| **POST** | `/api/auth/refresh` | Refresh user session (replace old session and issue new tokens) | Public |
| **GET** | `/api/users/:userId` | Get user information by ID | Private |

### 📋 Categories and Ingredients (`/api/categories`, `/api/ingredients`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/categories` | Get full list of recipe categories | Public |
| **GET** | `/api/ingredients` | Get full list of ingredients | Public |

### 🍳 Recipes and Favorites (`/api/recipes`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/recipes` | Search recipes by category, ingredient or name (with pagination) | Public |
| **GET** | `/api/recipes/:id` | Get detailed information about a recipe by its ID | Public |
| **POST** | `/api/recipes` | Create and add your own recipe | Private |
| **GET** | `/api/recipes/own` | Get a list of your own (user-created) recipes | Private |
| **GET** | `/api/recipes/favorites` | Get a list of user favorite recipes | Private |
| **POST** | `/api/recipes/favorites/:id` | Add a recipe to the user's favorites list | Private |
| **DELETE** | `/api/recipes/favorites/:id` | Remove a recipe from the favorites list by its ID | Private |

## 📚 API Documentation

After starting the server, Swagger documentation is available at:
https://final-project-fullstack-force-back-r48i.onrender.com/api-docs/

## 🌐 Deploy to Render

The backend is configured for quick deployment to the **Render** platform:

1. When creating a new **Web Service** on Render, connect this repository.
2. Specify the following settings:
* **Runtime:** `Node`
* **Build Command:** `npm install`
* **Start Command:**  `npm start` *(or as per your configuration in package.json)*
3. Move all variables from your `.env` file to the **Environment Variables** section of the Render control panel.

---
