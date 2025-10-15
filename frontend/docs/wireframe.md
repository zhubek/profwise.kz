# ProfWise UI Wireframes

This document provides wireframes and design patterns based on the existing archive-frontend implementation. These wireframes serve as a reference for maintaining consistent UI/UX across the application.

---

## Design System Overview

### Core Design Principles
- **Card-based layouts** for content organization
- **Grid systems** for responsive layouts
- **Icon-driven UI** using lucide-react icons
- **Badge components** for status indicators
- **Progressive disclosure** through tabs and dropdowns
- **Clear visual hierarchy** with consistent typography

### Component Library
- UI Framework: shadcn/ui
- Icons: lucide-react
- Layout: Tailwind CSS with custom utility classes
- Translation: i18n support throughout

---

## 1. Dashboard Page

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ Main Container (max-w-7xl, mx-auto, px-6, py-8)        │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Career Tests Section                                ││
│ │ ┌────────────────────────────────────────────────┐  ││
│ │ │ Header: "Career Tests"         [View All] btn  │  ││
│ │ └────────────────────────────────────────────────┘  ││
│ │                                                     ││
│ │ ┌──────────────────┐  ┌──────────────────┐        ││
│ │ │ Test Card 1      │  │ Test Card 2      │        ││
│ │ │ ┌──────────────┐ │  │ ┌──────────────┐ │        ││
│ │ │ │ Title + Badge│ │  │ │ Title + Badge│ │        ││
│ │ │ │ [Completed]  │ │  │ │              │ │        ││
│ │ │ └──────────────┘ │  │ └──────────────┘ │        ││
│ │ │ Description      │  │ Description      │        ││
│ │ │ 🕐 Duration      │  │ 🕐 Duration      │        ││
│ │ │                  │  │                  │        ││
│ │ │ [View Results]   │  │ [Start Test] ▶  │        ││
│ │ │ [Retake Test] ▶  │  │                  │        ││
│ │ └──────────────────┘  └──────────────────┘        ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Dashboard Grid (2-column layout)                    ││
│ │                                                     ││
│ │ ┌─────────────────────┐  ┌──────────────────────┐ ││
│ │ │ Matched Professions │  │ Recent Activity      │ ││
│ │ │ ┌─────────────────┐ │  │ ┌──────────────────┐ │ ││
│ │ │ │ Header + [View] │ │  │ │ Activity Timeline│ │ ││
│ │ │ └─────────────────┘ │  │ │ • Test completed │ │ ││
│ │ │                     │  │ │ • Profile update │ │ ││
│ │ │ Profession Card 1   │  │ │ • New match      │ │ ││
│ │ │ 🎓 Title  [90% ⭐]  │  │ │ • Achievement    │ │ ││
│ │ │ Description         │  │ └──────────────────┘ │ ││
│ │ │ [⋮ Menu]            │  │                      │ ││
│ │ │                     │  │ ┌──────────────────┐ │ ││
│ │ │ Profession Card 2   │  │ │ My Progress      │ │ ││
│ │ │ 💼 Title  [85% ⭐]  │  │ │                  │ │ ││
│ │ │ Description         │  │ │ Interests        │ │ ││
│ │ │ [⋮ Menu]            │  │ │ ████████ 80%     │ │ ││
│ │ │                     │  │ │                  │ │ ││
│ │ │ Profession Card 3   │  │ │ Skills           │ │ ││
│ │ │ 🔬 Title  [82% ⭐]  │  │ │ ██████░░ 60%     │ │ ││
│ │ │ Description         │  │ │                  │ │ ││
│ │ │ [⋮ Menu]            │  │ │ Personality      │ │ ││
│ │ └─────────────────────┘  │ │ ██████░░ 60%     │ │ ││
│ │                          │ │                  │ │ ││
│ │                          │ │ Values           │ │ ││
│ │                          │ │ ████████ 80%     │ │ ││
│ │                          │ │                  │ │ ││
│ │                          │ │ [Test History]   │ │ ││
│ │                          │ │ [Download]       │ │ ││
│ │                          │ │                  │ │ ││
│ │                          │ │ [View Profile] 👤│ │ ││
│ │                          │ └──────────────────┘ │ ││
│ │                          └──────────────────────┘ ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### Career Test Card
```
┌────────────────────────────────────────┐
│ Card (border, rounded, hover:shadow)   │
│ ┌────────────────────────────────────┐ │
│ │ CardHeader                         │ │
│ │ Title                [✓ Completed] │ │
│ │ Description text                   │ │
│ └────────────────────────────────────┘ │
│ ┌────────────────────────────────────┐ │
│ │ CardContent                        │ │
│ │ 🕐 15 minutes    Completed Oct 12  │ │
│ │                                    │ │
│ │ [Outline Button]  [Primary Button] │ │
│ │  View Results      Retake Test ▶   │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

#### Matched Profession Card
```
┌────────────────────────────────────────────┐
│ Card                                       │
│ ┌────────────────────────────────────────┐ │
│ │ 🎓 Title Text    [90% Match] 🔥Popular│ │
│ │                              [⋮ Menu]  │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Description: 2-3 lines of text about the  │
│ profession and why it matches...          │
│                                            │
│ Dropdown Menu on [⋮]:                     │
│   ❤️ Like                                 │
│   👁️ View Details                         │
│   🗑️ Delete (red text)                    │
└────────────────────────────────────────────┘
```

#### Progress Overview Component
```
┌──────────────────────────────────────┐
│ Section Header                       │
│ My Progress        [2/4 Completed]   │
│                                      │
│ INTERESTS                            │
│ Realistic  ████████░░ 80%            │
│ Artistic   ██████░░░░ 60%            │
│ Social     ██████████ 100%           │
│ ────────────────────────────────     │
│                                      │
│ SKILLS                               │
│ Technical  ██████░░░░ 60%            │
│ Creative   ████████░░ 80%            │
│ ────────────────────────────────     │
│                                      │
│ PERSONALITY                          │
│ Openness   ███████░░░ 70%            │
│ Extravert  ████░░░░░░ 40%            │
│ ────────────────────────────────     │
│                                      │
│ VALUES                               │
│ Growth     ████████░░ 80%            │
│ Security   ██████████ 100%           │
│                                      │
│ [📜 Test History]  [⬇️ Download]     │
│                                      │
│ [👤 View My Archetypes Profile]      │
└──────────────────────────────────────┘
```

---

## 2. Archetypes Page

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ Main Container (max-w-6xl, mx-auto, px-6, py-8)        │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Page Header                                         ││
│ │ My Archetype Profile                                ││
│ │ Discover your unique combination of traits...       ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Tabs Navigation (5 equal-width tabs)                ││
│ │ ┌─────────┬─────────┬──────────┬─────────┬────────┐ ││
│ │ │Interests│ Skills  │Personality│ Values  │  All   │ ││
│ │ │  (▓▓▓)  │         │          │         │        │ ││
│ │ └─────────┴─────────┴──────────┴─────────┴────────┘ ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Tab Content Area                                    ││
│ │                                                     ││
│ │ ┌─────────────────────────────────────────────────┐││
│ │ │ Archetype Category Header                       │││
│ │ │ Your top archetype traits in: [Category]        │││
│ │ └─────────────────────────────────────────────────┘││
│ │                                                     ││
│ │ ┌─────────────────┐  ┌─────────────────┐          ││
│ │ │ Archetype Card  │  │ Archetype Card  │          ││
│ │ │ ┌─────────────┐ │  │ ┌─────────────┐ │          ││
│ │ │ │🎯 Icon      │ │  │ │💡 Icon      │ │          ││
│ │ │ │             │ │  │ │             │ │          ││
│ │ │ │ Title       │ │  │ │ Title       │ │          ││
│ │ │ │ [Score: 85%]│ │  │ │ [Score: 72%]│ │          ││
│ │ │ └─────────────┘ │  │ └─────────────┘ │          ││
│ │ │ Description...  │  │ Description...  │          ││
│ │ │                 │  │                 │          ││
│ │ │ ████████░░ 85%  │  │ ███████░░░ 72%  │          ││
│ │ └─────────────────┘  └─────────────────┘          ││
│ │                                                     ││
│ │ ┌─────────────────┐  ┌─────────────────┐          ││
│ │ │ Archetype Card  │  │ Archetype Card  │          ││
│ │ │ (Similar layout)│  │ (Similar layout)│          ││
│ │ └─────────────────┘  └─────────────────┘          ││
│ │                                                     ││
│ │ [Test Not Completed? Take Assessment →]            ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Action Buttons (border-top)                         ││
│ │ [💼 View All Profession Matches]  [👤 Update Profile]││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### Archetype Card
```
┌────────────────────────────────────┐
│ Card                               │
│ ┌────────────────────────────────┐ │
│ │ 🎯 Icon (centered, large)      │ │
│ │                                │ │
│ │ Title (Bold, centered)         │ │
│ │ [85% Match Badge]              │ │
│ └────────────────────────────────┘ │
│                                    │
│ Description text explaining the    │
│ archetype characteristics and      │
│ what it means for the user...      │
│                                    │
│ Progress Bar                       │
│ ████████░░ 85%                     │
│                                    │
│ Key Traits:                        │
│ • Trait 1                          │
│ • Trait 2                          │
│ • Trait 3                          │
└────────────────────────────────────┘
```

---

## 3. Test Pages (RIASEC & Values)

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ Header (bg-card, border-bottom)                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ ProfWise - Test Name                [Back to Dashboard]││
│ │ Section 1 of 6: Section Title                       ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
│                                                         │
│ Main Content (max-w-4xl, mx-auto, bg-muted/30)         │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Card (bg-card, rounded, border, p-8)                ││
│ │                                                     ││
│ │ ┌─────────────────────────────────────────────────┐││
│ │ │ Section Description                             │││
│ │ │ Instructions for this section...                │││
│ │ └─────────────────────────────────────────────────┘││
│ │                                                     ││
│ │ ┌─────────────────────────────────────────────────┐││
│ │ │ Question 1: Question text here                  │││
│ │ │                                                 │││
│ │ │ Not important  ○  ○  ○  ○  ○  Very important  │││
│ │ │                1  2  3  4  5                    │││
│ │ └─────────────────────────────────────────────────┘││
│ │                                                     ││
│ │ ┌─────────────────────────────────────────────────┐││
│ │ │ Question 2: Question text here                  │││
│ │ │                                                 │││
│ │ │ Not important  ○  ○  ○  ○  ○  Very important  │││
│ │ │                1  2  3  4  5                    │││
│ │ └─────────────────────────────────────────────────┘││
│ │                                                     ││
│ │ ┌─────────────────────────────────────────────────┐││
│ │ │ Question 3 (Multiple Choice):                   │││
│ │ │ Select all that apply:                          │││
│ │ │                                                 │││
│ │ │ ☑ Option A                                      │││
│ │ │ ☐ Option B                                      │││
│ │ │ ☑ Option C                                      │││
│ │ │ ☐ Option D                                      │││
│ │ └─────────────────────────────────────────────────┘││
│ │                                                     ││
│ │ ┌─────────────────────────────────────────────────┐││
│ │ │ Progress                               42%      │││
│ │ │ ████████████░░░░░░░░░░░░░░░░░░░                │││
│ │ └─────────────────────────────────────────────────┘││
│ │                                                     ││
│ │ [← Previous Section]        [Next Section →]       ││
│ │                            or [Complete Test]      ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Question Types

#### Likert Scale (1-5 Rating)
```
┌────────────────────────────────────────────────────┐
│ Question Number. Question text here?               │
│                                                    │
│ Not important  ○  ○  ○  ○  ○  Very important     │
│                1  2  3  4  5                       │
│                                                    │
│ (Circles become filled/primary when selected)     │
└────────────────────────────────────────────────────┘
```

#### Multiple Choice (Checkboxes)
```
┌────────────────────────────────────────────────────┐
│ Question Number. Question text here?               │
│ Select all that apply:                             │
│                                                    │
│ ☑ Option A - Description                          │
│ ☐ Option B - Description                          │
│ ☑ Option C - Description                          │
│ ☐ Option D - Description                          │
│                                                    │
│ (Checkboxes show checkmark when selected)         │
└────────────────────────────────────────────────────┘
```

---

## 4. Professions List Page

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ Main Container (max-w-7xl, mx-auto, px-6, py-8)        │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Page Header                                         ││
│ │ Top Career Matches                                  ││
│ │ Explore professions tailored to your profile...     ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Filters and Sorting                                 ││
│ │ ┌────────────────┐  ┌────────────────┐             ││
│ │ │Filter by: [All▼]│  │Sort by: [Match%▼]│         ││
│ │ └────────────────┘  └────────────────┘             ││
│ │                                                     ││
│ │                      Showing 47 professions         ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Profession Cards Grid (2 columns, responsive)       ││
│ │                                                     ││
│ │ ┌──────────────────────┐  ┌──────────────────────┐ ││
│ │ │ Profession Card 1    │  │ Profession Card 2    │ ││
│ │ │ ┌──────────────────┐ │  │ ┌──────────────────┐ │ ││
│ │ │ │🎓 Title          │ │  │ │💼 Title          │ │ ││
│ │ │ │ [92%⭐] 🔥Popular│ │  │ │ [88%⭐]          │ │ ││
│ │ │ │         [⋮ Menu] │ │  │ │         [⋮ Menu] │ │ ││
│ │ │ └──────────────────┘ │  │ └──────────────────┘ │ ││
│ │ │                      │  │                      │ ││
│ │ │ Description text...  │  │ Description text...  │ ││
│ │ │                      │  │                      │ ││
│ │ │ Detailed Breakdown:  │  │ Detailed Breakdown:  │ ││
│ │ │  🎯   🔧   👤   ⭐  │  │  🎯   🔧   👤   ⭐  │ ││
│ │ │  92%  88%  85%  90% │  │  85%  90%  86%  88% │ ││
│ │ │ (with tooltips)      │  │ (with tooltips)      │ ││
│ │ └──────────────────────┘  └──────────────────────┘ ││
│ │                                                     ││
│ │ ┌──────────────────────┐  ┌──────────────────────┐ ││
│ │ │ Profession Card 3    │  │ Profession Card 4    │ ││
│ │ │ (Similar layout...)  │  │ (Similar layout...)  │ ││
│ │ └──────────────────────┘  └──────────────────────┘ ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### Profession Card (List View)
```
┌──────────────────────────────────────────────────┐
│ Card (hover:shadow-lg transition)               │
│ ┌──────────────────────────────────────────────┐ │
│ │ 🎓 Title Text   [92% Match] 🔥Popular [⋮]   │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ Description: 2-3 lines of text explaining the   │
│ profession, key responsibilities, and why it     │
│ matches your profile...                          │
│                                                  │
│ ┌──────────────────────────────────────────────┐ │
│ │ Match Breakdown (with hover tooltips)        │ │
│ │                                              │ │
│ │   🎯        🔧        👤        ⭐          │ │
│ │ Interests  Skills  Personality  Values      │ │
│ │   92%       88%       85%        90%        │ │
│ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘

