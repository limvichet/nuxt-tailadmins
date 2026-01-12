<p align="center">
  <img width=150 src="./app/assets/imgs/1EZ_LOGO_FULL.svg" alt="1EZ Logo" />
</p>

# School Platform Website

This website is created using [Nuxt.js](https://nuxt.com/docs/getting-started/introduction)

## Setup

Install dependencies:

```bash
npm install
```

> [!NOTE]
> Fill these values in `.env` file:
>
> - `NUXT_API_BASE_URL` with API base URL
> - `NUXT_PUBLIC_SITE_URL` with production domain
> - `NUXT_SECRET_KEY` with secret key for encryption. You can generate it by running `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Development Server

Start the development server on <http://localhost:3000>:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```
