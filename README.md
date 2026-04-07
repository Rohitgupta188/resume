# 🚀 AI Resume Builder & Analyzer

A production-grade full-stack application that allows users to create, manage, and optimize resumes using AI.

---

## 🧠 Features

### ✅ Resume Builder

* Structured resume creation (Education, Skills, Projects, Experience)
* Stored as clean JSON for AI processing

### 🤖 AI Resume Analyzer *(Coming Soon)*

* Resume scoring (ATS-style)
* Missing skills detection
* Section-wise feedback

### ✨ AI Resume Improver *(Coming Soon)*

* Rewrites weak bullet points
* Enhances impact using industry-level language

### 🎯 Job Matching *(Planned)*

* Match resume with job descriptions
* Skill gap analysis
* Match percentage scoring

---

## 🔐 Authentication

* JWT-based authentication
* Access + Refresh token flow
* Secure HTTP-only cookies
* Silent session refresh

---

## 🧩 Architecture

### 🗂 Models

* **User**

  * username, email, password
  * `activeResumeId` (single source of truth)

* **Resume**

  * structured content (JSON)
  * education, skills, projects, experience

---

## ⚙️ Key Design Decisions

### ✅ Active Resume Handling

* Uses `activeResumeId` in User model
* Avoids race conditions
* Single atomic DB update
* Scalable and production-safe

---

## 📡 API Endpoints

### Resume

#### 🔹 Create Resume

```
POST /api/resumes
```

#### 🔹 Get Resumes (with pagination)

```
GET /api/resumes?page=1&limit=20
```

#### 🔹 Activate Resume

```
PATCH /api/resumes/:id/activate
```

---

## 🛠 Tech Stack

* **Frontend:** Next.js (App Router)
* **Backend:** Next.js API Routes
* **Database:** MongoDB + Mongoose
* **Validation:** Zod
* **Auth:** JWT (Access + Refresh tokens)
* **AI (Planned):** Gemini / OpenAI

---

## 📈 Scalability Considerations

* Lean queries for performance
* Indexed fields for fast lookup
* Atomic updates to prevent race conditions
* Modular validation schemas
* Clean separation of concerns

---

## 🚧 Roadmap

* [x] Authentication system
* [x] Resume CRUD APIs
* [x] Active resume architecture
* [ ] AI Resume Analyzer
* [ ] AI Resume Improver
* [ ] Job Matching System
* [ ] Resume Versioning

---

## ⚡ Getting Started

```bash
git clone <repo-url>
cd project
npm install
npm run dev
```

---

## 📌 Environment Variables

```
MONGODB_URI=
JWT_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_EXPIRY=
```

---

## 💡 Author

Built with a focus on **scalable backend architecture + AI integration**.

---
