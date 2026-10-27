# AirChat

AirChat is a real-time, one-to-one messaging app. Users sign in with Clerk, browse other registered users, start conversations, and exchange text messages, images, and videos. The chat interface also includes online status, theme controls, and customizable wallpapers.

## Features

- Clerk authentication with server-verified API requests
- User directory and conversation list
- Real-time message delivery and online status with Socket.IO
- Text, image, and video messages
- ImageKit media uploads and optimized image/video display
- Light and dark themes, theme presets, and selectable wallpapers
- Responsive React chat interface

## Technology

| Area | Technologies |
| --- | --- |
| Client | React 19, Vite, React Router, HeroUI, Tailwind CSS, Zustand, Axios |
| Authentication | Clerk React SDK and Clerk Express SDK |
| Server | Node.js, Express 5, Socket.IO |
| Database | MongoDB with Mongoose |
| Media | ImageKit, Multer |
| Deployment | Docker multi-stage build; Express serves the built client from `server/public` |

## Project layout

```text
.
├── client/                 # React application
│   └── src/
│       ├── components/     # Authentication and chat UI
│       ├── context/        # Theme and wallpaper state
│       ├── hooks/          # Conversation and UI hooks
│       └── store/          # Zustand auth and chat stores
├── server/                 # Express API and Socket.IO server
│   ├── src/
│   │   ├── config/         # Environment configuration
│   │   ├── controllers/    # API handlers
│   │   ├── middleware/     # Authentication and media upload
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── webhooks/       # Clerk webhook handler
│   ├── index.js            # Express middleware and routes
│   └── server.js           # Database and HTTP startup
└── Dockerfile
```

## Requirements

- Node.js 22 or newer
- npm
- A MongoDB database
- A Clerk application
- An ImageKit account for image and video uploads

## Local development

### 1. Configure Clerk in the client

Create or update `client/.env`:

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

Use the publishable key from the same Clerk application as the server keys.

### 2. Configure the server

Create `server/src/config/.env`:

```dotenv
PORT=3000
CLIENT_URL=https://airchat.localhost
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_WEBHOOK_SIGNING_SECRET=whsec_your_webhook_signing_secret
IMAGEKIT_PRIVATE_KEY=private_your_imagekit_key
NODE_ENV=development
```

Keep secret keys out of source control. `CLERK_WEBHOOK_SIGNING_SECRET` is used to verify Clerk webhook requests. The app can create a user profile on that user’s first authenticated API request; a webhook endpoint is also available at `/api/webhooks/clerk` for profile updates and deletions.

### 3. Install dependencies

From the repository root:

```bash
cd server
npm install

cd ../client
npm install
```

### 4. Start the services

In one terminal, start the API and Socket.IO server:

```bash
cd server
npm run dev
```

In a second terminal, start the Vite client:

```bash
cd client
npm run dev
```

The API listens on port `3000` by default. The client development script uses Portless; use the local URL it prints. The configured `CLIENT_URL` and CORS allowlist should match the client origin used in development.

## API overview

All API endpoints are under `/api`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check (`/health` on the server) |
| `GET` | `/api/auth/check` | Resolve the signed-in app user |
| `GET` | `/api/messages/users` | List other registered users |
| `GET` | `/api/messages/conversations` | List users with message history |
| `GET` | `/api/messages/:id` | Load messages with a user |
| `POST` | `/api/messages/send/:id` | Send text or media to a user |
| `POST` | `/api/webhooks/clerk` | Receive verified Clerk user events |

Protected endpoints expect a Clerk session token. Media uploads use the multipart field name `media` and accept image or video files.

## Useful scripts

Client (`client/`):

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

Server (`server/`):

```bash
npm run dev
npm start
npm run build
```

## Docker

The root Dockerfile builds the client and copies its output into the server image. Pass the Clerk publishable key as a build argument and provide server environment variables when running the container:

```bash
docker build --build-arg VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key -t airchat .
docker run --env-file server/src/config/.env -p 3000:3000 airchat
```

The container listens on the server's configured `PORT` (3000 by default). Ensure your deployment maps that port and provides a persistent MongoDB URI and the required Clerk and ImageKit credentials.
