Use `docs/PROJECT_BLUEPRINT.md` as the source of truth.

Build the backend for the Office Supply Management System.

Tech constraints:
- Next.js App Router
- Route Handlers in `app/api`
- MongoDB + Mongoose
- Keep it simple and hackathon-friendly

Requirements to implement:
- Employee can submit office supply requests
- Each request has item name, quantity, and optional remarks
- Admin can view inventory
- Admin can approve or reject requests
- Approved requests must reduce inventory
- Rejected requests can store optional reason
- Full request history must be preserved

Important:
- Do not change architecture from the blueprint
- Do not generate frontend yet
- Return code file by file
- Mention filename before each code block
- Make code copy-paste ready

Start with backend foundation only:
1. database connection file
2. Mongoose models
3. API route files for:
   - create request
   - get requests
   - get inventory
   - approve request
   - reject request
4. optional inventory seed route if needed


Use TypeScript.
Use Mongoose models with safe model re-use for Next.js hot reload.
Use proper JSON responses with status codes.
Validate quantity > 0.
Prevent approving or rejecting an already processed request.
On approval, check inventory availability before reducing stock.