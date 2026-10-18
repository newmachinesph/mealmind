# MealMind

**AI-Powered Daily Meal Decisions for High-Performance Users**

---

| | |
|---|---|
| Version: 1.0 | Status: MVP Specification |
| Date: January 2025 | Timeline: 2-3 Weeks |

---

## 1. Executive Summary

MealMind is a focused MVP web application that eliminates daily food decision fatigue for high-performance individuals. By leveraging AI, the app provides one curated meal recommendation per day based on user preferences, dietary needs, and goals.

> **Core Value Proposition:** Remove the cognitive load of deciding what to eat. One decision. One meal. Zero friction.

### Target Users

- Busy professionals who value time and mental bandwidth
- Health-conscious individuals with specific dietary goals
- People experiencing decision fatigue around food choices
- High-performers seeking to optimize their daily routines

---

## 2. Product Overview

### 2.1 Problem Statement

High-performance individuals make hundreds of decisions daily. Food decisions, despite their simplicity, consume disproportionate mental energy. Current solutions (meal planning apps, recipe apps, delivery services) still require significant decision-making. MealMind removes decisions entirely by providing exactly one AI-selected meal per day.

### 2.2 Solution

A streamlined web app that learns user preferences through structured onboarding, then delivers a single daily meal recommendation. Users provide feedback after meals to improve future recommendations.

### 2.3 Key Differentiators

| Aspect | Our Approach |
|--------|--------------|
| Decision Load | Zero decisions - one meal, take it or leave it |
| Personalization | AI learns from onboarding + ongoing feedback |
| Complexity | Minimal UI, no feature bloat, single purpose |
| Speed | Open app → See today's meal → Done |

---

## 3. Core Features (MVP Scope)

### 3.1 User Authentication

| Component | Details |
|-----------|---------|
| Sign Up | Email/password registration with email verification |
| Login | Email/password authentication with session management |
| Profile | Basic profile view with ability to update preferences |
| Security | Password hashing, JWT tokens, secure session handling |

### 3.2 Structured Onboarding

Multi-step onboarding form capturing essential information for AI personalization:

| Step | Data Collected | Purpose |
|------|----------------|---------|
| 1. Basics | Name, age, location, timezone | Personalization context |
| 2. Dietary | Restrictions, allergies, preferences (vegan, keto, etc.) | Hard constraints for AI |
| 3. Goals | Health goals, calorie targets, macro preferences | Optimization criteria |
| 4. Lifestyle | Cooking skill, time available, kitchen equipment | Feasibility filtering |
| 5. Taste | Cuisine preferences, flavor profiles, ingredient likes/dislikes | Preference learning |

### 3.3 Today's Meal Screen

The primary interface - displays exactly ONE meal recommendation for the day:

- Meal name and hero image
- Brief description (2-3 sentences)
- Estimated prep/cook time
- Calorie and macro summary
- Simple ingredient list
- Basic cooking instructions (expandable)
- Prominent "I'll make this" confirmation button

> **Design Principle:** The meal is presented as THE choice, not A choice. No alternatives shown. No browsing. One meal, one screen.

### 3.4 Feedback System

Post-meal feedback collection (triggered after expected meal time):

| Feedback Type | Implementation |
|---------------|----------------|
| Did you make it? | Simple Yes/No toggle |
| Rating | 5-star scale for overall satisfaction |
| Quick Tags | Optional: Too hard, Too long, Missing ingredients, Will make again |
| Notes | Optional free-text field for specific feedback |

---

## 4. Technical Architecture

### 4.1 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (React) with TypeScript, Tailwind CSS |
| Backend | Next.js API Routes (serverless functions) |
| Database | Turso (LibSQL - SQLite for the edge) |
| AI Integration | OpenAI API (latest model) with structured outputs + DALL-E for meal images |
| Authentication | NextAuth.js (email/password) |
| Hosting | Vercel (frontend + API + edge database) |
| Image Storage | UploadThing |

