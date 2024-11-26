# Django-React Boilerplate: Usage

## Local setup

Check out the [README](README.md) for local setup instructions.

---

## Pre-deployment:

- Clone this repo into your account/group.
- Clone the new repo into your local machine.
- Rename every instance of in this repository of `exampleapp` to your project name.
- Press `Ctrl + Shift + F` (in VSCode) to search for all instances of `exampleapp` in the repository.
- Duplicate `.env.example` and rename it to `.env` and fill in the values accordingly. (Probably you won't need to change anything)
- In the backend copy in your apps folders in `backend/api` and add them into the `INSTALLED_APPS` list in `backend/api/api/settings/default.py`.
- In the frontend copy in your project code in `frontend/src` and update `frontend/package.json` accordingly.
  - `REACT_APP_API_ROOT_URL` is already in the environment variables and is available in the react project.
- Push your changes to your repository. (The pipeline will fail, but that's okay)

---

## Deployment: Digital Ocean

### Production:

- Create a new docker droplet from the marketplace [here](https://marketplace.digitalocean.com/apps/docker)
- General Purpose droplet plan is suitable for most use prodcution use cases.
- Choose an appropriate region.
- **[CRUCIAL]** Make sure to select Authentication with SSH keys.
  - Check out [this](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/) to create a new SSH key.
- Add the SSH public key to the droplet.
- Enable Monitoring option.
- Make sure to select a representative hostname.
- Make sure to assign the droplet to the appropriate project.

### Staging:

Same as production, but you might choose a smaller droplet plan, and you **should** create a different SSH key.

---

## Deployment: Namecheap/ or your DNS registrar of choice

Will be using `exampleapp.example` to demonstrate the steps.
Advanced DNS settings for Namecheap can be found at: namecheap.com/Domains/DomainControlPanel/**exampleapp.example**/advancedns

### Production:

- Create a new A record for your domain with host `@` and Value of the **production** droplet IP address. (This is the root domain, will lead to the project frontend)
- Create a new A record for your domain with host `api` and Value of the **production** droplet IP address. (This is a subdomain `api.exampleapp.example`, will lead to the project backend)

### Staging:

- Create a new A record for your domain with host `staging` and Value of the **staging** droplet IP address. (This is the staging root domain `staging.exampleapp.example`, will lead to the project frontend)
- Create a new A record for your domain with host `api.staging` and Value of the **staging** droplet IP address. (This is a subdomain `api.staging.exampleapp.example`, will lead to the project backend)

NGINX is already configured to serve the frontend on the root domain, and the backend on the subdomain `api`. Found at [docker-compose.prod.yml](docker-compose.prod.yml) nginx service. It is also configured with Let's Encrypt self-signed certificates, and is automatically renewed.

In the case of email setup, you'd create a few MX and TXT records for your domain. Depending on your email provider (Google workspace, Sendgrid, etc), you'd have to follow their instructions to setup the records.

---

## Gitlab setup

### Creating Envrionments:

Create two gitlab environments at `https://gitlab.com/your-group/your-repo/-/environments`: `production` and `staging`.

> ![create-environment](template-usage/create-environment.png)

### Setting up CI/CD variables:

- Setup CI/CD variables in your repo settings `https://gitlab.com/your-group/your-repo/-/settings/ci_cd`
- Add everything from `.env.example` to your repo's CI/CD variables, and fill in the values accordingly.
- Values with URLs that should be updated to your domain with environment set as `All`:

  - DJANGO_SUPERUSER_EMAIL
  - EMAIL_HOST_USER
  - EMAIL_SENDER

- Values that should be updated to your domain for production environment:

  - API_HOSTNAME: `api.exampleapp.example`
  - API_ROOT_URL: `https://api.exampleapp.example`
  - WEB_HOSTNAME: `exampleapp.example`
  - WEB_ROOT_URL: `https://exampleapp.example`
  - INSTANCE_IP: `111.111.111.111`
  - SSH_PRIVATE_KEY: `-----BEGIN OPENSSH PRIVATE KEY-----...` (THE SSH private key that you used to create the droplet of the environment)

- Values that should be updated to your domain for staging environment:

  - API_HOSTNAME: `api.staging.exampleapp.example`
  - API_ROOT_URL: `https://api.staging.exampleapp.example`
  - WEB_HOSTNAME: `staging.exampleapp.example`
  - WEB_ROOT_URL: `https://staging.exampleapp.example`
  - INSTANCE_IP: `222.222.222.222`
  - SSH_PRIVATE_KEY: `-----BEGIN OPENSSH PRIVATE KEY-----...` (THE SSH private key that you used to create the droplet of the environment)

- Values that need changing if needed (environment set as `All`):
  - POSTGRES_DB
  - EMAIL_HOST_PASSWORD
  - JWT_SECRET_KEY
  - DJANGO_SUPERUSER_USERNAME
  - DJANGO_SUPERUSER_PASSWORD

> ![cicd-variable-environment](template-usage/cicd-variable-environment.png)

### Setting up branches:

Setup the default branch to `staging` in your repo settings `https://gitlab.com/your-group/your-repo/-/settings/repository`

Setup protected branches in your repo settings
Add `main` and `staging` as protected branches, with the following settings:

- Allow to merge: `Maintainers`
- Allow to push: `No one`
- Allowed to force push: `No one`

### Triggering the pipeline:

- Push to the `main` branch to trigger the pipeline for the `production` environment.
- Push to the `staging` branch to trigger the pipeline for the `staging` environment.

---

## Post deployment

- Remove the folder `template-usage` from the project and this `USAGE.md` file.
- Push your changes to your repository (MR to `main` branch).