Dropdown Menu [⋮]:
  ❤️ Like
  👁️ View Details
  🗑️ Delete (red text)
```

#### Filter/Sort Controls
```
┌────────────────────────────────────────────────┐
│ Filters and Sorting Row                        │
│                                                │
│ Filter by: [All            ▼]                 │
│            • All                               │
│            • High Match (85%+)                 │
│            • Technology                        │
│            • Business                          │
│            • Healthcare                        │
│            • Science                           │
│            • Design                            │
│            • Communication                     │
│                                                │
│ Sort by:   [Match Score    ▼]                 │
│            • Match Score                       │
│            • Alphabetical                      │
│            • Popularity                        │
│                                                │
│                    Showing 47 professions      │
└────────────────────────────────────────────────┘
```

---

## 5. Profession Details Page

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ Main Container (max-w-6xl, mx-auto, px-6, py-8)        │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ [← Back to Recommendations]                         ││
│ │                                                     ││
│ │ ProfWise - Software Developer                       ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Tabs Navigation                                     ││
│ │ ┌────────┬────────┬───────┬──────────┬────────────┐││
│ │ │General │Descript│ Labor │Education │ Archetypes │││
│ │ │ (▓▓▓)  │  ion   │Market │          │            │││
│ │ └────────┴────────┴───────┴──────────┴────────────┘││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Tab Content Area                                    ││
│ │                                                     ││
│ │ [Content varies by tab - see below]                ││
│ │                                                     ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Action Buttons (border-top)                         ││
│ │ [❤️ Like]  [View Similar Professions]              ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Tab Content Layouts

#### General Tab
```
┌──────────────────────────────────────────────┐
│ Overview Section                             │
│ ┌──────────────────────────────────────────┐ │
│ │ Professional summary and key info        │ │
│ │                                          │ │
│ │ Match Score: [92% ████████░░]           │ │
│ │                                          │ │
│ │ Category: Technology                     │ │
│ │ Typical Environment: Office/Remote       │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Key Highlights                               │
│ ┌──────────────────────────────────────────┐ │
│ │ • Highlight point 1                      │ │
│ │ • Highlight point 2                      │ │
│ │ • Highlight point 3                      │ │
│ │ • Highlight point 4                      │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Match Breakdown                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 🎯 Interests     ████████░░ 92%          │ │
│ │ 🔧 Skills        ████████░░ 88%          │ │
│ │ 👤 Personality   ████████░░ 85%          │ │
│ │ ⭐ Values        █████████░ 90%          │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

