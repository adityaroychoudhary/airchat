import express from "express"
import path from "node:path"
import { config } from "./src/config/index.js";
import { app } from "./index.js"
import { connectDB } from "./src/lib/db.js";
import job from "./src/lib/cron.js";

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true })
})

const publicDir = path.join(process.cwd(), "public")
app.use(express.static(publicDir))
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"))
})

app.listen(config.port, () => {
  connectDB()
  console.log(`Server is running on port: ${config.port}`)

  if (process.env.NODE_ENV === "production") job.start()
})
