# Profwise API Documentation

Base URL: `http://localhost:4000`

## Table of Contents
- [Profiles (Users) Module](#profiles-users-module)
- [Quizzes Module](#quizzes-module)
- [Professions Module](#professions-module)
- [Archetypes Module](#archetypes-module)

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
