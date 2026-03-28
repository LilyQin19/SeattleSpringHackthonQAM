# Marathon Training Coach - Design Document

**Date:** 2026-03-28  
**Event:** Insforge x Qoder AI Agent Hackathon @ Seattle  
**Time Constraint:** 6-hour coding window (10 AM - 4 PM)

---

## 1. Overview

### 1.1 Purpose
An AI-powered web application that generates personalized marathon training plans based on the Hansons Marathon Method, tracks workouts, provides intelligent post-run feedback using InsForge AI integration, and visualizes training progress.

### 1.2 Core Value Proposition
Combines scientifically-backed training methodology (Hansons) with AI personalization and modern data integration to help runners prepare for marathons effectively.

### 1.3 Target Users
- Runners training for their first or subsequent marathons
- Users who prefer structured, high-mileage training plans
- Athletes seeking data-driven feedback on their performance

---

## 1.4 Demo Strategy - Showcasing Qoder + InsForge

This application is designed to demonstrate the **synergy between Qoder (AI Agent IDE) and InsForge (Agent-Native Backend Platform)** for the hackathon judges.

### 1.4.1 Qoder Capabilities Demonstrated

**Multi-File AI Development:**
- Complex React components generated simultaneously (Dashboard + Calendar + Forms)
- TypeScript types, database schema, and API calls created in parallel
- AI-assisted debugging across frontend and backend code
- Rapid iteration: "Add AI feedback feature" → generates 5+ related files instantly

**Intelligent Code Understanding:**
- Qoder understands Hansons Marathon Method context from research
- Generates domain-specific code (pace calculations, workout structures)
- Maintains consistency across training plan logic

**Demo Script:**
```
"Watch how Qoder generates the entire training dashboard 
in a single prompt, creating 6 coordinated components 
with shared state management..."
```

### 1.4.2 InsForge Infrastructure Demonstrated

**One-Command Backend Setup:**
```bash
npx @insforge/cli create
# → Authentication (Google OAuth)
# → Database (PostgreSQL)
# → AI Functions (LLM endpoints)
# All configured and ready in under 2 minutes
```

**Zero-Config AI Integration:**
- No API keys to manage - InsForge handles AI model access
- Edge functions keep logic server-side and secure
- Automatic scaling for AI calls during demo

**Demo Script:**
```
"Notice how we didn't configure any auth providers or 
database connections. InsForge gave us Google OAuth 
and PostgreSQL instantly. The AI feedback feature 
uses InsForge's built-in LLM - no OpenAI API key needed!"
```

### 1.4.3 AI-Native Application Architecture

**AI at Every Layer:**
1. **Onboarding:** AI translates simple inputs (race date, fitness level) → complex 18-week plan
2. **Training Plans:** AI adapts Hansons Method to individual runner profile
3. **Run Analysis:** AI analyzes performance data → personalized coaching feedback
4. **Future Enhancements:** AI could adjust plans based on injury, missed workouts, or race results

**Why This Matters:**
- Shows AI as core application logic, not just a chatbot
- Demonstrates AI understanding domain expertise (marathon training)
- Proves AI can generate actionable, data-driven recommendations

### 1.4.4 Demo Flow for Judges

**Opening (30 seconds):**
```
"We built an AI marathon coach in 6 hours using Qoder + InsForge. 
Let me show you how these platforms make AI-native development 
incredibly fast."
```

**The Build Story (2 minutes):**
1. Show git commits from Qoder development
2. Run `npx @insforge/cli create` to show backend setup
3. Highlight: No database config, no auth setup, no API keys

**Live Demo (5 minutes):**
1. **Onboarding:** User inputs race date → AI generates personalized plan instantly
2. **Training Dashboard:** Beautiful UI showing AI-generated schedule
3. **Log a Run:** Manual entry with smart workout matching
4. **AI Feedback:** The "wow" moment - AI coach analyzes and gives personalized tips
5. **Analytics:** Visual proof of training progress

