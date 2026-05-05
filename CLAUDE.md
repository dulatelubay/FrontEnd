# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Trainer** ("Digital Training Simulator") is a full-stack educational platform for teaching **data analysis and visualization** using Python. It targets school informatics teachers learning to apply data analysis in their work.

Master's thesis artifact: *"Development of a Digital Training Simulator Model for Applying AI to Educational Data Analysis and Visualization"*.

**Learning flow:** Course → Module → Lecture → Quiz → Practical task (Python sandbox + AI grading/hints).

## Monorepo Structure

```
trainer/
├── digital-trainer/   # React 19 + Vite frontend
├── backend/           # Spring Boot 4 (Java 21) backend
└── ai-microservice/   # Python FastAPI AI service (thesis author's domain)
```

## Commands

### Infrastructure (Docker) — start before anything else

PostgreSQL and Redis run in Docker:
```bash
docker run -d --name trainer-postgres \
  -e POSTGRES_DB=trainer \
  -e POSTGRES_USER=trainer \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:16-alpine

docker run -d --name trainer-redis \
  -p 6379:6379 redis:7-alpine
```

Stop/start on subsequent days:
```bash
docker start trainer-postgres trainer-redis
```

### Sandbox image — build once, rebuild when Dockerfile.sandbox changes

```bash
# From backend/
docker build -t trainer-sandbox -f Dockerfile.sandbox .
```

### Backend (`backend/`)
```bash
./mvnw.cmd spring-boot:run   # Windows — runs on port 8084
./mvnw spring-boot:run       # Linux/Mac
./mvnw test
```

Flyway migrations run automatically on startup and create all tables + seed data.

### Frontend (`digital-trainer/`)
```bash
npm install   # first time only
npm run dev   # dev server → http://localhost:5173
npm run build
npm run lint
```

### AI microservice (`ai-microservice/`) — optional, thesis author only
```bash
cd ai-microservice
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env    # fill in LLM API key
uvicorn app.main:app --host 0.0.0.0 --port 8100 --reload
```

The backend handles the AI service being offline gracefully: hints return 503, AI grading stays "pending".

## Roles

- `admin` — creates and manages teacher/methodist accounts
- `teacher` (methodist) — creates tasks, views student progress, overrides AI grades
- `student` — follows course progression, submits code, receives AI feedback

Test credentials:
- `admin@trainer.kz` / `admin123`
- `aigerim@school.kz` / `teacher123`
- `aliya@school.kz` / `student123`

## Backend Architecture

**Stack:** Spring Boot 4 + Java 21, PostgreSQL, Flyway migrations, Redis (refresh token store + JWT blocklist), Spring Security (stateless JWT).

**JWT flow:** `JwtAuthFilter` stores the user ID as a plain `String` principal. All controllers must use `@AuthenticationPrincipal String userId` — **never** `@AuthenticationPrincipal UserDetails` (that always injects null here).

**Database migrations** (`backend/src/main/resources/db/migration/`):
- `V1` — users table
- `V2` — auth seed
- `V3` — topics, tasks, task_submissions tables
- `V4` — seed topics (8 topics covering Python data analysis concepts)
- `V5` — seed tasks (6 tasks)
- `V6` — add `attempts` column to task_submissions
- `V7` — add `ai_grade`, `ai_feedback` columns to task_submissions

**Key endpoints:**
- `POST /api/auth/login` / `POST /api/auth/refresh` / `POST /api/auth/logout`
- `GET /api/topics` / `GET /api/topics/{id}`
- `GET /api/tasks` / `GET /api/tasks/{id}`
- `POST /api/submissions` — student submits code; triggers async AI grading
- `GET /api/submissions/my` — student's own submission history
- `GET /api/submissions/task/{taskId}` — teacher views all submissions (TEACHER/ADMIN)
- `PUT /api/submissions/{id}/grade` — teacher grades a submission (TEACHER/ADMIN)
- `POST /api/hints/{taskId}` — AI hint for a task (calls AI microservice `/scaffold`)
- `GET /api/users?role=STUDENT` / `POST /api/users/students` / `DELETE /api/users/{id}`
- `POST /sandbox/execute-code` — run Python in Docker sandbox (Content-Type: text/plain)

**Sandbox:** `POST /sandbox/execute-code` accepts raw Python, spawns a `trainer-sandbox` Docker container (data science image with pandas, numpy, matplotlib, seaborn, scipy, sklearn), returns JSON `{ output: string, figures: string[], error: string }` where `figures` is a list of base64-encoded PNG strings. Code is passed via base64 env var `STUDENT_CODE` to avoid shell quoting issues. Uses `--read-only` flag (Windows Docker Desktop file-sharing limitation).

