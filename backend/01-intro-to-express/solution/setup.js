import { exec } from "child_process";
import fs from "fs";

console.log("🔧 Running setup...");

if (!fs.existsSync("package.json")) {
  console.error(
    "❌ No package.json found. Please run this script inside the 'starter' folder.",
  );
  process.exit(1);
}

const install = exec("npm install");

install.stdout.on("data", (data) => process.stdout.write(data));
install.stderr.on("data", (data) => process.stderr.write(data));

install.on("exit", (code) => {
  if (code === 0) {
    console.log("✅ Dependencies installed successfully!");

    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    if (pkg.scripts && pkg.scripts.dev) {
      console.log("🚀 Starting dev server (npm run dev)...");
      const dev = exec("npm run dev");

      dev.stdout.on("data", (data) => process.stdout.write(data));
      dev.stderr.on("data", (data) => process.stderr.write(data));

      dev.on("exit", (devCode) => {
        if (devCode !== 0) {
          console.error("❌ Dev server failed to start.");
        }
      });
    } else {
      console.log("ℹ️ No 'dev' script found in package.json. Setup complete.");
    }
  } else {
    console.error("❌ Failed to install dependencies.");
  }
});