**The Hook:**
```
"This isn't just a CRUD app with AI sprinkled on top. 
The entire application logic is AI-driven. From plan 
generation to coaching feedback, AI makes decisions 
that used to require a human coach."
```

---

## 2. Architecture & Tech Stack

### 2.1 Frontend
- **Framework:** React + TypeScript (existing project)
- **Styling:** Tailwind CSS (already configured)
- **State Management:** React hooks + Context API
- **Routing:** React Router

### 2.2 Backend
- **Platform:** InsForge
  - Authentication (Google OAuth - already working)
  - Database (PostgreSQL via InsForge)
  - Serverless Functions (for AI calls)
  - AI Integration (built-in LLM capabilities)
- **Database Schema:** Defined via InsForge CLI
- **AI Processing:** InsForge edge functions (keeps API keys server-side)

### 2.3 Third-Party Integrations
- **Strava API:** Phase 3 (optional), with mock API for initial demo
- **Google Health/Apple Health:** Phase 3 (optional)

### 2.4 Data Flow
```
User → Onboarding → AI Training Plan Generation → Weekly Schedule Display
  ↓
Manual Run Entry / Strava Import (Phase 3)
  ↓
AI Feedback Analysis (Phase 2)
  ↓
Progress Analytics Dashboard
```

---

## 3. Hansons Marathon Method Foundation

### 3.1 Core Principles
- **Training Duration:** 18 weeks
- **Running Days:** 6 days per week
- **Longest Long Run:** 16 miles (not traditional 20 miles)
- **Weekly Mileage:** 40-63 miles (progressive buildup)
- **SOS Workouts:** 3 per week (Something of Substance)
  1. Speed/Strength workout
  2. Tempo run at goal marathon pace
  3. Long run
- **Cumulative Fatigue:** Running on tired legs to build endurance

### 3.2 Workout Types
1. **Easy Runs:** 1-2 min/mile slower than goal marathon pace
2. **Speed/Strength:** Intervals at 5K-10K pace with short recovery
3. **Tempo Runs:** Sustained runs at goal marathon pace
4. **Long Runs:** 40-50 sec/mile slower than goal pace, max 16 miles
5. **Rest Day:** 1 day per week (typically between SOS workouts)

### 3.3 Plan Variations
- **Beginner Plan:** Lower weekly mileage, more gradual buildup
- **Advanced Plan:** Higher weekly mileage, starts with speed work immediately
- **Custom AI Plan:** Adjusts based on user's actual performance data

### 3.4 Pace Calculations
Based on user input:
- **Goal Marathon Time** → Marathon Pace (MP)
- **Easy Pace:** MP + 60-120 sec/mile
- **Tempo Pace:** MP
- **Long Run Pace:** MP + 40-50 sec/mile
- **Speed Pace:** 5K-10K pace (calculated from MP using VDOT formulas)

---

## 4. Feature Specifications

### 4.1 Phase 1: Core Features (MVP)

#### 4.1.1 Onboarding Wizard
**Screens:**
1. Welcome screen with app overview
2. Race date picker (must be minimum 12 weeks in future)
3. Fitness level selection:
   - Beginner (current weekly mileage: <20 miles)
   - Intermediate (current weekly mileage: 20-40 miles)
   - Advanced (current weekly mileage: 40+ miles)
4. Goal time selection (optional, for pace calculations)
5. Training plan preview & confirmation

**Technical Requirements:**
- Store user profile in `users` table
- Generate training plan immediately upon completion
- Show loading state during AI generation (3-5 seconds max)

#### 4.1.2 AI Training Plan Generation
**Input:**
- Race date
- Fitness level
- Goal time (optional)

**Output:**
- 18-week training schedule
- Weekly mileage progression
- Daily workout assignments with target paces
- Plan stored in `training_plans` table

