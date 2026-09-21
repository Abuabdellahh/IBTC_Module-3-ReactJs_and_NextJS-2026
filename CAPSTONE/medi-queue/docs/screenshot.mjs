import puppeteer from 'puppeteer'
import { resolve, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const pages = [
  { file: 'home.html',         out: 'home.png' },
  { file: 'doctors.html',      out: 'doctors.png' },
  { file: 'detail.html',       out: 'detail.png' },
  { file: 'appointments.html', out: 'appointments.png' },
  { file: 'login.html',        out: 'login.png' },
]

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

for (const { file, out } of pages) {
  const url = pathToFileURL(resolve(__dirname, file)).href
  const outPath = resolve(__dirname, out)

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto(url, { waitUntil: 'networkidle0' })
  await page.screenshot({ path: outPath, fullPage: true })
  console.log(`✅  ${out}`)
  await page.close()
}

await browser.close()
console.log('\nAll screenshots saved to docs/')
