# Final project (Messanger)
**Student: Nurkhan Kuanyshov**

**Group: SE-2431**

**Live Links:**
- Backend: `https://finalprojectweb2.onrender.com`
- Frontend: `https://messangervibegram.netlify.app/`


## 1. Project Overview

This project is a secure backend REST API + full-stack messenger system.
It extends Assignment 3 by introducing authentication, role-based access control (RBAC),
and a professional MVC project architecture.

The project demonstrates:

- MVC architecture (Models, Controllers, Routes, Middleware)
- User authentication with JWT
- Password hashing using bcrypt
- Role-Based Access Control (admin / user)
- Full CRUD operations for Chats and Messages
- Real-time notifications (Socket.IO)
- Message search inside a chat
- Feedback form stored in MongoDB
- Admin panel to manage users and chats
- MongoDB Atlas integration

All data is stored in MongoDB Atlas.

---

## 2. Technologies Used

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv
- CORS
- Socket.IO

**Frontend**
- React + TypeScript (Vite)
- Redux Toolkit
- Axios
- Responsive CSS

**Tools**
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
| displayName | Optional user name |
| status | online/offline |
| isBlocked | blocked flag |
| preferences | theme/notifications |
| createdAt | Timestamp |

Security features:
- Passwords are hashed using bcrypt
- JWT tokens are generated on login
- Admin-only access for sensitive routes

---

### 3.2 Chats Management (CRUD)

| Field | Description |
|-----|------------|
| title | Chat title |
| participants | Array of User references |
| createdBy | Creator |
| createdAt | Timestamp |

---

### 3.3 Messages Management (CRUD)

| Field | Description |
|-----|------------|
| chat | Reference to Chat |
| sender | Reference to User |
| text | Message content |
| edited | Edited flag |
| isRead | Read flag |
| createdAt | Timestamp |

Relationships are implemented using ObjectId references and populated using `.populate()`.

---

### 3.4 Feedback System

| Field | Description |
|-----|------------|
| name | Sender name (optional) |
| email | Sender email |
| message | Feedback message |
| user | Linked user (optional) |

---

## 4. API Endpoints (Updated)

### 4.1 Authentication API

```http
POST /api/auth/register
POST /api/auth/login
```

---

### 4.2 Chats API

```http
GET    /api/chats                    (auth)
GET    /api/chats/:id                (auth)
GET    /api/chats/admin/all          (admin)
POST   /api/chats                    (auth)
PUT    /api/chats/:id                (auth/creator/admin)
DELETE /api/chats/:id                (auth/creator/admin)
```

---

### 4.3 Messages API

```http
GET    /api/messages/chat/:chatId            (auth)
GET    /api/messages/chat/:chatId/search     (auth)
PUT    /api/messages/chat/:chatId/read       (auth)
POST   /api/messages/chat/:chatId            (auth)
PUT    /api/messages/:id                     (auth/sender/admin)
DELETE /api/messages/:id                     (auth/sender/admin)
```

---

### 4.4 Users API

```http
GET    /api/users                    (auth)
PUT    /api/users/me/settings        (auth)
PUT    /api/users/me/profile         (auth)
PUT    /api/users/me/password        (auth)
PUT    /api/users/:id/role           (admin)
PUT    /api/users/:id/block          (admin)
PUT    /api/users/:id/restore        (admin)
DELETE /api/users/:id                (admin)
```

---

### 4.5 Feedback API

```http
POST /api/feedback              (public)
GET  /api/feedback              (admin)
```

---

## 5. Project Structure

```text
finalprojectweb2/
├─ backend/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  └─ routes/
├─ messenger-frontend/
│  ├─ src/
│  └─ index.html
├─ server.js
├─ package.json
└─ README.md
```

---

## 6. Environment Variables

**Backend `.env` for normal local run**
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/messagesDB
JWT_SECRET=your_secret_key
```

If you deploy the backend to Render/Railway/other cloud, set `MONGO_URI` there to your MongoDB Atlas connection string.

If you run with Docker Compose, the backend uses the internal Docker Mongo service automatically:

```text
mongodb://mongodb:27017/messagesDB
```

**Frontend `.env`** (create from `.env.example`)
```
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

---

## 7. Run Locally (Detailed)

### 7.1 Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- Postman (optional for testing)