#### Description Tab
```
┌──────────────────────────────────────────────┐
│ What does a [Profession] do?                 │
│ ┌──────────────────────────────────────────┐ │
│ │ Detailed description of the profession   │ │
│ │ with multiple paragraphs explaining:     │ │
│ │ - Day-to-day responsibilities            │ │
│ │ - Key tasks and activities               │ │
│ │ - Work environment                       │ │
│ │ - Tools and technologies used            │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Key Responsibilities                         │
│ ┌──────────────────────────────────────────┐ │
│ │ 1. Primary responsibility                │ │
│ │ 2. Secondary responsibility              │ │
│ │ 3. Additional responsibility             │ │
│ │ ...                                      │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Required Skills                              │
│ ┌──────────────────────────────────────────┐ │
│ │ [Technical Skill 1] [Soft Skill 1]      │ │
│ │ [Technical Skill 2] [Soft Skill 2]      │ │
│ │ [Badge layout for skills]                │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

#### Labor Market Tab
```
┌──────────────────────────────────────────────┐
│ Job Market Overview                          │
│ ┌──────────────────────────────────────────┐ │
│ │ Demand Level:    [███████░░░] High       │ │
│ │ Job Growth:      +15% (next 5 years)     │ │
│ │ Openings:        ~50,000 annually        │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Salary Information                           │
│ ┌──────────────────────────────────────────┐ │
│ │ Entry Level:     $50,000 - $70,000       │ │
│ │ Mid-Career:      $70,000 - $100,000      │ │
│ │ Senior Level:    $100,000 - $150,000+    │ │
│ │                                          │ │
│ │ [Salary Distribution Chart/Visual]       │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Industry Sectors                             │
│ ┌──────────────────────────────────────────┐ │
│ │ [Technology] [Finance] [Healthcare]      │ │
│ │ [Education] [Government] [Startups]      │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Geographic Hotspots                          │
│ ┌──────────────────────────────────────────┐ │
│ │ • City 1 - High demand                   │ │
│ │ • City 2 - Growing market                │ │
│ │ • City 3 - Established market            │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

