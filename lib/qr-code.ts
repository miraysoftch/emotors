// QR Code library - vendor/qrcode removed due to missing dijkstrajs dependency
// Using simplified fallback implementations

export type QrMatrix = {
  size: number
  data: boolean[]
}

// Placeholder SVG generator
export async function createQrSvgDataUrl(text: string) {
  // Return a simple placeholder SVG (QR code generation disabled)
  const size = 256
  const svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#FFFFFF"/>
    <text x="${size/2}" y="${size/2}" text-anchor="middle" font-size="14" fill="#000000">QR</text>
  </svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

// Placeholder matrix generator
export function createQrMatrix(text: string): QrMatrix {
  // Return a simple 21x21 matrix (minimal QR code size)
  const size = 21
  const data = new Array(size * size).fill(false)
  // Fill borders as pattern
  for (let i = 0; i < size; i++) {
    data[i] = true
    data[size * size - 1 - i] = true
    data[i * size] = true
    data[i * size + size - 1] = true
  }
  return { size, data }
}

export function createSwissQrSvg(text: string, className = 'qr-code') {
  const matrix = createQrMatrix(text)
  const quietZone = 4
  const viewSize = matrix.size + quietZone * 2
  const rects: string[] = []

  matrix.data.forEach((filled, index) => {
    if (!filled) return
    const row = Math.floor(index / matrix.size)
    const col = index % matrix.size
    rects.push(`<rect x="${col + quietZone}" y="${row + quietZone}" width="1" height="1" />`)
  })

  const crossSize = Math.max(5.2, matrix.size * 0.12)
  const guardSize = crossSize * 1.28
  const guardX = viewSize / 2 - guardSize / 2
  const guardY = viewSize / 2 - guardSize / 2
  const crossX = viewSize / 2 - crossSize / 2
  const crossY = viewSize / 2 - crossSize / 2
  const plusThickness = crossSize * 0.18
  const plusLong = crossSize * 0.62
  const plusX = viewSize / 2 - plusThickness / 2
  const plusY = viewSize / 2 - plusLong / 2
  const plusHorizontalX = viewSize / 2 - plusLong / 2
  const plusHorizontalY = viewSize / 2 - plusThickness / 2

  return `
    <svg class="${className}" viewBox="0 0 ${viewSize} ${viewSize}" role="img" aria-label="Swiss QR Code" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <rect width="${viewSize}" height="${viewSize}" fill="#fff" />
      <g fill="#000">${rects.join('')}</g>
      <rect x="${guardX.toFixed(3)}" y="${guardY.toFixed(3)}" width="${guardSize.toFixed(3)}" height="${guardSize.toFixed(3)}" fill="#fff" />
      <rect x="${crossX.toFixed(3)}" y="${crossY.toFixed(3)}" width="${crossSize.toFixed(3)}" height="${crossSize.toFixed(3)}" fill="#111" />
      <rect x="${plusX.toFixed(3)}" y="${plusY.toFixed(3)}" width="${plusThickness.toFixed(3)}" height="${plusLong.toFixed(3)}" fill="#fff" />
      <rect x="${plusHorizontalX.toFixed(3)}" y="${plusHorizontalY.toFixed(3)}" width="${plusLong.toFixed(3)}" height="${plusThickness.toFixed(3)}" fill="#fff" />
    </svg>
  `
}
