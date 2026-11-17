/**
 * Turbopack (Next 15.5.x) may request server-external-packages.jsonc while the
 * published package only ships .json — common after a partial/corrupt install.
 */
const fs = require('fs');
const path = require('path');

const paths = [
  'node_modules/next/dist/lib/server-external-packages.json',
  'node_modules/next/dist/esm/lib/server-external-packages.json',
];

for (const jsonPath of paths) {
  const abs = path.join(__dirname, '..', jsonPath);
  const jsoncPath = abs.replace(/\.json$/, '.jsonc');
  if (fs.existsSync(abs) && !fs.existsSync(jsoncPath)) {
    fs.copyFileSync(abs, jsoncPath);
  }
}