**AI Prompt Template:**
```
Generate an 18-week marathon training plan following Hansons Marathon Method principles:
- Fitness level: {level}
- Race date: {date}
- Goal time: {time} (if provided)

Requirements:
- 6 days of running per week
- 3 SOS workouts per week (speed, tempo, long)
- Max long run: 16 miles
- Progressive weekly mileage buildup
- Include pace targets for each workout type
- Follow cumulative fatigue principle

Return as JSON with weekly_schedule array containing daily workouts.
```

#### 4.1.3 Training Dashboard (Home)
**Layout:**
- Collapsible weekly training view at top
- Today's workout card (prominent)
- Weekly progress summary (miles completed / planned)
- Quick stats: Current week mileage, workouts completed

**Components:**
- Weekly strip showing 7 days with workout icons
- Today's workout details with start button
- Progress bar for weekly mileage goal

#### 4.1.4 Calendar View
**Features:**
- Month view with workout indicators
- Color-coded workout types (Easy, Speed, Tempo, Long, Rest)
- Click day to see planned vs completed workout
- Swipe/click to navigate months
- Weekly summary popup on hover/tap

**Technical:**
- Use date-fns or similar for calendar logic
- Virtual scrolling for performance
- Cache monthly data locally

#### 4.1.5 Manual Run Entry
**Fields:**
- Date (default: today)
- Distance (miles or km)
- Duration (hours:minutes:seconds)
- Average pace (auto-calculated, editable)
- Perceived effort (1-10 scale)
- Notes (optional)
- Match to planned workout (dropdown)

**Validation:**
- Distance > 0
- Duration > 0
- Date within training plan range
- Prevent duplicate entries for same workout

**Storage:**
- Save to `runs` table
- Link to `workouts` table if matched

#### 4.1.6 Basic Workout Completion
**Features:**
- Toggle workout as completed/not completed
- Quick entry form from dashboard
- Visual indication of completed workouts
- Streak counter (consecutive weeks with all workouts completed)

### 4.2 Phase 2: AI Feedback & Advanced Features

#### 4.2.1 Post-Run AI Feedback (Key Demo Feature)
**Purpose:** Demonstrates InsForge AI integration capabilities

**Input Data:**
- Planned workout details
- Actual run data (distance, pace, duration, effort)
- Historical performance (last 4 weeks)

**AI Analysis Areas:**
1. **Pace Consistency:** Did they hit target pace?
2. **Effort Assessment:** Was perceived effort appropriate for workout type?
3. **Progress Indicators:** Improvements vs. similar past workouts
4. **Recommendations:** Adjustments for next similar workout

**Output Format:**
```typescript
interface AIFeedback {
  summary: string;           // 2-3 sentence overview
  paceAnalysis: string;      // Specific pace feedback
  effortAssessment: string;  // How hard they worked
  recommendations: string[]; // 2-3 actionable tips
  fitnessScore: number;      // 1-100 overall rating
  confidence: number;        // AI confidence level
}
```

**Display:**
- Show immediately after run entry
- Card-based layout with clear sections
- Tone: Encouraging but honest
- Include visualization (fitness score gauge)

**AI Prompt Template:**
```
Analyze this workout and provide coaching feedback:

Planned Workout:
- Type: {workout_type}
- Target: {target_distance} miles at {target_pace}/mile

Actual Performance:
- Distance: {actual_distance} miles
- Duration: {duration}
- Average Pace: {actual_pace}/mile
- Perceived Effort: {effort}/10

Recent History (last 4 weeks):
{recent_workouts_summary}

Provide:
1. Brief summary of performance
2. Pace analysis (how well they hit targets)
3. Effort assessment (was it too easy/hard/just right)
4. 2-3 specific recommendations for improvement
5. Overall fitness score (1-100)

Tone: Professional running coach, encouraging but data-driven.
```

#### 4.2.2 Enhanced Analytics
**Features:**
- Pace progression chart (weekly trend)
- Mileage buildup visualization
- Weekly mileage vs plan comparison
- Completed workouts by type (pie chart)

