import express, { urlencoded } from "express"
import cors from "cors"
import { clerkMiddleware } from "@clerk/express"
import { corsConfig } from "./src/config/index.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsConfig))

app.use(clerkMiddleware())

export { app }
