/**
 * Interaction checks — the parts of Day 28 that only exist once you click.
 *
 * Renders the real <App /> into a jsdom document and drives it the way a
 * person would: press Add, switch category, type a phone number, submit. It
 * asserts on what ends up in the DOM, so it breaks if the state wiring breaks.
 *
 * Run it with: docker compose run --rm web npm run check:ui
 */
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
})
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.IS_REACT_ACT_ENVIRONMENT = true

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { createElement, act } = await import('react')
const { createRoot } = await import('react-dom/client')
const { default: App } = await vite.ssrLoadModule('/src/App.jsx')

const root = createRoot(document.getElementById('root'))
await act(async () => root.render(createElement(App)))

const $ = (sel) => document.querySelector(sel)
const $$ = (sel) => [...document.querySelectorAll(sel)]
const click = async (el) => act(async () => el.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })))
const type = async (el, value) => {
  const proto = el.tagName === 'SELECT' ? dom.window.HTMLSelectElement : dom.window.HTMLInputElement
  Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(el, value)
  await act(async () => {
    el.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
    el.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
  })
}
const blur = async (el) => act(async () => el.dispatchEvent(new dom.window.FocusEvent('focusout', { bubbles: true })))

let fails = 0
const t = (label, actual, expected) => {
  const ok = actual === expected
  if (!ok) fails++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : `  (got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)})`}`)
}

const total = () => $('.summary__total').textContent
const submit = () => $('.delivery__submit')

// --- order total ---------------------------------------------------------
t('starts empty', total(), '0.00 ETB')
t('submit disabled with no order', submit().disabled, true)

const adds = $$('.dish__add')
await click(adds[0])                                    // Doro Wat 420
t('one dish -> 420.00 ETB', total(), '420.00 ETB')
t('dish shows its own count', $$('.dish__count')[0].textContent, '1 × 420.00 ETB')
await click(adds[0])                                    // again
t('same dish twice -> 840.00 ETB', total(), '840.00 ETB')
await click(adds[1])                                    // Kitfo 380
t('plus another dish -> 1,220.00 ETB', total(), '1,220.00 ETB')
t('summary counts 3 dishes', $('.summary__label').textContent, '3 dishes in your order')

// --- category filter -----------------------------------------------------
const chips = $$('.chip')
t('chips rendered from array', chips.map((c) => c.textContent).join(','), 'All,Mains,Fasting,Breakfast')
t('"All" starts selected', chips[0].className, 'chip chip--selected')
await click(chips[2])                                   // Fasting
t('selected chip highlighted', $('.chip--selected').textContent, 'Fasting')
t('list filtered to Fasting', $$('.dish').length, 3)
t('total survives filtering', total(), '1,220.00 ETB')
await click($('.switch input'))                         // spicy only + Fasting
t('empty state shown', $('.empty__message').textContent, 'No spicy dishes under Fasting.')
await click($('.empty__reset'))
t('filters cleared', $$('.dish').length, 10)

// --- delivery form -------------------------------------------------------
await type($('#name'), 'Selam')
t('still disabled without a phone', submit().disabled, true)
await type($('#phone'), '0812345678')                   // bad prefix
await blur($('#phone'))
t('invalid number shows an error', $('.field__error').textContent.slice(0, 24), 'TeleBirr numbers look li')
t('still disabled on invalid number', submit().disabled, true)
await type($('#phone'), '0912345678')
t('error clears on a valid number', $('.field__error'), null)
t('still disabled without an area', submit().disabled, true)
await type($('#area'), 'Bole')
t('enabled once name + phone + area valid', submit().disabled, false)

// --- checkout ------------------------------------------------------------
await click(submit())
t('receipt shown', $('.receipt__title').textContent, 'Order confirmed')
t('receipt has the +251 number', $('.receipt__body').textContent.includes('+251912345678'), true)
t('receipt has the total', $('.receipt__body').textContent.includes('1,220.00 ETB'), true)
await click($('.receipt__dismiss'))
t('order reset after checkout', total(), '0.00 ETB')
t('dish counts reset too', $$('.dish__count').length, 0)

await vite.close()
console.log(fails === 0 ? '\nAll interaction checks passed.' : `\n${fails} failed.`)
process.exit(fails ? 1 : 0)
