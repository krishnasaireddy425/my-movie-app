# Movie Facts App

A simple web app that lets you sign in with Google, save your favorite movie, and get interesting AI-generated facts about it.

### Installation

Clone the repo and install dependencies:

```bash
npm install
```

Set up the database:

```bash
npx prisma db push
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js
- Google OAuth for authentication
- Prisma with PostgreSQL
- OpenAI API
- TypeScript

## How it works

1. Sign in with your Google account
2. Enter your favorite movie (first time only)
3. Get AI-generated fun facts about your movie
4. Refresh the page to get new facts
