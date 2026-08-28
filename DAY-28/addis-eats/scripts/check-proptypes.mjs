/**
 * PropTypes smoke test.
 *
 * PropTypes failures are plain `console.error` calls, so this script renders
 * the app with Vite's SSR loader while watching `console.error`:
 *
 *   1. the real <App /> must render silently — zero warnings;
 *   2. a deliberately mis-typed <Dish /> must warn — proving the propTypes
 *      declarations are actually wired up and not just decoration.
 *
 * Run it with: docker compose run --rm web npm run check:props
 */
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

/** Collect everything written to console.error while `fn` runs. */
function captureErrors(fn) {
  const original = console.error
  const messages = []
  console.error = (...args) => messages.push(args.join(' '))
  try {
    fn()
  } finally {
    console.error = original
  }
  return messages
}

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

let failures = 0

try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  const { default: Dish } = await server.ssrLoadModule('/src/components/Dish.jsx')

  // 1. The app as shipped.
  const appWarnings = captureErrors(() => renderToString(createElement(App)))
  if (appWarnings.length === 0) {
    console.log('PASS  <App /> renders with no PropTypes warnings')
  } else {
    failures += 1
    console.log('FAIL  <App /> produced warnings:')
    appWarnings.forEach((warning) => console.log(`      ${warning}`))
  }

  // 2. Wrong on purpose: price is a string, `spicy` is not a boolean, and the
  //    required `onAdd` handler is missing entirely.
  const badWarnings = captureErrors(() =>
    renderToString(
      createElement(Dish, { name: 'Doro Wat', price: '420', spicy: 'yes', onAdd() {} }),
    ),
  )
  if (badWarnings.length > 0) {
    console.log(`PASS  invalid props rejected (${badWarnings.length} warning(s)):`)
    badWarnings.forEach((warning) => console.log(`      ${warning.split('\n')[0]}`))
  } else {
    failures += 1
    console.log('FAIL  invalid props raised no warning — are propTypes attached?')
  }
} finally {
  await server.close()
}

process.exit(failures === 0 ? 0 : 1)
