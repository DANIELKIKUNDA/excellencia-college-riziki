import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

console.log('READY_FOR_CREDENTIALS');
const rl = readline.createInterface({ input: process.stdin, terminal: false });
const [line] = await new Promise((resolve) => {
  const lines = [];
  rl.on('line', (value) => { lines.push(value); rl.close(); });
  rl.on('close', () => resolve(lines));
});
const { email, password } = JSON.parse(line);
const output = path.resolve('artifacts/e2e-admin');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-FR' });
const page = await context.newPage();
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (error) => errors.push(error.message));

await page.goto('https://excellenciariziki.com/admin/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.getByLabel('E-mail').fill(email);
await page.getByLabel('Mot de passe').fill(password);
await page.getByRole('button', { name: 'Se connecter' }).click();
await page.getByText('Centre de pilotage').waitFor({ timeout: 30000 });
await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
await page.getByText('Centre de pilotage').waitFor({ timeout: 30000 });
const sessionPersisted = !await page.getByRole('button', { name: 'Se connecter' }).count();

const tabs = ['Tableau de bord', 'Messages', 'Actualit\u00e9s', 'Communiqu\u00e9s', 'Notifications', 'M\u00e9diath\u00e8que', 'Param\u00e8tres', 'Responsables'];
const report = [];
for (const tab of tabs) {
  const button = page.getByRole('button', { name: new RegExp(tab, 'i') }).first();
  if (!await button.count()) continue;
  await button.click();
  await page.waitForTimeout(900);
  const slug = tab.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-');
  await page.screenshot({ path: path.join(output, `${slug}.png`), fullPage: true });
  const metrics = await page.evaluate(() => {
    const bad = [...document.querySelectorAll('body *')]
      .filter((element) => {
        if (element.closest('.adminTabs')) return false;
        const rect = element.getBoundingClientRect();
        return rect.right > innerWidth + 2 || rect.left < -2;
      })
      .slice(0, 20)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { tag: element.tagName, class: element.className, right: Math.round(rect.right), left: Math.round(rect.left) };
      });
    return { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, bad };
  });
  report.push({ tab, ...metrics });
}

const result = { sessionPersisted, report, errors };
await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await context.close();
await browser.close();
