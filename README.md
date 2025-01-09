# ScrollBooks

![](https://drive.google.com/uc?id=1Dclyg8JOIeuSPnxN33ojY7TOnKG9mdsP)

This project consists of a backend API, frontend, and associated services. It uses Docker Compose to run the services including the API, Celery Beat, Celery Worker, Redis, PostgreSQL, and the frontend application.

## Backend

The backend consists of an API developed using Django and is integrated with several services for background tasks, caching, and database management.

### Technologies Used:

- Django (Backend Framework)
- Django REST Framework (API endpoints)
- Celery (Asynchronous task management)
- Redis (Message broker for Celery)
- PostgreSQL (Database)

### Services

- **API**: The main backend service exposing endpoints.
- **Celery Beat**: A service to schedule periodic tasks.
- **Celery Worker**: A service to handle background tasks.
- **Redis**: Used as the broker for Celery.
- **PostgreSQL**: Used as the database for the backend.

## Frontend

> **Note:** The frontend is still under development, and is not yet completed.

### Technologies Used:

- React.js (Frontend)
- Docker (For containerization)
- Tailwind CSS (For styling)

## Local setup

1. Create the necessary docker network by running the following command:

   ```bash
   docker network create scrollbooks-network
   ```

2. Create file `.env` and add environment values (see `.env.example`)

3. Run the following command to build and run containers:

   ```bash
   docker-compose up --build
   ```

4. Confirm that all services are running.

5. You should be access the django app on the following url:

   ```url
   http://localhost:8000
   ```

6. You should be able to access the frontend app on the following url:

   ```url
   http://localhost:3000
   ```

---

## Local development

1. In the project root directory, run `pre-commit install` to install precommit hooks. If you don't have `pre-commit` installed, run `pip install pre-commit` first or see [pre-commit documentation](https://pre-commit.com/#install) for homebrew and other installation methods.

## To add a new backend dependency

Run:

```bash
docker-compose run --rm api poetry add --lock <dependency_name>
```

or if it's a dev dependency, run:

```bash
docker-compose run --rm api poetry add --dev --lock <dependency_name>
```

> NOTE: After adding a new dependency, you need to rebuild the containers

## To add a new frontend dependency

Make sure the project is running and then run:

```bash
docker-compose exec frontend npm install <dependency_name>
```

or if it's a dev dependency, run:

```bash
docker-compose exec frontend npm install --save-dev <dependency_name>
```
