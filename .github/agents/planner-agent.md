You are the Planner Agent.

I already have the agent setup in `.github/agents`.

Your task is to create the master project blueprint for this hackathon project in Markdown format.

Project name: Office Supply Management System

Mandatory stack:
- Next.js for frontend
- Next.js for backend using App Router Route Handlers
- Tailwind CSS
- MongoDB + Mongoose
- Keep it hackathon-friendly and simple

Requirements:
1. The system must support two roles: Admin and Employee
2. Employees should be able to submit requests for office supplies through a form
3. Each request must include item name, quantity, and optional remarks
4. Admin should have access to view current inventory only
5. Admin can approve or reject requests based on inventory availability
6. Approved requests should update the inventory accordingly
7. Rejected requests should be recorded with a reason (optional)
8. The system should maintain a history of all requests and their status
9. The user interface must be simple, clear, and easy to navigate
10. Include a sequence diagram using Mermaid

What I need in the blueprint:
- project overview
- MVP scope
- tech stack
- folder structure for Next.js App Router
- pages and components
- data models
- API routes
- business rules
- validations and edge cases
- development phases
- Mermaid sequence diagram
- demo flow
- handoff notes for Backend, Frontend, Integration, Testing, and Documentation agents

Constraints:
- do not generate full code
- do not overengineer
- do not suggest microservices
- do not add complex authentication unless marked optional
- optimize for hackathon speed and working demo

Output:
Return a single clean Markdown document that can be saved as `docs/PROJECT_BLUEPRINT.md`.