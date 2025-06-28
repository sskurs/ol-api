#!/bin/bash

# OpenLoyalty Docker Setup Script (Symfony 4.4+ Migration)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_status "Docker is running"
}

# Function to start development environment
start_dev() {
    print_status "Starting development environment..."
    docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml up -d
    print_status "Development environment started!"
    print_status "Access points:"
    echo "  - Backend API: http://localhost:8181"
    echo "  - Frontend: http://localhost:8182"
    echo "  - PgAdmin: http://localhost:8889 (admin@openloyalty.com / admin123)"
    echo "  - MailHog: http://localhost:8186"
    echo "  - Elasticsearch: http://localhost:9200"
}

# Function to stop all services
stop_all() {
    print_status "Stopping all services..."
    docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml down 2>/dev/null || true
    docker-compose -f docker-compose.migrated.yml -f docker-compose.prod.yml down 2>/dev/null || true
    print_status "All services stopped!"
}

# Function to show logs
show_logs() {
    local service=${1:-backend}
    print_status "Showing logs for $service..."
    docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml logs -f "$service"
}

# Function to run migrations
run_migrations() {
    print_status "Running database migrations..."
    docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml exec backend bin/console doctrine:migrations:migrate --no-interaction
    print_status "Migrations completed!"
}

# Function to clear cache
clear_cache() {
    print_status "Clearing Symfony cache..."
    docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml exec backend bin/console cache:clear
    print_status "Cache cleared!"
}

# Function to show help
show_help() {
    echo "OpenLoyalty Docker Setup Script (Symfony 4.4+ Migration)"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment"
    echo "  stop        Stop all services"
    echo "  logs [SVC]  Show logs (default: backend)"
    echo "  migrate     Run database migrations"
    echo "  cache       Clear Symfony cache"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev              # Start development environment"
    echo "  $0 logs frontend    # Show frontend logs"
}

# Main script logic
case "${1:-help}" in
    dev)
        check_docker
        start_dev
        ;;
    stop)
        stop_all
        ;;
    logs)
        show_logs "$2"
        ;;
    migrate)
        run_migrations
        ;;
    cache)
        clear_cache
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 