#### Education Tab
```
┌──────────────────────────────────────────────┐
│ Educational Requirements                     │
│ ┌──────────────────────────────────────────┐ │
│ │ Minimum Education: Bachelor's Degree     │ │
│ │ Preferred Fields:                        │ │
│ │ • Computer Science                       │ │
│ │ • Software Engineering                   │ │
│ │ • Information Technology                 │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Recommended Courses                          │
│ ┌──────────────────────────────────────────┐ │
│ │ Core Courses:                            │ │
│ │ • Course 1 name                          │ │
│ │ • Course 2 name                          │ │
│ │ • Course 3 name                          │ │
│ │                                          │ │
│ │ Elective Courses:                        │ │
│ │ • Course 4 name                          │ │
│ │ • Course 5 name                          │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Certifications                               │
│ ┌──────────────────────────────────────────┐ │
│ │ [Certification Badge 1]                  │ │
│ │ [Certification Badge 2]                  │ │
│ │ [Certification Badge 3]                  │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Learning Paths                               │
│ ┌──────────────────────────────────────────┐ │
│ │ 1. Entry Level Path → Timeline           │ │
│ │ 2. Career Switcher Path → Timeline       │ │
│ │ 3. Advanced Specialization → Timeline    │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

#### Archetypes Tab
```
┌──────────────────────────────────────────────┐
│ Archetype Matches                            │
│                                              │
│ This profession best aligns with:            │
│                                              │
│ ┌──────────────────┐  ┌──────────────────┐  │
│ │ Archetype Card   │  │ Archetype Card   │  │
│ │ 🎯 Investigative │  │ 💡 Artistic      │  │
│ │                  │  │                  │  │
│ │ Match: 95%       │  │ Match: 82%       │  │
│ │ ████████░░       │  │ ████████░░       │  │
│ │                  │  │                  │  │
│ │ Description...   │  │ Description...   │  │
│ └──────────────────┘  └──────────────────┘  │
│                                              │
│ ┌──────────────────┐  ┌──────────────────┐  │
│ │ Archetype Card   │  │ Archetype Card   │  │
│ │ 🔧 Realistic     │  │ 👥 Social        │  │
│ │                  │  │                  │  │
│ │ Match: 78%       │  │ Match: 65%       │  │
│ │ ███████░░░       │  │ ██████░░░░       │  │
│ │                  │  │                  │  │
│ │ Description...   │  │ Description...   │  │
│ └──────────────────┘  └──────────────────┘  │
│                                              │
│ [View Full Archetype Profile]                │
└──────────────────────────────────────────────┘
```

---

## Common UI Patterns

### 1. Badge Variants
```
[Completed]        - Secondary variant (gray)
[92% Match]        - Secondary variant with green bg
🔥 Popular          - Destructive variant (red/orange)
[High Demand]      - Default variant
[+15%]             - Outline variant
```

### 2. Button Patterns
```
[Primary Button]   - Solid bg, contrasting text
[Outline Button]   - Border, transparent bg
[Ghost Button]     - No border, transparent bg
[Icon + Text]      - Icon on left, text on right
```

### 3. Progress Bars
```
Label            ████████░░ 80%

