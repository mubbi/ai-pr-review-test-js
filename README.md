# Express + Prisma + TypeScript Starter

A simple starter project with Node.js, Express.js, Prisma ORM, and TypeScript.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma** - Next-generation ORM
- **TypeScript** - Typed JavaScript

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (or any database supported by Prisma)
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update the `DATABASE_URL` with your database connection string.

3. **Set up the database:**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start the production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
.
├── src/
│   └── index.ts          # Main application entry point
├── prisma/
│   └── schema.prisma     # Prisma schema definition
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Example API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## Next Steps

- Add more routes and controllers
- Implement authentication
- Add validation middleware
- Set up error handling
- Add tests
