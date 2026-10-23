import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { corsConfig } from "./src/config/index.js";
import clerkWebhook from "./src/webhooks/clerk.webhook.js";
import authRoutes from "./src/routes/auth.route.js";

const app = express();

const publicDir = path.join(process.cwd(), "public");

app.use(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook,
);
app.use("/api/auth", authRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsConfig));

app.use(clerkMiddleware());

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

export { app };
