import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

// Simulate __dirname in ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const headers = JSON.stringify(req.headers, null, 2);
  const body =
    req.body && Object.keys(req.body).length > 0
      ? JSON.stringify(req.body, null, 2)
      : "no body";

  const log = `[${timestamp}] ${method} ${url} - Headers: ${headers} - Body: ${body}\n\n`;

  const logPath = path.join(__dirname, "logger.txt");

  fs.appendFile(logPath, log, (err) => {
    if (err) {
      console.error("Failed to write log:", err);
    }
  });

  next();
};

export default logger;
