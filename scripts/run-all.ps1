# OMBS Orchestrator - Starts all backend services and frontends

$baseDir = Split-Path -Path $PSScriptRoot -Parent
if ([string]::IsNullOrEmpty($baseDir)) { $baseDir = Get-Location }

$mvnPath = "$baseDir\backend\apache-maven-3.9.6\bin\mvn.cmd"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Online Maid Bureau System (OMBS) Launcher" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Build Backend Jars
Write-Host "Step 1: Building Backend Microservices Jars..." -ForegroundColor Yellow
Set-Location "$baseDir\backend"
& $mvnPath install -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Error "Maven build failed. Please fix compilation issues first."
    exit 1
}
Write-Host "Backend Jars built successfully!" -ForegroundColor Green

# 2. Start Microservices sequentially
Write-Host "`nStep 2: Starting Microservices..." -ForegroundColor Yellow

$services = @(
    @{ name = "Eureka Server";    jar = "eureka-server\target\eureka-server-1.0.0.jar";    port = 8761 },
    @{ name = "Auth Service";     jar = "auth-service\target\auth-service-1.0.0.jar";     port = 8081 },
    @{ name = "User Service";     jar = "user-service\target\user-service-1.0.0.jar";     port = 8082 },
    @{ name = "Matching Service"; jar = "matching-service\target\matching-service-1.0.0.jar"; port = 8083 },
    @{ name = "Payment Service";  jar = "payment-service\target\payment-service-1.0.0.jar";  port = 8084 },
    @{ name = "Feedback Service"; jar = "feedback-service\target\feedback-service-1.0.0.jar"; port = 8085 },
    @{ name = "Report Service";   jar = "report-service\target\report-service-1.0.0.jar";   port = 8086 },
    @{ name = "API Gateway";      jar = "gateway-service\target\gateway-service-1.0.0.jar";  port = 8080 }
)

foreach ($service in $services) {
    Write-Host "Launching $($service.name) on port $($service.port)..." -ForegroundColor Cyan
    Start-Process java -ArgumentList "-jar", "$($service.jar)" -WorkingDirectory "$baseDir\backend" -NoNewWindow
    Start-Sleep -Seconds 4  # Wait for startup buffer
}

# 3. Start Frontends
Write-Host "`nStep 3: Starting Frontend Development Servers..." -ForegroundColor Yellow

Write-Host "Starting React Analytics Dashboard (Port 4300)..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/c", "npm run dev" -WorkingDirectory "$baseDir\frontend\react-analytics" -NoNewWindow

Write-Host "Starting Angular Main Portal (Port 4200)..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/c", "npx ng serve" -WorkingDirectory "$baseDir\frontend\angular-portal" -NoNewWindow

Write-Host "`nAll processes initiated!" -ForegroundColor Green
Write-Host "You can access:" -ForegroundColor Green
Write-Host " - Eureka Dashboard: http://localhost:8761" -ForegroundColor Green
Write-Host " - Angular Main Portal: http://localhost:4200" -ForegroundColor Green
Write-Host " - React Analytics: http://localhost:4300" -ForegroundColor Green
Write-Host " - API Gateway: http://localhost:8080" -ForegroundColor Green
Write-Host "Keeping launcher alive to maintain background services..." -ForegroundColor Cyan
while ($true) {
    Start-Sleep -Seconds 10
}