### 4.2 Database Schema

#### Users Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key, auto-generated |
| email | VARCHAR | User email (unique) |
| created_at | TIMESTAMP | Account creation time |
| onboarding_complete | BOOLEAN | Whether user finished onboarding |
| timezone | VARCHAR | User's timezone for meal timing |

#### User Profiles Table

| Field | Type | Description |
|-------|------|-------------|
| user_id | UUID | Foreign key to users |
| dietary_restrictions | JSONB | Array of restrictions |
| allergies | JSONB | Array of allergens |
| health_goals | JSONB | Goals and targets |
| cuisine_preferences | JSONB | Liked/disliked cuisines |
| cooking_skill | ENUM | beginner, intermediate, advanced |
| max_cook_time | INTEGER | Minutes willing to spend |
| kitchen_equipment | JSONB | Available equipment list |

#### Daily Meals Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| date | DATE | Date of recommendation |
| meal_data | JSONB | Full meal details from AI |
| confirmed | BOOLEAN | User confirmed they'll make it |
| generated_at | TIMESTAMP | When AI generated the meal |

#### Feedback Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| meal_id | UUID | Foreign key to daily_meals |
| did_make | BOOLEAN | Whether user made the meal |
| rating | INTEGER | 1-5 star rating |
| tags | JSONB | Array of feedback tags |
| notes | TEXT | Optional free-text feedback |
| submitted_at | TIMESTAMP | When feedback was given |

### 4.3 AI Integration

#### Prompt Structure

The AI receives structured user context and returns a JSON-formatted meal recommendation:

> **System Prompt Components:** User profile data (dietary restrictions, goals, preferences) → Recent meal history (avoid repetition) → Feedback patterns (learn from ratings) → Constraints (time, skill, equipment)

#### Response Schema

- `meal_name`: String - Name of the dish
- `description`: String - 2-3 sentence description
- `prep_time`: Integer - Minutes for preparation
- `cook_time`: Integer - Minutes for cooking
- `calories`: Integer - Estimated calories
- `macros`: Object - { protein, carbs, fat } in grams
- `ingredients`: Array - List with quantities
- `instructions`: Array - Step-by-step cooking instructions
- `image_prompt`: String - Prompt for DALL-E image generation
- `image_url`: String - Generated image URL (stored in UploadThing)

#### AI Image Generation Workflow

1. **Meal Generation**: GPT generates meal details including optimized `image_prompt`
2. **Image Creation**: DALL-E 3 generates photorealistic meal image from prompt
3. **Storage**: Generated image uploaded to UploadThing for persistent storage
4. **Caching**: Image URL stored in database with meal data for reuse
5. **Cost Optimization**: Pre-generate images during off-peak hours, cache aggressively

### 4.4 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Authenticate user |
| POST | /api/auth/logout | End session |
| GET | /api/profile | Get user profile |
| PUT | /api/profile | Update user profile |
| POST | /api/onboarding | Save onboarding data |
| GET | /api/meal/today | Get today's meal |
| POST | /api/meal/confirm | Confirm meal selection |
| POST | /api/meal/feedback | Submit meal feedback |
| GET | /api/meal/history | Get past meals (optional) |

---

## 5. User Flows

### 5.1 New User Journey

1. User lands on homepage → Sees value proposition
2. Clicks "Get Started" → Redirected to signup
3. Creates account with email/password
4. Enters 5-step onboarding flow
5. Completes onboarding → First meal generated immediately
6. Sees "Today's Meal" screen with first recommendation

### 5.2 Daily User Flow

1. User opens app → Automatically sees today's meal
2. Reviews meal details, ingredients, instructions
3. Taps "I'll make this" to confirm (or skips)
4. Later: Receives feedback prompt (push notification or in-app)
5. Submits quick feedback → AI learns for future recommendations

---

## 6. UI/UX Guidelines

### 6.1 Design Principles

