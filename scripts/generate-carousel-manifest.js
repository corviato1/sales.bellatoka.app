const fs = require("fs");
const path = require("path");

const carouselDir = path.join(__dirname, "..", "public", "images", "carousel");
const extensions = [".jpg", ".jpeg", ".png", ".webp"];

const files = fs
  .readdirSync(carouselDir)
  .filter((file) => extensions.includes(path.extname(file).toLowerCase()))
  .sort();

fs.writeFileSync(
  path.join(carouselDir, "manifest.json"),
  JSON.stringify(files, null, 2)
);

console.log(`Carousel manifest: ${files.length} images found`);
