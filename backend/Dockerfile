FROM python:3.9-slim-buster as build-base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1 \
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/pysetup/.venv"

RUN apt-get update && apt-get install -y \
  curl \
  python3-dev \
  libpq-dev \
  build-essential

RUN curl -sSL https://install.python-poetry.org | python3 -

ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

# Separate docker stage to avoid re-installing poetry & build essentials on every change
FROM build-base as final-stage

WORKDIR $PYSETUP_PATH

COPY poetry.lock ./

COPY pyproject.toml ./

RUN poetry install --no-root --only main --sync

WORKDIR /home/bookstore

COPY ./ ./

COPY entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]


CMD uvicorn api.asgi:application --host 0.0.0.0 --port 8000 \
  --app-dir /home/bookstore/api \
  --reload \
  --reload-dir /home/bookstore/api

EXPOSE 8000
