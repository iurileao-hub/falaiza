/**
 * Script para gerar ícones PWA da Ouvidoria DF
 * Usa sharp para gerar imagens PNG com o logo simplificado
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Diretório de saída
const OUTPUT_DIR = path.join(__dirname, "..", "public", "icons");

// Tamanhos de ícones necessários
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Cores do Participa DF
const PRIMARY_COLOR = "#192D4B";
const ACCENT_COLOR = "#549250";
const WHITE = "#FFFFFF";

// Criar SVG base com o logo simplificado
function createBaseSvg(size) {
  const fontSize = Math.round(size * 0.35);
  const padding = Math.round(size * 0.15);

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Fundo azul escuro -->
      <rect width="${size}" height="${size}" fill="${PRIMARY_COLOR}" rx="${Math.round(size * 0.15)}"/>

      <!-- Círculo decorativo -->
      <circle cx="${size * 0.5}" cy="${size * 0.35}" r="${size * 0.18}" fill="${ACCENT_COLOR}" opacity="0.9"/>

      <!-- Texto OUV -->
      <text
        x="${size / 2}"
        y="${size * 0.75}"
        font-family="Arial, sans-serif"
        font-size="${fontSize}"
        font-weight="bold"
        fill="${WHITE}"
        text-anchor="middle"
      >OUV</text>

      <!-- Linha decorativa -->
      <rect
        x="${padding}"
        y="${size * 0.85}"
        width="${size - padding * 2}"
        height="${size * 0.03}"
        fill="${ACCENT_COLOR}"
        rx="${size * 0.015}"
      />
    </svg>
  `;
}

// Criar SVG para atalhos
function createShortcutSvg(type) {
  const size = 96;
  const iconColor = type === "new" ? ACCENT_COLOR : "#0062AE";

  const icon = type === "new"
    ? `<path d="M48 20v56M20 48h56" stroke="${WHITE}" stroke-width="8" stroke-linecap="round"/>`
    : `<path d="M30 48h36M30 36h24M30 60h30" stroke="${WHITE}" stroke-width="6" stroke-linecap="round"/>`;

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${iconColor}" rx="16"/>
      ${icon}
    </svg>
  `;
}

async function generateIcons() {
  // Criar diretório se não existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log("🎨 Gerando ícones PWA da Ouvidoria DF...\n");

  // Gerar ícones principais
  for (const size of SIZES) {
    const svg = createBaseSvg(size);
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);

    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);

    console.log(`✓ Gerado: icon-${size}x${size}.png`);
  }

  // Gerar ícones de atalhos
  const shortcuts = [
    { name: "shortcut-new.png", type: "new" },
    { name: "shortcut-track.png", type: "track" }
  ];

  for (const shortcut of shortcuts) {
    const svg = createShortcutSvg(shortcut.type);
    const outputPath = path.join(OUTPUT_DIR, shortcut.name);

    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);

    console.log(`✓ Gerado: ${shortcut.name}`);
  }

  // Gerar favicon.ico (16x16 e 32x32)
  const faviconSvg = createBaseSvg(32);
  await sharp(Buffer.from(faviconSvg))
    .png()
    .toFile(path.join(OUTPUT_DIR, "..", "favicon.png"));
  console.log(`✓ Gerado: favicon.png`);

  // Gerar apple-touch-icon
  const appleSvg = createBaseSvg(180);
  await sharp(Buffer.from(appleSvg))
    .png()
    .toFile(path.join(OUTPUT_DIR, "apple-touch-icon.png"));
  console.log(`✓ Gerado: apple-touch-icon.png`);

  console.log("\n✅ Todos os ícones foram gerados com sucesso!");
  console.log(`📁 Diretório: ${OUTPUT_DIR}`);
}

generateIcons().catch(console.error);
