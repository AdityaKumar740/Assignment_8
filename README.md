# Community Connect

Community Connect is a full-stack volunteer event platform built with Next.js. It helps community members discover local opportunities, join volunteer events, create and manage events, and view their activity through a personal profile.

**Live frontend:** https://assignment-8-taupe-five.vercel.app/

**Live API server:** https://assignment-8-server-mu.vercel.app/

## Features

- Browse upcoming community events
- Search events by title
- Filter events by category
- View complete event details
- Join or leave volunteer events
- Create a new community event
- Edit or delete events created by the signed-in user
- View events joined by the current user
- Sign up and sign in with email and password
- Continue with Google authentication
- View a signed-in user's profile
- Switch between light and dark themes
- Access protected pages through authenticated routes
- Responsive layouts for desktop and mobile devices

## Pages

| Route | Description | Access |
| --- | --- | --- |
| `/` | Home page, featured events, community information, and gallery | Public |
| `/events` | Searchable and filterable event listing | Public |
| `/events/[id]` | Event details and join/leave controls | Public details |
| `/login` | Email/password and Google sign-in | Public |
| `/register` | Account registration | Public |
| `/create-event` | Create a new volunteer event | Protected |
| `/manage-events` | Edit or delete events created by the user | Protected |
| `/joined-events` | View and leave joined events | Protected |
| `/profile` | Display the authenticated user's profile | Protected |

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Better Auth
- MongoDB
- JWT authentication
- React Hook Form
- Zod
- Lucide React
- Sonner notifications
- Vercel

## Event API

The Next.js frontend communicates with a separate Express-style event service. The API base URL is configured with `NEXT_PUBLIC_API_URL`.

Example backend endpoints used by the application include:

- `GET /events`
- `GET /events/:id`
- `POST /create-event`
- `POST /events/:id/join`
- `POST /events/:id/leave`
- `PATCH /events/:id`
- `DELETE /events/:id`

The application also includes default demo events when the external service is unavailable or when an API response does not contain a local demo event.

## Authentication

Authentication is handled by Better Auth with:

- Email and password registration
- Email and password sign-in
- Google social login
- JWT plugin support
- MongoDB session storage
- Protected-route middleware
- Trusted production origin validation

## Environment Variables

Create a `.env.local` file in the project root:

```env
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

MONGO_URI=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_API_URL=http://localhost:5000
```

For deployment, set `BETTER_AUTH_URL` to the public frontend URL, such as:

```env
BETTER_AUTH_URL=https://assignment-8-taupe-five.vercel.app
```

Set `NEXT_PUBLIC_API_URL` to the public event API URL:

```env
NEXT_PUBLIC_API_URL=https://assignment-8-server-mu.vercel.app
```

Never commit real secrets, database credentials, or OAuth client secrets to source control.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB database
- A deployed or locally running event API
- Google OAuth credentials if Google sign-in is enabled

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AdityaKumar740/Assignment_8.git
   cd Assignment_8
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` and add the required environment variables.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000.

## Available Scripts

```bash
npm run dev      # Start the Next.js development server
npm run build    # Create a production build
npm run start    # Start the production server
npm run lint     # Run ESLint
```

## Project Structure

```text
src/
  app/
    api/
      auth/[...all]/route.ts  # Better Auth API handler
      events/                 # Frontend event API proxy routes
    create-event/             # Event creation page
    events/                   # Event listing and details
    joined-events/            # Joined events dashboard
    login/                    # Login page
    manage-events/            # Organizer management dashboard
    profile/                  # User profile page
    register/                 # Registration page
    globals.css               # Tailwind CSS and theme variables
    layout.tsx                # Global layout
  components/
    navbar.tsx
    footer.tsx
    private-route.tsx
    ui/                       # Reusable interface components
  lib/
    auth.ts                   # Better Auth server configuration
    auth-client.ts            # Better Auth client configuration
    auth-provider.tsx         # Authentication React context
    api-events.ts             # Frontend event API helpers
    events.ts                 # Demo event data and event types
  proxy.ts                    # Protected-route redirect middleware
```

## Deployment

The frontend and authentication routes can be deployed as a Next.js Vercel project. The external event API is deployed separately.

Configure both projects with matching public URLs:

- Frontend: `https://assignment-8-taupe-five.vercel.app`
- Event API: `https://assignment-8-server-mu.vercel.app`

When deploying the frontend, also add the frontend URL and any required preview URLs to Better Auth trusted origins.

## License

This project was developed for educational and assignment purposes.
