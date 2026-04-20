Read my current project files and fix the MongoDB configuration for this Next.js App Router project.

Goal:
- connect the app to my local MongoDB database
- database name: `office-management-app`
- use environment variable instead of hardcoding
- make the setup compatible with Next.js + Mongoose + TypeScript
- use safe connection caching for hot reload
- keep it hackathon-friendly and production-safe enough

What to do:
1. Create or fix `.env.local`
2. Create or fix `lib/mongodb.ts`
3. Update any API route files that need to call the DB connection
4. Do not change unrelated code
5. Return the exact file contents that need to be created or modified
6. Mention filename before each code block

Use this local MongoDB URI:
`mongodb://127.0.0.1:27017/office-management-app`

Requirements:
- validate that `MONGODB_URI` exists
- use `process.env.MONGODB_URI`
- use Mongoose connection caching pattern for Next.js hot reload
- code must be copy-paste ready
- TypeScript only
- no frontend changes

If my existing files are wrong, correct them with minimal changes.