**Charts:**
- Line chart: Pace trend over time
- Bar chart: Weekly mileage (planned vs actual)
- Circular progress: Overall plan completion percentage

### 4.3 Phase 3: Data Integrations (If Time Permits)

#### 4.3.1 Strava Integration
**Scope:** Mock API for demo, real API for production

**Features:**
- OAuth connection to Strava
- Import recent runs (last 30 days)
- Auto-match imported runs to planned workouts
- Sync new runs automatically

**Mock API Approach:**
- Create mock Strava responses for demo reliability
- Simulate various workout types and distances
- Show OAuth flow with mock callback

**Data Mapping:**
- Strava activity type → Our workout type
- Strava distance/duration → Run record
- Strava average pace → Calculated field
- Strava heart rate (if available) → Additional metric

#### 4.3.2 Progress Analytics (CTL/ATL)
**Features:**
- Chronic Training Load (CTL) trend
- Acute Training Load (ATL) trend
- Training Stress Balance (TSB)
- Fitness trend prediction
- Race readiness indicator

**Calculation:**
- Use TSS (Training Stress Score) formula
- Calculate from run duration and intensity
- 42-day CTL average, 7-day ATL average

---

## 5. Data Model

### 5.1 Database Schema

```sql
-- Users (extends InsForge auth)
create table users (
  id uuid references auth.users primary key,
  email text not null,
  created_at timestamp default now(),
  race_date date not null,
  goal_time interval, -- optional, stored as HH:MM:SS
  fitness_level text check (fitness_level in ('beginner', 'intermediate', 'advanced')),
  training_plan_id uuid references training_plans(id),
  marathon_pace numeric, -- seconds per mile
  easy_pace numeric,
  tempo_pace numeric,
  long_run_pace numeric,
  speed_pace numeric
);

-- Training Plans
create table training_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) not null,
  method text default 'hansons', -- hansons, daniels, custom
  level text not null, -- beginner, advanced
  start_date date not null,
  race_date date not null,
  weekly_schedule jsonb not null, -- Array of 18 weeks
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Workouts (individual scheduled workouts)
create table workouts (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references training_plans(id) not null,
  scheduled_date date not null,
  type text not null check (type in ('easy', 'speed', 'tempo', 'long', 'rest')),
  target_distance numeric, -- miles
  target_pace numeric, -- seconds per mile
  target_duration interval, -- optional, for time-based workouts
  description text,
  completed boolean default false,
  completed_at timestamp,
  run_id uuid references runs(id),
  created_at timestamp default now()
);

-- Runs (actual completed runs)
create table runs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) not null,
  workout_id uuid references workouts(id),
  source text default 'manual' check (source in ('manual', 'strava', 'import')),
  external_id text, -- Strava activity ID, etc.
  date date not null,
  distance numeric not null, -- miles
  duration interval not null,
  avg_pace numeric, -- seconds per mile (calculated)
  avg_hr integer, -- optional
  max_hr integer, -- optional
  perceived_effort integer check (perceived_effort between 1 and 10),
  notes text,
  created_at timestamp default now()
);

-- AI Feedback
create table ai_feedback (
  id uuid default gen_random_uuid() primary key,
  run_id uuid references runs(id) not null,
  workout_id uuid references workouts(id) not null,
  summary text not null,
  pace_analysis text,
  effort_assessment text,
  recommendations text[], -- array of strings
  fitness_score integer check (fitness_score between 1 and 100),
  confidence numeric check (confidence between 0 and 1),
  created_at timestamp default now()
);

-- Indexes for performance
create index idx_workouts_plan_date on workouts(plan_id, scheduled_date);
create index idx_workouts_user_completed on workouts(completed, scheduled_date);
create index idx_runs_user_date on runs(user_id, date);
create index idx_runs_workout on runs(workout_id);
```

### 5.2 JSON Structure - Weekly Schedule

