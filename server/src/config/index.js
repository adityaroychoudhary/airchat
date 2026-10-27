import dotenv from "dotenv";

dotenv.config({
  path: "./src/config/.env",
});

export const config = {
  port: process.env.PORT || 3000,
  clientUrl: process.env.CLIENT_URL || "https://airchat.localhost",
  mongoUri: process.env.MONGO_URI,
  clerkWebhookSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
  imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY,
};

export const corsConfig = {
  // Portless serves the Vite dev app at this origin; keep the configured
  // deployment origin too so the same server config works in production.
  origin: [config.clientUrl, "https://airchat.local"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  exposedHeaders: ["X-Custom-Total-Count"],
};
