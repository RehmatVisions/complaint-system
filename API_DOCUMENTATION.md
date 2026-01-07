# User Authentication API Documentation

## Overview
This API provides complete user authentication functionality including user registration, login, profile management, and password changes. The system uses JWT tokens for authentication and includes role-based access control.

## Features
- User Registration (Signup)
- User Login with JWT Authentication
- Protected Profile Management
- Password Change Functionality
- Role-based Authorization (User/Admin)

## Base URL
```
http://localhost:3000/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## API Endpoints

### 1. User Registration (Signup)

**Endpoint:** `POST /auth/signup`

**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. User Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Get User Profile

**Endpoint:** `GET /users/profile`

**Description:** Get current user's profile information

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update User Profile

**Endpoint:** `PUT /users/profile`

**Description:** Update user's profile information

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Change Password

**Endpoint:** `PUT /users/change-password`

**Description:** Change user's password

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Postman Testing Guide

### Setup Environment Variables

1. Create a new environment in Postman
2. Add these variables:
   - `baseUrl`: `http://localhost:3000/api`
   - `authToken`: (will be set automatically after login)

### Test Collection Setup

#### 1. Test User Registration

**Method:** POST  
**URL:** `{{baseUrl}}/auth/signup`  
**Body (JSON):**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123456"
}
```

**Tests Script:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has success true", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
});

pm.test("User object is returned", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.user).to.have.property('id');
    pm.expect(jsonData.user).to.have.property('email');
});
```

#### 2. Test User Login

**Method:** POST  
**URL:** `{{baseUrl}}/auth/login`  
**Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "test123456"
}
```

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Token is returned", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.token).to.exist;
    
    // Save token for future requests
    pm.environment.set("authToken", jsonData.token);
});

pm.test("User data is returned", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.user).to.have.property('id');
    pm.expect(jsonData.user).to.have.property('email');
});
```

#### 3. Test Get Profile (Protected Route)

**Method:** GET  
**URL:** `{{baseUrl}}/users/profile`  
**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Profile data is returned", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.user).to.have.property('id');
});
```

#### 4. Test Update Profile

**Method:** PUT  
**URL:** `{{baseUrl}}/users/profile`  
**Headers:**
```
Authorization: Bearer {{authToken}}
```
**Body (JSON):**
```json
{
  "name": "Updated Test User",
  "email": "updated@example.com"
}
```

#### 5. Test Change Password

**Method:** PUT  
**URL:** `{{baseUrl}}/users/change-password`  
**Headers:**
```
Authorization: Bearer {{authToken}}
```
**Body (JSON):**
```json
{
  "currentPassword": "test123456",
  "newPassword": "newtest123456"
}
```

### Error Testing Scenarios

#### Test Invalid Login
**Body:**
```json
{
  "email": "test@example.com",
  "password": "wrongpassword"
}
```
**Expected:** 401 Unauthorized

#### Test Unauthorized Access
**URL:** `{{baseUrl}}/users/profile`  
**Headers:** (No Authorization header)  
**Expected:** 401 Unauthorized

#### Test Duplicate Email Registration
Use the same email from step 1  
**Expected:** 409 Conflict

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Name is required", "Email is invalid"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided or invalid format."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Security Features

- **Password Hashing:** All passwords are hashed using bcrypt
- **JWT Authentication:** Secure token-based authentication
- **Role-based Access Control:** Admin and user roles
- **Input Validation:** Comprehensive validation for all inputs
- **Error Handling:** Secure error messages without sensitive data exposure

## Usage Notes

1. Always include the JWT token in the Authorization header for protected routes
2. Tokens expire after a set time (check your JWT configuration)
3. Admin routes require both authentication and admin role
4. All passwords must be at least 6 characters long
5. Email addresses must be unique across the system