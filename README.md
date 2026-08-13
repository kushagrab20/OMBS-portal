# Online Maid Bureau System (OMBS)

A complete Enterprise Microservices Web Project for an Online Maid Bureau System, built strictly with Spring Boot 3, Netflix Eureka, Spring Cloud Gateway, Angular 19, React 19, MySQL, and Bootstrap 5. This project supports three user roles: Admin, Member, and Maid, and allows users to search, book, allocate, and pay for verified domestic helpers securely.

## Features

- **Role-Based Access Control**: Separate dashboards and permissions for Admin, Member, and Maid.
- **Service Discovery & API Gateway**: Dynamic microservice registration with Netflix Eureka and centralized routing via Spring Cloud Gateway.
- **Automated Maid Allocation Engine**: Intelligent matching system linking pending job requests with available maids based on skill, location, and budget.
- **Secured Escrow Payment Gateway**: Unlocks verified maid contact details (Phone & Email) upon 500 INR processing fee payment.
- **Automated Email Follow-up Scheduler**: Scheduled background tasks executing 7-day post-allocation feedback follow-ups.
- **Real-Time Analytics Dashboard**: Interactive Chart.js reporting in React for revenue, allocation rates, and rating trends.
- **Modern UI**: Built with Bootstrap 5, featuring a custom glassmorphism and warm gradient design with instant search filters.

## Technology Stack

- **Frontend**: Angular 19 (Main Portal), React 19 (Analytics Dashboard), HTML5, CSS3, Bootstrap 5, Chart.js
- **Backend**: Java 17+, Spring Boot 3.2.2, Spring Cloud 2023.0.0, Spring Security (JWT)
- **Service Mesh**: Netflix Eureka Server (Discovery), Spring Cloud Gateway (Routing & CORS)
- **Database**: MySQL 8+ with Spring Data JPA & Hibernate
- **Build & DevOps**: Maven 3.9+, Docker, Docker Compose, PowerShell Orchestrator

## Installation Guide

### Prerequisites
- **Java Development Kit (JDK)**: Version 17 or higher.
- **Node.js & NPM**: Version 18 or higher.
- **MySQL Server**: Version 8.0 or higher.
- **Maven**: Version 3.9+ (Embedded wrapper provided in `backend/apache-maven-3.9.6`).

### Step 1: Database Setup
1. Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or CLI).
2. Execute the provided `data.sql` file:
   ```sql
   SOURCE scripts/data.sql;
   ```
   *This script will create `ombs_auth`, `ombs_user`, `ombs_matching`, `ombs_payment`, and `ombs_feedback` databases, all necessary tables, and insert sample data.*

### Step 2: Configure Database Credentials
1. Navigate to `backend/*/src/main/resources/application.yml` in each service.
2. Update the database connection credentials to match your local MySQL setup:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/ombs_auth
       username: root
       password: Kushagra@20
   ```

### Step 3: Deployment / Execution

#### Option A: 1-Click Launch Script (Recommended)
Open IntelliJ IDEA Terminal or PowerShell in the project root directory:
```powershell
Set-ExecutionPolicy Bypass -Scope Process; .\scripts\run-all.ps1
```
*This automatically builds all Maven JARs and starts Eureka, Gateway, 6 Domain Services, Angular Portal, and React Analytics.*

#### Option B: Docker Compose Deployment
```bash
docker compose up -d
```

#### Option C: Manual Execution via IDE (IntelliJ IDEA)
1. Open the `backend` folder in IntelliJ IDEA.
2. Run `EurekaServerApplication.java` (Port `8761`).
3. Run `AuthApplication.java`, `UserApplication.java`, `MatchingApplication.java`, `PaymentApplication.java`, `FeedbackApplication.java`, `ReportApplication.java`, and `GatewayApplication.java`.
4. In Terminal, run Angular: `cd frontend/angular-portal && npm start`.

## Sample Credentials

| Role | Username / User ID | Password | Name |
|---|---|---|---|
| Admin | `999999` | `admin123` | System Admin |
| Member | `100001` | `member123` | Ravi Kumar |
| Member | `100002` | `member123` | Sita Patel |
| Maid | `200001` | `maid123` | Aarti Sharma (Cleaner) |
| Maid | `200002` | `maid123` | Priya Singh (Cook) |
| Maid | `200003` | `maid123` | Pooja Sharma (Baby sitter) |

## Project Structure

```text
ombs-system/
├── backend/
│   ├── eureka-server/     (Netflix Eureka Service Discovery Registry :8761)
│   ├── gateway-service/   (Spring Cloud API Gateway & CORS Filter :8080)
│   ├── auth-service/      (JWT Authentication & User Security :8081)
│   ├── user-service/      (Member & Maid Profiles CRUD :8082)
│   ├── matching-service/  (Job Creation & Automated Allocation Engine :8083)
│   ├── payment-service/   (Escrow Transaction Logs & Contact Unlock :8084)
│   ├── feedback-service/  (Ratings, Reviews & 7-Day Scheduler :8085)
│   ├── report-service/   (Analytics Data Aggregator :8086)
│   ├── apache-maven-3.9.6/ (Embedded Portable Maven Build Tool)
│   └── pom.xml            (Parent Maven Multi-Module Project Configuration)
├── frontend/
│   ├── angular-portal/    (Main Angular 19 User & Admin Portal :4200)
│   └── react-analytics/   (Real-Time React 19 Chart.js Dashboard :4300)
├── scripts/
│   ├── data.sql           (Database schema and seed data)
│   └── run-all.ps1        (Automated PowerShell Orchestration Script)
├── docker-compose.yml     (Multi-container Docker orchestration manifest)
└── README.md              (Project documentation)
```

## Database Schema (ER Details)

- **ombs_auth.users**: Stores user login credentials, hashed BCrypt passwords, and roles (`ADMIN`, `MEMBER`, `MAID`).
- **ombs_user.members**: Stores member profiles, home addresses, and verified contact info.
- **ombs_user.maids**: Stores maid profiles, age, specialty (`Cleaner`, `Cook`, `Baby sitter`), experience, and availability status.
- **ombs_matching.jobs**: Connects members with job details, location, budget, assigned maid, and allocation status.
- **ombs_payment.payments**: Escrow transaction records tracking payment status and unlocking contact info.
- **ombs_feedback.feedbacks**: Stores star ratings, review comments, and automated follow-up timestamps.

Enjoy building and extending the Online Maid Bureau System!
