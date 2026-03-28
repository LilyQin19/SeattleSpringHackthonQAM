# Marathon Training Coach - Implementation Plan

## Context

This is a greenfield project for the Insforge x Qoder AI Agent Hackathon (6-hour window). The design doc at `docs/superpowers/specs/2026-03-28-marathon-training-app-design.md` defines a comprehensive AI-powered marathon training coach based on the Hansons Marathon Method. The goal is to scaffold, build, and polish a full-stack web app using InsForge (backend) and React + TypeScript (frontend) that generates personalized training plans, tracks workouts, and provides AI coaching feedback.

**Scope:** Phase 1 (MVP) + Phase 2 (AI Feedback + Analytics)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript, Vite, Tailwind CSS 3.4 |
| Routing | React Router v7 |
| State | React Context API + hooks |
| Charts | Recharts |
| Dates | date-fns |
| Backend | InsForge (PostgreSQL, Google OAuth, Edge Functions, AI Gateway) |
| AI Models | `anthropic/claude-3.5-haiku` via InsForge AI SDK |

### InsForge SDK Patterns (confirmed from docs)

```ts
// Client setup
import { createClient } from '@insforge/sdk';
const insforge = createClient({ baseUrl: '...', anonKey: '...' });

// Database
insforge.database.from('table').select().eq('col', val).single();
insforge.database.from('table').insert({ ... }).select();

// Auth
insforge.auth.signInWithOAuth({ provider: 'google', redirectTo: '...' });
insforge.auth.getCurrentUser();
insforge.auth.signOut();

// Edge Functions
insforge.functions.invoke('slug', { body: { ... } }); // auto-includes auth token

// AI (can be called client-side or from edge functions)
insforge.ai.chat.completions.create({
  model: 'anthropic/claude-3.5-haiku',
  messages: [{ role: 'system', content: '...' }, { role: 'user', content: '...' }]
});
```

---

## Project Structure

```
SeattleSpringHackthonQAM/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .env                              # VITE_INSFORGE_URL, VITE_INSFORGE_ANON_KEY
├── insforge/
│   └── functions/
│       ├── generate-plan/index.ts    # AI training plan generation
│       └── analyze-run/index.ts      # Post-run AI feedback
├── src/
│   ├── main.tsx                      # Entry, providers
│   ├── App.tsx                       # Router
│   ├── config/
│   │   └── insforge.ts              # Client singleton
│   ├── types/
│   │   ├── index.ts                 # Barrel export
│   │   ├── user.ts                  # UserProfile, FitnessLevel
│   │   ├── training-plan.ts         # TrainingPlan, WeekSchedule, DayPlan
│   │   ├── workout.ts              # Workout, WorkoutType
│   │   ├── run.ts                  # Run, RunFormData
│   │   ├── ai-feedback.ts          # AIFeedback
│   │   └── onboarding.ts           # OnboardingState
│   ├── contexts/
│   │   ├── AuthContext.tsx          # Auth state, Google OAuth
│   │   ├── TrainingPlanContext.tsx   # Active plan, workouts, current week
│   │   └── RunContext.tsx           # Runs CRUD, AI feedback state
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTrainingPlan.ts
│   │   ├── useRuns.ts
│   │   ├── useWorkouts.ts           # Derived workout queries
│   │   ├── useAnalytics.ts          # Computed chart data
│   │   └── useStreak.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── users.service.ts
│   │   ├── plans.service.ts
│   │   ├── workouts.service.ts
│   │   ├── runs.service.ts
│   │   └── ai-feedback.service.ts
│   ├── lib/
│   │   ├── pace-utils.ts            # Pace string <-> seconds conversions
│   │   ├── date-utils.ts            # date-fns wrappers
│   │   ├── calendar-utils.ts        # Calendar grid generation
│   │   └── constants.ts             # Workout colors, fitness levels
│   ├── layouts/
│   │   ├── AppLayout.tsx            # Auth'd layout: TopBar + Tabs + FAB + Outlet
│   │   └── OnboardingLayout.tsx     # Minimal: logo + stepper + Outlet
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── onboarding/
│   │   │   ├── OnboardingPage.tsx   # Stepper container
│   │   │   ├── WelcomeStep.tsx
│   │   │   ├── RaceDateStep.tsx
│   │   │   ├── FitnessLevelStep.tsx
│   │   │   └── GoalTimeStep.tsx
│   │   ├── DashboardPage.tsx        # "Today" tab
│   │   ├── CalendarPage.tsx         # "Calendar" tab
│   │   ├── HistoryPage.tsx          # "History" tab
│   │   ├── AnalyticsPage.tsx        # "Analytics" tab
│   │   └── NotFoundPage.tsx
│   ├── components/
│   │   ├── ui/                      # Button, Card, Input, Modal, Spinner, etc.
│   │   ├── layout/                  # TopBar, TabNavigation, UserMenu, FAB
│   │   ├── dashboard/               # WeeklyStrip, TodayWorkoutCard, ProgressBar, etc.
│   │   ├── calendar/                # CalendarGrid, CalendarDayCell, DayDetailPanel, etc.
│   │   ├── runs/                    # RunEntryModal, RunEntryForm, EffortSelector, etc.
│   │   ├── feedback/                # AIFeedbackCard, FitnessScoreGauge, etc.
│   │   ├── analytics/               # PaceTrendChart, WeeklyMileageChart, etc.
│   │   └── onboarding/              # StepIndicator, FitnessLevelCards, etc.
│   └── router/
│       └── index.tsx                # All route definitions + guards
```