**AI grading flow:** `SubmissionService.submit()` saves submission as "pending" then fires `CompletableFuture.runAsync(() -> gradeWithAi(...))`. Background task runs sandbox → calls `AiServiceClient.grade()` → updates `ai_grade`, `ai_feedback`, status `"ai_graded"`. Frontend polls `/api/submissions/my` every 4s until status changes.

**Task submission statuses:** `pending` → `ai_graded` → `graded` (teacher override). Max 5 attempts per task.

## Frontend Architecture

**Entry:** `src/main.jsx` → `src/App.jsx`

**Context providers:**
- `AuthProvider` (`src/context/AuthContext.jsx`) — JWT access token in memory (`useRef`), refresh token in `localStorage`, auto-refresh on mount, `authFetch(path, opts)` helper that injects Bearer token and retries on 401/403
- `ThemeProvider` (`src/context/ThemeContext.jsx`) — light/dark toggle, `useTheme()` hook

**Theming:** All colors from `src/styles/themes.js` (`themes.light` / `themes.dark`). Every page: `const t = themes[theme]`, `const isDark = theme === 'dark'`. Accent: `isDark ? '#89B4FA' : '#1A6EFF'`. No CSS files — all inline styles.

**Routing (`src/App.jsx`):**
- `ProtectedRoute` — blocks while `loading === true`, then checks role
- Teacher/admin routes: `/`, `/theory`, `/tasks`, `/lessons`, `/sandbox`, `/students`, `/progress`, `/admin`
- Student routes: `/student`, `/student/tasks`, `/student/progress`, `/student/theory`, `/student/sandbox`, `/student/courses`, `/student/courses/:id`, `/student/courses/:id/module/:moduleId`

**Student course flow** (`src/data/courseData.js` + `src/pages/student/StudentCourses|CourseDetail|ModuleView.jsx`):
- 1 seed course hardcoded in `courseData.js` with 3 modules (lecture blocks + quiz + practical per module)
- Progress stored in `localStorage` key `course_progress_{userId}` — temporary until DB entities are built
- Lock logic: module N locked until module N-1 `practicalDone`; within module: quiz locked until `lectureRead`, practical locked until `quizPassed`
- Free navigation between steps once a step is completed

**Data layer status:**
- Teacher pages (Theory, Tasks, Students) — wired to real API
- StudentTasks — real API, AI grading + hints + polling
- StudentTheory, StudentSandbox — real API
- StudentCourses / StudentModuleView — hardcoded seed data (`courseData.js`), progress in localStorage
- StudentDashboard, StudentProgress — still hardcoded mock data

**Error boundary:** `src/components/ErrorBoundary.jsx` wraps all routes in `App.jsx`.

## AI Features (implemented)

1. **Task hints** — `POST /api/hints/{taskId}` → `AiServiceClient.hint()` → AI microservice `/api/v1/scaffold`. Student sees "💡 Подсказка от ИИ" button in task view. Each click fetches a new hint (cache disabled on scaffold endpoint).
2. **Auto-grading** — async on every submission. AI score stored as `ai_grade` (0–100), teacher score as `grade`. Teacher UI shows AI suggestion with "Apply" button. Student UI shows purple block (AI) and green block (teacher grade) separately.
3. **Module practical hints** — same hint endpoint reused from the course practical step.

## Key Constraints

- `@AuthenticationPrincipal` must be typed as `String` — JwtAuthFilter stores a plain String principal.
- Sandbox: `--read-only` Docker flag, code via stdin as base64 env var. Docker Desktop must be running.
- `open-in-view=false` — JPA associations in DTO constructors must be EAGER. `@ManyToOne` is EAGER by default — do not add `fetch = FetchType.LAZY`.
- `HttpStatus.UNPROCESSABLE_ENTITY` is deprecated in Spring 7 — use `HttpStatusCode.valueOf(422)`.
- `AiServiceClient` uses `HttpClient.Version.HTTP_1_1` explicitly — uvicorn (AI service) does not support HTTP/2.
- `ObjectMapper` in `AiServiceClient` and `PythonService` is declared as `private static final ObjectMapper MAPPER = new ObjectMapper()` — Spring Boot 4's webmvc starter does not auto-register it as a bean.
- Java 22 on dev machine, project targets `--release 21` — intentional.
