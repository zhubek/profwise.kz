# Profwise API Documentation

Base URL: `http://172.26.195.243:4000` (or `http://localhost:4000` if running locally)

## Table of Contents
- [Authentication Module](#authentication-module)
- [Profiles (Users) Module](#profiles-users-module)
- [Quizzes Module](#quizzes-module)
- [Questions Module](#questions-module)
- [Results Module](#results-module)
- [Licenses Module](#licenses-module)
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

### Get User Archetype Profile
**GET** `/users/:id/archetype-profile`

Retrieves a user's complete archetype profile with scores grouped by archetype type IDs.

**Parameters:**
- `id` (string, required): User ID

**Response:** `200 OK`
```json
{
  "userId": "uuid",
  "groupedArchetypes": {
    "interest": [
      {
        "archetypeId": "archetype-uuid",
        "archetype": {
          "id": "archetype-uuid",
          "name": {
            "en": "Realistic",
            "ru": "Реалистичный",
            "kk": "Шынайы"
          },
          "category": "interest",
          "description": {
            "en": "Prefers hands-on activities",
            "ru": "Предпочитает практическую деятельность",
            "kk": "Практикалық әрекетті артық көреді"
          },
          "icon": null,
          "keyTraits": [],
          "createdAt": "2025-10-16T12:00:00.000Z",
          "updatedAt": "2025-10-16T12:00:00.000Z"
        },
        "score": 85,
        "percentile": null
      }
    ],
    "personality": [],
    "skill": []
  },
  "lastUpdated": "2025-10-17T14:30:00.000Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "User with ID {id} not found"
}
```

**Notes:**
- Archetype scores are grouped dynamically by ArchetypeType ID
- Keys in `groupedArchetypes` correspond to ArchetypeType IDs in the database
- Score represents user's affinity for that archetype (higher = stronger match)
- Percentile calculation is planned for future implementation
- Empty objects indicate no archetypes recorded for the user yet
- Use `GET /archetypes/types/all` to fetch available archetype types and their names

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
  },
  "parameters": {
    "timeLimit": 30,
    "scoringMethod": "weighted",
    "passingScore": 70
  },
  "instructionsContent": {  // optional, dynamic content blocks for quiz instructions
    "blocks": [
      {
        "type": "overview",
        "id": "overview",
        "title": { "en": "About This Test", "ru": "Об этом тесте", "kk": "Бұл тест туралы" },
        "description": { "en": "Description text", "ru": "Текст описания", "kk": "Сипаттама мәтіні" }
      },
      {
        "type": "riasec_grid",
        "id": "riasec_grid",
        "title": { "en": "What It Measures", "ru": "Что измеряет", "kk": "Не өлшейді" },
        "description": { "en": "The RIASEC model", "ru": "Модель RIASEC", "kk": "RIASEC үлгісі" },
        "items": [
          {
            "code": "R",
            "title": { "en": "Realistic", "ru": "Реалистичный", "kk": "Шынайы" },
            "description": { "en": "Hands-on", "ru": "Практический", "kk": "Практикалық" },
            "color": "blue"
          }
        ]
      },
      {
        "type": "numbered_steps",
        "id": "how_it_works",
        "title": { "en": "How It Works", "ru": "Как это работает", "kk": "Қалай жұмыс істейді" },
        "steps": [
          {
            "number": 1,
            "title": { "en": "", "ru": "", "kk": "" },
            "description": { "en": "Step 1 text", "ru": "Текст шага 1", "kk": "1-қадам мәтіні" }
          }
        ]
      },
      {
        "type": "bullet_list",
        "id": "instructions",
        "title": { "en": "Instructions", "ru": "Инструкции", "kk": "Нұсқаулар" },
        "description": { "en": "Optional intro", "ru": "Необязательное вступление", "kk": "Қосымша кіріспе" },
        "items": [
          { "en": "Point 1", "ru": "Пункт 1", "kk": "1-тармақ" }
        ]
      }
    ]
  },
  "isActive": true,           // optional, defaults to true
  "startDate": "2025-01-01",  // optional, ISO date string
  "isPublic": false           // optional, defaults to false
}
```

**instructionsContent Block Types:**
- `overview`: Simple text block with title and description
- `riasec_grid`: Grid of colored cards (e.g., RIASEC types with descriptions)
- `numbered_steps`: Ordered list with numbered steps
- `bullet_list`: Unordered list of bullet points
- `rich_text`: Flexible text content with optional title

**instructionsContent Colors (for riasec_grid):**
- `blue`, `purple`, `pink`, `green`, `orange`, `gray`, `yellow`, `red`

**Quiz Types:**
- `PERSONALITY`
- `APTITUDE`
- `KNOWLEDGE`
- `CAREER`
- `HOLAND`
- `OTHER`

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "quizName": {...},
  "quizType": "PERSONALITY",
  "isFree": true,
  "description": {...},
  "parameters": {...},
  "isActive": true,
  "startDate": "2025-01-01T00:00:00.000Z",
  "isPublic": false,
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

### Get User-Specific Quizzes
**GET** `/quizzes/user/:userId`

Retrieves all quizzes available to a specific user based on public access and active licenses.

**Logic:**
1. Fetches all public quizzes (`isPublic: true`) - includes both active and inactive
2. Fetches all active quizzes from user's active licenses
3. If quizzes share the same `quizType`, license quizzes override public ones
4. Sorts results:
   - License-based quizzes first (sorted by `activationDate` DESC - most recently activated first)
   - Then public active quizzes
   - Then inactive public quizzes (sorted by `startDate` ASC - upcoming ones first)
5. Returns deduplicated and sorted list with source indicator

**Parameters:**
- `userId` (string, required): User ID

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "quizName": {
      "en": "Holland Career Interest Test (RIASEC)",
      "ru": "Тест профессиональных интересов Голланда (RIASEC)",
      "kk": "Голланд кәсіби қызығушылық тесті (RIASEC)"
    },
    "quizType": "HOLAND",
    "isFree": true,
    "description": {...},
    "parameters": null,
    "isActive": true,
    "startDate": null,
    "isPublic": false,
    "createdAt": "2025-10-16T04:32:47.434Z",
    "updatedAt": "2025-10-16T04:32:47.434Z",
    "_count": {
      "questions": 36,
      "results": 0
    },
    "source": "license",  // "public" or "license"
    "licenseInfo": {      // Only present when source is "license"
      "licenseCode": "SCHOOL-2024-ABC123",
      "expireDate": "2025-08-31T23:59:59.000Z",
      "organizationName": "School #15",
      "activationDate": "2025-01-15T10:30:00.000Z"
    }
  }
]
```

**Notes:**
- Quiz results are sorted to prioritize the most relevant quizzes for the user
- License-based quizzes are shown first as they are specifically assigned to the user
- Among license quizzes, most recently activated ones appear first
- Inactive public quizzes are sorted by startDate to show upcoming quizzes first
- Quizzes without startDate appear last among inactive quizzes

### Get Quiz by ID
**GET** `/quizzes/:id`

Retrieves a specific quiz with all questions and results.

**Response:** `200 OK`

### Get Quiz Instructions
**GET** `/quizzes/:id/instructions`

Retrieves only the instructions content for a specific quiz. This endpoint is optimized for client-side caching and reduces payload size compared to fetching the full quiz.

**Parameters:**
- `id` (string, required): Quiz ID

**Response:** `200 OK`
```json
{
  "quizId": "uuid",
  "instructionsContent": {
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "content": {
          "en": "About This Test",
          "ru": "Об этом тесте",
          "kz": "Бұл тест туралы"
        }
      },
      {
        "type": "paragraph",
        "content": {
          "en": "This test measures...",
          "ru": "Этот тест измеряет...",
          "kz": "Бұл тест өлшейді..."
        }
      },
      {
        "type": "bulletList",
        "items": [
          {
            "en": "Point 1",
            "ru": "Пункт 1",
            "kz": "1-тармақ"
          }
        ]
      },
      {
        "type": "numberedList",
        "items": [
          {
            "en": "Step 1",
            "ru": "Шаг 1",
            "kz": "1-қадам"
          }
        ]
      },
      {
        "type": "card",
        "variant": "info",
        "content": {
          "en": "Important note...",
          "ru": "Важное примечание...",
          "kz": "Маңызды ескерту..."
        }
      }
    ]
  }
}
```

**instructionsContent Block Types:**
- `heading`: Text heading with configurable level (2-4)
- `paragraph`: Simple text paragraph
- `bulletList`: Unordered list with bullet points
- `numberedList`: Ordered list with numbered items
- `card`: Highlighted content box with optional variant (`info`, `warning`, `success`)

**Notes:**
- If quiz has no custom `instructionsContent`, the field will be `null` - client should use generic fallback
- This endpoint returns minimal data for optimal performance
- Designed for client-side caching to avoid repeated API calls
- Frontend automatically uses generic instructions when `instructionsContent` is null

**Error Response:** `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "Quiz with ID {id} not found"
}
```

### Update Quiz
**PATCH** `/quizzes/:id`

Updates quiz information.

**Request Body:** (all fields optional)
```json
{
  "isFree": false,
  "description": {...},
  "parameters": {...},
  "isActive": false,
  "startDate": "2025-02-01",
  "isPublic": true
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

## Licenses Module

Manages user licenses, license activation, and quiz access control.

### Activate License
**POST** `/licenses/activate`

Activates a license code for a user, granting access to quizzes.

**Request Body:**
```json
{
  "userId": "user-uuid",
  "licenseCode": "SCHOOL-2024-ABC123"
}
```

**Response:** `201 Created`
```json
{
  "message": "License activated successfully",
  "userLicense": {
    "id": "uuid",
    "userId": "user-uuid",
    "licenseId": "license-uuid",
    "createdAt": "2025-10-16T12:00:00.000Z",
    "license": {
      "id": "uuid",
      "name": "School Annual License",
      "licenseCode": "SCHOOL-2024-ABC123",
      "startDate": "2024-09-01T00:00:00.000Z",
      "expireDate": "2025-08-31T23:59:59.000Z",
      "licenseClass": {
        "id": "uuid",
        "name": "School License"
      },
      "organization": {
        "id": "uuid",
        "name": "School #15",
        "type": "SCHOOL"
      }
    }
  },
  "availableQuizzes": [
    {
      "id": "uuid",
      "quizName": {...},
      "quizType": "PERSONALITY",
      "isFree": false
    }
  ]
}
```

**Error Responses:**

`404 Not Found` - License code doesn't exist
```json
{
  "statusCode": 404,
  "message": "License with code SCHOOL-2024-ABC123 not found"
}
```

`400 Bad Request` - License expired or not active
```json
{
  "statusCode": 400,
  "message": "License is invalid, expired, or not yet active"
}
```

`409 Conflict` - User already has this license
```json
{
  "statusCode": 409,
  "message": "User already has this license activated"
}
```

### Validate License Code
**GET** `/licenses/validate/:code`

Checks if a license code is valid and active.

**Parameters:**
- `code` (string, required): License code to validate

**Response:** `200 OK`
```json
{
  "valid": true,
  "license": {
    "id": "uuid",
    "name": "School Annual License",
    "licenseCode": "SCHOOL-2024-ABC123",
    "startDate": "2024-09-01T00:00:00.000Z",
    "expireDate": "2025-08-31T23:59:59.000Z",
    "isExpired": false,
    "isActive": true,
    "licenseClass": {
      "id": "uuid",
      "name": "School License"
    },
    "organization": {
      "id": "uuid",
      "name": "School #15"
    }
  }
}
```

### Get User Licenses
**GET** `/licenses/user/:userId`

Retrieves all licenses for a specific user.

**Parameters:**
- `userId` (string, required): User ID

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "userId": "user-uuid",
    "licenseId": "license-uuid",
    "createdAt": "2025-10-16T12:00:00.000Z",
    "license": {
      "id": "uuid",
      "name": "School Annual License",
      "licenseCode": "SCHOOL-2024-ABC123",
      "startDate": "2024-09-01T00:00:00.000Z",
      "expireDate": "2025-08-31T23:59:59.000Z",
      "isExpired": false,
      "isActive": true,
      "licenseClass": {
        "name": "School License"
      },
      "organization": {
        "name": "School #15",
        "type": "SCHOOL"
      }
    },
    "availableQuizzes": [...]
  }
]
```

### Get License Quizzes
**GET** `/licenses/:id/quizzes`

Retrieves all quizzes available for a specific license.

**Parameters:**
- `id` (string, required): License ID

**Response:** `200 OK`
```json
{
  "licenseId": "uuid",
  "licenseName": "School Annual License",
  "licenseClass": "School License",
  "quizzes": [
    {
      "id": "uuid",
      "quizName": {...},
      "quizType": "PERSONALITY",
      "isFree": false,
      "description": {...},
      "_count": {
        "questions": 48,
        "results": 150
      }
    }
  ]
}
```

### Create License (Admin)
**POST** `/licenses`

Creates a new license for an organization.

**Request Body:**
```json
{
  "startDate": "2024-09-01",
  "expireDate": "2025-08-31",
  "licenseCode": "SCHOOL-2024-ABC123",
  "name": "School Annual License",
  "licenseClassId": "license-class-uuid",
  "organizationId": "organization-uuid"
}
```

**Response:** `201 Created`

**Error Response:** `409 Conflict` (if license code already exists)

### Get All Licenses
**GET** `/licenses`

Retrieves all licenses with organization and usage details.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "School Annual License",
    "licenseCode": "SCHOOL-2024-ABC123",
    "startDate": "2024-09-01T00:00:00.000Z",
    "expireDate": "2025-08-31T23:59:59.000Z",
    "licenseClass": {
      "id": "uuid",
      "name": "School License"
    },
    "organization": {
      "id": "uuid",
      "name": "School #15",
      "type": "SCHOOL",
      "region": {
        "name": {...}
      }
    },
    "_count": {
      "userLicenses": 45
    },
    "createdAt": "2024-08-15T12:00:00.000Z"
  }
]
```

### Get License by ID
**GET** `/licenses/:id`

Retrieves a specific license with full details including users and available quizzes.

**Response:** `200 OK`

### Update License
**PATCH** `/licenses/:id`

Updates license information.

**Request Body:** (all fields optional)
```json
{
  "name": "Updated License Name",
  "expireDate": "2026-08-31"
}
```

**Response:** `200 OK`

### Delete License
**DELETE** `/licenses/:id`

Deletes a license and all user license associations (cascade).

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

### Get Archetype Types
**GET** `/archetypes/types/all`

Retrieves all archetype types (categories) available in the system.

**Response:** `200 OK`
```json
[
  {
    "id": "interest",
    "name": {
      "en": "Holland RIASEC",
      "ru": "RIASEC Холланда",
      "kk": "Холланд RIASEC"
    },
    "description": {
      "en": "John Holland's theory of career choice based on six personality types",
      "ru": "Теория профессионального выбора Джона Холланда",
      "kk": "Джон Холландтың мансап таңдау теориясы"
    },
    "createdAt": "2025-10-15T21:39:30.248Z",
    "_count": {
      "archetypes": 6
    }
  }
]
```

**Notes:**
- Returns all archetype type categories used to organize archetypes
- Use these types to create dynamic tabs/filters in the UI
- The `_count.archetypes` field shows how many archetypes belong to each type

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
