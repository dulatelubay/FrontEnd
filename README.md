# Цифровой тренажёр — Digital Training Simulator

A web platform for teaching **data analysis and visualization with Python**, aimed at school informatics teachers. Built as the software artifact for a master's thesis on applying AI to educational data analysis.

## Team responsibilities

| Who | What |
|-----|------|
| **Master's student (thesis author)** | AI microservice (`ai-microservice/`) — LLM integration, scaffolding, grading prompts, ML risk prediction |
| **Platform developers** | Spring Boot backend (`backend/`) + React frontend (`digital-trainer/`) |

> **Platform developers:** you do not need to run `ai-microservice/` to work on the platform. The backend handles its absence gracefully (AI hints return a 503 you can stub, AI grading falls back to "pending" status).

---

## Architecture

```
┌─────────────────┐     JWT/REST      ┌──────────────────────┐
│  React 19+Vite  │ ◄───────────────► │  Spring Boot 4       │
│  :5173          │                   │  Java 21  :8084      │
└─────────────────┘                   └──────────┬───────────┘
                                                 │ HTTP (localhost:8100)
                                       ┌─────────▼───────────┐
                                       │  AI Microservice     │
                                       │  Python FastAPI      │
                                       │  :8100               │
                                       └──────────┬───────────┘
                                                  │
                                       ┌──────────▼──────────┐
                                       │  OpenAI / Anthropic  │
                                       │  / Gemini API        │
                                       └─────────────────────┘
         ┌──────────────────────────────────────┐
         │  PostgreSQL :5432  │  Redis :6379     │
         └──────────────────────────────────────┘
         │  Docker sandbox (trainer-sandbox image)            │
         └────────────────────────────────────────────────────┘
```

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Java | 21+ | JDK, not JRE |
| Maven | 3.9+ | or use `./mvnw` wrapper |
| Node.js | 20+ | |
| Docker Desktop | latest | must be running |
| PostgreSQL | 15+ | local or Docker |
| Redis | 7+ | optional — needed only for AI features |
| Python | 3.12 | only if running AI microservice |

---

## Setup & Running

### 1. Infrastructure (Docker)

PostgreSQL and Redis both run in Docker. Start them before the backend:

```bash
docker run -d --name trainer-postgres \
  -e POSTGRES_DB=trainer \
  -e POSTGRES_USER=trainer \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:16-alpine

docker run -d --name trainer-redis \
  -p 6379:6379 redis:7-alpine
```

On subsequent days just `docker start trainer-postgres trainer-redis`.

Flyway migrations run automatically on backend startup and create all tables + seed data.

### 2. Backend (Spring Boot)

```bash
cd backend
```

Build the sandbox Docker image (do this once, rebuild if `Dockerfile.sandbox` changes):
```bash
docker build -t trainer-sandbox -f Dockerfile.sandbox .
```

Run:
```bash
# Windows
./mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Backend starts on **http://localhost:8084**. Flyway runs migrations automatically.

### 3. Frontend (React)

```bash
cd digital-trainer
npm install
npm run dev
```

Frontend starts on **http://localhost:5173**

### 4. AI Microservice (optional — thesis author only)

```bash
cd ai-microservice
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # then fill in your LLM API key
uvicorn app.main:app --host 0.0.0.0 --port 8100 --reload
```

Swagger UI available at **http://localhost:8100/docs**

---

## Test credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@trainer.kz` | `admin123` |
| Teacher (methodist) | `aigerim@school.kz` | `teacher123` |
| Student | `aliya@school.kz` | `student123` |

---

## What's implemented

### Authentication & Users
- [x] JWT login / refresh / logout (access token in memory, refresh in localStorage)
- [x] Role-based routing: `admin` / `teacher` / `student`
- [x] Teacher creates student accounts; admin manages all users

### Teacher side
- [x] Theory topics — create, view with content
- [x] Tasks — create with description, example input/output, solution
- [x] View all student submissions per task
- [x] Grade submissions manually; see AI-suggested grade with "Apply" button
- [x] Student list

### Student side
- [x] **Course flow** — linear progression: Lecture → Quiz → Practical per module
  - 1 seed course: "Введение в анализ данных для учителей информатики" (3 modules)
  - Modules locked until previous is complete; free navigation once unlocked
  - Progress stored in `localStorage` (temporary — needs DB entities)
- [x] **Task submissions** — code editor, submit, AI grades in background
  - Up to 5 attempts per task
  - Polling UI: spinner while AI grades, auto-switches to feedback tab
  - Differentiated display: AI grade (purple) vs teacher grade (green)
