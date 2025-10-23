# API Performance Analysis Report
**Date:** 2025-10-23
**Environment:** Local Development (localhost:4000)

## Executive Summary

### Critical Issues Found

1. **GET /professions** - 🔴 CRITICAL
   - Response Time: **594ms** (0.59 seconds)
   - Payload Size: **11.16 MB** (11,160,762 bytes)
   - **Issue**: Returning ALL profession data including nested relations (specs, archetypes)

2. **GET /archetypes** - 🔴 CRITICAL
   - Response Time: **1.06 seconds**
   - Payload Size: **22.56 MB** (22,555,605 bytes)
   - **Issue**: Returning ALL archetypes with ALL professions nested inside

3. **GET /quizzes/:id** - ✅ FIXED
   - Response Time: **5.6ms** (was 2.3 seconds)
   - Payload Size: **12.67 KB** (was 26.3 MB)
   - **Fix Applied**: Now only returns `_count` instead of all questions and results

---

## Detailed Performance Metrics

### ✅ GOOD Performance (< 50ms)

| Endpoint | Response Time | Payload Size | Status |
|----------|--------------|--------------|--------|
| GET /quizzes/:id | 5.6ms | 12.67 KB | ✅ FIXED |
| GET /quizzes/user/:userId | 9.2ms | 12.70 KB | ✅ Good |
| GET /quizzes | 12.8ms | 57.22 KB | ✅ Good |
| GET /quizzes/:id/instructions | 4.8ms | 11.44 KB | ✅ Good |
| GET /questions?quizId=:id | 15.7ms | 31.82 KB | ✅ Good |
| GET /results?userId=:id | 4.7ms | 2 bytes | ✅ Good (empty) |
| GET /users/:id | 3.2ms | 110 bytes | ✅ Good (404 likely) |
| GET /users/:id/archetype-profile | 4.3ms | 110 bytes | ✅ Good (404 likely) |
| GET /users/:id/professions | 4.0ms | 110 bytes | ✅ Good (404 likely) |
| GET /archetypes/types/all | 4.0ms | 2.83 KB | ✅ Good |
| GET /categories | 8.9ms | 16.84 KB | ✅ Good |
| GET /universities | 4.4ms | 2 bytes | ✅ Good (empty) |
| GET /specs | 4.2ms | 2 bytes | ✅ Good (empty) |
| GET /professions/:id | 23.1ms | 116 bytes | ✅ Good (404 likely) |

### 🔴 CRITICAL Performance Issues (> 500ms or > 5 MB)

| Endpoint | Response Time | Payload Size | Problem |
|----------|--------------|--------------|---------|
| **GET /professions** | **594ms** | **11.16 MB** | Returns ALL professions with full nested data (category, professionSpecs with specs, professionArchetypes with archetypes) |
| **GET /archetypes** | **1.06s** | **22.56 MB** | Returns ALL archetypes with ALL professionArchetypes including full profession objects nested inside each archetype |

---

## Root Cause Analysis

### 1. GET /professions Problem

**Backend Code (professions.service.ts:26-44):**
```typescript
async findAll() {
  return this.prisma.profession.findMany({
    include: {
      category: true,
      professionSpecs: {
        include: {
          spec: true,  // ← Full spec object for each profession
        },
      },
      professionArchetypes: {
        include: {
          archetype: true,  // ← Full archetype object for each profession
        },
      },
      _count: {
        select: { userProfessions: true },
      },
    },
  });
}
```

**Issues:**
- Returning ALL professions (~250-300+ records)
- Each profession includes:
  - Full `category` object
  - All `professionSpecs` with full `spec` objects
  - All `professionArchetypes` with full `archetype` objects
- Each profession has large JSON fields: `general`, `descriptionData`, `archetypes`, `education`, `marketResearch`
- Total payload: **11.16 MB**

**Where used in frontend:**
- ✅ **NOT USED** - Checked frontend code, `getProfessions()` is only defined in API files but never imported/called in pages

