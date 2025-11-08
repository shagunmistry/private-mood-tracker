const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const svgPath = path.join(__dirname, "../public/icon.svg");
const publicDir = path.join(__dirname, "../public");

const sizes = [192, 512];

async function generateIcons() {
  console.log("Generating PWA icons...");

  for (const size of sizes) {
    const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);

    try {
      await sharp(svgPath)
        .resize(size, size, {
          fit: "contain",
          background: { r: 99, g: 102, b: 241, alpha: 1 },
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${size}x${size} icon`);
    } catch (error) {
      console.error(`✗ Failed to generate ${size}x${size} icon:`, error.message);
    }
  }

  console.log("Done!");
}

generateIcons();
