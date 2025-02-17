#!/bin/bash

. $VENV_PATH/bin/activate

poetry run python api/manage.py migrate

poetry run python api/manage.py collectstatic --noinput --clear

exec "$@"