Components:
- Label (left-aligned)
- Progress bar (visual indicator)
- Percentage (right-aligned)
```

### 4. Card Structure
```
┌────────────────────────────────┐
│ Card (border, rounded, shadow) │
│ ┌────────────────────────────┐ │
│ │ CardHeader                 │ │
│ │ - Title                    │ │
│ │ - Description (optional)   │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ CardContent                │ │
│ │ - Main content             │ │
│ │ - Actions                  │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

### 5. Dropdown Menu Pattern
```
[⋮] → Click reveals menu:
┌──────────────────┐
│ Icon + Action 1  │
│ Icon + Action 2  │
│ ──────────────── │
│ Icon + Delete    │ (Red text)
└──────────────────┘
```

### 6. Tab Navigation
```
┌────────┬────────┬────────┬────────┐
│ Tab 1  │ Tab 2  │ Tab 3  │ Tab 4  │
│ (▓▓▓)  │        │        │        │
└────────┴────────┴────────┴────────┘
```

### 7. Icon + Text Layout
```
🎯 Icon  Title Text  [Badge]  [⋮]
```

### 8. Metric Display with Tooltips
```
  🎯        🔧        👤        ⭐
Interests  Skills  Personality  Values
  92%       88%       85%        90%

(Hover over icon/text to see tooltip explanation)
```

