@echo off
REM OpenLoyalty Docker Setup Script (Symfony 4.4+ Migration)

setlocal enabledelayedexpansion

if "%1"=="" goto help

if "%1"=="dev" goto dev
if "%1"=="stop" goto stop
if "%1"=="logs" goto logs
if "%1"=="migrate" goto migrate
if "%1"=="cache" goto cache
if "%1"=="help" goto help

echo [ERROR] Unknown command: %1
echo.
goto help

:dev
echo [INFO] Starting development environment...
docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml up --build -d
echo [INFO] Development environment started!
echo [INFO] Access points:
echo   - Backend API: http://localhost:8181
echo   - Frontend: http://localhost:8182
echo   - PgAdmin: http://localhost:8889 (admin@openloyalty.com / admin123)
echo   - MailHog: http://localhost:8186
echo   - Elasticsearch: http://localhost:9200
goto end

:stop
echo [INFO] Stopping all services...
docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml down 2>nul
docker-compose -f docker-compose.migrated.yml -f docker-compose.prod.yml down 2>nul
echo [INFO] All services stopped!
goto end

:logs
if "%2"=="" (
    echo [INFO] Showing logs for backend...
    docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml logs -f backend
) else (
    echo [INFO] Showing logs for %2...
    docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml logs -f %2
)
goto end

:migrate
echo [INFO] Running database migrations...
docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml exec backend bin/console doctrine:migrations:migrate --no-interaction
echo [INFO] Migrations completed!
goto end

:cache
echo [INFO] Clearing Symfony cache...
docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml exec backend bin/console cache:clear
echo [INFO] Cache cleared!
goto end

:help
echo OpenLoyalty Docker Setup Script (Symfony 4.4+ Migration)
echo.
echo Usage: %0 [COMMAND]
echo.
echo Commands:
echo   dev         Start development environment
echo   stop        Stop all services
echo   logs [SVC]  Show logs (default: backend)
echo   migrate     Run database migrations
echo   cache       Clear Symfony cache
echo   help        Show this help message
echo.
echo Examples:
echo   %0 dev              # Start development environment
echo   %0 logs frontend    # Show frontend logs
goto end

:end 