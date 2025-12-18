# 🚀 JobFinder Pro: Full-Stack Engineering Portfolio

JobFinder Pro is a robust job listing platform featuring a responsive JavaScript frontend and a Spring Boot REST API. This project served as a deep dive into complex system integrations, focusing on data integrity, security, and the "Defense in Depth" architectural pattern.

## 🛠️ Technology Stack
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla ES6+), Bootstrap 5
* **Backend:** Java 17+, Spring Boot 3.x, Spring Data JPA
* **Database:** PostgreSQL (Production-grade), H2 (Testing)
* **Security:** CORS Configuration, Server-side Validation

---

## 🏗️ Engineering Challenges & Technical Post-Mortems

Developing this application involved navigating several critical bottlenecks across the stack. Below is the documentation of how these were resolved.

### 1. The "Vanishing" UI Logic (DOM Execution Order)
**Problem:** After a successful job posting, the submission modal refused to close and notifications failed to appear, despite data being successfully saved in the database.

**Investigation:** The browser console revealed `TypeError: cannot read property of null`. Because the `<script>` tag was placed before the HTML elements for the Toast and Modals, the JavaScript initialized before the elements existed in the DOM.

**Solution:** * Moved script references to the end of the `<body>` to ensure the **DOM** was fully parsed before execution.
* Wrapped initialization logic in a `DOMContentLoaded` listener as an industry-standard safety measure.



---

### 2. PostgreSQL Type Inference: The `lower(bytea)` Bug
**Problem:** Searching for jobs with empty filters caused a backend crash: `ERROR: function lower(bytea) does not exist`.

**Investigation:** In the JPQL query, when the `:keyword` parameter was `null`, the JDBC driver failed to infer the string type. PostgreSQL defaulted the null to `bytea` (binary), making it incompatible with the `LOWER()` function.

**Solution:** * Implemented **Query Short-Circuiting** in the Service layer. 
* If filters are empty, the app now calls a simple `findAll()` instead of the complex search query, avoiding the type-inference conflict and improving query performance.



---

### 3. The CORS Security Wall
**Problem:** The frontend could not fetch data from the API, resulting in `TypeError: Failed to fetch`, even though the API worked perfectly in Postman.

**Investigation:** Identified a **Same-Origin Policy (SOP)** violation. Since the frontend was served from a different origin than the API (file system vs. localhost:8080), the browser blocked the request because the server hadn't explicitly granted permission.

**Solution:** * Configured **Cross-Origin Resource Sharing (CORS)** in Spring Boot using the `@CrossOrigin` annotation on REST controllers.
* This allowed the server to send the necessary security headers to permit data exchange with the local frontend.



---

### 4. Build-Time Conflicts (MapStruct vs. Lombok)
**Problem:** Persistent `UnsatisfiedDependencyException` for the `JobMapper` and compiler errors regarding missing DTO properties.

**Investigation:** A "Race Condition" existed between the **Lombok** and **MapStruct** annotation processors. MapStruct was attempting to map fields before Lombok had generated the necessary getters and setters.

**Solution:** * **Refactored to Manual Mapping:** Replaced the automated mapper with explicit Java constructors in the `JobDto` class.
* This eliminated build-time "magic," reduced project complexity, and ensured the code is 100% transparent and debuggable.



---

## 🛑 Data Integrity & Defense in Depth

To prevent duplicate job listings and ensure a high-quality database, I implemented a three-tier validation strategy:

1.  **Frontend (UX Layer - Debouncing):** The submit button is immediately disabled upon click and displays a loading spinner. This prevents accidental multi-clicks during slow network requests.
2.  **Backend (Service Layer - Validation):** Before persisting, the service logic checks `existsByTitleAndCompany()`. If a duplicate is detected, it returns a `409 Conflict` status.
3.  **Database (Persistence Layer - Constraints):** Implementation of a `UNIQUE` composite constraint on `(title, company)` as the final technical fail-safe for data consistency.

## 🚀 Getting Started

### Prerequisites
* JDK 17 or higher
* Maven 3.6+
* PostgreSQL 14+ (or use the H2 profile)

### Installation & Run
1. **Clone the Repo:**
   ```bash
   git clone [https://github.com/samzion/jobPortal-Full-Stack-.git]

2. Run the Backend:

3. Launch the Frontend: Open index.html in your browser.

Developer: Samson Kayode

Project Date: December 2025