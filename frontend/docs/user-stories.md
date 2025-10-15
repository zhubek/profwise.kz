# ProfWise User Stories

## Student User Stories

### Career Guidance Testing
**US-001:** As a student, I want to take a career guidance test so that I can discover suitable career paths based on my interests and abilities.

**US-002:** As a student, I want to view my test results and receive a comprehensive report so that I can understand my career profile clearly.

**US-003:** As a student, I want to see recommended professions that best fit my test results so that I can explore career options aligned with my profile.

**US-004:** As a student, I want to access multiple different career guidance tests so that I can explore various aspects of my career interests and get more comprehensive insights.

### Archetype Analysis
**US-005:** As a student, I want to view my archetype levels (interests, skills, abilities, personality, values) so that I can understand my career-related strengths and preferences.

**US-006:** As a student, I want to see my RIASEC interest codes and their corresponding levels so that I can understand my vocational interests according to established career theories.

**US-007:** As a student, I want to see profession recommendations based on each individual archetype so that I can understand how different aspects of my profile influence career suggestions.

**US-008:** As a student, I want to see profession recommendations based on my overall/general archetype profile so that I can get holistic career guidance.

### Profession Information & AI Interaction
**US-009:** As a student, I want to view detailed information about professions including job descriptions, required interests, values, and abilities so that I can make informed career decisions.

**US-010:** As a student, I want to ask AI questions about specific professions so that I can get personalized insights and clarifications about career paths.

### Access Management
**US-011:** As a student, I want to enter the website using a license code so that I can access the career guidance platform provided by my organization.

## Organization User Stories

### License Code Management
**US-012:** As an organization administrator, I want to generate license codes so that I can provide access to students affiliated with my organization.

**US-013:** As an organization administrator, I want students to be automatically attached to my organization when they enter a valid license code so that I can track and manage my students' progress.

### Student Progress Monitoring
**US-014:** As an organization administrator, I want to view the archetype results of my students so that I can monitor their career development and provide appropriate guidance.

**US-015:** As an organization administrator, I want to see aggregated results of all my students across different archetypes so that I can identify trends and patterns in career interests within my organization.

### Classroom Management
**US-016:** As an organization administrator, I want to create classrooms so that I can organize students into groups for better management and tracking.

**US-017:** As a student, I want to choose and join a classroom during registration so that I can be organized within my organization's structure.

## Additional User Stories (Derived Requirements)

### Data Management
**US-018:** As an organization administrator, I want to maintain a secure database of student profiles and results so that I can access historical data for analysis and reporting.

**US-019:** As a student, I want my personal data and test results to be securely stored so that I can access them across multiple sessions.

### User Experience
**US-020:** As a student, I want an intuitive and user-friendly interface so that I can easily navigate through tests, results, and profession information.

**US-021:** As an organization administrator, I want a dashboard to manage students, view reports, and generate license codes so that I can efficiently administer the platform.

## Acceptance Criteria Templates

### For Student Test Taking (US-001)
- Given I am a registered student
- When I select a career guidance test
- Then I should be able to complete the test questions
- And receive immediate feedback on completion
- And see my results in a clear, understandable format

### For Archetype Viewing (US-005)
- Given I have completed at least one career test
- When I navigate to my profile/archetypes section
- Then I should see my levels for each archetype category
- And see specific RIASEC codes with their corresponding scores
- And understand what each level means for career development

### For Organization License Generation (US-012)
- Given I am an organization administrator
- When I request to generate license codes
- Then I should be able to specify the number of codes needed
- And receive unique, valid codes
- And have those codes automatically linked to my organization

### For Student-Organization Linking (US-013)
- Given I have a valid license code from an organization
- When I enter the code during registration or login
- Then I should be automatically associated with that organization
- And the organization administrator should see me in their student list
- And I should have access to organization-specific features if any
