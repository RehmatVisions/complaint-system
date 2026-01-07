# Postman Test Cases - Authentication Module

## Base URL
```
http://localhost:5000/api
```

## 1. Successful Signup
**Route:** `POST /auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-05T10:30:00.000Z",
    "updatedAt": "2024-01-05T10:30:00.000Z"
  }
}
```

## 2. Duplicate Email Signup
**Route:** `POST /auth/signup`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "john@example.com",
  "password": "password456"
}
```

**Expected Response:** `409 Conflict`
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

## 3. Successful Login
**Route:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-05T10:30:00.000Z",
    "updatedAt": "2024-01-05T10:30:00.000Z"
  }
}
```

## 4. Wrong Password Login
**Route:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "wrongpassword"
}
```

**Expected Response:** `401 Unauthorized`
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## 5. Access Protected Route Without Token
**Route:** `GET /users/profile`

**Headers:** None

**Expected Response:** `401 Unauthorized`
```json
{
  "success": false,
  "message": "Access denied. No token provided or invalid format."
}
```

## 6. Access Protected Route With Invalid Token
**Route:** `GET /users/profile`

**Headers:**
```
Authorization: Bearer invalid_token_here
```

**Expected Response:** `401 Unauthorized`
```json
{
  "success": false,
  "message": "Invalid token."
}
```

## 7. Access Protected Route With Valid Token
**Route:** `GET /users/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-05T10:30:00.000Z",
    "updatedAt": "2024-01-05T10:30:00.000Z"
  }
}
```

## 8. Access Admin-Only Route as Normal User
**Route:** `GET /admin/dashboard`

**Headers:**
```
Authorization: Bearer user_token_here
```

**Expected Response:** `403 Forbidden`
```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

## 9. Access Admin-Only Route as Admin User
**Route:** `GET /admin/dashboard`

**Headers:**
```
Authorization: Bearer admin_token_here
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "message": "Welcome to admin dashboard",
  "data": {
    "totalUsers": 150,
    "totalComplaints": 75,
    "pendingComplaints": 25
  }
}
```

## Additional Test Cases

### 10. Missing Fields in Signup
**Route:** `POST /auth/signup`

**Request Body:**
```json
{
  "name": "John Doe"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Name, email, and password are required"
}
```

### 11. Invalid Email Format
**Route:** `POST /auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "invalid-email",
  "password": "password123"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Please enter a valid email"]
}
```

### 12. Short Password
**Route:** `POST /auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john2@example.com",
  "password": "123"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Password must be at least 6 characters long"]
}
```

## How to Test in Postman

1. **Create a new collection** called "Authentication Tests"
2. **Set up environment variables:**
   - `baseUrl`: `http://localhost:5000/api`
   - `userToken`: (will be set after login)
   - `adminToken`: (will be set after admin login)

3. **For login tests**, add this script to the "Tests" tab:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.token) {
        pm.environment.set("userToken", response.token);
    }
}
```

4. **For protected routes**, use:
```
Authorization: Bearer {{userToken}}
```

5. **Create an admin user** first by manually updating a user's role in the database or creating a separate admin signup endpoint.