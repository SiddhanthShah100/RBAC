# RBAC

RBAC (Role-Based Access Control) is a web application that implements user authentication and role-based access control using Firebase. It provides an easy-to-use platform where users can register, log in, and access different parts of the app based on their roles. Administrators have access to manage user data and perform administrative tasks, while regular users only have access to their personal dashboards.

This project is ideal for developers looking to implement a secure authentication system with role-based access in their applications.

## Steps to Open the Project

1. **Start the Backend**:  
   Visit the backend URL: [https://rbac-1-36z6.onrender.com](https://rbac-1-36z6.onrender.com).

2. **Access the Frontend**:  
   Visit the registration page: [https://rbac-sigma-seven.vercel.app/register](https://rbac-sigma-seven.vercel.app/register).

3. **User Registration & Verification**:
   - **Register**: Fill out the registration form to create a new account.
   - **Email Verification**: Check your email inbox for a verification email and verify your email address.
   - Once verified, you can **log in** to access the dashboard.

## Admin Credentials  
Use the following credentials to log in as an admin:  
- **Email**: Siddhanthshah2003@gmail.com  
- **Password**: 123456789

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

```dotenv
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_DATABASE_URL=your-database-url
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

```

## Installation

### Frontend Installation


```bash
 git clone https://github.com/your-username/rbac-project.git
 cd rbac-project
 cd rbac-frontend
 npm install
 npm start

```
### Backend Installation
Place the firebase-admin-sdk.json file in the /rbac-backend/config/ directory.

```bash
 cd rbac-backend
 npm install
 node server.js

```


####  Updates the role of an existing user identified by the uid.

```http
  PUT /api/users/:uid/role
```

####  Authenticates a user using email and password, and returns the user's details if successful.

```http
  POST /api/login
```
####  Fetches the permissions associated with a specified role.

```http
  GET /api/roles/:role/permissions
```
### A simple health check endpoint that responds with "Hello, server is running!" when accessed.
```http
   /
```





