import { config } from "./src/config/index.js";
import { app, server } from "./src/lib/socket.js";
import { connectDB } from "./src/lib/db.js";
import job from "./src/lib/cron.js";
import "./index.js";

server.listen(config.port, () => {
  connectDB()
  console.log(`Server is running on port: ${config.port}`)

  if (process.env.NODE_ENV === "production") job.start()
})
