# Welcome to My Basecamp 1

## Task
A web-based project management tool inspired by Basecamp. The challenge is to build a full-stack application with user authentication, role-based permissions, and project management features.

## Description
Built with Node.js and Express on the backend, PostgreSQL as the database, and Prisma as the ORM. The app supports user registration, login/logout with sessions, admin roles, and full project CRUD.

## Installation

1. Clone the repository:
```
git clone https://git.us.qwasar.io/my_basecamp_1_213017_xdakrh/my_basecamp_1.git
cd my_basecamp_1
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory:
```
PORT=3000
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/mybasecamp"
SESSION_SECRET=anyrandomstring
```
4. Run Prisma migration to create the tables:
```
npx prisma migrate dev
```
5. Start the server:
```
npm run dev
```

## Usage

The server runs on `http://localhost:3000`

**User endpoints:**
- `POST /users` — register a new user
- `GET /users/:id` — get a user by id
- `DELETE /users/:id` — delete a user (admin only)
- `PUT /users/:id/admin` — promote user to admin (admin only)
- `PUT /users/:id/removeadmin` — demote admin to user (admin only)

**Session endpoints:**
- `POST /session` — login
- `DELETE /session` — logout

**Project endpoints:**
- `POST /projects` — create a project
- `GET /projects` — get all projects
- `GET /projects/:id` — get a project by id
- `PUT /projects/:id` — update a project
- `DELETE /projects/:id` — delete a project
- `GET /projects/:id/users` — list project members and owner
- `POST /projects/:id/members` — add a member by email or user id
- `DELETE /projects/:id/members/:userId` — remove a member

**Collaboration endpoints:**
- `POST /projects/:id/attachments` — upload a local file or attach a link
- `DELETE /projects/:id/attachments/:attachmentId` — delete an attachment
- `POST /projects/:id/threads` — create a thread
- `PUT /projects/:id/threads/:threadId` — edit a thread
- `DELETE /projects/:id/threads/:threadId` — delete a thread
- `POST /projects/:id/threads/:threadId/messages` — post a message
- `PUT /projects/:id/threads/:threadId/messages/:messageId` — edit a message
- `DELETE /projects/:id/threads/:threadId/messages/:messageId` — delete a message

**Local uploads**
- Uploaded files are stored in the `/uploads` folder and served at `/uploads/...`
- Supported upload formats: `png`, `jpg`, `jpeg`, `pdf`, `txt`
- Uploads are tied to the project attachment list and can be removed from the project page

- run `prisma/seed.js` or `npm run seed` to create an admin user (admin@test.com : admin123) or manually register a user, then in psql:
```
UPDATE "User" SET role = 'admin' WHERE email = 'admin@test.com';
```

### The Core Team

azizova_n
<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
