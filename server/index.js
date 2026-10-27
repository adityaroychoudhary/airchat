import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { config, corsConfig } from "./src/config/index.js";
import clerkWebhook from "./src/webhooks/clerk.webhook.js";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import { app } from "./src/lib/socket.js";

const publicDir = path.join(process.cwd(), "public");

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// CORS and Clerk must run before routes that use Clerk's getAuth().
app.use(cors(corsConfig));
app.use(clerkMiddleware({
  publishableKey: config.clerkPublishableKey,
  secretKey: config.clerkSecretKey,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook,
);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}
