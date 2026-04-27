# College Management System

A full-stack college management system with a React + Vite frontend, a Node.js + Express backend, PostgreSQL integration, role-based dashboards, and Docker-based monitoring with Jenkins, Prometheus, and Grafana.

## Overview

This project is organized into:

- `backend/` for the Express API and PostgreSQL access
- `frontend/` for the React dashboard UI
- `monitoring/` for Prometheus and Grafana configuration
- `docker-compose.monitoring.yml` for the monitoring stack
- `Jenkinsfile` for CI pipeline automation

The frontend currently provides a role-based login screen and dashboards for:

- Student
- Teacher
- Admin

The backend exposes real authentication and dashboard endpoints, plus a `/metrics` endpoint for Prometheus.

## Features

- Role-based dashboard navigation
- Authentication API with login and registration
- PostgreSQL database integration
- Admin, faculty, and student dashboard routes
- Prometheus metrics endpoint
- Grafana dashboard provisioning
- Jenkins CI pipeline

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Axios, Recharts
- Backend: Node.js, Express, PostgreSQL, JWT, bcrypt
- Monitoring: Prometheus, Grafana
- CI/CD: Jenkins
- Containerization: Docker

## Project Structure

```text
college_Managment_system/
├── backend/
├── frontend/
├── monitoring/
├── docker-compose.monitoring.yml
├── Jenkinsfile
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js 18+ recommended
- npm
- Docker Desktop
- Jenkins, if you want to run the CI pipeline locally
- PostgreSQL database

## Environment Variables

### Backend

Create `backend/.env` with values like:

```env
PORT=5000
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

### Frontend

Optional frontend variable:

```env
VITE_API_BASE_URL=http://localhost:5000
```

If this is not set, the frontend defaults to `http://localhost:5000`.

## Local Setup

### 1. Clone the repository

```powershell
git clone <your-repo-url>
cd college_Managment_system
```

### 2. Install backend dependencies

```powershell
cd backend
npm install
```

### 3. Install frontend dependencies

```powershell
cd ..\frontend
npm install
```

## Run the Application

### Start the backend

```powershell
cd backend
npm run dev
```

The backend runs on `http://localhost:5000` by default.

### Start the frontend

Open a new terminal:

```powershell
cd frontend
npm run dev
```

The frontend runs on the Vite dev server, usually `http://localhost:5173`.

## Monitoring With Docker

This repo includes a Docker Compose file for:

- Jenkins
- Prometheus
- Grafana

### Start the monitoring stack

From the repository root:

```powershell
docker compose -f docker-compose.monitoring.yml up -d
```

### Open the services

- Jenkins: `http://localhost:8080`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`

### Grafana login

- Username: `admin`
- Password: `admin123`

### Jenkins initial password

```powershell
docker exec college-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

## Metrics

The backend exposes Prometheus metrics at:

```text
http://localhost:5000/metrics
```

Prometheus is configured to scrape the backend through:

```text
host.docker.internal:5000
```

## Jenkins CI Pipeline

The `Jenkinsfile` currently performs these steps:

1. Checkout code
2. Install backend dependencies
3. Install frontend dependencies
4. Run frontend lint
5. Build the frontend
6. Run a backend import/sanity check

### How to use it

1. Push the repo to GitHub.
2. Create a Jenkins pipeline job.
3. Point Jenkins to this repository.
4. Use the `Jenkinsfile` in the repository root.
5. Trigger the job manually or with a GitHub webhook.

## API Endpoints

### Authentication

- `POST /api/auth/login`
- `POST /api/auth/register`

### Dashboards

- `GET /api/admin/dashboard`
- `GET /api/faculty/dashboard`
- `GET /api/student/dashboard`

### Metrics

- `GET /metrics`

## Frontend Notes

- The login screen is currently a role selector used to simulate dashboard navigation.
- The admin dashboard includes local mock data for tables and charts.
- The chatbot widget expects a backend chat endpoint if you plan to enable that feature.

## Git Ignore

This repository includes a root `.gitignore` that excludes:

- `node_modules`
- build outputs
- environment files
- editor settings
- Docker runtime volumes

## Troubleshooting

### Backend does not start

- Check your `.env` values.
- Verify PostgreSQL is running.
- Confirm the database credentials are correct.

### Frontend cannot reach the backend

- Make sure the backend is running on port `5000`.
- Set `VITE_API_BASE_URL=http://localhost:5000` if needed.

### Jenkins pipeline fails on Windows agents

- The provided `Jenkinsfile` uses `sh`, which works best with Linux-based Jenkins agents or Jenkins running in Docker.
- If you run Jenkins on a native Windows agent, change the shell steps to `bat`.

### Grafana shows no data

- Confirm Prometheus is running.
- Confirm the backend is serving `/metrics`.
- Wait a minute after startup and refresh the query.

## Suggested Next Steps

1. Add backend tests and a `test` script.
2. Add a Dockerfile for backend and frontend.
3. Add a deploy stage to Jenkins.
4. Replace the mock login flow with real API authentication in the frontend.

