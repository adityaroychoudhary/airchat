import { config } from "./src/config/index.js";
import { app } from "./src/index.js"

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`)
})
