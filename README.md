```markdown
# 🛒 NestJS E-Commerce API

This project implements an e-commerce API built with NestJS, utilizing PostgreSQL, JWT-based authentication, and role-based access control.

## 📝 Features
- **Authentication Module**: User registration, login, and JWT-based authentication.
- **Product Management**: CRUD operations for products (with Secure endpoints with AuthGuard and Role-based access for admins).
- **Unit Testing**: Unit tests for all Auth Services and Product Services.
- **Swagger Documentation**: API documentation available via Swagger UI.

## 🚀 Setup Instructions

1. Clone the repository.
2. Create a `.env` file in the root directory and add your environment variables:
```env
DATABASE_URL=postgres://username:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
JWT_EXPIRATION_TIME=3600s
```

3. Install dependencies:
```bash
npm install
```

4. Run the application:
```bash
npm run start
```

5. Run the tests:
```bash
npm run test
```

6. Access Swagger UI:
```
http://localhost:3000/api
```

## 📦 Endpoints

- **POST** `/auth/register`: Register a new user
- **POST** `/auth/login`: Login a user and receive a JWT token
- **POST** `/products`: Add a new product (admin only)
- **GET** `/products`: List all products
- **GET** `/products/:id`: Get product by ID
- **PUT** `/products/:id`: Update product details (admin only)
- **DELETE** `/products/:id`: Delete a product (admin only)

## 👨‍💻 Unit Tests

The project includes unit tests for all services and controllers. To ensure good coverage, run:
```bash
npm run test:cov
```