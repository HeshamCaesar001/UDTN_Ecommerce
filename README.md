# Product Management API 📦

Welcome to the **Product Management API**! This API allows you to manage products, including creating, retrieving, updating, and deleting products. The API is protected with JWT authentication, ensuring secure access.

## Features 🛠️
- JWT Authentication 🔐
- Admin-only access for certain actions (e.g., create, update, delete) 🛑
- Swagger API documentation 🌐
- CRUD operations for managing products 📋

## Tech Stack ⚡
- **NestJS** 🚀
- **TypeORM** 🗄️
- **PostgreSQL** (or another DB supported by TypeORM) 💾
- **JWT (JSON Web Tokens)** 🔑
- **Swagger** for API documentation 📖

## Getting Started 🚀

### Prerequisites 📜
Before running this project, make sure you have the following installed:
- **Node.js** (v14 or later) 🌱
- **NPM** (or **Yarn** as an alternative) 💻
- **PostgreSQL** (or any other database supported by TypeORM) 🏙️

### Installation Steps ⚙️

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HeshamCaesar001/UDTN_Ecommerce.git
   cd UDTN_Ecommerce
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your `.env` file**:
   Create a `.env` file in the root directory and add your environment variables:

4. **Run the application**:
   ```bash
   npm run start:dev
   ```

   The app will now be running on `http://localhost:3000`.

### Database Configuration 🗄️
Make sure your database is running and configured in the `.env` file. If you're using PostgreSQL, your `.env` should look like this:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=product_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION_TIME=3600s
```

### Swagger Documentation 🌐

Once the application is running, navigate to the following URL to access the Swagger documentation for the API:

```
http://localhost:3000/api
```

Here, you can see all the available routes, view request/response examples, and test the API with your authentication tokens.

### Authentication 🔑

To access the **protected routes** (like creating, updating, or deleting products), you need to provide a valid JWT token. 

1. **Login to get a token**:
   Use the `/auth/login` endpoint to log in with your credentials and get a JWT token.

2. **Use the token**:
   Once you have the token, click on the **Authorize** button at the top-right of the Swagger UI. Enter your token as a Bearer token.

### API Endpoints 📝

#### Auth Endpoints 💼

- **POST /auth/register**: Register a new user
- **POST /auth/login**: Log in a user and get a JWT token

#### Product Endpoints 📦

- **POST /products**: Create a new product (Admin only)
- **GET /products**: Get all products (Public and Signed In users)
- **GET /products/:id**: Get a single product by ID (Public and Signed In users)
- **PUT /products/:id**: Update a product by ID (Admin only)
- **DELETE /products/:id**: Delete a product by ID (Admin only)

### Example Request for `/auth/login` 🏷️

```json
{
  "email": "test@example.com",
  "password": "password"
}
```

### Example Request for `/products` 📦

```json
{
  "name": "Product 1",
  "price": 100,
  "description": "A description of Product 1",
  "stock": 50
}
```

---

## Testing 🧪

### Unit Tests ⚙️
Unit tests for CRUD operations on products are written using Jest. To run the tests, use the following command:

```bash
npm run test
```
---

## Contributing 🤝

We welcome contributions! If you find a bug or want to add new features, feel free to fork the repo and submit a pull request.

- **Fork the repo**
- **Create a new branch**
- **Make your changes**
- **Submit a pull request**

## Acknowledgments 🎉

- Thanks to the creators of [NestJS](https://nestjs.com/) for making such a great framework 🚀
- Thanks to [Swagger](https://swagger.io/) for providing a fantastic tool for API documentation 🌐
```
