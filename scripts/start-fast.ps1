# Fast OMBS Microservices Launcher (Skips Maven Build)

$baseDir = Split-Path -Path $PSScriptRoot -Parent
if ([string]::IsNullOrEmpty($baseDir)) { $baseDir = "K:\OMBS Project" }

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Fast Online Maid Bureau System (OMBS) Launcher" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Kill any zombie processes on target ports
Write-Host "Clearing ports 8761, 8080-8086, 4200, 4300..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 8080,8081,8082,8083,8084,8085,8086,8761,4200,4300 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 2. Start Microservices sequentially
Write-Host "`nLaunching Backend Microservices..." -ForegroundColor Yellow

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
    Start-Sleep -Seconds 3  # startup buffer
}

# 3. Start Frontends
Write-Host "`nStarting Frontend Servers..." -ForegroundColor Yellow

Write-Host "Starting React Analytics Dashboard (Port 4300)..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/c", "npm run dev" -WorkingDirectory "$baseDir\frontend\react-analytics" -NoNewWindow

Write-Host "Starting Angular Main Portal (Port 4200)..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/c", "npx ng serve" -WorkingDirectory "$baseDir\frontend\angular-portal" -NoNewWindow

Write-Host "`nAll processes successfully booted!" -ForegroundColor Green
Write-Host " - Eureka Dashboard: http://localhost:8761" -ForegroundColor Green
Write-Host " - Angular Main Portal: http://localhost:4200" -ForegroundColor Green
Write-Host " - React Analytics: http://localhost:4300" -ForegroundColor Green
Write-Host " - API Gateway: http://localhost:8080" -ForegroundColor Green

while ($true) { Start-Sleep -Seconds 10 }
