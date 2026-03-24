# gwn's simple property management dashboard for Buena

## Project Info

Simple property management dashboard designed for efficiency.

See [the requirement specification](meta/reqspec.md) for the
original project requirements.

See [the technical specification](meta/techspec.md) for the
summary of the tech stack and the reasons behind the choices.


## Dependencies

- PostgreSQL >= v13
- Node, NPM (Find required versions under `package.json/engines`)
- Anthropic API access


## Setup

Node version setup:

Make sure to use the proper Node version. Check out minimum
required version under `package.json/engines`. Example using NVM
and Node version 20:

    nvm use 20

Project setup:

```bash
psql < schema.sql
cp env-example env
$EDITOR env
nvm use
npm i
npm run dev:be
npm run dev:fe
```

Note that a Swagger API documentation is available, see backend
logs for the URL.
