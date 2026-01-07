# Smart Complaint & Feedback Management – Member 3 Backend

This repository contains the backend foundation for **Member 3 (Admin & Status Control)** of the Smart Complaint & Feedback Management System. It focuses on secure admin operations such as listing complaints, updating status, assigning staff/department, and replying to users.

## Tech Stack

- **Runtime:** Node.js (Express)
- **Database:** MongoDB via Mongoose
- **Auth:** JWT + bcrypt
- **Validation:** express-validator

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment**
   - Duplicate `.env.example` as `.env` and fill values:
     ```
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/complaints_db
     JWT_SECRET=change_me
     ```
3. **Run server**
   ```bash
   npm run dev
   # or
   npm start
   ```

Server starts at `http://localhost:5000`.

## API Summary (Member 3 scope)

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/admin/complaints` | Paginated list with filters (status/category/priority) |
| `PUT` | `/api/admin/complaints/:complaintId/status` | Update complaint status + append status history |
| `PUT` | `/api/admin/complaints/:complaintId/assign` | Assign staff/department |
| `POST` | `/api/admin/complaints/:complaintId/reply` | Add admin reply |

> All routes require `Authorization: Bearer <JWT>` for an `admin` role user.

### Query/Body Details

- `GET /complaints`: optional `status`, `category`, `priority`, `page`, `limit`.
- `PUT /status`: body `{ "status": "In Progress", "note": "Investigating" }`.
- `PUT /assign`: body `{ "assignedTo": "IT Department" }`.
- `POST /reply`: body `{ "message": "Resolved, please verify." }`.

## Manual Testing (Postman / Thunder Client)

1. **Register admin** – `POST /api/auth/register` (body: name, email, password, role=`admin`).
2. **Login** – `POST /api/auth/login` → copy JWT token.
3. **Seed complaints** – create documents via Mongo shell or future Member 2 APIs. Ensure `complaintId` field exists (use `generateComplaintId` utility).
4. **Admin actions** – hit the endpoints above with the JWT in headers.
5. **Verify status history & replies** by checking response payload or database.

## Project Structure

```
src/
  config/db.js              # Mongo connection helper
  controllers/
    adminController.js      # Member 3 logic
    authController.js       # Basic auth (for testing)
  middleware/auth.js        # JWT auth + role guard
  models/
    Complaint.js            # Complaint schema (status history, replies)
    User.js                 # Basic user schema
  routes/
    adminRoutes.js          # Admin endpoints
  utils/generateComplaintId # helper to generate unique complaint IDs
  server.js                 # Express bootstrap
```

## Next Steps (Outside Member 3)

- Member 1/2: finalize auth & complaint submission APIs.
- Member 4/5: frontend integration once backend endpoints are stable.

This backend slice is ready for integration and testing as part of the overall system.
