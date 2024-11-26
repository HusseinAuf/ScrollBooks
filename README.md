# Django-React Boilerplate

This is a boilerplate for a Django-React project. It uses Docker Compose to run the project locally and in production, Poetry for dependency management, npm for frontend dependencies, and pre-commit for linting and testing. It also packs a few django tools like celerybeat and celery worker for scheduled tasks.

# Usage

Check out [USAGE.md](USAGE.md) for more information on how to use this boilerplate.

## Local setup

1. Create the necessary docker network by running the following command:

   ```bash
   docker network create exampleapp-network
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

7. You should be able to access the admin panel on the following url:

   ```url
   http://localhost:8000/admin
   ```

---

## Local development

1. In the project root directory, run `pre-commit install` to install precommit hooks. If you don't have `pre-commit` installed, run `pip install pre-commit` first or see [pre-commit documentation](https://pre-commit.com/#install) for homebrew and other installation methods.

2. If you haven't built the containers yet, run `docker-compose up --build`, or run `docker-compose up` if your contaiers are built.

3. To run a specific service -and the services it depends on- run `docker-compose up <service_name>`

4. To execute a command inside a running service container, run `docker-compose exec <service_name> <command>`, this can be used to access a container's terminal by running `docker-compose exec <service_name> bash`

5. If you want to connect to the DB from a local pgAdmin, make sure that the db service is running, then set host to `localhost` and port to `5345`

6. To run a command inside a inactive container (if you can't run the container due to an error for example), run `docker-compose run <service_name> <command>`

7. When you're done, or if you need to restart your services, run `docker-compose down` or `docker-compose down <service_name>`

8. To clean and rebuild containers run `docker-compose build --no-cache`

9. If you're running this project inside `WSL2` you might face disk space issues, to clear unused container inside your `WSL2` instance, run `docker system prune`

## To add a new backend dependency

Run:

```bash
docker-compose run --rm api poetry add --lock <dependency_name>
```

or if it's a dev dependency, run:

```bash
docker-compose run --rm api poetry add --dev --lock <dependency_name>
```

> NOTE: After adding a new dependency, you need to rebuild the containers: `docker-compose up --build`

## To add a new frontend dependency

Make sure the project is running (step 2) and then run:

```bash
docker-compose exec frontend yarn add <dependency_name>
```

or if it's a dev dependency, run:

```bash
docker-compose exec frontend yarn add --dev <dependency_name>
```

---

## Development workflow

1. To start working on a new Issue, create a gitlab issue and include the Jira issue link as well as any additional information in the issue description.

2. Create a draft merge request for that issue, the created branch is your feature branch.

3. When you're done working on your issue (requirements satesfied, tests added along with any additional tests/docs), mark the MR as ready for review.

---

### Known Issues

1. Faced an issue with pre-commit mypy hook on my M1 mac to fix this issue I updated the version of the hooks by using the following commands:

   ```bash
      pre-commit autoupdate
      pre-commit install
   ```

   If you find any one of the hooks pointing to an alpha version in the .pre-commit-config.yaml file revert it to the latest stable version.

## Useful links

1. [Poetry: Python package and dependency manager](https://python-poetry.org/)
2. [Docker Compose docs](https://docs.docker.com/compose/)