```json
{
  "week": 1,
  "week_starting": "2026-04-01",
  "total_miles": 40,
  "days": [
    {
      "day": "Monday",
      "date": "2026-04-01",
      "type": "easy",
      "distance": 6,
      "pace": "9:00",
      "description": "Easy run at conversational pace"
    },
    {
      "day": "Tuesday", 
      "date": "2026-04-02",
      "type": "speed",
      "distance": 8,
      "pace": "7:30",
      "description": "12x400m at 5K pace with 400m recovery"
    },
    {
      "day": "Wednesday",
      "date": "2026-04-03", 
      "type": "easy",
      "distance": 5,
      "pace": "9:00",
      "description": "Recovery run"
    },
    {
      "day": "Thursday",
      "date": "2026-04-04",
      "type": "tempo",
      "distance": 7,
      "pace": "8:00",
      "description": "1 mile warm-up, 5 miles at marathon pace, 1 mile cool-down"
    },
    {
      "day": "Friday",
      "date": "2026-04-05",
      "type": "rest",
      "description": "Rest day - light stretching or yoga optional"
    },
    {
      "day": "Saturday",
      "date": "2026-04-06",
      "type": "easy",
      "distance": 6,
      "pace": "9:00",
      "description": "Easy run"
    },
    {
      "day": "Sunday",
      "date": "2026-04-07",
      "type": "long",
      "distance": 10,
      "pace": "8:40",
      "description": "Long run at easy pace"
    }
  ]
}
```

---

## 6. User Interface Design

### 6.1 Navigation Structure
**Training-Focused Layout:**
- **Top Bar:** Collapsible weekly training strip (current week)
- **Main Tabs:** Today | Calendar | History | Analytics
- **Floating Action Button:** "Log Run" (always accessible)
- **User Menu:** Profile, Settings, Logout

### 6.2 Screen Designs

#### 6.2.1 Dashboard (Today Tab)
```
┌─────────────────────────────────────┐
│ Weekly Strip (collapsible)          │
│ Mon Tue Wed Thu Fri Sat Sun         │
│ 🏃  🏃  😴  🏃  ✓   🏃  🏃          │
├─────────────────────────────────────┤
│                                     │
│  TODAY'S WORKOUT                    │
│  ─────────────────                  │
│  Speed Workout                      │
│  8 miles at 7:30/mile               │
│                                     │
│  [      Start Workout       ]       │
│                                     │
│  Description:                       │
│  12x400m intervals at 5K pace...    │
│                                     │
├─────────────────────────────────────┤
│ WEEKLY PROGRESS                     │
│ ████████████░░░░░░ 42/56 miles      │
│                                     │
│ Workouts: 4/6 completed             │
│ Streak: 3 weeks 🔥                  │
└─────────────────────────────────────┘
```

#### 6.2.2 Calendar View
```
┌─────────────────────────────────────┐
│      April 2026            [>]     │
│ Su  Mo  Tu  We  Th  Fr  Sa          │
│      1   2   3   4   5   6          │
│  🏃  🏃  😴  🏃  ✓   🏃  🏃          │
│  7   8   9  10  11  12  13          │
│  🏃  🏃  🏃  😴  🏃  ✓   🏃          │
│                                     │
│ Legend: 🏃 Planned  ✓ Completed    │
│         😴 Rest                     │
└─────────────────────────────────────┘
```

#### 6.2.3 Run Entry Form
```
┌─────────────────────────────────────┐
│ Log Run                    [X]      │
├─────────────────────────────────────┤
│                                     │
│ Date: [2026-03-28    ] 📅          │
│                                     │
│ Distance: [____] miles              │
│                                     │
│ Duration: [__:__:__]               │
│                                     │
│ Avg Pace: [8:45/mile] (auto)        │
│                                     │
│ Perceived Effort:                   │
│ ○ 1  ○ 2  ○ 3  ○ 4  ○ 5  ● 6       │
│ ○ 7  ○ 8  ○ 9  ○ 10                │
│                                     │
│ Match to Planned Workout:           │
│ [Tuesday Speed Workout        ▼]   │
│                                     │
│ Notes:                              │
│ [________________________]         │
│                                     │
│ [      Save Run       ]             │
└─────────────────────────────────────┘
```

