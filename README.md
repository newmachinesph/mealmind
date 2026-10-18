# MealMind

AI-Powered Daily Meal Decisions for High-Performance Users

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Turso](https://img.shields.io/badge/Turso-LibSQL-4FF8D2?logo=turso&logoColor=black)

MealMind is a Next.js web app that eliminates food decision fatigue by giving each user one AI-curated meal recommendation per day. Users complete a five-step onboarding (diet, allergies, goals, kitchen, taste), then get a daily meal with an AI-generated photo, nutrition facts and step-by-step instructions, and rate it so future suggestions improve. It is built for busy, health-conscious people who would rather not decide what to eat.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Turso (LibSQL)
- **Authentication**: NextAuth.js v5 (credentials, bcrypt password hashing)
- **AI**: OpenAI `gpt-4o` for meal generation; OpenRouter (`bytedance-seed/seedream-4.5`) for meal images, stored as base64 data URLs
- **File uploads**: UploadThing route (`/api/uploadthing`)
- **Testing**: Vitest + Testing Library (jsdom)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+ (required by Next.js 16)
- Turso database
- OpenAI API key
- OpenRouter API key
- UploadThing account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/newmachinesph/mealmind.git
cd mealmind
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in a `.env` file at the project root (it is gitignored; Next.js and the `db:*` scripts both read it):
```
OPENAI_API_KEY=your_openai_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
UPLOADTHING_TOKEN=your_uploadthing_token
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Initialize the database (creates the tables in `src/lib/db/schema.sql`):
```bash
npm run db:init
```

5. Optionally seed demo accounts (see `src/lib/db/seed.ts` for the list):
```bash
npm run db:seed
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:ui` | Vitest UI (requires `@vitest/ui`) |
| `npm run test:coverage` | Coverage report (requires `@vitest/coverage-v8`) |
| `npm run db:init` | Create database tables |
| `npm run db:seed` | Insert demo accounts with completed profiles |
| `npm run lint` | `next lint` (note: removed in Next.js 16; run `npx eslint .` instead) |

`scripts/reset-database.js` drops and recreates all tables; `scripts/verify-schema.js` prints the current schema.

## Project Structure

```
mealmind/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes (auth, onboarding, profile, meal, feedback, seed, uploadthing)
│   │   ├── auth/            # Login and signup pages
│   │   ├── feedback/        # Feedback history page
│   │   ├── meal/today/      # Today's meal page
│   │   ├── onboarding/      # Onboarding flow
│   │   ├── profile/         # Profile view and edit pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Landing page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components (auth, feedback, layout, meal, onboarding, profile, ui)
│   ├── lib/
│   │   ├── ai/              # Meal + image generation and prompts
│   │   ├── auth/            # Auth config and password hashing
│   │   ├── db/              # Turso client, schema, init and seed scripts
│   │   └── storage/         # UploadThing client
│   ├── test/                # Test setup, mock data, integration tests
│   ├── types/               # TypeScript types
│   ├── auth.ts              # NextAuth configuration
│   └── proxy.ts             # Route protection and onboarding redirects (Next.js 16 proxy)
├── scripts/                 # Database reset and schema verification
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
├── vitest.config.ts         # Vitest configuration
└── package.json             # Dependencies and scripts
```

Planning docs: [MealMind_PRD.md](MealMind_PRD.md) (product spec), [QUICK_START.md](QUICK_START.md), [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md), [CHECKLIST.md](CHECKLIST.md).

## Features

### 1. User Authentication
- Email/password registration and login
- Secure session management with NextAuth.js
- Protected routes via `src/proxy.ts`

### 2. Onboarding Flow
- 5-step personalization process
- Dietary restrictions and allergies
- Health goals and calorie targets
- Cooking skills and equipment
- Taste preferences and cuisines

### 3. Daily Meal Recommendations
- AI-generated meal suggestions
- Personalized based on user profile
- AI-generated food photography
- Detailed nutritional information
- Step-by-step cooking instructions
- Up to 3 generations per day (initial meal + 2 regenerations)

### 4. Feedback System
- Rate meals (1-5 stars)
- Quick feedback tags
- Optional notes
- Feedback history page
- Past ratings and tags are fed into future meal prompts

### 5. Profile Management
- View all preferences
- Edit dietary restrictions, goals and cooking preferences

## API Routes

- `POST /api/auth/signup` - Register new user
- `GET|POST /api/auth/[...nextauth]` - NextAuth handlers
- `POST /api/onboarding` - Save onboarding data
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/meal/today` - Get (or generate) today's meal
- `POST /api/meal/regenerate` - Generate a new meal for today (daily limit)
- `POST /api/meal/confirm` - Confirm meal selection
- `POST /api/meal/feedback` - Submit feedback
- `GET /api/meal/feedback?meal_id=X` - Get feedback for a meal
- `GET /api/feedback/history` - Get the user's feedback history
- `POST /api/seed` - Create demo accounts (development only; returns 404 when `NODE_ENV=production`)
- `/api/uploadthing` - UploadThing file router

## Database Schema

See `src/lib/db/schema.sql` for the complete database schema.

Tables:
- `users` - User accounts
- `user_profiles` - User preferences
- `daily_meals` - Generated meals
- `feedback` - User feedback

## Development

### Running Tests
```bash
npm test
```

Tests cover UI components (`Button`, `Input`, `SignupForm`), password hashing, and an auth integration test.

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

## Deployment

This app is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

Released under the [MIT License](LICENSE).

## Support

Open an issue on [GitHub](https://github.com/newmachinesph/mealmind/issues).
