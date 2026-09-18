/**
 * TeleBirr number validation checks.
 *
 * `src/lib/telebirr.js` is plain JavaScript with no JSX, so Node can import it
 * directly — no build step, no test framework.
 *
 * Run it with: docker compose run --rm web npm run check:phone
 */
import { isValidTelebirr, toInternational } from '../src/lib/telebirr.js'

const VALID = [
  '0912345678', // local
  '0912 345 678', // spaced, as people type it
  '091-234-5678', // dashed
  '+251912345678', // international
  '251912345678', // international without the plus
  '0712345678', // the 07 range
]

const INVALID = [
  '', // empty
  '091234567', // one digit short
  '09123456789', // one digit too long
  '0812345678', // 08 is not a mobile prefix
  '+254712345678', // Kenya
  '912345678', // missing the 0 / country code
  'telebirr', // not a number at all
]

let failures = 0

const check = (label, actual, expected) => {
  const pass = actual === expected
  if (!pass) failures += 1
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}`)
}

for (const value of VALID) {
  check(`accepts ${JSON.stringify(value)}`, isValidTelebirr(value), true)
}

for (const value of INVALID) {
  check(`rejects ${JSON.stringify(value)}`, isValidTelebirr(value), false)
}

check(
  'normalises 0912 345 678 to +251912345678',
  toInternational('0912 345 678'),
  '+251912345678',
)
check('returns null for an invalid number', toInternational('0812345678'), null)

console.log(failures === 0 ? '\nAll TeleBirr checks passed.' : `\n${failures} failed.`)
process.exit(failures === 0 ? 0 : 1)