#### 6.2.4 AI Feedback Display
```
┌─────────────────────────────────────┐
│ AI Coach Feedback                   │
├─────────────────────────────────────┤
│                                     │
│  [Fitness Score: 78/100]            │
│  ████████████████████░░░            │
│                                     │
│  Great work on your speed session!  │
│  You maintained consistent pace     │
│  through all 12 intervals.          │
│                                     │
│  PACE ANALYSIS                      │
│  ─────────────────                  │
│  Target: 7:30/mile                  │
│  Actual: 7:28/mile ✓                │
│  Consistency: Excellent (±3 sec)    │
│                                     │
│  EFFORT ASSESSMENT                  │
│  ─────────────────                  │
│  Perceived effort of 6/10 is        │
│  appropriate for speed work.        │
│                                     │
│  RECOMMENDATIONS                    │
│  ─────────────────                  │
│  • Try shortening recovery intervals│
│    next week for added challenge    │
│                                     │
│  • Focus on form during final       │
│    3 intervals when fatigue sets in │
│                                     │
└─────────────────────────────────────┘
```

### 6.3 Responsive Design
- **Mobile First:** All screens work on mobile (primary use case)
- **Tablet:** Two-column layout for calendar and analytics
- **Desktop:** Full dashboard with side-by-side widgets

---

## 7. Error Handling & Edge Cases

### 7.1 Onboarding Errors
- **Invalid Race Date:** Must be minimum 12 weeks in future
  - Show error message: "Please select a date at least 12 weeks from today"
  - Disable continue button until valid

- **AI Generation Failure:** 
  - Show retry button
  - Fallback to template-based plan if AI fails 3 times
  - Cache successful generations

### 7.2 Run Entry Errors
- **Duplicate Entry:**
  - Check for existing run on same date
  - Show warning: "You already logged a run on this date. Add anyway?"

- **Impossible Pace:**
  - If pace > 20 min/mile or < 4 min/mile, show confirmation
  - "This pace seems unusual. Is it correct?"

### 7.3 Data Integrity
- **Orphaned Workouts:**
  - If workout references non-existent run, show "Mark as skipped" option
  
- **Plan Modifications:**
  - Allow users to mark workouts as "skipped" if injured/busy
  - AI suggests plan adjustments after 2+ skipped workouts

### 7.4 Demo-Specific Handling
- **Mock Data Availability:**
  - Always have sample runs available for demo
  - Pre-populate 2-3 weeks of training data
  
- **Offline Mode:**
  - Cache last viewed data locally
  - Show offline banner when disconnected

---

## 8. Testing Strategy

### 8.1 Manual Testing Checklist

#### Critical Path (Must Work for Demo):
- [ ] Create new account
- [ ] Complete onboarding wizard
- [ ] View generated training plan
- [ ] Log a manual run
- [ ] View AI feedback for run
- [ ] Navigate between all tabs
- [ ] View calendar with workouts

#### Edge Cases:
- [ ] Plan generation with 12-week timeline (minimum)
- [ ] Plan generation with 24-week timeline
- [ ] Logging run without matching workout
- [ ] Editing a logged run
- [ ] Viewing analytics with only 1 run

### 8.2 Demo Data
**Pre-configured Demo Account:**
- User: demo@marathoncoach.app
- Plan: 18-week Hansons Advanced
- Progress: Week 6 (variety of completed workouts)
- Sample Runs: 15+ runs with variety of workout types
- AI Feedback: 5-6 examples for different scenarios

### 8.3 Error Scenarios to Test
- [ ] AI service unavailable (show fallback feedback)
- [ ] Database connection lost (show cached data)
- [ ] Strava OAuth failure (Phase 3)

---

