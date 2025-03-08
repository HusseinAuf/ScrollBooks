cat <<EOL >> .env
# General settings
SECRET_KEY=$SECRET_KEY
DEBUG=$DEBUG
DJANGO_SUPERUSER_EMAIL=$DJANGO_SUPERUSER_EMAIL
DJANGO_SUPERUSER_PASSWORD=$DJANGO_SUPERUSER_PASSWORD
JWT_SECRET_KEY=$JWT_SECRET_KEY
DJANGO_ENV=$DJANGO_ENV

# Domains and URLs
API_ROOT_URL=$API_ROOT_URL
WEB_ROOT_URL=$WEB_ROOT_URL
API_HOSTNAME=$API_HOSTNAME
WEB_HOSTNAME=$WEB_HOSTNAME

# Database
POSTGRES_HOST=$POSTGRES_HOST
POSTGRES_PORT=$POSTGRES_PORT
POSTGRES_DB=$POSTGRES_DB
POSTGRES_USER=$POSTGRES_USER
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@db:$POSTGRES_PORT/$POSTGRES_DB

# Redis
REDIS_URL=$REDIS_URL

# Emails
IS_SEND_EMAIL_ENABLED=$IS_SEND_EMAIL_ENABLED
EMAIL_HOST=$EMAIL_HOST
EMAIL_USE_TLS=$EMAIL_USE_TLS
EMAIL_PORT=$EMAIL_PORT
EMAIL_HOST_USER=$EMAIL_HOST_USER
EMAIL_HOST_NAME=$EMAIL_HOST_NAME
EMAIL_HOST_PASSWORD=$EMAIL_HOST_PASSWORD
EMAIL_BACKEND=$EMAIL_BACKEND

# Stripe
STRIPE_PUBLIC_KEY=$STRIPE_PUBLIC_KEY
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY

# React
VITE_API_ROOT_URL=$VITE_API_ROOT_URL
VITE_WEB_ROOT_URL=$VITE_WEB_ROOT_URL
EOL