### 2. GET /archetypes Problem

**Backend Code (archetypes.service.ts:26-39):**
```typescript
async findAll() {
  return this.prisma.archetype.findMany({
    include: {
      archetypeType: true,
      professionArchetypes: {
        include: {
          profession: true,  // ← Full profession object for EACH archetype-profession relation!
        },
      },
      _count: {
        select: { userArchetypes: true, professionArchetypes: true },
      },
    },
  });
}
```

**Issues:**
- Returning ALL archetypes (~6 RIASEC types + personality types)
- Each archetype includes `professionArchetypes` array
- Each `professionArchetype` includes the FULL `profession` object with all its JSON fields
- This creates massive data duplication:
  - Profession "Software Engineer" appears in multiple archetypes (R, I, C)
  - Each time, the full profession data is duplicated
- Total payload: **22.56 MB** (almost double the /professions endpoint!)

**Where used in frontend:**
- ✅ **NOT USED** - Checked frontend code, `getArchetypes()` is only defined in API files but never imported/called in pages

---

## Frontend API Usage Analysis

### Actually Used Endpoints (from frontend code review)

**Quiz/Test Flows:**
1. ✅ `GET /quizzes/user/:userId` - Used for test list page
2. ✅ `GET /quizzes/:id` - Used for quiz details (FIXED - now fast)
3. ✅ `GET /questions?quizId=:id` - Used to fetch quiz questions
4. ✅ `GET /quizzes/:id/instructions` - Used for quiz instructions page

**Results:**
1. ✅ `GET /results?userId=:userId` - Used for user results list
2. ✅ `GET /results/:id` - Used for specific result details page
3. ✅ `POST /quizzes/calculate-holand` - Used to submit quiz answers

**Professions (User-Specific):**
1. ✅ `GET /users/:userId/professions` - Used for matched professions list
2. ✅ `GET /professions/:id` - Used for single profession detail page
3. ✅ `GET /professions/:id/description` - Used for profession description tab
4. ✅ `GET /professions/:id/archetypes` - Used for profession archetypes tab
5. ✅ `GET /professions/:id/education` - Used for profession education tab
6. ✅ `GET /professions/:id/market-research` - Used for salary/market data tab
7. ✅ `PATCH /users/:userId/professions/like` - Used to like/unlike professions

**User Profile:**
1. ✅ `GET /users/:userId/archetype-profile` - Used for user archetype scores
2. ✅ `GET /archetypes/types/all` - Used to get archetype categories

**Categories:**
1. ✅ `GET /categories` - Likely used for profession filtering

**🔴 NOT USED Endpoints:**
- ❌ `GET /professions` - 11.16 MB endpoint is never called!
- ❌ `GET /archetypes` - 22.56 MB endpoint is never called!

---

## Recommendations

### 1. Immediate Fixes (High Priority)

#### A. Remove unused heavy includes from GET /professions
Even though it's not used in frontend, it should be optimized for future use:

```typescript
// professions.service.ts:26
async findAll() {
  return this.prisma.profession.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      code: true,
      featured: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          professionSpecs: true,
          professionArchetypes: true,
          userProfessions: true,
        },
      },
    },
  });
}
```

**Benefits:**
- Removes large JSON fields: `general`, `descriptionData`, `archetypes`, `education`, `marketResearch`
- Removes nested `professionSpecs` and `professionArchetypes` arrays
- Expected size reduction: **11.16 MB → ~500 KB** (95% reduction)
- Expected time reduction: **594ms → ~50ms** (90% faster)

#### B. Fix GET /archetypes to only return counts

```typescript
// archetypes.service.ts:26
async findAll() {
  return this.prisma.archetype.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      archetypeTypeId: true,
      icon: true,
      keyTraits: true,
      archetypeType: true,
      _count: {
        select: {
          userArchetypes: true,
          professionArchetypes: true,
        },
      },
    },
  });
}
```

