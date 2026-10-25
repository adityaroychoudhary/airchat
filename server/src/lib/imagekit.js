import ImageKit, { toFile } from "@imagekit/nodejs";
import { config } from "../config/index.js";

const imagekit = new ImageKit({ privateKey: config.imagekitPrivateKey })

function hasImagekitCredentials() {
  return Boolean(config.imagekitPrivateKey)
}

function createFileName(originalName = "upload") {
  const base = (originalName || "upload").split(/[/\\]/).pop()

  const lastDot = base.lastIndexOf(".")
  const hasExt = lastDot > 0 && lastDot < base.length - 1
  const rawName = hasExt ? base.slice(0, lastDot) : base
  const rawExt = hasExt ? base.slice(lastDot + 1) : ""

  const cleanName = rawName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80) || "file"

  const cleanExt = rawExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 10)

  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  return cleanExt
    ? `chat-${uniqueId}-${cleanName}.${cleanExt}`
    : `chat-${uniqueId}-${cleanName}`
}

async function uploadMedia(file) {
  const fileName = createFileName(file.originalname)

  const result = await imagekit.files.upload({
    file: await toFile(file.buffer, fileName, { type: file.mimetype }),
    fileName,
    folder: "/airchatMedia"
  })

  return result.url
}

export { hasImagekitCredentials, uploadMedia }
