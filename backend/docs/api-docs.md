# Profwise API Documentation

Base URL: `http://172.26.195.243:4000` (or `http://localhost:4000` if running locally)

## Table of Contents
- [Authentication Module](#authentication-module)
- [Profiles (Users) Module](#profiles-users-module)
- [Quizzes Module](#quizzes-module)
- [Questions Module](#questions-module)
- [Results Module](#results-module)
- [Professions Module](#professions-module)
- [Categories Module](#categories-module)
- [Universities Module](#universities-module)
- [Specs Module](#specs-module)
- [Archetypes Module](#archetypes-module)

---

## Authentication Module

Manages user authentication, registration, and email verification.

### Register User
**POST** `/auth/register`

Registers a new user and sends verification email if email verification is enabled.

**Request Body:**
```json
{
  "name": "John",
  "surname": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123",
  "schoolId": "school-uuid",  // optional
  "grade": "10",              // optional
  "age": 16,                  // optional
  "language": "RU"            // optional: "EN", "RU", or "KZ" (defaults to "RU")
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@example.com",
    "schoolId": "school-uuid",
    "grade": "10",
    "age": 16,
    "language": "RU",
    "emailVerified": false,
    "onboardingCompleted": false,
    "createdAt": "2025-10-15T12:00:00.000Z",
    "updatedAt": "2025-10-15T12:00:00.000Z"
  },
  "accessToken": "jwt-token-string",
  "message": "Registration successful. Please check your email to verify your account."
}
```

**Error Response:** `409 Conflict`
```json
{
  "statusCode": 409,
  "message": "User with this email already exists"
}
```

### Login User
**POST** `/auth/login`

Authenticates a user and returns JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@example.com",
    "schoolId": "school-uuid",
    "grade": "10",
    "age": 16,
    "language": "RU",
    "emailVerified": true,
    "onboardingCompleted": false,
    "createdAt": "2025-10-15T12:00:00.000Z",
    "updatedAt": "2025-10-15T12:00:00.000Z"
  },
  "accessToken": "jwt-token-string"
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

### Verify Email
**GET** `/auth/verify-email?token={token}`

Verifies user's email address using the token sent to their email.

**Query Parameters:**
- `token` (string, required): Email verification token

**Response:** `200 OK`
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "uuid",
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@example.com",
    "schoolId": null,
    "grade": null,
    "age": 16,
    "language": "RU",
    "emailVerified": true,
    "onboardingCompleted": false,
    "createdAt": "2025-10-15T12:00:00.000Z",
    "updatedAt": "2025-10-15T12:00:00.000Z"
  }
}
```

**Error Responses:**

`400 Bad Request` - Invalid or expired token
```json
{
  "statusCode": 400,
  "message": "Invalid verification token"
}
```

`400 Bad Request` - Token expired
```json
{
  "statusCode": 400,
  "message": "Verification token has expired. Please request a new one."
}
```

`400 Bad Request` - Already verified
```json
{
  "statusCode": 400,
  "message": "Email already verified"
}
```

### Get Current User
**GET** `/auth/me`

Returns the currently authenticated user's profile.

**Headers:**
```
Authorization: Bearer {jwt-token}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "John",
  "surname": "Doe",
  "email": "john.doe@example.com",
  "schoolId": "school-uuid",
  "grade": "10",
  "age": 16,
  "language": "RU",
  "emailVerified": true,
  "onboardingCompleted": false,
  "createdAt": "2025-10-15T12:00:00.000Z",
  "updatedAt": "2025-10-15T12:00:00.000Z"
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Send Test Email
**POST** `/auth/send-test-email`

Sends a test email to verify email configuration (development/testing only).

**Request Body:**
```json
{
  "email": "recipient@example.com",
  "subject": "Test Email Subject",
  "text": "Test email content"
}
```

**Response:** `200 OK`
```json
{
  "message": "Test email sent successfully"
}
```

**Error Response:** `500 Internal Server Error`
```json
{
  "statusCode": 500,
  "message": "Failed to send test email"
}
```

---

## Profiles (Users) Module

Manages user profiles and related data.

### Create User
**POST** `/users`

Creates a new user profile.

**Request Body:**
```json
{
  "name": "John",
  "surname": "Doe",
  "email": "john.doe@example.com",
  "schoolId": "school-uuid",  // optional
  "grade": "10",              // optional
  "age": 16                   // optional
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "John",
  "surname": "Doe",
  "email": "john.doe@example.com",
  "schoolId": "school-uuid",
  "grade": "10",
  "age": 16,
  "createdAt": "2025-10-15T12:00:00.000Z",
  "updatedAt": "2025-10-15T12:00:00.000Z"
}
```

### Get All Users
**GET** `/users`

Retrieves all users with their licenses, archetypes, and professions.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@example.com",
    "schoolId": "school-uuid",
    "grade": "10",
    "age": 16,
    "createdAt": "2025-10-15T12:00:00.000Z",
    "updatedAt": "2025-10-15T12:00:00.000Z",
    "userLicenses": [],
    "userArchetypes": [],
    "userProfessions": []
  }
]
```

### Get User by ID
**GET** `/users/:id`

Retrieves a specific user with full relations.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "John",
  "surname": "Doe",
  "email": "john.doe@example.com",
  "userLicenses": [...],
  "userArchetypes": [...],
  "userProfessions": [...],
  "results": [...]
}
```

**Error Response:** `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "User with ID {id} not found"
}
```

### Update User
**PATCH** `/users/:id`

Updates user information.

**Request Body:** (all fields optional)
```json
{
  "name": "Jane",
  "age": 17
}
```

**Response:** `200 OK`

### Delete User
**DELETE** `/users/:id`

Deletes a user and all related data (cascade).

**Response:** `204 No Content`

---

## Quizzes Module

Manages quizzes, questions, and results.

### Create Quiz
**POST** `/quizzes`

Creates a new quiz.

**Request Body:**
```json
{
  "quizName": {
    "en": "Personality Test",
    "ru": "Тест личности",
    "kk": "Тұлға тесті"
  },
  "quizType": "PERSONALITY",
  "isFree": true,
  "description": {
    "en": "Discover your personality type",
    "ru": "Откройте свой тип личности",
    "kk": "Өзіңіздің тұлға типіңізді табыңыз"
  }
}
```

**Quiz Types:**
- `PERSONALITY`
- `APTITUDE`
- `KNOWLEDGE`
- `CAREER`
- `OTHER`

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "quizName": {...},
  "quizType": "PERSONALITY",
  "isFree": true,
  "description": {...},
  "createdAt": "2025-10-15T12:00:00.000Z",
  "updatedAt": "2025-10-15T12:00:00.000Z"
}
```

### Get All Quizzes
**GET** `/quizzes`

Retrieves all quizzes with question counts.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "quizName": {...},
    "quizType": "PERSONALITY",
    "isFree": true,
    "description": {...},
    "questions": [...],
    "_count": {
      "questions": 20,
      "results": 150
    }
  }
]
```

### Get Quiz by ID
**GET** `/quizzes/:id`

Retrieves a specific quiz with all questions and results.

**Response:** `200 OK`

### Update Quiz
**PATCH** `/quizzes/:id`

Updates quiz information.

**Request Body:** (all fields optional)
```json
{
  "isFree": false,
  "description": {...}
}
```

**Response:** `200 OK`

### Delete Quiz
**DELETE** `/quizzes/:id`

Deletes a quiz and all related questions and results (cascade).

**Response:** `204 No Content`

---

## Questions Module

Manages quiz questions.

### Create Question
**POST** `/questions`

Creates a new question for a quiz.

**Request Body:**
```json
{
  "quizId": "quiz-uuid",
  "questionText": {
    "en": "What is your favorite color?",
    "ru": "Какой ваш любимый цвет?",
    "kk": "Сіздің сүйікті түсіңіз қандай?"
  },
  "answers": {
    "options": [
      { "en": "Red", "ru": "Красный", "kk": "Қызыл" },
      { "en": "Blue", "ru": "Синий", "kk": "Көк" }
    ]
  },
  "parameters": {
    "archetype": "R",
    "weight": 1
  },
  "questionType": "SINGLE_CHOICE"
}
```

**Question Types:**
- `MULTIPLE_CHOICE`
- `SINGLE_CHOICE`
- `TRUE_FALSE`
- `SCALE`
- `LIKERT`
- `TEXT`
- `OTHER`

**Response:** `201 Created`

### Get All Questions
**GET** `/questions`

Retrieves all questions. Can be filtered by quizId.

**Query Parameters:**
- `quizId` (string, optional): Filter questions by quiz ID

**Response:** `200 OK`

### Get Question by ID
**GET** `/questions/:id`

Retrieves a specific question with quiz details and user responses.

**Response:** `200 OK`

### Update Question
**PATCH** `/questions/:id`

Updates question information.

**Request Body:** (all fields optional)
```json
{
  "questionText": {...},
  "answers": {...},
  "parameters": {...}
}
```

**Response:** `200 OK`

### Delete Question
**DELETE** `/questions/:id`

Deletes a question and all related user responses (cascade).

**Response:** `204 No Content`

---

## Results Module

Manages quiz results and submissions.

### Submit Quiz Result
**POST** `/results`

Submits a user's quiz result.

**Request Body:**
```json
{
  "userId": "user-uuid",
  "quizId": "quiz-uuid",
  "answers": {
    "question-uuid-1": ["answer1"],
    "question-uuid-2": [3]
  },
  "results": {
    "R": 15,
    "I": 12,
    "A": 8,
    "S": 10,
    "E": 14,
    "C": 11
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "quizId": "quiz-uuid",
  "answers": {...},
  "results": {...},
  "createdAt": "2025-10-16T12:00:00.000Z",
  "user": {
    "id": "uuid",
    "name": "John",
    "surname": "Doe",
    "email": "john@example.com"
  },
  "quiz": {
    "id": "uuid",
    "quizName": {...},
    "quizType": "PERSONALITY"
  }
}
```

### Get All Results
**GET** `/results`

Retrieves all quiz results. Can be filtered by userId or quizId.

**Query Parameters:**
- `userId` (string, optional): Filter results by user ID
- `quizId` (string, optional): Filter results by quiz ID

**Response:** `200 OK`

### Get Result by ID
**GET** `/results/:id`

Retrieves a specific result with full details including quiz questions.

**Response:** `200 OK`

### Update Result
**PATCH** `/results/:id`

Updates result information.

**Request Body:** (all fields optional)
```json
{
  "answers": {...},
  "results": {...}
}
```

**Response:** `200 OK`

### Delete Result
**DELETE** `/results/:id`

Deletes a result.

**Response:** `204 No Content`

---

## Professions Module

Manages professions, categories, universities, and specializations.

### Create Profession
**POST** `/professions`

Creates a new profession.

**Request Body:**
```json
{
  "name": {
    "en": "Software Engineer",
    "ru": "Инженер-программист",
    "kk": "Бағдарламалық инженер"
  },
  "description": {
    "en": "Develops software applications",
    "ru": "Разрабатывает программное обеспечение",
    "kk": "Бағдарламалық қосымшаларды әзірлейді"
  },
  "code": "SE001",
  "categoryId": "category-uuid",
  "featured": true
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": {...},
  "description": {...},
  "code": "SE001",
  "categoryId": "category-uuid",
  "featured": true,
  "category": {
    "id": "category-uuid",
    "name": {...}
  }
}
```

### Get All Professions
**GET** `/professions`

Retrieves all professions with categories, specs, and archetypes.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": {...},
    "description": {...},
    "code": "SE001",
    "featured": true,
    "category": {...},
    "professionSpecs": [
      {
        "spec": {
          "id": "uuid",
          "name": {...},
          "code": "CS101"
        }
      }
    ],
    "professionArchetypes": [...],
    "_count": {
      "userProfessions": 50
    }
  }
]
```

### Get Profession by ID
**GET** `/professions/:id`

Retrieves a specific profession with full relations including universities.

**Response:** `200 OK`

### Update Profession
**PATCH** `/professions/:id`

Updates profession information.

**Request Body:** (all fields optional)
```json
{
  "featured": false,
  "description": {...}
}
```

**Response:** `200 OK`

### Delete Profession
**DELETE** `/professions/:id`

Deletes a profession and all related data (cascade).

**Response:** `204 No Content`

---

## Categories Module

Manages profession categories.

### Create Category
**POST** `/categories`

Creates a new profession category.

**Request Body:**
```json
{
  "name": {
    "en": "Healthcare",
    "ru": "Здравоохранение",
    "kk": "Денсаулық сақтау"
  },
  "description": {
    "en": "Medical and healthcare professions",
    "ru": "Медицинские профессии и здравоохранение",
    "kk": "Медициналық мамандықтар және денсаулық сақтау"
  }
}
```

**Response:** `201 Created`

### Get All Categories
**GET** `/categories`

Retrieves all categories with profession counts.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": {...},
    "description": {...},
    "createdAt": "2025-10-16T12:00:00.000Z",
    "_count": {
      "professions": 15
    }
  }
]
```

### Get Category by ID
**GET** `/categories/:id`

Retrieves a specific category with all professions in that category.

**Response:** `200 OK`

### Update Category
**PATCH** `/categories/:id`

Updates category information.

**Request Body:** (all fields optional)
```json
{
  "name": {...},
  "description": {...}
}
```

**Response:** `200 OK`

### Delete Category
**DELETE** `/categories/:id`

Deletes a category.

**Response:** `204 No Content`

---

## Universities Module

Manages universities and educational institutions.

### Create University
**POST** `/universities`

Creates a new university.

**Request Body:**
```json
{
  "name": {
    "en": "Nazarbayev University",
    "ru": "Университет Назарбаева",
    "kk": "Назарбаев Университеті"
  },
  "code": "NU-001",
  "description": {
    "en": "Research university in Astana",
    "ru": "Исследовательский университет в Астане",
    "kk": "Астанадағы зерттеу университеті"
  }
}
```

**Response:** `201 Created`

**Error Response:** `409 Conflict` (if code already exists)

### Get All Universities
**GET** `/universities`

Retrieves all universities with specialization counts.

**Response:** `200 OK`

### Get University by ID
**GET** `/universities/:id`

Retrieves a specific university with all specializations and test scores.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": {...},
  "code": "NU-001",
  "description": {...},
  "createdAt": "2025-10-16T12:00:00.000Z",
  "specUniversities": [
    {
      "id": "uuid",
      "isEnglish": true,
      "spec": {
        "id": "uuid",
        "name": {...},
        "code": "CS-001"
      },
      "testScores": [...]
    }
  ]
}
```

### Update University
**PATCH** `/universities/:id`

Updates university information.

**Request Body:** (all fields optional)
```json
{
  "name": {...},
  "description": {...}
}
```

**Response:** `200 OK`

### Delete University
**DELETE** `/universities/:id`

Deletes a university and all related data (cascade).

**Response:** `204 No Content`

---

## Specs Module

Manages academic specializations (degree programs).

### Create Spec
**POST** `/specs`

Creates a new specialization.

**Request Body:**
```json
{
  "name": {
    "en": "Computer Science",
    "ru": "Компьютерные науки",
    "kk": "Компьютерлік ғылымдар"
  },
  "code": "CS-001",
  "description": {
    "en": "Study of computation and algorithms",
    "ru": "Изучение вычислений и алгоритмов",
    "kk": "Есептеулер мен алгоритмдерді зерттеу"
  },
  "subjects": {
    "en": ["Math", "Physics", "Computer Science"],
    "ru": ["Математика", "Физика", "Информатика"],
    "kk": ["Математика", "Физика", "Информатика"]
  },
  "groupName": {
    "en": "Information Technology",
    "ru": "Информационные технологии",
    "kk": "Ақпараттық технологиялар"
  }
}
```

**Response:** `201 Created`

**Error Response:** `409 Conflict` (if code already exists)

### Get All Specs
**GET** `/specs`

Retrieves all specializations with university and profession counts.

**Response:** `200 OK`

### Get Spec by ID
**GET** `/specs/:id`

Retrieves a specific spec with universities offering it and related professions.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": {...},
  "code": "CS-001",
  "description": {...},
  "subjects": {...},
  "groupName": {...},
  "createdAt": "2025-10-16T12:00:00.000Z",
  "specUniversities": [
    {
      "id": "uuid",
      "isEnglish": true,
      "university": {
        "id": "uuid",
        "name": {...},
        "code": "NU-001"
      },
      "testScores": [...]
    }
  ],
  "professionSpecs": [
    {
      "profession": {
        "id": "uuid",
        "name": {...},
        "code": "SE-001"
      }
    }
  ]
}
```

### Update Spec
**PATCH** `/specs/:id`

Updates spec information.

**Request Body:** (all fields optional)
```json
{
  "name": {...},
  "description": {...},
  "subjects": {...}
}
```

**Response:** `200 OK`

### Delete Spec
**DELETE** `/specs/:id`

Deletes a spec and all related data (cascade).

**Response:** `204 No Content`

---

## Archetypes Module

Manages personality archetypes and their relationships.

### Create Archetype
**POST** `/archetypes`

Creates a new archetype.

**Request Body:**
```json
{
  "name": {
    "en": "The Analyst",
    "ru": "Аналитик",
    "kk": "Талдаушы"
  },
  "archetypeTypeId": "type-uuid",
  "description": {
    "en": "Logical and analytical thinker",
    "ru": "Логичный и аналитический мыслитель",
    "kk": "Логикалық және аналитикалық ойлаушы"
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": {...},
  "archetypeTypeId": "type-uuid",
  "description": {...},
  "archetypeType": {
    "id": "type-uuid",
    "name": {...}
  }
}
```

### Get All Archetypes
**GET** `/archetypes`

Retrieves all archetypes with types and profession relationships.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": {...},
    "archetypeTypeId": "type-uuid",
    "description": {...},
    "archetypeType": {...},
    "professionArchetypes": [
      {
        "profession": {
          "id": "uuid",
          "name": {...},
          "code": "SE001"
        }
      }
    ],
    "_count": {
      "userArchetypes": 25,
      "professionArchetypes": 10
    }
  }
]
```

### Get Archetype by ID
**GET** `/archetypes/:id`

Retrieves a specific archetype with professions and users.

**Response:** `200 OK`

### Update Archetype
**PATCH** `/archetypes/:id`

Updates archetype information.

**Request Body:** (all fields optional)
```json
{
  "description": {...}
}
```

**Response:** `200 OK`

### Delete Archetype
**DELETE** `/archetypes/:id`

Deletes an archetype and all related data (cascade).

**Response:** `204 No Content`

---

## Common Error Responses

### 400 Bad Request
Validation error - invalid input data.

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "name should not be empty"
  ],
  "error": "Bad Request"
}
```