---

## Routing

```
/login                    → LoginPage (public)
/onboarding               → OnboardingLayout
  /onboarding             → WelcomeStep
  /onboarding/race        → RaceDateStep
  /onboarding/fitness     → FitnessLevelStep
  /onboarding/goal        → GoalTimeStep (+ PlanPreview + AI generation)
/app                      → AppLayout (requires auth + plan)
  /app                    → DashboardPage ("Today")
  /app/calendar           → CalendarPage
  /app/history            → HistoryPage
  /app/analytics          → AnalyticsPage
*                         → NotFoundPage
```

**Route Guards:**
- `RequireAuth` — redirects to `/login` if not authenticated
- `RequireOnboarding` — redirects to `/onboarding` if no training plan
- Root `/` redirects based on auth + onboarding state

---

## State Architecture

```
AuthProvider (user, signIn/Out, loading)
  └── TrainingPlanProvider (plan, workouts, currentWeek, todayWorkout)
       └── RunProvider (runs, addRun, feedback, isSubmitting)
            └── <RouterProvider>
```

### AuthContext
- `user: UserProfile | null`, `isLoading`, `isAuthenticated`, `hasCompletedOnboarding`
- Actions: `signInWithGoogle()`, `signOut()`, `refreshUser()`, `createUserProfile()`

### TrainingPlanContext
- `plan: TrainingPlan | null`, `workouts: Workout[]`, `currentWeekNumber`, `todayWorkout`
- Actions: `generatePlan()`, `markWorkoutComplete()`, `fetchPlan()`

### RunContext
- `runs: Run[]`, `isSubmitting`, `latestFeedback: AIFeedback | null`
- Actions: `addRun()`, `requestFeedback()`, `fetchRuns()`

---

## Database Schema

Execute via `insforge db query` or InsForge dashboard. Schema from design doc section 5.1:
- `users` - extends auth.users with race_date, fitness_level, pace calculations
- `training_plans` - 18-week plan with JSONB weekly_schedule
- `workouts` - individual scheduled workouts (hydrated from plan JSON)
- `runs` - logged runs with distance, duration, pace, effort
- `ai_feedback` - AI coaching analysis per run

---

## Edge Functions

### `generate-plan`
1. Validate inputs (race date >= 12 weeks out, valid fitness level)
2. Calculate pace targets from goal time using Hansons formulas
3. Call InsForge AI (`anthropic/claude-3.5-haiku`) with system prompt (marathon coach) + user prompt (race date, fitness, goal)
4. Parse JSON response into `WeekSchedule[]`
5. Insert into `training_plans`, hydrate individual `workouts` rows
6. Update `users` with training_plan_id and calculated paces
7. Return complete plan

### `analyze-run`
1. Fetch run record + matched workout + recent 4 weeks of runs
2. Call InsForge AI with coaching analysis prompt
3. Parse response into `AIFeedback` shape
4. Insert into `ai_feedback` table
5. Return feedback

---

## Implementation Steps

### Step 1: Scaffolding & Infrastructure
- Invoke `ui-designer` skill for design system and visual prototypes
- Scaffold Vite + React + TypeScript project
- Install deps: `react-router-dom@7`, `@insforge/sdk`, `recharts`, `date-fns`, `tailwindcss`, `postcss`, `autoprefixer`
- Configure Tailwind CSS
- Set up InsForge project (`npx @insforge/cli create` or `link`)
- Create `.env` with `VITE_INSFORGE_URL` and `VITE_INSFORGE_ANON_KEY`
- Run database migration (SQL schema from design doc)
- Create InsForge client singleton (`src/config/insforge.ts`)

