// Quick test to check if quiz instructions are working
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navigating to tests page...');
  await page.goto('http://172.26.195.243:3000/ru/tests', { waitUntil: 'networkidle0' });

  // Wait for the page to load
  await page.waitForTimeout(2000);

  // Check if "About This Test" or "Об этом тесте" is visible (from generic instructions)
  const hasGenericInstructions = await page.evaluate(() => {
    const body = document.body.innerText;
    return body.includes('Об этом тесте') || body.includes('About This Test');
  });

  console.log('Has generic instructions:', hasGenericInstructions);

  // Get all visible text
  const pageText = await page.evaluate(() => document.body.innerText);

  // Check for instruction keywords
  console.log('Contains "Как это работает":', pageText.includes('Как это работает'));
  console.log('Contains "Важные инструкции":', pageText.includes('Важные инструкции'));
  console.log('Contains "Что вы узнаете":', pageText.includes('Что вы узнаете'));

  // Take a screenshot
  await page.screenshot({ path: '/tmp/test-instructions.png', fullPage: true });
  console.log('Screenshot saved to /tmp/test-instructions.png');

  await browser.close();
})();
