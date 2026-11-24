FROM python:3.12-slim-bookworm AS builder


# forces Python stdout/stderr to be unbuffered (real-time logs)
ENV PYTHONUNBUFFERED=1 \
    # prevents .pyc files from being written
    PYTHONDONTWRITEBYTECODE=1 \
    # disables pip cache to reduce image size
    PIP_NO_CACHE_DIR=on \
    # tells Poetry to create the .venv inside the current working directory, instead of storing it in a global cache location.
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_HOME="/opt/poetry" \
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/pysetup/.venv"

# apt-get update: does not install or upgrade anything — it only updates the local “catalog” of what packages are available and their versions.
RUN apt-get update \
    # -y: Automatically answers “yes” to prompts.
    # --no-install-recommends: keep install minimal and lightweight
    && apt-get install -y --no-install-recommends \
        curl \
        python3-dev \
        # PostgreSQL development headers (needed for psycopg2 build)
        libpq-dev \
        # compiler tools (gcc, make, etc.) for building native extensions
        build-essential \
    # clean up package lists to reduce image size
    && rm -rf /var/lib/apt/lists/*

# -sSL: silent + show errors + follow redirects
RUN curl -sSL https://install.python-poetry.org | python3 -

ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

WORKDIR $PYSETUP_PATH

COPY poetry.lock pyproject.toml ./

ARG ENV_MODE="production"

# --no-root: install dependencies only, not your project as an importable Python package.
# --sync: Makes the environment exactly match poetry.lock
RUN if [ "$ENV_MODE" = "development" ]; then \
      poetry install --no-root --with dev --sync; \
    else \
      poetry install --no-root --only main --sync; \
    fi

# ---- final stage ----
FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    POETRY_HOME="/opt/poetry" \
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/pysetup/.venv"

ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        # PostgreSQL client libraries (needed for psycopg2 runtime)
        libpq5 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder $POETRY_HOME $POETRY_HOME
COPY --from=builder $PYSETUP_PATH $PYSETUP_PATH

WORKDIR /home/scrollbooks

COPY ./ ./

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# --reload is overridden in docker-compose for local development
CMD ["uvicorn", "api.asgi:application", "--host", "0.0.0.0", "--port", "8000"]


# ├── bin/
# ├── etc/
# ├── lib/
# ├── usr/
# │   ├── bin/
# │   └── local/
# │       ├── bin/
# │       │   ├── python
# │       │   ├── pip
# │       │   └── entrypoint.sh      # ← script
# │       └── lib/
# │
# ├── opt/
# │   ├── poetry/                   # ← Poetry installation
# │   │   ├── bin/
# │   │   │   └── poetry
# │   │   └── ...
# │   │
# │   └── pysetup/                  # ← dependency layer
# │       ├── pyproject.toml
# │       ├── poetry.lock
# │       └── .venv/                # ← virtual environment (VERY IMPORTANT)
# │           ├── bin/
# │           │   ├── python
# │           │   ├── uvicorn
# │           │   └── ...
# │           ├── lib/
# │           │   └── python3.12/
# │           │       └── site-packages/
# │           │           ├── fastapi/
# │           │           ├── psycopg2/
# │           │           └── all deps...
# │           └── ...
# │
# ├── home/
# │   └── scrollbooks/              # ← app code
# │
# ├── var/
# └──