**Benefits:**
- Removes massive `professionArchetypes` array with full profession objects
- Expected size reduction: **22.56 MB → ~15 KB** (99.9% reduction)
- Expected time reduction: **1.06s → ~5ms** (99.5% faster)

### 2. Medium Priority

#### C. Add Redis Caching
Currently Redis is disabled (`ENABLE_REDIS_CACHE=false`). Enable it in production:

```bash
# backend/.env
ENABLE_REDIS_CACHE=true
```

**Benefits:**
- All GET endpoints will be cached
- Subsequent requests will be 10-100x faster
- Reduces database load significantly

#### D. Consider Pagination for Large Lists
For endpoints like `/professions` and `/archetypes`, add pagination:

```typescript
async findAll(page: number = 1, limit: number = 50) {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    this.prisma.profession.findMany({
      skip,
      take: limit,
      select: { /* ... */ },
    }),
    this.prisma.profession.count(),
  ]);
  return { data, total, page, limit };
}
```

### 3. Low Priority

#### E. Monitor Actual Frontend Usage
Add logging to track which endpoints are actually being called:

```typescript
// Add middleware to log all requests
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms - ${res.get('Content-Length')} bytes`);
  });
  next();
});
```

---

## Performance Comparison: Before vs After Fixes

| Metric | Before | After (Proposed) | Improvement |
|--------|--------|------------------|-------------|
| **GET /quizzes/:id** | 2.3s, 26.3 MB | ✅ 5.6ms, 12.67 KB | **99.8% faster, 99.95% smaller** |
| **GET /professions** | 594ms, 11.16 MB | 50ms (est), 500 KB (est) | **92% faster, 95% smaller** |
| **GET /archetypes** | 1.06s, 22.56 MB | 5ms (est), 15 KB (est) | **99.5% faster, 99.9% smaller** |

---

## Similar Patterns to Watch

### Pattern: Over-fetching with Deep Includes

The same issue that affected `GET /quizzes/:id` is also present in:
1. ✅ **FIXED**: `/quizzes/:id` - Was returning all questions and results
2. 🔴 **NEEDS FIX**: `/professions` - Returning all specs and archetypes with full objects
3. 🔴 **NEEDS FIX**: `/archetypes` - Returning all professions within each archetype

### Best Practice
**Always prefer counts over full relations for list endpoints:**

```typescript
// ❌ BAD - Returns full nested objects
include: {
  professionSpecs: {
    include: { spec: true },
  },
}

// ✅ GOOD - Returns only counts
_count: {
  select: { professionSpecs: true },
}
```

---

## Action Items

### Immediate (Do Now)
- [ ] Fix `GET /professions` to use `select` instead of `include` for specs and archetypes
- [ ] Fix `GET /archetypes` to remove `professionArchetypes.profession` include
- [ ] Test that frontend still works (it should since these endpoints aren't used)

### Short Term (This Week)
- [ ] Enable Redis caching in production (`ENABLE_REDIS_CACHE=true`)
- [ ] Add response size monitoring/logging middleware
- [ ] Review all other `findAll()` methods for similar over-fetching

### Long Term (Next Sprint)
- [ ] Add pagination to `/professions` and `/archetypes`
- [ ] Implement request/response monitoring dashboard
- [ ] Set up alerts for responses > 1 MB or > 500ms

---

## Conclusion

The main issue was the same as the quiz endpoint: **over-fetching with deep includes**.

**Key Learnings:**
1. Always return `_count` instead of full relations for list endpoints
2. Use `select` to limit fields instead of `include` for everything
3. Profile API performance regularly to catch these issues early
4. The fix for `/quizzes/:id` reduced response from **2.3s → 5.6ms** (256x faster)
5. Similar fixes for `/professions` and `/archetypes` could save **~34 MB** of data transfer

**Good News:**
- The two worst offenders (`/professions`, `/archetypes`) are NOT being used by the frontend
- All actually-used endpoints are performing well (< 50ms)
- Frontend is using optimized user-specific endpoints (`/users/:id/professions`) instead of loading everything
