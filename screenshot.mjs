import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const page = await browser.newPage()

// iPhone 14 Pro dimensions - matches our max-w-sm design
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })

// --- Login screen ---
await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 800))
const loginBuf = await page.screenshot({ type: 'png' })
writeFileSync('C:/Users/User/ss_login.png', loginBuf)
console.log('login done')

// --- Fill phone and submit ---
await page.type('input[type="tel"]', '+972501234567')
await page.keyboard.press('Enter')
await new Promise(r => setTimeout(r, 500))

// New player - fill name
const nameInput = await page.$('input[type="text"]')
if (nameInput) {
  await nameInput.type('Alice')
  await page.keyboard.press('Enter')
  await new Promise(r => setTimeout(r, 600))
}

// --- Dashboard ---
await page.waitForSelector('h1', { timeout: 3000 }).catch(() => {})
const dashBuf = await page.screenshot({ type: 'png' })
writeFileSync('C:/Users/User/ss_dashboard.png', dashBuf)
console.log('dashboard done')

// --- Create Tournament ---
await page.goto('http://localhost:5173/create', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 600))

// Fill tournament name
const inputs = await page.$$('input')
if (inputs[0]) await inputs[0].type('Office Cup 2025')

// Add a second player
const nameInputs = await page.$$('input')
for (const inp of nameInputs) {
  const ph = await inp.evaluate(el => el.placeholder)
  if (ph === 'Player name') { await inp.type('Bob'); }
  if (ph === 'Phone number') { await inp.type('0509876543'); }
}
const createBuf = await page.screenshot({ type: 'png' })
writeFileSync('C:/Users/User/ss_create.png', createBuf)
console.log('create done')

await browser.close()
console.log('ALL DONE')