### Step 2: Types & Utilities
- Define all TypeScript interfaces in `src/types/`
- Build utility functions: `pace-utils.ts`, `date-utils.ts`, `constants.ts`

### Step 3: Auth + Routing Shell
- Build UI primitives (`src/components/ui/`)
- Create auth service + AuthContext
- Build LoginPage with Google OAuth
- Build layout shells (AppLayout, OnboardingLayout)
- Set up React Router with all routes and guards
- Build TopBar, TabNavigation, UserMenu

### Step 4: Onboarding Wizard + Plan Generation
- Build onboarding components (StepIndicator, RaceDatePicker, FitnessLevelCards, GoalTimeInput)
- Build onboarding pages (4 steps + container)
- Deploy `generate-plan` edge function
- Create plans + workouts services
- Build PlanPreview component
- Create TrainingPlanContext

### Step 5: Training Dashboard
- Build WeeklyStrip + WeeklyStripDay
- Build TodayWorkoutCard
- Build WeeklyProgressBar, QuickStats, StreakBadge
- Create useWorkouts + useStreak hooks
- Assemble DashboardPage

### Step 6: Run Entry + Calendar
- Create runs service + RunContext
- Build RunEntryForm, EffortSelector, PaceCalculator, WorkoutMatcher
- Build RunEntryModal + FloatingActionButton
- Build calendar components (CalendarGrid, CalendarDayCell, DayDetailPanel, etc.)
- Assemble CalendarPage + HistoryPage

### Step 7: AI Feedback (Phase 2)
- Deploy `analyze-run` edge function
- Create AI feedback service
- Build feedback components (AIFeedbackCard, FitnessScoreGauge, etc.)
- Wire feedback into RunEntryModal (show after run submission)

### Step 8: Analytics (Phase 2)
- Build useAnalytics hook
- Build chart components (PaceTrendChart, WeeklyMileageChart, CompletionDonut)
- Assemble AnalyticsPage

### Step 9: Polish & Demo
- Add empty states, error banners, loading spinners to all pages
- Seed demo data (6 weeks of training data + sample AI feedback)
- Responsive design polish
- Final testing of end-to-end flow

---

## Key Architectural Decisions

1. **Dual storage for plans** — JSONB in `training_plans.weekly_schedule` for fast retrieval + individual `workouts` rows for per-day queries and completion tracking
2. **Edge functions for AI** — Prompts and model config stay server-side; client never sees raw prompts
3. **Global RunEntryModal** — FAB rendered in AppLayout outside route Outlet, accessible from any tab
4. **Optimistic UI** — Workout completion updates state immediately before DB confirms
5. **ISO strings everywhere** — All dates as ISO strings in state/DB; `date-fns` for display formatting only
6. **Workout type color system** — Consistent color coding: easy=emerald, speed=orange, tempo=blue, long=purple, rest=slate

---

## Verification

1. **Auth flow:** Login with Google OAuth → redirect to onboarding (new user) or dashboard (existing user)
2. **Onboarding:** Complete 4-step wizard → AI generates training plan → view plan preview → confirm → redirect to dashboard
3. **Dashboard:** See today's workout, weekly strip with color-coded workouts, weekly progress bar, streak counter
4. **Calendar:** Navigate months, see color-coded workout indicators, click day for details
5. **Run logging:** Click FAB → fill form → auto-calculate pace → match to workout → save → see AI feedback
6. **Analytics:** View pace trend chart, weekly mileage comparison, completion percentage
7. **Run `npm run dev`** to verify hot reload and no build errors
8. **Run `npx tsc --noEmit`** to verify no TypeScript errors
9. **Test responsive design** at mobile (375px), tablet (768px), desktop (1280px) viewports

---

## Critical Files

| File | Why Critical |
|------|-------------|
| `src/contexts/TrainingPlanContext.tsx` | Central state - plan data, workouts, current week. Most components depend on it |
| `insforge/functions/generate-plan/index.ts` | AI plan generation - must produce valid JSON for 18-week schedule |
| `src/components/runs/RunEntryModal.tsx` | Highest interaction - bridges run logging, workout completion, AI feedback |
| `src/services/workouts.service.ts` | Hydration logic: flattens WeekSchedule JSON → individual Workout rows |
| `src/router/index.tsx` | Controls entire user flow: login → onboarding → app |
| `src/config/insforge.ts` | Single client instance used by all services |