### 7.2 Backend Setup
1. Go to project root:
```
cd finalprojectweb2
```
2. Install dependencies:
```
npm install
```
3. Create `.env` in root and add:
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/messagesDB
JWT_SECRET=your_secret_key
```
4. Start server:
```
npm start
```
Server runs at:
```
http://localhost:5001
```

### 7.3 Frontend Setup
1. Go to frontend folder:
```
cd finalprojectweb2/messenger-frontend
```
2. Install dependencies:
```
npm install
```
3. Create `.env`:
```
cp .env.example .env
```
4. Start frontend:

---

## 8. SRE Midterm Notes

This section describes the reliability part of the project in a simple and practical way.

### 8.1 Services in Docker Compose

The project includes the following services in `docker-compose.yml`:

- Frontend (`messenger-frontend`)
- Backend (`messenger-backend`)
- Database (`messenger-mongodb`)
- Prometheus
- Grafana
- Node Exporter

This means the application and the observability stack can run together in one environment.

### 8.2 Custom SLIs

For this messenger application, the most useful indicators are:

**SLI 1: API Availability**

This shows how often the backend answers requests successfully.

Formula:

```text
Availability SLI = Successful requests / Total requests
```

In Prometheus, this can be calculated as:

```promql
1 - (
  sum(rate(app_http_requests_total{status_code=~"5.."}[30d]))
  /
  sum(rate(app_http_requests_total[30d]))
)
```

**SLI 2: API Latency**

This shows how fast the backend responds to requests.

Formula:

```text
Latency SLI = Percentage of requests completed under target response time
```

For this project, the target can be measured with the existing request duration histogram.
The dashboard already shows `P95 latency`, which means 95% of requests should stay below the chosen threshold.

Prometheus query already used in Grafana:

```promql
histogram_quantile(0.95, sum(rate(app_http_request_duration_seconds_bucket[5m])) by (le))
```

### 8.3 SLO Targets

The following SLOs are realistic for a student messenger project:

- **SLO 1: Availability**
  The backend should be available **99.5%** of the time in one month.

- **SLO 2: Latency**
  At least **95%** of requests should finish in **less than 500 ms**.

These goals are realistic because the app is not a banking or medical system, but it should still feel stable and responsive for users.

### 8.4 Monthly Error Budget

For a 30-day month:

```text
30 days = 30 x 24 x 60 = 43,200 minutes
```

If the availability SLO is **99.5%**, then the allowed failure time is:

```text
Error budget = 0.5% of 43,200 minutes
             = 0.005 x 43,200
             = 216 minutes
```

So the system may be unavailable for about:

- **216 minutes per month**
- **3.6 hours per month**

For latency, if the SLO says that **95%** of requests must stay under **500 ms**, then:

- up to **5%** of requests may be slower than 500 ms
- if more than 5% are slower, the latency SLO is violated

### 8.5 Metrics Collected

The backend exports custom metrics for Prometheus:

- `app_http_requests_total`
- `app_http_request_duration_seconds`
- `app_login_attempts_total`
- `app_messages_created_total`
- `app_active_socket_connections`

These metrics are enough to build a dashboard for traffic, errors, latency, and messaging activity.

### 8.6 Grafana Dashboard

The dashboard includes:

- Backend availability (`up`)
- Traffic (`requests/sec`)
- Error rate
- P95 latency
- Messages created
- Active socket connections

This covers most of the Golden Signals:

- **Latency**: P95 latency panel
- **Traffic**: requests/sec panel
- **Errors**: error rate panel
- **Saturation**: can be shown using Node Exporter CPU / memory metrics

### 8.7 Alert Rules

Two alert rules are included:

1. **Critical Alert**
   `BackendDownCritical`

   Fires when the backend is unreachable for more than 1 minute.

2. **Warning Alert**
   `HighErrorRateWarning`

   Fires when more than 5% of backend requests return 5xx errors for 5 minutes.

### 8.8 How to Trigger an Alert for Demo

**Option 1: Trigger the critical alert**

1. Start the stack with Docker Compose
2. Stop only the backend container
3. Wait about 1 minute
4. Prometheus should show `BackendDownCritical` as `FIRING`

Example command:

```bash
docker compose stop backend
```

To recover:

```bash
docker compose start backend
```

```
npm run start
```
Frontend runs at:
```
http://localhost:3000
```

---

## 8. Postman Collection

Postman collection is included in the root:

```
postman_collection.json
```

**Import in Postman:**
1. Open Postman
2. Click `Import`
3. Select `postman_collection.json`
4. Set variables: `baseUrl`, `token`, `chatId`, `userId` as needed

---

## 9. Deployment

Deploy backend to Render (or similar) and frontend to Vercel/Netlify.  
After deployment, add links at the top of this README.

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