### 404 Not Found
Resource not found.

```json
{
  "statusCode": 404,
  "message": "User with ID {id} not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
Server error.

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Notes

- All IDs are UUIDs (v4)
- All timestamps are in ISO 8601 format
- JSON fields (name, description) support multiple languages
- DELETE operations cascade to related entities
- All endpoints use JSON for request/response bodies
- Validation is enabled globally with whitelist and forbidNonWhitelisted
- User language preference: Supports `EN` (English), `RU` (Russian), and `KZ` (Kazakh), defaults to `RU`

### Authentication & Security
- JWT tokens expire in 7 days
- Passwords are hashed using bcrypt (10 rounds)
- Email verification can be enabled/disabled via `ENABLE_EMAIL_VERIFICATION` environment variable
- Email verification tokens expire in 24 hours
- Protected endpoints require `Authorization: Bearer {token}` header

### Email Configuration
Email verification is powered by Brevo (formerly Sendinblue). Configure the following environment variables:
- `BREVO_API_KEY`: Your Brevo API key
- `ENABLE_EMAIL_VERIFICATION`: Set to `"true"` to enable email verification
- `EMAIL_FROM`: Sender email address (e.g., "bex@profwise.kz")
- `EMAIL_FROM_NAME`: Sender display name (e.g., "Profwise")
- `FRONTEND_URL`: Frontend URL for email verification links
