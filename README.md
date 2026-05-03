# College Management System

A full-stack college management system with a React + Vite frontend, a Node.js + Express backend, PostgreSQL integration, role-based dashboards, and Docker-based monitoring with Jenkins, Prometheus, and Grafana.

## Overview

This project is organized into:

- `backend/` for the Express API and PostgreSQL access
- `frontend/` for the React dashboard UI
- `monitoring/` for Prometheus and Grafana configuration
- `docker-compose.yml` for the full app stack
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
- Kubernetes enabled in Docker Desktop, or another local cluster
- `kubectl`
- Jenkins, if you want to run the CI pipeline locally
- PostgreSQL database for a pure local Node setup

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

## One-Command Startup

The easiest way to start the project from terminal is:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-project.ps1
```

That starts:

- Jenkins on `http://localhost:8080`
- SonarQube on `http://localhost:9000`
- Prometheus on `http://localhost:9090`
- Grafana on `http://localhost:3001`
- Backend in Kubernetes on `http://localhost:30080`
- Frontend in Kubernetes on `http://localhost:30000`

If you only want part of the stack:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-project.ps1 -Mode compose
powershell -ExecutionPolicy Bypass -File .\start-project.ps1 -Mode k8s
```

## Dockerized Setup

The app-only Docker Compose stack is still available with:

```powershell
docker compose up -d --build
```

That starts:

- PostgreSQL on `localhost:5432`
- Backend API on `localhost:5000`
- Frontend on `localhost:3000`
- Prometheus on `localhost:9090`
- Grafana on `localhost:3001`

### Useful Docker commands

```powershell
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f prometheus
docker compose logs -f grafana
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

### Start SonarQube

```powershell
docker compose -f docker-compose.sonarqube.yml up -d
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
backend:5000
host.docker.internal:30080
```

## Kubernetes Autoscaling

The Kubernetes setup now includes HorizontalPodAutoscalers for:

- `backend`
- `frontend`

These HPAs scale on CPU usage and require Metrics Server.

When you run:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-project.ps1 -Mode k8s
```

the script installs Metrics Server if it is missing, then applies:

- [k8s/autoscaling/backend-hpa.yaml](/c:/Users/admin/Downloads/PROJECTS/College_managment_system/k8s/autoscaling/backend-hpa.yaml)
- [k8s/autoscaling/frontend-hpa.yaml](/c:/Users/admin/Downloads/PROJECTS/College_managment_system/k8s/autoscaling/frontend-hpa.yaml)

Important:

- HPA will not scale up until the pods actually use enough CPU.
- To see scaling happen, you need to create load against the backend or frontend.
- Check status with `kubectl get hpa -n college-system`.

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

### Kubernetes frontend cannot reach the API

- The Kubernetes backend is exposed on `http://localhost:30080`.
- Rebuild the frontend image after API URL changes.
- Make sure Docker Desktop Kubernetes is enabled before applying manifests.
- If `kubectl config current-context` is empty, run `kubectl config use-context docker-desktop` after enabling Kubernetes in Docker Desktop.

## Suggested Next Steps

1. Add backend tests and a `test` script.
2. Add a Dockerfile for backend and frontend.
3. Add a deploy stage to Jenkins.
4. Replace the mock login flow with real API authentication in the frontend.

