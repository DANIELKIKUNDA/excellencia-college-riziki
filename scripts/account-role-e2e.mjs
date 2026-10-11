import { chromium } from 'playwright-core';
import readline from 'node:readline';

console.log('READY_FOR_CREDENTIALS');
const rl = readline.createInterface({ input: process.stdin, terminal: false });
const [line] = await new Promise((resolve) => { const lines=[]; rl.on('line',(v)=>{lines.push(v);rl.close()}); rl.on('close',()=>resolve(lines)); });
const admin = JSON.parse(line);
const stamp = Date.now();
const temporary = { email: `riziki-test-${stamp}@example.com`, password: `Riziki-Test-${stamp}!`, name: 'Compte test temporaire' };
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const adminContext = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-FR' });
const page = await adminContext.newPage();
await page.goto('https://excellenciariziki.com/admin/', { waitUntil: 'domcontentloaded' });
await page.getByLabel('E-mail').fill(admin.email);
await page.locator('input[name="password"]').fill(admin.password);
await page.getByRole('button', { name: 'Se connecter' }).click();
await page.getByText('Centre de pilotage').waitFor({ timeout: 30000 });
await page.getByRole('button', { name: /Responsables/i }).click();
await page.locator('input[name="full_name"]').fill(temporary.name);
await page.locator('input[name="email"]').fill(temporary.email);
await page.locator('select[name="role"]').selectOption('secretariat');
await page.locator('input[name="service"]').fill('secretariat');
await page.locator('input[name="password"]').fill(temporary.password);
await page.getByRole('button', { name: 'Créer le responsable' }).click();
await page.waitForTimeout(5000);
const creationStatus = await page.locator('.formStatus').allTextContents();
const created = await page.getByText(temporary.email).count() > 0;
let roleAccess = null;
if (created) {
  const roleContext = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-FR' });
  const rolePage = await roleContext.newPage();
  await rolePage.goto('https://excellenciariziki.com/admin/', { waitUntil: 'domcontentloaded' });
  await rolePage.getByLabel('E-mail').fill(temporary.email);
  await rolePage.locator('input[name="password"]').fill(temporary.password);
  await rolePage.getByRole('button', { name: 'Se connecter' }).click();
  await rolePage.getByText('Centre de pilotage').waitFor({ timeout: 30000 });
  roleAccess = {
    messages: await rolePage.locator('.adminTabs button', { hasText: 'Messages' }).count() > 0,
    announcements: await rolePage.locator('.adminTabs button', { hasText: 'Communiqués' }).count() > 0,
    news: await rolePage.locator('.adminTabs button', { hasText: 'Actualités' }).count() > 0,
    notifications: await rolePage.locator('.adminTabs button', { hasText: 'Notifications' }).count() > 0,
    media: await rolePage.locator('.adminTabs button', { hasText: 'Médiathèque' }).count() > 0,
    settings: await rolePage.locator('.adminTabs button', { hasText: 'Paramètres' }).count() > 0,
    accounts: await rolePage.locator('.adminTabs button', { hasText: 'Responsables' }).count() > 0,
  };
  await roleContext.close();
  page.on('dialog', (dialog) => dialog.accept());
  const row = page.locator('.accountRow').filter({ hasText: temporary.email });
  await row.getByRole('button', { name: 'Supprimer' }).click();
  await page.waitForTimeout(4000);
}
console.log(JSON.stringify({ created, creationStatus, roleAccess, cleanupSucceeded: created ? await page.getByText(temporary.email).count() === 0 : false }, null, 2));
await adminContext.close();
await browser.close();
