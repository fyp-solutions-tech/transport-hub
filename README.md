<div align="center">

# Transport Hub

**A modern, full-stack transportation management platform built for the real world.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

> A scalable transportation hub platform with real-time Google Maps integration, secure authentication, and a clean full-stack architecture — built as a Final Year Project.

</div>

---

## ✨ Features

- 🗺️ **Interactive Maps** — Real-time Google Maps integration via `@vis.gl/react-google-maps` for route visualization and location tracking
- 🔐 **Secure Authentication** — Powered by `better-auth` with Google OAuth support and email-based flows
- 📧 **Email Notifications** — Transactional emails via Resend for booking confirmations, alerts, and updates
- 🗄️ **Robust Database** — PostgreSQL with Prisma ORM for type-safe, schema-driven data management
- ⚡ **Blazing Fast** — Built on Next.js 16 with Turbopack and React 19 for a snappy user experience
- 🧩 **Modern UI** — Tailwind CSS v4 + DaisyUI v5 for a polished, responsive interface
- 🧠 **Smart State** — Global state management with Zustand, form validation with Zod
- 🔔 **Toast Notifications** — Beautiful in-app alerts with Sonner

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS v4 + DaisyUI v5 |
| **ORM** | Prisma 7 |
| **Database** | PostgreSQL (via `pg`) |
| **Auth** | better-auth + Google OAuth |
| **Maps** | Google Maps API + `@vis.gl/react-google-maps` |
| **Email** | Resend |
| **State** | Zustand |
| **Validation** | Zod |
| **Notifications** | Sonner |
| **Package Manager** | pnpm |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- [PostgreSQL](https://www.postgresql.org/) database

### 1. Clone the repository

```bash
git clone https://github.com/fyp-solutions-tech/transport-hub.git
cd transport-hub
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .example.env .env.local
```

```env
NEXT_PUBLIC_DATABASE_URL=""          # Your PostgreSQL connection string
BETTER_AUTH_SECRET=""                # A random secret for auth sessions
NEXT_PUBLIC_BETTER_AUTH_URL=""       # Base URL of your app (e.g. http://localhost:3000)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=""      # Google OAuth client ID
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=""  # Google OAuth client secret
NEXT_PUBLIC_AUTH_PROXY_ENABLED=""    # Set to "true" if using an auth proxy
NEXT_PUBLIC_EMAIL_FROM=""            # Sender email address (e.g. noreply@yourdomain.com)
NEXT_PUBLIC_RESEND_API_KEY=""        # Your Resend API key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""   # Your Google Maps API key
```

### 4. Set up the database

```bash
pnpm prisma migrate dev
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

## 📁 Project Structure

```
transport-hub/
├── email/              # Email templates (Resend)
├── prisma/             # Prisma schema & migrations
├── public/             # Static assets
├── src/                # Application source code
│   ├── app/            # Next.js App Router pages & layouts
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utilities, auth config, db client
│   └── ...
├── .example.env        # Environment variable template
├── next.config.ts      # Next.js configuration
├── prisma.config.ts    # Prisma configuration
└── package.json
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret key for auth token signing |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Deployed app base URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth App Client ID |
| `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET` | Google OAuth App Client Secret |
| `NEXT_PUBLIC_AUTH_PROXY_ENABLED` | Enable auth proxy (`true`/`false`) |
| `NEXT_PUBLIC_EMAIL_FROM` | Email sender address |
| `NEXT_PUBLIC_RESEND_API_KEY` | Resend API key for emails |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key |

---

## 🧪 Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |

---

## 🌍 Deployment

The easiest way to deploy is on [Vercel](https://vercel.com/):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=transport-hub)

Make sure to set all environment variables in your Vercel project settings before deploying.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for academic/educational use as a Final Year Project.

---

<div align="center">

Built with ❤️ by [fyp-solutions-tech](https://github.com/fyp-solutions-tech)

</div>