- [x] **AI hints** — "💡 Подсказка от ИИ" button in task view calls AI scaffold endpoint
- [x] **Sandbox** — run Python with pandas/matplotlib/seaborn, see output + inline charts
- [x] Theory reading

### AI integration (backend ↔ AI microservice)
- [x] `POST /api/submissions` → async AI grading via `/api/v1/grade`
- [x] `POST /api/hints/{taskId}` → scaffolding hint via `/api/v1/scaffold`
- [x] Python sandbox — Docker container with data science image, returns stdout + base64 figures

---

## What's next (backlog)

### High priority — platform developers

#### Course content model in DB
The course/module/lecture/quiz/practical flow is currently **hardcoded seed data** in `digital-trainer/src/data/courseData.js`. It needs proper backend entities so teachers can create and edit content.

Suggested entities:
```
Course → Module (ordered) → [Lecture, Quiz, PracticalTask]
QuizQuestion (belongs to Quiz, has options + correct answer)
ModuleProgress (student × module → lectureRead, quizPassed, practicalDone)
```

New endpoints needed:
```
GET  /api/courses                        — list courses
GET  /api/courses/:id                    — course with modules
GET  /api/courses/:id/modules/:mid       — module content
POST /api/courses/:id/modules/:mid/progress  — save progress
```

#### StudentDashboard & StudentProgress
Both pages (`StudentDashboard.jsx`, `StudentProgress.jsx`) are still **hardcoded mock data**. They need to be wired to:
- `GET /api/submissions/my` — for grade history and task stats
- `GET /api/courses` + progress endpoint (once implemented) — for module progress

#### Teacher course creation UI
Teachers need pages to create/edit courses, modules, lectures, quizzes, and practical tasks. Currently there's no UI for this — content is seeded directly.

### Lower priority

- [ ] PDF/video support for lecture content
- [ ] Mobile-responsive layout
- [ ] Internationalization (Russian UI is hardcoded)
- [ ] Email notifications for graded submissions

### AI microservice (thesis author)

- [ ] Wire VL assessment (`/api/v1/assess-vl`) to student profiles — currently all hints use hardcoded `vl_level: "intermediate"`
- [ ] Update grade/scaffold prompts to say "student" instead of "teacher/methodist" context
- [ ] AI chat assistant during module learning (calls `/api/v1/chat`)
- [ ] AI learning recommendations after module completion (calls `/api/v1/report`)

---

## Key technical decisions

- **JWT:** `JwtAuthFilter` stores the user ID as a plain `String` principal. All controllers must use `@AuthenticationPrincipal String userId` — **never** `@AuthenticationPrincipal UserDetails` (that injects null).
- **Sandbox:** uses `--read-only` Docker flag + stdin for code (no temp files — Windows Docker Desktop limitation). Docker Desktop must be running.
- **JPA:** `open-in-view=false`. All associations accessed in DTO constructors must be EAGER (default for `@ManyToOne` — do not set lazy).
- **AI grading:** runs in `CompletableFuture.runAsync()` — submissions immediately return as "pending", AI updates them in the background. Frontend polls every 4s.
- **Sandbox image:** must be built manually (`docker build -t trainer-sandbox -f Dockerfile.sandbox .`) — it is not pulled from a registry.

---

## Project structure

```
trainer/
├── backend/                  # Spring Boot 4, Java 21
│   ├── src/main/java/.../
│   │   ├── controller/       # REST endpoints
│   │   ├── service/          # business logic + AI client
│   │   ├── entity/           # JPA entities
│   │   ├── repository/       # Spring Data repos
│   │   ├── dto/              # request/response DTOs
│   │   ├── security/         # JWT filter + config
│   │   └── config/           # CORS, Security, etc.
│   └── src/main/resources/
│       ├── application.properties
│       └── db/migration/     # Flyway SQL migrations (V1–V7)
│
├── digital-trainer/          # React 19 + Vite
│   └── src/
│       ├── pages/
│       │   ├── student/      # StudentDashboard, StudentTasks, StudentCourses, etc.
│       │   └── *.jsx         # teacher pages
│       ├── components/       # Sidebar, ThemeToggle, ErrorBoundary
│       ├── context/          # AuthContext (JWT), ThemeContext
│       ├── data/             # courseData.js (seed data — temporary)
│       └── styles/           # themes.js (light/dark color tokens)
│
└── ai-microservice/          # Python FastAPI — thesis author's domain
    ├── app/
    │   ├── routers/          # scaffold, grade, predict, chat, report
    │   ├── prompts/          # LLM prompt templates
    │   ├── services/         # llm_router, llm_cache, chat_history
    │   └── ml/               # Random Forest risk predictor
    └── handoff/              # API contract docs for integration
```
