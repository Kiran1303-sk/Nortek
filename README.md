# Nortek Backend

Node.js + Express backend for the Nortek website and careers platform.

## What This Project Includes

- Static website hosting from `public/`
- Careers/jobs APIs
- Candidate authentication with OTP
- Admin/recruiter authentication and user management
- Job application submission with CV upload
- Email notifications (OTP, contact form, application updates)

## Tech Stack

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcrypt`)
- File upload (`multer`)
- Security middleware (`helmet`, `cors`, `express-rate-limit`)
- Email (`nodemailer`)

## Project Structure

```text
nortek-backend/
  server.js
  package.json
  models/
  routes/
  middleware/
  utils/
  public/
  uploads/
  createAdmin.js
  manageAdminAccount.js
  importJobs.js
  jobs.json
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or a reachable MongoDB URI
- Gmail account with App Password (for outgoing mail)

## Environment Variables

Create `.env` in project root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nortek
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=30min
ADMIN_JWT_EXPIRES_IN=30m
PASSWORD_MIN_LENGTH=8
CLIENT_URL=http://localhost:5500
CORS_ALLOWED_ORIGINS=http://localhost:5000,http://localhost:5500,http://127.0.0.1:5500
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
CONTACT_RECEIVER_EMAIL=hr@nortekconsulting.com
ENABLE_CSP_REPORT_ONLY=true
LOG_CSP_REPORTS=false
NODE_ENV=development
```

Notes:
- `EMAIL_USER` and `EMAIL_PASS` are required for OTP/contact/application emails.
- Use a Gmail App Password, not your normal Gmail password.
- If `CONTACT_RECEIVER_EMAIL` is not set, contact emails go to `EMAIL_USER`.

## Install and Run

```bash
npm install
node server.js
```

Default app URL: `http://localhost:5000`

Root route (`/`) redirects to `/nortek.html`.

## Available npm Scripts

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## Admin Utility Scripts

Create or update an admin account:

```bash
node createAdmin.js <email> <password> [super_admin|admin|recruiter|user]
```

Manage an admin account:

```bash
node manageAdminAccount.js view <email> <currentPassword>
node manageAdminAccount.js change-email <currentEmail> <currentPassword> <newEmail>
node manageAdminAccount.js change-password <email> <currentPassword> <newPassword>
node manageAdminAccount.js change-display-name <email> <currentPassword> <newDisplayName>
```

Import jobs from `jobs.json`:

```bash
node importJobs.js
```

## Core Routes

### Public / Static

- `GET /` -> redirects to `/nortek.html`
- Static files served from `public/`
- Uploaded CVs served from `/uploads/<filename>`

### Candidate Auth (`/auth/candidate`)

- `POST /request-otp` (`purpose`: `signup` or `forgot_password`)
- `POST /verify-otp`
- `POST /register`
- `POST /forgot-password/reset`
- `POST /login`
- `GET /me` (requires candidate bearer token)

### Admin Auth + User Management (`/admin`)

- `POST /login`
- `PUT /change-password` (roles: `super_admin`, `admin`, `recruiter`, `user`)
- `GET /users` (roles: `super_admin`, `admin`)
- `POST /users` (role: `super_admin`)
- `PUT /users/:id` (role: `super_admin`)
- `DELETE /users/:id` (role: `super_admin`)
- `POST /forgot-password/request-otp`
- `POST /forgot-password/verify-otp`
- `POST /forgot-password/reset`

### Jobs (`/jobs`)

- `GET /public`
- `GET /public/:jobCode`
- `GET /` (roles: `super_admin`, `admin`, `recruiter`, `user`)
- `GET /:id` (roles: `super_admin`, `admin`, `recruiter`, `user`)
- `POST /` (roles: `super_admin`, `admin`)
- `PUT /:id` (roles: `super_admin`, `admin`)
- `DELETE /:id` (roles: `super_admin`, `admin`)

### Contact

- `POST /contact`

### Applications

- `POST /apply` (multipart form-data with optional `cv` file)
- `GET /apply/all` (roles: `super_admin`, `admin`, `recruiter`)
- `PUT /apply/update/:id` (roles: `super_admin`, `admin`, `recruiter`)
- `PUT /apply/mark-read/:id` (roles: `super_admin`, `admin`, `recruiter`)
- `PUT /apply/mark-all-read` (roles: `super_admin`, `admin`, `recruiter`)
- `DELETE /apply/delete/:id` (roles: `super_admin`, `admin`)

## Authentication

Use bearer tokens for protected routes:

```http
Authorization: Bearer <token>
```

## Notes for Maintainers

- Active runtime flow is primarily in `server.js` plus `routes/jobs.routes.js`.
- Some files in `routes/` and `models/` are legacy and not used by current runtime.
- Keep role/status enums aligned across backend and frontend to avoid dashboard inconsistencies.
