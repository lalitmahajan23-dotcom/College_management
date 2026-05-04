param(
    [ValidateSet("all", "k8s", "compose")]
    [string]$Mode = "all"
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Invoke-CheckedCommand {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Command
    )

    & $Command[0] $Command[1..($Command.Count - 1)]
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code ${LASTEXITCODE}: $($Command -join ' ')"
    }
}

function Ensure-Command {
    param([string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found in PATH."
    }
}

function Ensure-KubernetesContext {
    try {
        $context = kubectl config current-context 2>$null
    } catch {
        $context = $null
    }

    if ([string]::IsNullOrWhiteSpace($context)) {
        throw @"
No Kubernetes context is set for kubectl.

Fix:
1. Open Docker Desktop.
2. Enable Kubernetes in Settings > Kubernetes.
3. Wait for Docker Desktop to finish restarting.
4. Run: kubectl config use-context docker-desktop
5. Confirm with: kubectl get nodes
"@
    }

    Write-Host "Using Kubernetes context: $context" -ForegroundColor Green
}

function Ensure-MetricsServer {
    function Test-MetricsApiReady {
        try {
            $apiService = kubectl get apiservice v1beta1.metrics.k8s.io -o jsonpath="{.status.conditions[?(@.type=='Available')].status}" 2>$null
            return ($apiService -eq "True")
        } catch {
            return $false
        }
    }

    $metricsApiReady = $false
    $metricsApiReady = Test-MetricsApiReady

    if (-not $metricsApiReady) {
        Write-Step "Installing Metrics Server for autoscaling"
        Invoke-CheckedCommand @(
            "kubectl",
            "apply",
            "-f",
            "https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.8.1/components.yaml"
        )

        $deadline = (Get-Date).AddMinutes(5)
        while ((Get-Date) -lt $deadline) {
            if (Test-MetricsApiReady) {
                $metricsApiReady = $true
                break
            }

            Start-Sleep -Seconds 5
        }

        if (-not $metricsApiReady) {
            Write-Warning "Metrics Server was installed, but the metrics API did not become ready within 5 minutes. The app will continue, but HPA scaling will not work until Metrics Server is healthy."
        }
    }
}

function Start-ComposeStacks {
    Write-Step "Starting Jenkins, Prometheus, Grafana, and SonarQube"
    Invoke-CheckedCommand @("docker", "compose", "-f", "docker-compose.sonarqube.yml", "up", "-d")
    Invoke-CheckedCommand @("docker", "compose", "-f", "docker-compose.monitoring.yml", "up", "-d")
}

function Start-KubernetesApp {
    Ensure-MetricsServer

    Write-Step "Building local Kubernetes images"
    Invoke-CheckedCommand @("docker", "build", "-t", "college-backend:local", "./backend")
    Invoke-CheckedCommand @("docker", "build", "--build-arg", "VITE_API_BASE_URL=http://localhost:30080", "-t", "college-frontend:local", "./frontend")

    Write-Step "Applying Kubernetes manifests"
    Invoke-CheckedCommand @("kubectl", "apply", "--validate=false", "-f", "k8s/namespace.yaml")
    Invoke-CheckedCommand @("kubectl", "apply", "--validate=false", "-f", "k8s/postgres")
    Invoke-CheckedCommand @("kubectl", "apply", "--validate=false", "-f", "k8s/backend")
    Invoke-CheckedCommand @("kubectl", "apply", "--validate=false", "-f", "k8s/frontend")
    Invoke-CheckedCommand @("kubectl", "apply", "--validate=false", "-f", "k8s/autoscaling")

    Write-Step "Starting local port-forwards for browser access"
    Start-Process -WindowStyle Hidden -FilePath "powershell.exe" -ArgumentList @(
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        "kubectl -n college-system port-forward svc/backend 30080:5000"
    )
    Start-Process -WindowStyle Hidden -FilePath "powershell.exe" -ArgumentList @(
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        "kubectl -n college-system port-forward svc/frontend 30000:3000"
    )
}

Ensure-Command docker
Ensure-Command kubectl
if ($Mode -ne "compose") {
    Ensure-KubernetesContext
}

switch ($Mode) {
    "compose" {
        Start-ComposeStacks
    }
    "k8s" {
        Start-KubernetesApp
    }
    "all" {
        Start-ComposeStacks
        Start-KubernetesApp
    }
}

Write-Host ""
Write-Host "Services:"
Write-Host "  Backend (Kubernetes)   -> http://localhost:30080"
Write-Host "  Frontend (Kubernetes)  -> http://localhost:30000"
Write-Host "  Jenkins                -> http://localhost:8080"
Write-Host "  SonarQube              -> http://localhost:9000"
Write-Host "  Prometheus             -> http://localhost:9090"
Write-Host "  Grafana                -> http://localhost:3001"
