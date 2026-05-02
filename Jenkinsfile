pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    tools {
        nodejs 'Node-20'
    }

    environment {
        DOCKERHUB_USER = 'your-dockerhub-user'
        DOCKERHUB_REPO = 'college-management'
        K8S_NAMESPACE = 'college-system'
        VITE_API_BASE_URL = 'http://college.local/api'
        BACKEND_IMAGE = "docker.io/${DOCKERHUB_USER}/college-backend:${BUILD_NUMBER}"
        FRONTEND_IMAGE = "docker.io/${DOCKERHUB_USER}/college-frontend:${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Run Lint') {
            steps {
                dir('backend') {
                    sh 'npm run lint'
                }
                dir('frontend') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
                dir('frontend') {
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube Backend') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner -Dproject.settings=backend/sonar-project.properties'
                }
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('SonarQube Frontend') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner -Dproject.settings=frontend/sonar-project.properties'
                }
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "docker build -t ${BACKEND_IMAGE} backend"
                sh "docker build --build-arg VITE_API_BASE_URL=${VITE_API_BASE_URL} -t ${FRONTEND_IMAGE} frontend"
            }
        }

        stage('Push Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    sh 'echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin'
                    sh "docker push ${BACKEND_IMAGE}"
                    sh "docker push ${FRONTEND_IMAGE}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/namespace.yaml'
                sh 'kubectl apply -f k8s'
                sh "kubectl -n ${K8S_NAMESPACE} set image deployment/backend backend=${BACKEND_IMAGE}"
                sh "kubectl -n ${K8S_NAMESPACE} set image deployment/frontend frontend=${FRONTEND_IMAGE}"
            }
        }
    }

    post {
        success {
            echo 'CI pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check the console log for the exact step.'
        }
        always {
            archiveArtifacts artifacts: 'frontend/dist/**', fingerprint: true, allowEmptyArchive: true
        }
    }
}
