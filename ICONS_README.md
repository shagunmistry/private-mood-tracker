# PWA Icons Setup

The app currently has an SVG icon at `/public/icon.svg`. To complete the PWA setup, you need to generate PNG icons.

## Quick Setup (Recommended)

Use an online tool or the following command:

```bash
# Install sharp for image conversion
npm install -D sharp-cli

# Generate icons (if you have sharp-cli)
npx sharp-cli -i public/icon.svg -o public/icon-192x192.png resize 192 192
npx sharp-cli -i public/icon.svg -o public/icon-512x512.png resize 512 512
```

## Alternative: Use Online Tools

1. Go to [RealFaviconGenerator](https://realfavicongenerator.net/) or [Favicon.io](https://favicon.io/)
2. Upload `public/icon.svg`
3. Download the generated icons
4. Place `icon-192x192.png` and `icon-512x512.png` in the `public/` directory

## Or Create Custom Icons

You can replace `/public/icon.svg` with your own custom design and then generate PNG versions.

The manifest.json already references these icon files:
- `/icon-192x192.png` (192x192 pixels)
- `/icon-512x512.png` (512x512 pixels)
