# OpenLoyalty Docker Setup (Symfony 4.4+ Migration)

This document describes how to run the migrated OpenLoyalty application using Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available for Docker

## Quick Start

### Development Environment

1. **Start the development environment:**
   ```bash
   docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml up -d
   ```

2. **Access the application:**
   - Backend API: http://localhost:8181
   - Frontend: http://localhost:8182
   - PgAdmin: http://localhost:8889 (admin@openloyalty.com / admin123)
   - MailHog: http://localhost:8186
   - Elasticsearch: http://localhost:9200

3. **Run database migrations:**
   ```bash
   docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml exec backend bin/console doctrine:migrations:migrate
   ```

### Production Environment

1. **Start the production environment:**
   ```bash
   docker-compose -f docker-compose.migrated.yml -f docker-compose.prod.yml up -d
   ```

## Configuration Files

### `docker-compose.migrated.yml`
Base configuration with all services defined.

### `docker-compose.dev.yml`
Development overrides:
- Volume mounts for live code editing
- Debug mode enabled
- Cache and logs volumes for persistence
- Development-specific commands

### `docker-compose.prod.yml`
Production overrides:
- Optimized builds
- No debug mode
- Minimal volume mounts
- Production-specific commands

## Services

### Backend (Symfony 4.4+)
- **Image:** Custom PHP 7.4 + Apache
- **Port:** 8181
- **Features:** Symfony 4.4, PHP 7.4, Apache, Composer

### Frontend
- **Image:** Custom Node.js
- **Ports:** 8182, 8183, 8184
- **Features:** Angular.js application

### Database (PostgreSQL 17)
- **Image:** postgres:17
- **Port:** 5432
- **Database:** openloyalty
- **Credentials:** openloyalty/openloyalty

### PgAdmin
- **Image:** dpage/pgadmin4:latest
- **Port:** 8889
- **Credentials:** admin@openloyalty.com / admin123

### Elasticsearch 7.17
- **Image:** elasticsearch:7.17.0
- **Port:** 9200
- **Features:** Single-node setup, security disabled

### MailHog
- **Image:** mailhog/mailhog:latest
- **Ports:** 8186 (web), 8187 (SMTP)
- **Features:** Email testing and debugging

### Redis 7
- **Image:** redis:7-alpine
- **Port:** 6379
- **Features:** Caching and session storage

## Environment Variables

### Backend
- `APP_ENV`: Environment (dev/prod)
- `DATABASE_URL`: PostgreSQL connection string
- `SYMFONY_DEBUG`: Debug mode (0/1)

### Database
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password

### PgAdmin
- `PGADMIN_DEFAULT_EMAIL`: Admin email
- `PGADMIN_DEFAULT_PASSWORD`: Admin password
- `PGADMIN_CONFIG_SERVER_MODE`: Server mode

## Volumes

### Development
- `backend_vendor`: Composer dependencies
- `backend_cache`: Symfony cache
- `backend_logs`: Application logs
- `postgres_data`: Database data
- `elasticsearch_data`: Search index data
- `redis_data`: Cache data

### Production
- `backend_uploads`: File uploads
- `backend_translations`: Translation files
- `postgres_data`: Database data
- `elasticsearch_data`: Search index data
- `redis_data`: Cache data

## Common Commands

### Development
```bash
# Start development environment
docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml logs -f backend

# Execute commands in backend container
docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml exec backend bin/console cache:clear

# Stop all services
docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml down
```

### Production
```bash
# Start production environment
docker-compose -f docker-compose.migrated.yml -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.migrated.yml -f docker-compose.prod.yml logs -f backend

# Stop all services
docker-compose -f docker-compose.migrated.yml -f docker-compose.prod.yml down
```

## Troubleshooting

### Memory Issues
If you encounter memory issues with Elasticsearch:
1. Increase Docker memory limit to at least 4GB
2. Adjust ES_JAVA_OPTS in the elk service

### Permission Issues
If you encounter permission issues:
```bash
docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml exec backend chown -R www-data:www-data /var/www/ol/backend/var
```

### Database Connection Issues
1. Ensure PostgreSQL container is running
2. Check database credentials
3. Verify network connectivity

### Cache Issues
Clear Symfony cache:
```bash
docker-compose -f docker-compose.migrated.yml -f docker-compose.dev.yml exec backend bin/console cache:clear
```

## Migration Notes

This Docker setup has been updated for the Symfony 4.4+ migration:

- **PHP Version:** Upgraded to 7.4
- **Symfony Version:** Upgraded to 4.4+
- **Elasticsearch:** Upgraded to 7.17.0
- **PostgreSQL:** Upgraded to 17
- **Redis:** Added for caching
- **Removed:** Broadway dependencies (replaced with custom repositories)

## Security Notes

- Default passwords are used for development only
- Change all passwords in production
- Consider using Docker secrets for sensitive data
- Enable Elasticsearch security in production 