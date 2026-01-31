# Assignment 4: Secure Messaging API with RBAC (JWT)

**Student: Nurkhan Kuanyshov**

**Group: SE-2431**


## 1. Project Overview

This project is a secure backend REST API for a messaging system.
It extends Assignment 3 by introducing authentication, role-based access control (RBAC),
and a professional MVC project architecture.

The project demonstrates:

- MVC architecture (Models, Controllers, Routes, Middleware)
- User authentication with JWT
- Password hashing using bcrypt
- Role-Based Access Control (admin / user)
- Full CRUD operations for Chats and Messages
- Public and protected API routes
- API testing using Postman
- MongoDB Atlas integration

All data is stored in MongoDB Atlas.

---

## 2. Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv
- CORS
- Postman

---

## 3. Features

### 3.1 Authentication & RBAC

Each user contains the following fields:

| Field | Description |
|-----|------------|
| email | User email |
| password | Hashed password |
| role | user or admin |
| createdAt | Timestamp |

Security features:
- Passwords are hashed using bcrypt
- JWT tokens are generated on login
- Admin-only access for POST, PUT, DELETE routes

---

### 3.2 Chats Management (CRUD)

| Field | Description |
|-----|------------|
| title | Chat title |
| participants | Array of User references |
| createdBy | Admin user |
| createdAt | Timestamp |

---

### 3.3 Messages Management (CRUD)

| Field | Description |
|-----|------------|
| chat | Reference to Chat |
| sender | Reference to User |
| text | Message content |
| edited | Edited flag |
| createdAt | Timestamp |

Relationships are implemented using ObjectId references and populated using `.populate()`.

---

## 4. API Endpoints

### 4.1 Authentication API

```http
POST /api/auth/register
POST /api/auth/login
```

![postAuthRegisterAdmin](postman_screens/postuserAdmin.png)

![postAuthRegisterUser](postman_screens/postuserUser.png)

![postAuthLoginUser](postman_screens/posrAuthLoginUser.png)

![postAuthLoginAdmin](postman_screens/postAuthLogin.png)
---

### 4.2 Chats API

```http
GET    /api/chats           (Public)
GET    /api/chats/:id       (Public)
POST   /api/chats           (Admin)
PUT    /api/chats/:id       (Admin)
DELETE /api/chats/:id       (Admin)
```
![getChats](postman_screens/getChats.png)

![getChatByID](postman_screens/getChatById.png)

![postChatUserDenied](postman_screens/PostchatsUserDenied.png)

![postChatAdmin](postman_screens/postchatsAdmin.png)

![putChatUserDenied](postman_screens/putchatUserDenied.png)

![putChatAdmin](postman_screens/putchatAdmin.png)

![deletChat](postman_screens/deleteChatAdmin.png)

---

### 4.3 Messages API

```http
GET    /api/messages           (Public)
GET    /api/messages/:id       (Public)
POST   /api/messages           (Admin)
PUT    /api/messages/:id       (Admin)
DELETE /api/messages/:id       (Admin)
```
![getAllMessages](postman_screens/getMessages.png)

![getMessageById](postman_screens/getMessageById.png)

![postMessage](postman_screens/postmessagesAdmin.png)

![putMessage](postman_screens/putMessageAdmin.png)

![deleteMessage](postman_screens/geleteMessageAdmin.png)
---

### 4.4 Users API

```http
GET    /api/users/:id       (Admin)
PUT    /api/users/:id       (Admin)
DELETE /api/users/:id       (Admin)
```
![getUserById](postman_screens/getUserById.png)

![putUserById](postman_screens/putUserById.png)


![deleteUserById](postman_screens/deleteUserAdmin.png)
---

## 5. Project Setup

### 5.1 Prerequisites

- Node.js installed
- MongoDB Atlas account
- Postman

### 5.2 Installation

```bash
npm install
```

Create `.env` file:

```env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

Start the server:

```bash
node server.js
```

Server will run at:

```text
http://localhost:5001
```

---

## 6. Project Structure

```text
assignment4web2/
|
|_config/
|   |_db.js
│
├─ models/
│   ├─ User.js
│   ├─ Chat.js
│   └─ Message.js
│.
├─ controllers/
│   ├─ authController.js
│   ├─ chatController.js
│   ├─ messageController.js
│   └─ userController.js
│
├─ routes/
│   ├─ authRoutes.js
│   ├─ chatRoutes.js
│   ├─ messageRoutes.js
│   └─ userRoutes.js
│
├─ middleware/
│   ├─ authMiddleware.js
│   ├─ roleMiddleware.js
│   └─ errorMiddleware.js
│
├─ .env
├─ server.js
├─ package.json
└─ README.md
```

---

## 7. Error Handling

| Case | Response |
|----|---------|
| Missing token | 401 Unauthorized |
| Invalid token | 401 Unauthorized |
| Access denied | 403 Forbidden |
| Resource not found | 404 Not Found |

---

## 8. Postman Testing

All endpoints were tested using Postman.

- Public routes accessible without authentication
- Admin-only routes return 403 for regular users
- JWT tokens used in Authorization header

---

## 9. Conclusion

Through this assignment, I learned and applied the following skills:

- Designing scalable MVC backend architecture
- Implementing JWT authentication
- Applying role-based access control
- Securing API endpoints
- Working with MongoDB relationships
- Testing APIs professionally using Postman
- Debugging authentication and server issues

This project fully satisfies all Assignment 4 requirements.

