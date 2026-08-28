/**
 * TeleBirr / Ethio Telecom mobile number handling.
 *
 * Accepted shapes, all the same subscriber:
 *   0912 345 678      local
 *   +251912345678     international
 *   251912345678      international, no plus
 *
 * Ethiopian mobile numbers are 9 digits after the country code and start with
 * 9 or 7. Anything else is rejected.
 */
const TELEBIRR_PATTERN = /^(?:\+?251|0)([97]\d{8})$/

/** Strip the spaces, dashes and brackets people actually type. */
export function normalizePhone(value) {
  return value.replace(/[\s()-]/g, '')
}

/** True when `value` is a usable TeleBirr number. */
export function isValidTelebirr(value) {
  return TELEBIRR_PATTERN.test(normalizePhone(value))
}

/**
 * Canonical `+2519XXXXXXXX` form, or `null` if the number is not valid.
 * This is what you would send to an API — never the raw input.
 */
export function toInternational(value) {
  const match = TELEBIRR_PATTERN.exec(normalizePhone(value))
  return match ? `+251${match[1]}` : null
}
