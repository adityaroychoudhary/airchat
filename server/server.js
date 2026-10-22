import { config } from "./src/config/index.js";
import { app } from "./index.js"
import { connectDB } from "./src/lib/db.js";

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true })
})

app.listen(config.port, () => {
  connectDB()
  console.log(`Server is running on port: ${config.port}`)
})
