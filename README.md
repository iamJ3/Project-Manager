# Task Manager Backend API

A robust and scalable Node.js backend API for a task management application, built with Express.js and MongoDB. This backend provides comprehensive user authentication, email verification, and project management capabilities with a clean, RESTful architecture.

## 🚀 Features

- **User Authentication & Authorization**
  - User registration with email verification
  - Secure login with JWT tokens (access & refresh tokens)
  - Password hashing with bcrypt
  - Role-based access control (Admin, Project Admin, Member)

- **Email Services**
  - Email verification system
  - Password reset functionality
  - Professional email templates using Mailgen

- **API Features**
  - RESTful API design
  - Input validation with express-validator
  - Error handling with custom error classes
  - CORS configuration for cross-origin requests
  - Health check endpoints

- **Database**
  - MongoDB with Mongoose ODM
  - User model with comprehensive fields
  - Secure token storage and management

## 🛠️ Technologies Used

### Core Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework for Node.js
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling for Node.js

### Authentication & Security
- **JWT (JSON Web Tokens)** - For secure user authentication
- **bcrypt** - For password hashing and security
- **crypto** - For generating secure tokens

### Email Services
- **Nodemailer** - Email sending library
- **Mailgen** - Professional email template generator

### Validation & Middleware
- **express-validator** - Input validation middleware
- **cors** - Cross-Origin Resource Sharing middleware
- **cookie-parser** - Cookie parsing middleware

### Development Tools
- **nodemon** - Development server with auto-restart
- **prettier** - Code formatting tool
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamJ3/Project-Manager
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Server Configuration
   PORT=3000
   
   # Database
   MONGO_URI=mongodb://localhost:27017/taskmanager
   
   # JWT Secrets
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173,http://localhost:3000
   
   # Email Configuration (SMTP)
   MAIL_SPTM_HOST=smtp.gmail.com
   MAIL_SPTM_PORT=587
   MAIL_SPTM_USER=your_email@gmail.com
   MAIL_SPTM_PASS=your_app_password
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # For Windows
   net start MongoDB
   
   # For macOS/Linux
   sudo systemctl start mongod
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## 🧪 Testing the API

### Health Check
```bash
# Check if the server is running
curl http://localhost:3000/api/v1/healthcheck
```

### User Registration
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### User Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

## 📚 API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/register` | Register a new user | `{ username, email, password, fullName? }` |
| POST | `/login` | User login | `{ email, password }` |

### Health Check Routes (`/api/v1/healthcheck`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server health status |
| GET | `/instagram` | Additional health check |

### Example API Responses

#### Successful Registration
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "isEmailVerified": false,
      "avatar": {
        "url": "https://placehold.co/200x200",
        "localPath": ""
      },
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    }
  },
  "message": "user registered successfully",
  "success": true
}
```

#### Successful Login
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "isEmailVerified": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User logged in successfully",
  "success": true
}
```

#### Error Response
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Username Already Exist",
  "success": false
}
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | Yes | - |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | Yes | - |
| `ACCESS_TOKEN_EXPIRY` | Access token expiration | No | 15m |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiration | No | 7d |
| `CORS_ORIGIN` | Allowed CORS origins | No | http://localhost:5173 |
| `MAIL_SPTM_HOST` | SMTP server host | Yes | - |
| `MAIL_SPTM_PORT` | SMTP server port | Yes | - |
| `MAIL_SPTM_USER` | SMTP username | Yes | - |
| `MAIL_SPTM_PASS` | SMTP password | Yes | - |

### Database Schema

#### User Model
```javascript
{
  username: String (required, unique, lowercase, indexed)
  email: String (required, unique, lowercase)
  fullName: String (optional)
  password: String (required, hashed)
  isEmailVerified: Boolean (default: false)
  avatar: {
    url: String,
    localPath: String
  }
  refreshToken: String
  forgotPasswordToken: String
  forgotPasswordExpiry: Date
  emailVerificationToken: String
  emailVerificationExpiry: Date
  createdAt: Date
  updatedAt: Date
}
```

## 🐛 Known Issues & Limitations

- **Email Verification**: Currently set to `true` by default for development purposes
- **Password Reset**: Implementation in progress
- **File Upload**: Avatar upload functionality not yet implemented
- **Rate Limiting**: No rate limiting implemented for API endpoints
- **Logging**: Basic console logging only, no structured logging system
- **Testing**: No automated test suite currently available

## 🔮 Future Improvements

### Planned Features
- [ ] **Complete Email Verification System**
  - Email verification endpoint
  - Resend verification email functionality
  
- [ ] **Password Reset Functionality**
  - Forgot password endpoint
  - Reset password with token validation
  
- [ ] **User Profile Management**
  - Update user profile
  - Avatar upload with cloud storage
  - Change password functionality
  
- [ ] **Project Management Features**
  - Project CRUD operations
  - Task management system
  - Team collaboration features
  
- [ ] **Enhanced Security**
  - Rate limiting
  - Input sanitization
  - Security headers
  - API versioning
  
- [ ] **Testing & Documentation**
  - Unit tests with Jest
  - Integration tests
  - API documentation with Swagger
  - Code coverage reports
  
- [ ] **Performance & Monitoring**
  - Redis caching
  - Database indexing optimization
  - Application monitoring
  - Performance metrics
  
- [ ] **DevOps & Deployment**
  - Docker containerization
  - CI/CD pipeline
  - Environment-specific configurations
  - Health check improvements

## 🤝 Contributing

We welcome contributions to improve this project! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use Prettier for code formatting
- Follow existing code patterns and conventions
- Write meaningful commit messages
- Add comments for complex logic

### Pull Request Guidelines
- Provide a clear description of changes
- Include relevant tests if applicable
- Ensure all existing tests pass
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jatin Sharma**
- GitHub: [@iamj3](https://github.com/iamj3)
- Email: [jatinsharma.techy@gmail.com]

## 🙏 Acknowledgments

- Express.js community for the excellent framework
- MongoDB team for the robust database solution
- All contributors who help improve this project

---

**Note**: This is a development version of the Task Manager Backend API. For production use, ensure all security measures are properly configured and tested.
