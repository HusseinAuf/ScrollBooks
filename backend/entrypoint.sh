#!/bin/bash

. $VENV_PATH/bin/activate

poetry run python api/manage.py migrate

poetry run python api/manage.py collectstatic --noinput --clear

# echo "Creating superuser $DJANGO_SUPERUSER_EMAIL with username $DJANGO_SUPERUSER_USERNAME"

# poetry run python api/manage.py createsuperuser --noinput

exec "$@"
