/*
 *  Method: Color.info(RGB/16)
 *  return object | false
 *  object is 6item:
 *  '16'
 *  complementary16
 *  reversal16
 *  rgb
 *  complementaryRgb
 *  reversalRgb
 *
 *  Create 2014.11.16 Takenori Kawakami
 *
 *  Repair 2014.11.22 Takenori Kawakami
 *  add " v = v.toLowerCase(); " in getRgb function
 *
 *  Typo 2015.12.13 Takenori Kawakami
 *  from 'Kawaakmi' to 'Kawakami'
 *
 * Bugfix 2026.11.23
 *
 */

const Color = (() => {
  const color = {}

  function getRgb(v) {
    if (typeof v !== 'string') return undefined

    v = v.trim().toLowerCase()

    let r, g, b

    // HEX形式
    if (/^#?([0-9a-f]{3}|[0-9a-f]{6})$/.test(v)) {
      let hex = v.replace('#', '')

      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('')
      }

      r = parseInt(hex.slice(0, 2), 16)
      g = parseInt(hex.slice(2, 4), 16)
      b = parseInt(hex.slice(4, 6), 16)
    } else {
      // RGB形式（255,0,0）
      const rgb = v.split(',').map(s => s.trim())

      if (
        rgb.length !== 3 ||
        rgb.some(s => !/^\d+$/.test(s))
      ) {
        return undefined
      }

      ;[r, g, b] = rgb.map(Number)
    }

    if ([r, g, b].some(n => n < 0 || n > 255)) {
      return undefined
    }

    const hex = [r, g, b]
      .map(n => n.toString(16).padStart(2, '0'))
      .join('')

    return {
      '16': '#' + hex,
      rgb: `${r},${g},${b}`
    }
  }

  function getComplementary(r, g, b) {
    const complement = Math.max(r, g, b) + Math.min(r, g, b)

    return getRgb(`${complement - r},${complement - g},${complement - b}`)
  }

  function getReversal(r, g, b) {
    return getRgb(`${255 - r},${255 - g},${255 - b}`)
  }

  color.info = (v) => {
    const val = getRgb(v)

    if (!val) return undefined

    const [r, g, b] = val.rgb.split(',').map(Number)

    const complementary = getComplementary(r, g, b)
    const reversal = getReversal(r, g, b)

    val.complementary16 = complementary['16']
    val.complementaryRgb = complementary.rgb
    val.reversal16 = reversal['16']
    val.reversalRgb = reversal.rgb

    return val
  }

  return color
})()

