const fs = require("fs");
const path = require("path");

const carouselDir = path.join(__dirname, "..", "src", "media", "carousel");
const extensions = [".jpg", ".jpeg", ".png", ".webp"];

function extractNumber(filename) {
  const match = filename.match(/(\d+)\.[^.]+$/);
  return match ? parseInt(match[1], 10) : 0;
}

const files = fs
  .readdirSync(carouselDir)
  .filter((file) => extensions.includes(path.extname(file).toLowerCase()))
  .sort((a, b) => extractNumber(a) - extractNumber(b));

fs.writeFileSync(
  path.join(carouselDir, "manifest.json"),
  JSON.stringify(files, null, 2)
);

console.log(`Carousel manifest: ${files.length} images found`);