- **Minimal:** Every element must earn its place
- **Fast:** Instant load, no waiting for AI (pre-generate meals)
- **Focused:** One primary action per screen
- **Confident:** Present meals definitively, not tentatively
- **Clean:** White space, clear typography, no visual clutter

### 6.2 Screen Inventory

| Screen | Key Elements |
|--------|--------------|
| Landing Page | Value prop, CTA, simple benefits list |
| Auth Screens | Clean forms, minimal fields, clear CTAs |
| Onboarding (5 steps) | Progress indicator, single question focus per step |
| Today's Meal | Hero image, meal name, quick stats, ingredients, instructions |
| Feedback Modal | Quick rating, optional tags, submit button |
| Profile/Settings | View/edit preferences, dietary info, account settings |

### 6.3 Mobile-First Approach

Primary use case is mobile (checking what to cook). Design mobile-first with responsive desktop version. Touch targets minimum 44px. Thumb-friendly primary actions.

---

## 7. Development Timeline

### Week 1: Foundation

| Days | Deliverables |
|------|--------------|
| 1-2 | Project setup: Next.js, Turso, Tailwind. Database schema. Auth flow with NextAuth.js. |
| 3-4 | Onboarding UI and backend. Profile storage. |
| 5 | AI integration: OpenAI API setup (GPT + DALL-E), initial prompt engineering. |

### Week 2: Core Features

| Days | Deliverables |
|------|--------------|
| 1-2 | Today's Meal screen. Meal generation logic with AI image generation. Caching strategy. |
| 3-4 | Feedback system. Feedback storage and retrieval. |
| 5 | AI prompt refinement based on feedback loop testing. |

### Week 3: Polish & Launch

| Days | Deliverables |
|------|--------------|
| 1-2 | UI polish. Edge case handling. Error states. |
| 3 | Testing: Cross-browser, mobile, user flow validation. |
| 4-5 | Deployment to production. Monitoring setup. Documentation. |

---

## 8. Success Metrics (MVP Validation)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Onboarding Completion | >70% | Users who finish all 5 steps |
| Daily Active Return | >40% | Users who return next day |
| Meal Confirmation Rate | >50% | Users who tap "I'll make this" |
| Feedback Submission | >30% | Users who provide feedback |
| Average Rating | >3.5 stars | Mean of all feedback ratings |

---

## 9. Out of Scope (Post-MVP)

The following features are explicitly NOT part of the MVP but may be considered for future iterations:

- Multiple meals per day (breakfast, lunch, dinner)
- Grocery list generation and shopping integration
- Social features (sharing meals, friends)
- Meal prep and batch cooking modes
- Integration with fitness trackers or health apps
- Premium subscription features
- Native mobile apps (iOS/Android)
- Voice assistant integration
- Restaurant recommendation fallback

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| AI API costs escalate | Implement caching, pre-generate meals and images during off-peak, set usage limits, consider DALL-E 2 for lower cost |
| Poor meal recommendations | Extensive prompt engineering, feedback loop, manual fallback options |
| Users want alternatives | Stay firm on single-meal concept for MVP validation; track skip rates |
| Low engagement | Push notifications (opt-in), email reminders, gamification hooks |
| Dietary constraints missed | Strict constraint handling in prompts, user verification step |

---

## 11. Developer Expectations

### Required Skills

- Full-stack development with React/Next.js
- SQLite/LibSQL database design and management
- REST API development
- OpenAI API integration experience
- Authentication implementation (NextAuth.js)
- Clean, maintainable code practices

### Communication

- Daily async updates on progress
- Immediate flagging of blockers
- Weekly sync calls (optional)
- Clear documentation of technical decisions

### Deliverables

- Working MVP deployed to production
- Source code in version control (GitHub)
- Basic documentation (README, API docs)
- Database schema documentation
- Handoff notes for future development

---

> **Ready to Build?** This PRD defines a focused, achievable MVP that can validate the core hypothesis: people want their food decisions made for them. The scope is intentionally constrained to enable rapid development and real-world testing.
