# JobFinder — Full-Stack Job Marketplace

> A two-sided job marketplace where job seekers discover opportunities and companies manage hiring.
> Built with Java 17 · Spring Boot 4 · React 18 · PostgreSQL · JWT

[![Java](https://img.shields.io/badge/Java-17-007396?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## What It Does

**For Job Seekers**
- Browse and search job listings by keyword, category, and relevance
- Vote (like/dislike) on listings to surface the best opportunities
- Apply directly with a cover letter and resume URL
- Track application status in real time: `PENDING → REVIEWED → ACCEPTED / REJECTED`

**For Companies**
- Post and manage job listings
- Review applications from candidates
- Update application status with one click
- Toggle between company and job-seeker mode

**For Everyone**
- No account required to browse and vote — anonymous visitor tracking via unique ID (`X-Visitor-ID` header + localStorage)
- Real-time vote counts on every listing

---

## Feature Set

| Area | Features |
|------|----------|
| **Auth** | Register, login (JWT), toggle company / user mode |
| **Jobs** | CRUD, paginated list, keyword search, category filter, sort by date / likes / title |
| **Voting** | Like/Dislike per job, idempotent toggle, anonymous visitor tracking |
| **Applications** | Apply with cover letter + resume URL; full status lifecycle |
| **Categories** | 10 seeded categories — Tech, Finance, Healthcare, and more |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 4.0, Spring Security + JWT (HS256, 24h expiry) |
| ORM / Migrations | Spring Data JPA / Hibernate + Liquibase |
| Database | PostgreSQL (production) / H2 in-memory (development) |
| Frontend (SPA) | React 18, React Router 6, Axios — full auth + all features (`/frontend/`) |
| Frontend (Static) | HTML / CSS / JS — public-facing, no auth (`/src/main/resources/static/`) |
| Styling | Custom utility CSS, Bootstrap Icons |

---

## Getting Started

**Prerequisites:** Java 17, Node.js 18+

### Backend
```bash
./mvnw spring-boot:run
# API:        http://localhost:8080/api/v1
# H2 console: http://localhost:8080/h2-console  (dev only)
```

### Frontend
```bash
cd frontend
npm install
npm start
# App: http://localhost:3000
```

### Production (PostgreSQL)
Set environment variables before running:
```
DB_URL=jdbc:postgresql://localhost:5432/jobfinder_db
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register as user or company |
| `POST` | `/api/v1/auth/login` | Login, returns JWT |
| `GET` | `/api/v1/jobs` | List jobs (paginated, filterable) |
| `POST` | `/api/v1/jobs` | Post a new job (company only) |
| `POST` | `/api/v1/jobs/{id}/vote` | Like or dislike a job |
| `POST` | `/api/v1/applications/jobs/{id}` | Apply for a job |
| `PATCH` | `/api/v1/applications/{id}/status` | Update application status (company only) |
| `GET` | `/api/v1/categories` | List all job categories |

---

## Roadmap

- [x] Job listings with search, filter, and sort
- [x] JWT authentication for users and companies
- [x] Job application lifecycle management
- [x] Like/dislike voting with anonymous visitor tracking
- [ ] External job feed integration (Adzuna, Remotive)
- [ ] Resume file upload (S3 / Cloudinary)
- [ ] Email notifications on application status change
- [ ] Full-text search (PostgreSQL `tsvector`)
- [ ] Admin dashboard

---

## Author

**Samson Kayode** — Software Engineer  
[LinkedIn](https://linkedin.com/in/kayodesamson) · [GitHub](https://github.com/samzion) · kayodesamson4@gmail.com