---

## Responsive Breakpoints

### Mobile (< 768px)
- Single column layouts
- Stacked cards
- Collapsible navigation
- Full-width buttons

### Tablet (768px - 1024px)
- 2-column grids where applicable
- Maintained card spacing
- Responsive typography

### Desktop (> 1024px)
- Full grid layouts (2-3 columns)
- Optimal card sizing
- Hover states active
- Sidebar layouts where applicable

---

## Color Patterns

### Background Colors
- `bg-card` - Card backgrounds
- `bg-muted/30` - Page backgrounds
- `bg-primary` - Primary actions
- `bg-secondary` - Secondary elements

### Text Colors
- `text-foreground` - Primary text
- `text-muted-foreground` - Secondary text
- `text-primary` - Accent/link text
- `text-destructive` - Error/delete actions

### Border & Interactive
- `border` - Standard borders
- `border-border` - Dividers
- `hover:shadow-lg` - Card hover states
- `hover:text-primary` - Interactive text

---

## Spacing Standards

### Section Spacing
- Page padding: `px-6 py-8`
- Section gaps: `space-y-8`
- Card gaps: `gap-4` or `gap-6`

### Internal Spacing
- Card padding: `p-6` or `p-8`
- Content spacing: `space-y-4`
- Inline gaps: `gap-2` or `gap-3`

