# MealMind - Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- npm installed
- OpenAI API key
- Turso database (already configured)
- UploadThing account (already configured)

## Installation (5 minutes)

### Step 1: Verify Dependencies
All dependencies are already installed. If you need to reinstall:
```bash
npm install --legacy-peer-deps
```

### Step 2: Verify Environment Variables
The `.env.local` file already contains:
- ✅ OPENAI_API_KEY
- ✅ UPLOADTHING_TOKEN
- ✅ TURSO_DATABASE_URL
- ✅ TURSO_AUTH_TOKEN
- ✅ NEXTAUTH_SECRET
- ✅ NEXTAUTH_URL

### Step 3: Database is Already Initialized
The database schema has been created. You can verify by running:
```bash
npm run db:init
```

### Step 4: Start the Development Server
```bash
npm run dev
```

### Step 5: Open Your Browser
Navigate to: http://localhost:3000

## First Time User Journey

### 1. Landing Page (/)
- See the MealMind value proposition
- Click "Get Your First Meal" or "Start Free Today"

### 2. Sign Up (/auth/signup)
- Enter your email (e.g., test@example.com)
- Create a password (minimum 8 characters)
- Click "Create Account"
- You'll be redirected to onboarding

### 3. Onboarding Flow (/onboarding)
Complete all 5 steps:

**Step 1: Basics**
- Name: Your name
- Age: Your age
- Location: City, Country
- Timezone: Select your timezone

**Step 2: Dietary**
- Select dietary restrictions (optional): Vegetarian, Vegan, Keto, etc.
- Select allergies (optional): Peanuts, Shellfish, etc.

**Step 3: Goals**
- Select health goals: Weight Loss, Muscle Gain, etc.
- Activity level: Sedentary to Extra Active
- Calorie target (optional): e.g., 500 per meal
- Macro preferences (optional): Protein, Carbs, Fat in grams

**Step 4: Lifestyle**
- Cooking skill: Beginner, Intermediate, Advanced
- Max cooking time: e.g., 45 minutes
- Kitchen equipment: Select what you have

**Step 5: Taste**
- Favorite cuisines: Italian, Mexican, Japanese, etc.
- Cuisines to avoid: Select dislikes
- Flavor preferences: Spicy, Savory, Sweet, etc.
- Favorite ingredients: Chicken, Fish, Tofu, etc.
- Ingredients to avoid: Select dislikes

Click "Complete Setup" when done.

### 4. First Meal Generation (/meal/today)
- The AI will generate your first personalized meal
- This takes 10-30 seconds
- You'll see:
  - Beautiful food photo
  - Meal name and description
  - Time, calories, difficulty, servings
  - Nutritional macros
  - Ingredient list
  - Cooking instructions (click "Show")

### 5. Confirm Your Meal
Click "I'll Make This" to confirm you'll cook it

### 6. Give Feedback
Click "Give Feedback" to rate your meal:
- Did you make it? Yes/No
- Rate 1-5 stars
- Add quick tags (optional)
- Add notes (optional)

### 7. Next Day
Come back tomorrow for a new meal recommendation!

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Initialize database (already done)
npm run db:init
```

## Testing the Complete Flow

### Test Account 1: Quick Test
```
Email: test@mealmind.com
Password: password123
```
Create this account and complete a simple onboarding with:
- Dietary: None
- Skills: Intermediate
- Time: 30 minutes
- Cuisines: Italian, Mexican

### Test Account 2: Complex Profile
```
Email: vegan@mealmind.com
Password: password123
```
Create with:
- Dietary: Vegan, Gluten-Free
- Allergies: Peanuts, Soy
- Goals: Weight Loss, Improve Energy
- Skills: Beginner
- Time: 20 minutes
- Equipment: Microwave, Stovetop only
- Cuisines: Mediterranean, Thai

## Troubleshooting

### Issue: "Failed to fetch meal"
- Check that the OpenAI API key is valid
- Ensure you have API credits
- Check browser console for errors

### Issue: "Database error"
- Run `npm run db:init` to reinitialize
- Check Turso database connection
- Verify TURSO_* environment variables

### Issue: "Image not loading"
- DALL-E 3 might be rate limited
- Check UPLOADTHING_TOKEN validity
- Image will fallback to placeholder

### Issue: "Cannot sign in"
- Clear browser cookies
- Check NEXTAUTH_SECRET is set
- Verify user exists in database

### Issue: Build errors
- Run `npm install --legacy-peer-deps` again
- Clear `.next` folder: `rm -rf .next`
- Restart development server

## Project Structure (Quick Reference)

```
src/
├── app/                    # Next.js pages and routes
│   ├── api/               # API endpoints
│   ├── auth/              # Auth pages (signup, login)
│   ├── meal/              # Meal pages
│   ├── onboarding/        # Onboarding flow
│   └── profile/           # Profile page
├── components/            # React components
│   ├── auth/             # Auth forms
│   ├── meal/             # Meal display & feedback
│   ├── onboarding/       # 5 onboarding steps
│   ├── profile/          # Profile display
│   ├── layout/           # Header, navigation
│   └── ui/               # Buttons, inputs, cards
├── lib/                  # Core libraries
│   ├── ai/              # GPT-4 & DALL-E integration
│   ├── auth/            # Authentication logic
│   ├── db/              # Database client
│   └── storage/         # File uploads
└── types/               # TypeScript types
```

## Key Files to Know

- **Landing Page**: `src/app/page.tsx`
- **Signup**: `src/app/auth/signup/page.tsx`
- **Login**: `src/app/auth/login/page.tsx`
- **Onboarding**: `src/app/onboarding/page.tsx`
- **Today's Meal**: `src/app/meal/today/page.tsx`
- **Profile**: `src/app/profile/page.tsx`

- **Meal Generation**: `src/lib/ai/meal-generator.ts`
- **Image Generation**: `src/lib/ai/image-generator.ts`
- **Database Client**: `src/lib/db/client.ts`
- **Auth Config**: `src/lib/auth/config.ts`

## API Endpoints (for testing)

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get today's meal (requires auth)
curl http://localhost:3000/api/meal/today \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

# Get profile (requires auth)
curl http://localhost:3000/api/profile \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

## Next Steps

1. ✅ Test the complete user flow
2. ✅ Generate multiple meals over several days
3. ✅ Submit feedback to see AI learning
4. ✅ Update profile preferences
5. ✅ Test on mobile devices
6. ✅ Prepare for deployment

## Deployment to Vercel

When ready to deploy:

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables from `.env.local`
5. Update `NEXTAUTH_URL` to your production domain
6. Deploy!

## Support

- **Documentation**: See README.md
- **PRD**: See MealMind_PRD.md
- **Summary**: See PROJECT_SUMMARY.md
- **Database Schema**: See src/lib/db/schema.sql

---

**You're all set! Start the dev server and begin testing.**

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.