## 9. Implementation Phases

### Phase 1: Foundation (Hours 1-3)
**Goal:** Working training plan display and manual run entry

**Tasks:**
1. **Database Setup (30 min)**
   - Run InsForge CLI to create tables
   - Verify schema matches design

2. **Onboarding Wizard (45 min)**
   - 4-screen wizard (welcome, race date, fitness, goal)
   - Store user preferences
   - Input validation

3. **AI Plan Generation (45 min)**
   - Create edge function for plan generation
   - Implement AI prompt template
   - Store generated plan in database
   - Loading states and error handling

4. **Training Dashboard (60 min)**
   - Weekly strip component
   - Today's workout card
   - Progress indicators
   - Navigation tabs

### Phase 2: Core Features (Hours 3-5)
**Goal:** Complete workout logging with AI feedback

**Tasks:**
5. **Calendar View (30 min)**
   - Month view with color coding
   - Day selection and detail popup
   - Navigation between months

6. **Manual Run Entry (30 min)**
   - Form with all fields
   - Validation and error handling
   - Match to planned workout
   - Store in database

7. **AI Feedback System (60 min)**
   - Create AI analysis edge function
   - Design feedback display component
   - Generate feedback on run entry
   - Store and display historical feedback

### Phase 3: Polish & Demo Prep (Hour 5-6)
**Goal:** Demo-ready with sample data and error handling

**Tasks:**
8. **Basic Analytics (30 min)**
   - Simple pace trend chart
   - Weekly mileage bar chart
   - Completion percentage

9. **Demo Data Setup (20 min)**
   - Create demo user account
   - Generate 6 weeks of sample data
   - Create diverse AI feedback examples

10. **Error Handling & Polish (10 min)**
    - Loading states
    - Error messages
    - Empty states
    - Final UI polish

### Phase 4: Stretch Goals (If Time Permits)
- **Strava Integration:** OAuth + mock API
- **Advanced Analytics:** CTL/ATL calculations
- **Push Notifications:** Workout reminders
- **Export Function:** Download training plan as PDF

---

## 10. Success Criteria

### 10.1 Functional Requirements
- ✅ User can complete onboarding in <2 minutes
- ✅ Training plan generates in <5 seconds
- ✅ Weekly schedule displays with all 18 weeks
- ✅ User can log a run in <30 seconds
- ✅ AI feedback generates in <3 seconds
- ✅ All navigation between tabs works smoothly

### 10.2 Demo Requirements
- ✅ Can show end-to-end flow: onboarding → plan → run entry → AI feedback
- ✅ Demo data shows 6 weeks of realistic training
- ✅ No external dependencies that could fail (use mock Strava)
- ✅ Works offline with cached data
- ✅ Handles errors gracefully without crashes

### 10.3 Judging Criteria Alignment

#### 🏆 Best Use of InsForge (Prize: $350)

**Infrastructure as Code:**
- Single command (`npx @insforge/cli create`) provisions entire backend
- Database, auth, and AI all configured automatically
- Zero manual API key management

**AI-Native Features:**
- Training plan generation via InsForge AI edge functions
- Post-run coaching analysis using built-in LLM
- Server-side AI processing keeps prompts secure

**Demo Value:**
```
"We have authentication, database, and AI running 
in production - and we didn't configure a single 
API key or connection string. InsForge made backend 
infrastructure invisible."
```

#### 🏆 Best Use of Qoder (Prize: $350)

**AI-Powered Development:**
- Multi-file code generation across React components, TypeScript types, and API integration
- Natural language prompts → working features (e.g., "Add AI feedback system")
- AI understands domain context (Hansons Marathon Method from research)

**Rapid Iteration:**
- Complete feature implementation in single conversation turns
- Cross-file refactoring and consistency maintenance
- Debug assistance across frontend/backend boundary

**Demo Value:**
```
"Qoder didn't just write code - it understood marathon 
training science. When we asked for pace calculations, 
it implemented VDOT formulas and Hansons principles 
automatically."
```