### Grid Layouts
- 2-column: `grid grid-cols-1 md:grid-cols-2`
- Equal columns: `grid grid-cols-2`
- Auto-fit: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## Typography Hierarchy

### Headers
```
h1: text-3xl font-bold         (Page titles)
h2: text-2xl font-bold         (Section headers)
h3: text-lg font-semibold      (Card titles)
h4: text-sm font-medium        (Sub-headers)
```

### Body Text
```
text-base leading-relaxed      (Standard body)
text-sm                        (Secondary text)
text-xs                        (Labels, captions)
```

### Special Text
```
text-muted-foreground          (De-emphasized)
uppercase tracking-wide        (Labels)
font-medium                    (Emphasis)
```

---

## Interaction Patterns

### Loading States
- Skeleton loaders for cards
- Progress indicators for tests
- Spinner for async actions

### Empty States
```
┌────────────────────────────────┐
│ Center-aligned container       │
│                                │
│ No items yet                   │
│ Helpful message...             │
│                                │
│ [Call to Action Button]        │
└────────────────────────────────┘
```

### Error States
- Inline error messages
- Toast notifications
- Validation feedback

---

## Accessibility Considerations

1. **Semantic HTML**: Use proper heading hierarchy
2. **ARIA Labels**: All interactive elements labeled
3. **Keyboard Navigation**: Tab order logical
4. **Focus States**: Visible focus indicators
5. **Color Contrast**: WCAG AA compliant
6. **Screen Readers**: Descriptive text for icons
7. **Tooltips**: Additional context on hover/focus

---

## Implementation Notes

### Component Structure
```
Page Component (pages/)
  ├─ Layout logic
  ├─ Event handlers
  └─ Import UI components

UI Components (_content/components/)
  ├─ Presentational logic
  ├─ Props interface
  └─ Styled with Tailwind
```

### State Management
- Local state for UI interactions
- Session/localStorage for test progress
- Context for global state (theme, i18n)

### Data Flow
```
Page → Handlers → Components → UI
           ↓
      API/Storage
```

---

## Design Principles Summary

1. **Consistency**: Reuse patterns across pages
2. **Clarity**: Clear hierarchy and labeling
3. **Efficiency**: Minimal clicks to key actions
4. **Feedback**: Visual response to interactions
5. **Progressive Disclosure**: Show details on demand
6. **Mobile-First**: Responsive from smallest screens
7. **Accessibility**: Inclusive design practices

---

## Reference Files

This wireframe was created by analyzing:
- `archive-frontend/src/app/dashboard/*`
- `archive-frontend/src/app/archetypes/*`
- `archive-frontend/src/app/test/*`
- `archive-frontend/src/app/professions/*`

Use these patterns as the foundation for new pages and features in the frontend application.
