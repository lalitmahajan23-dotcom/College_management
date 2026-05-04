# CI/CD Pipeline Guide (Jenkins)

This document explains the **pipeline for the College Management System** in both **non-technical** and **technical** terms. It is based on the actual Jenkins pipeline defined in `Jenkinsfile`.

## 1) One-paragraph (Non-technical)

Whenever code is changed, the pipeline acts like an automated quality-and-delivery checklist: it downloads the latest code, installs everything needed, checks for basic mistakes (lint), runs any tests, checks code quality/security rules in SonarQube, then packages the backend and frontend into Docker images. If everything looks good, it uploads those images to Docker Hub and updates the running Kubernetes deployment so users get the new version with minimal downtime.

## 2) What the pipeline achieves (Why it exists)

- **Consistency:** Every build runs the same steps the same way.
- **Quality gates:** SonarQube can fail the pipeline if code quality drops.
- **Repeatable deployments:** Docker images + Kubernetes updates reduce “works on my machine” problems.
- **Faster feedback:** Lint/quality checks catch issues early.

## 3) Pipeline at a glance

### Simple flow

1. Get latest code
2. Install dependencies
3. Lint + tests
4. SonarQube scans + quality gate
5. Build Docker images
6. Push images to registry
7. Deploy/update Kubernetes

### Technical flow (matches `Jenkinsfile` stages)

- **Checkout**
- **Install Dependencies** (backend + frontend)
- **Run Lint** (backend + frontend)
- **Run Tests** (backend + frontend)
- **SonarQube Backend** + Quality Gate
- **SonarQube Frontend** + Quality Gate
- **Build Docker Images**
- **Push Images**
- **Deploy to Kubernetes**

## 4) Detailed stage-by-stage explanation

### Stage: Checkout

**Non-technical:** Pulls the newest version of the project.

**Technical:** Jenkins executes `checkout scm` to fetch the repository configured for the Jenkins job.

---

### Stage: Install Dependencies

**Non-technical:** Installs all required libraries for backend and frontend.

**Technical:**

- Runs `npm ci` inside `backend/`
- Runs `npm ci` inside `frontend/`

`npm ci` is used for repeatable installs (it uses the lockfile).

---

### Stage: Run Lint

**Non-technical:** Checks code for obvious mistakes / bad patterns.

**Technical:**

- Backend: `npm run lint` (currently implemented as `node --check app.js && node --check server.js`)
- Frontend: `npm run lint` (ESLint)

---

### Stage: Run Tests

**Non-technical:** Runs automated tests to ensure code changes didn’t break features.

**Technical:**

- Backend: `npm test` (currently prints: "No backend tests yet")
- Frontend: `npm test` (currently prints: "No frontend tests yet")

Note: Tests are placeholders right now; the stage exists so you can add real tests later without redesigning the pipeline.

---

### Stage: SonarQube Backend

**Non-technical:** Performs a deeper code quality scan (bugs, code smells, security hotspots, maintainability).

**Technical:**

- Uses Jenkins tool installation: `SonarScanner`
- Uses configured SonarQube server: `withSonarQubeEnv('SonarQube')`
- Runs: `sonar-scanner -Dproject.settings=sonar-project.properties` inside `backend/`
- Waits for **Quality Gate** (up to 5 minutes) and aborts the pipeline if it fails.

Configuration lives in `backend/sonar-project.properties`.

---

### Stage: SonarQube Frontend

**Non-technical:** Same quality scan, but for the frontend code.

**Technical:**

- Runs the scanner inside `frontend/`
- Waits for **Quality Gate** and aborts on failure.

Configuration lives in `frontend/sonar-project.properties`.

---

### Stage: Build Docker Images

**Non-technical:** Packages the backend and frontend into deployable “containers”.

**Technical:**

- Backend build:
  - `docker build -t docker.io/<user>/college-backend:<BUILD_NUMBER> backend`
- Frontend build:
  - `docker build --build-arg VITE_API_BASE_URL=<value> -t docker.io/<user>/college-frontend:<BUILD_NUMBER> frontend`

Important detail: the frontend is a static build hosted by Nginx, so `VITE_API_BASE_URL` is injected at **build time** (via `--build-arg`).

---

### Stage: Push Images

**Non-technical:** Uploads the new container versions to Docker Hub so Kubernetes can pull them.

**Technical:**

- Uses Jenkins credentials with ID: `dockerhub-creds`
- Logs into Docker Hub (`docker login`)
- Pushes both images with the build number tag.

---

### Stage: Deploy to Kubernetes

**Non-technical:** Updates the running app to the new version with minimal downtime.

**Technical:**

1. Applies the namespace and all manifests:
   - `kubectl apply -f k8s/namespace.yaml`
   - `kubectl apply -f k8s`
2. Updates the images on the deployments (rolling update):
   - `kubectl -n college-system set image deployment/backend backend=<BACKEND_IMAGE>`
   - `kubectl -n college-system set image deployment/frontend frontend=<FRONTEND_IMAGE>`

Notes:

- Your Kubernetes manifests use 2 replicas, rolling update strategy, probes, PDBs, and HPAs.
- For private Docker Hub images, Kubernetes would need an `imagePullSecret` (not currently defined in the manifests). Public repos work without that.

---

### Post actions

**Non-technical:** Saves build outputs for reference.

**Technical:**

- Always archives `frontend/dist/**` (if present) as Jenkins artifacts.

## 5) Pipeline prerequisites (what must be configured in Jenkins)

To run this pipeline successfully, Jenkins must have:

- **NodeJS tool** configured as `Node-20`
- **SonarScanner tool** configured as `SonarScanner`
- A **SonarQube server config** named `SonarQube`
- Docker available on the Jenkins agent (Docker CLI + daemon access)
- `kubectl` installed and configured to reach the target Kubernetes cluster
- Credentials:
  - Docker Hub credentials stored in Jenkins with ID: `dockerhub-creds`

## 6) Environment variables used by the pipeline

The `Jenkinsfile` sets key environment variables:

- `DOCKERHUB_USER` / `DOCKERHUB_REPO`
- `K8S_NAMESPACE=college-system`
- `VITE_API_BASE_URL` (used during frontend Docker build)
- `BACKEND_IMAGE` and `FRONTEND_IMAGE` are tagged with `BUILD_NUMBER`

## 7) Suggested demo explanation (quick speaking version)

"Our Jenkins pipeline validates the code (install → lint → tests), enforces quality gates using SonarQube for both backend and frontend, then builds Docker images and pushes them to Docker Hub. Finally it deploys to Kubernetes by applying manifests and updating the deployment images, so releases are automated, repeatable, and observable through Prometheus/Grafana metrics and alerts."