#### 🏆 Overall Innovation (1st/2nd/3rd Place)

**AI-Native Application:**
- AI is the core engine, not an add-on feature
- Replaces human coach with AI that adapts to individual performance
- Demonstrates AI understanding domain expertise

**Technical Achievement:**
- Full-stack application in 6 hours
- Complex business logic (training periodization, pace calculations)
- Real-time AI feedback loop

**Practical Impact:**
- Solves real problem: personalized marathon coaching is expensive ($100-300/month)
- Makes elite-level training methodology accessible to everyone
- Scales AI coaching to millions of runners

### 10.4 Demo Scorecard

**What Judges Will See:**

| Feature | InsForge Demo Value | Qoder Demo Value |
|---------|-------------------|------------------|
| Google OAuth Login | "Works instantly, no config" | "Qoder implemented auth flow" |
| AI Training Plan | "Generated via InsForge AI" | "Qoder wrote the prompt logic" |
| Run Logging | "Data persists in InsForge DB" | "Qoder built all forms" |
| AI Feedback | "InsForge LLM powers analysis" | "Qoder created the UI" |
| Calendar View | "Real-time data from DB" | "Qoder generated complex component" |

**The Narrative:**
```
"Most teams spend hours on infrastructure. We spent 
6 hours building features because Qoder + InsForge 
handled the plumbing. This is the future of AI-native 
development."
```

---

## 11. Open Questions / Decisions

1. **Pace Calculation:** Use simple formulas or Daniels' VDOT tables?
   - *Decision:* Simple formulas for MVP, VDOT for Phase 2

2. **Plan Adjustments:** Auto-adjust plan when workouts missed?
   - *Decision:* Show suggestion, let user approve manually (Phase 2)

3. **Data Export:** Allow exporting training plan?
   - *Decision:* Stretch goal, not critical for demo

4. **Multi-Race Support:** One plan per user or support multiple races?
   - *Decision:* One active plan per user for MVP

---

## 12. Appendix

### 12.1 Hansons Marathon Method - Sample Week

**Week 1 (40 miles):**
- Monday: Easy 6 miles
- Tuesday: Speed 8 miles (12x400m)
- Wednesday: Easy 5 miles
- Thursday: Tempo 7 miles
- Friday: Rest
- Saturday: Easy 6 miles
- Sunday: Long 10 miles

**Week 9 (Peak Week - 60 miles):**
- Monday: Easy 8 miles
- Tuesday: Speed 10 miles (10x800m)
- Wednesday: Easy 6 miles
- Thursday: Tempo 10 miles
- Friday: Rest
- Saturday: Easy 8 miles
- Sunday: Long 16 miles

### 12.2 Pace Calculation Formulas

From marathon pace (MP):
- Easy Pace = MP + 60 to 120 seconds
- Tempo Pace = MP
- Long Run Pace = MP + 40 to 50 seconds
- Speed Pace = MP - 45 to 60 seconds (approximate 5K pace)

### 12.3 API Endpoints (InsForge Edge Functions)

```
POST /api/generate-plan
  body: { raceDate, fitnessLevel, goalTime? }
  response: { plan: TrainingPlan }

POST /api/analyze-run
  body: { runId, workoutId }
  response: { feedback: AIFeedback }

GET /api/strava/auth
  redirect to Strava OAuth

POST /api/strava/callback
  body: { code }
  response: { accessToken, athlete }

GET /api/strava/import
  headers: { Authorization: Bearer {token} }
  response: { activities: Run[] }
```

---

**Document Status:** ✅ Ready for Implementation  
**Next Step:** Invoke writing-plans skill to create detailed implementation plan

---

## 13. Changelog

**v1.0 (2026-03-28)**
- Initial design document
- Defined Hansons Marathon Method integration
- Specified three-phase implementation approach
- Included mock Strava approach for reliability
- Prioritized AI feedback as key demo feature