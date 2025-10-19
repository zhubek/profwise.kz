# Profession Data Population Scripts

This directory contains scripts to populate the professions database from the Excel file `job_general_data.xlsx`.

## Files

### Data Files
- **job_general_data.xlsx** - Source Excel file with 1,000 professions

### Scripts

1. **extract-first-record.js**
   - Extracts and displays the first record from the Excel file
   - Shows both raw and parsed data
   - Usage: `node mock-data/extract-first-record.js`

2. **populate-single-profession.ts**
   - Populates ONE profession from Excel into the database
   - Creates comprehensive JSON data for all profession fields
   - Usage: `npx tsx mock-data/populate-single-profession.ts`

3. **verify-profession.ts**
   - Verifies that a profession was correctly saved to the database
   - Shows structure and content of all JSON fields
   - Usage: `npx tsx mock-data/verify-profession.ts`

## What Gets Populated

The script creates the following JSON fields for each profession:

### 1. descriptionData
Contains detailed profession description with 6 fields:
- `overview` - General profession overview (multilingual)
- `keyResponsibilities` - 4-5 key responsibilities (array)
- `requiredSkills` - 5-7 required skills (array)
- `workEnvironment` - Work setting description
- `typicalTasks` - 3-4 typical daily tasks (array)
- `toolsAndTechnologies` - 3-5 tools/technologies (array, optional)

**Used in:** `/professions/:id/description` page

### 2. archetypes
Contains RIASEC and personality data:
- `riasecCodes` - Array of RIASEC codes (e.g., ["E", "C"])
- `primaryArchetypes` - Main archetype categories
- `archetypeScores` - Detailed scores for interests, skills, personality, values

**Used in:** Profession matching, quiz results

### 3. marketResearch
Contains labor market information:
- `demandLevel` - Job demand (high/medium/low)
- `jobGrowth` - Growth percentage
- `annualOpenings` - Estimated annual job openings
- `salaryRanges` - Entry/mid/senior salary ranges (in KZT)
- `industrySectors` - Main industry sectors
- `geographicHotspots` - Top cities for this profession
- `trends` - Current market trends

**Used in:** `/professions/:id/market` page

### 4. education
Contains educational requirements:
- `minimumEducation` - Minimum degree required
- `preferredFields` - Preferred study fields
- `certifications` - Recommended certifications
- `learningPaths` - Different paths to enter the profession

**Used in:** `/professions/:id/education` page

### 5. general
Contains general information:
- `overview` - Brief overview
- `alternativeTitles` - Other job titles
- `careerPath` - Typical career progression

**Used in:** `/professions/:id` overview page

## Database Schema

The profession model includes:

```prisma
model Profession {
  id              String   @id @default(uuid())
  name            Json     // Multilingual {en, ru, kk}
  description     Json?
  code            String   @unique
  categoryId      String
  featured        Boolean  @default(false)
  general         Json?
  descriptionData Json?    // NEW: 6 detailed description fields
  archetypes      Json?
  education       Json?
  marketResearch  Json?
  createdAt       DateTime @default(now())
  ...
}
```

## Data Sources

### From Excel
- Job ID (used to map professions)
- RIASEC codes (personality types)
- Archetype data (personality scores)
- Education data (universities, specializations)
- Market data (basic salary/demand info)

### Generated Using Reasoning
- descriptionData - Created based on profession type and RIASEC code
- Detailed market research - Kazakhstan-specific data
- Education paths - Structured from Excel data
- General information - Based on profession category

## Example Output

Running `populate-single-profession.ts` created:

**Profession:** Chief Executive (MGT-001)
- **Category:** Business and Management
- **RIASEC:** E (Enterprising), C (Conventional)
- **Salary Range:** 250,000 - 3,000,000 KZT/month
- **Demand:** High
- **Growth:** +8%

All fields fully populated with multilingual content (English, Russian, Kazakh).

## Next Steps

To populate more professions:

1. Modify `populate-single-profession.ts` to iterate through Excel records
2. Create profession-specific data based on RIASEC codes and categories
3. Map Excel university data to actual database universities
4. Add logic to detect profession type from Excel data

## Notes

- Salaries are in KZT (Kazakhstan Tenge), not USD from Excel
- All text fields are multilingual: `{en, ru, kk}`
- Excel data has malformed JSON - scripts include parsers
- Profession code must be unique
- Scripts use Prisma Client for database operations
