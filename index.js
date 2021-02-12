require('dotenv').config()
const puppeteer = require('puppeteer')

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function login (page) {
  await page.goto('https://github.com/login')
  await sleep(1000)
  if (page.url() !== 'https://github.com/login') {
    // We are already logged in and got redirected
    console.log('Already logged in')
    return
  }
  console.log('Logging in...')
  await page.type('input[name=login]', process.env.GITHUB_USERNAME)
  await page.type('input[name=password]', process.env.GITHUB_PASSWORD)
  // Press enter
  await page.type('input[name=password]', String.fromCharCode(13))
  // TODO: handle verification code
  await sleep(1000)
  if (page.url() === 'https://github.com/login') {
    console.log('Login seems to have failed (no redirect)')
    process.exit(1)
  }
  console.log('Login seems to have succeeded')
}

(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await login(page)
  await page.screenshot({ path: 'test1.png' })

  await browser.close()
})()
