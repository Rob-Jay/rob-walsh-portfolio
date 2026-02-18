import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "diagrams");
const outDir = path.join(rootDir, "public", "diagrams-rendered");

async function renderPumlToSvg(pumlSource) {
  return new Promise((resolve, reject) => {
    const req = https.request("https://kroki.io/plantuml/svg", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Length": Buffer.byteLength(pumlSource)
      }
    });

    let data = "";
    req.on("response", (res) => {
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
          return;
        }
        reject(new Error(`Render failed with ${res.statusCode}: ${res.statusMessage}`));
      });
    });

    req.on("error", reject);
    req.write(pumlSource);
    req.end();
  });
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const files = await readdir(sourceDir);
  const pumlFiles = files.filter((file) => file.toLowerCase().endsWith(".puml"));

  if (pumlFiles.length === 0) {
    console.log("No .puml files found in diagrams/.");
    return;
  }

  for (const file of pumlFiles) {
    const sourcePath = path.join(sourceDir, file);
    const puml = await readFile(sourcePath, "utf8");
    const outName = `${path.basename(file, ".puml")}.svg`;
    const outPath = path.join(outDir, outName);
    try {
      const svg = await renderPumlToSvg(puml);
      await writeFile(outPath, svg, "utf8");
      console.log(`Rendered ${file} -> public/diagrams-rendered/${outName}`);
    } catch (error) {
      const safeError = String(error.message || error).replace(/[<>&]/g, "");
      const fallbackSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="280" viewBox="0 0 900 280">
  <rect width="100%" height="100%" fill="#07101a"/>
  <rect x="20" y="20" width="860" height="240" rx="12" fill="#0d1d2b" stroke="#6a95b0"/>
  <text x="40" y="85" fill="#d9eaf5" font-family="Arial, sans-serif" font-size="28">Diagram render failed</text>
  <text x="40" y="130" fill="#8db2ca" font-family="Arial, sans-serif" font-size="20">${file}</text>
  <text x="40" y="170" fill="#8db2ca" font-family="Arial, sans-serif" font-size="16">${safeError}</text>
</svg>`;
      await writeFile(outPath, fallbackSvg, "utf8");
      console.warn(`Fallback generated for ${file}: ${safeError}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
