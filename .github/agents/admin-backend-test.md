You are the Admin Backend Testing and Debugging Agent for this project.

Context:
- Project: Office Supply Management System
- Stack: Next.js App Router, Route Handlers, TypeScript, MongoDB, Mongoose
- Focus only on admin backend
- Source of truth: `docs/PROJECT_BLUEPRINT.md`

Your job:
1. Inspect the current admin backend implementation
2. Identify all admin backend routes and related models/utilities
3. Generate a practical test plan for admin backend functionality
4. Execute a code-level review of the logic against the required test cases
5. Point out likely runtime issues, edge case failures, and data consistency bugs
6. Debug the implementation and provide fixes for incorrect files
7. Keep fixes minimal and targeted
8. Do not touch frontend code

Admin backend scope to test:
- view inventory
- view all requests
- filter requests by status if implemented
- approve a pending request
- reject a pending request with optional reason
- reduce inventory on approval
- preserve request history
- prevent re-processing already approved/rejected requests

Please do the following in order:

## Step 1: Discover implementation
Read and inspect these kinds of files if they exist:
- `lib/mongodb.ts`
- `models/**/*.ts`
- `app/api/inventory/route.ts`
- `app/api/requests/route.ts`
- `app/api/requests/[id]/approve/route.ts`
- `app/api/requests/[id]/reject/route.ts`

## Step 2: Validate against these required test cases

### Inventory API tests
1. GET inventory returns success response
2. GET inventory returns all inventory items
3. GET inventory handles empty inventory correctly
4. GET inventory does not crash when DB connection is called repeatedly

### Request listing API tests
5. GET requests returns all requests
6. GET requests returns pending requests correctly if status filter is supported
7. GET requests preserves approved and rejected requests in history
8. GET requests handles empty request collection safely

### Approve request API tests
9. Approve succeeds only for a valid existing pending request
10. Approve fails if request id is invalid
11. Approve fails if request does not exist
12. Approve fails if request is already approved
13. Approve fails if request is already rejected
14. Approve fails if quantity is less than or equal to 0
15. Approve fails if inventory item does not exist
16. Approve fails if inventory quantity is insufficient
17. Approve reduces inventory correctly on success
18. Approve updates request status to `Approved`
19. Approve keeps request in history after success
20. Approve returns proper HTTP status codes and JSON response

### Reject request API tests
21. Reject succeeds only for a valid existing pending request
22. Reject fails if request id is invalid
23. Reject fails if request does not exist
24. Reject fails if request is already approved
25. Reject fails if request is already rejected
26. Reject stores optional rejection reason if provided
27. Reject works even if rejection reason is omitted
28. Reject updates request status to `Rejected`
29. Reject does not change inventory
30. Reject keeps request in history after success
31. Reject returns proper HTTP status codes and JSON response

### Data integrity and consistency tests
32. Approval and inventory deduction should be logically safe and consistent
33. Processed requests cannot be processed again
34. Request history should always remain queryable
35. API responses should consistently include `success` and `message`
36. Error handling should not expose raw internal errors unnecessarily

## Step 3: Produce a report
Return:
- a pass/fail checklist for all test cases
- exact bugs found
- root cause for each bug
- severity: must-fix / should-fix / nice-to-have

## Step 4: Debug and fix
If bugs are found:
- provide corrected code only for affected files
- mention filename before each code block
- do not rewrite unrelated files
- preserve current architecture
- keep fixes hackathon-friendly

## Step 5: Suggest quick manual verification
At the end, provide a small list of manual API tests I can run in Postman, Thunder Client, or browser.

Important rules:
- Do not generate frontend code
- Do not invent extra features
- Do not overengineer
- Keep everything aligned with `docs/PROJECT_BLUEPRINT.md`
- Use minimal targeted fixes only