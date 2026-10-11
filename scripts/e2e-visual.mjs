import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const base=process.env.E2E_BASE_URL||'http://localhost:3000';
const edge='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const output=path.resolve('artifacts/e2e');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:edge});
const pages=['','ecole/','formations/','vie-scolaire/','actualites/','communiques/','contact/','admin/'];
const devices=[['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]];
const report=[];
for(const [device,viewport] of devices){
 const context=await browser.newContext({viewport,locale:'fr-FR',reducedMotion:'reduce'});
 for(const route of pages){
  const page=await context.newPage();
  const errors=[];page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text())});page.on('pageerror',error=>errors.push(error.message));
  const response=await page.goto(`${base}/${route}`,{waitUntil:'commit',timeout:30000});
  await page.waitForTimeout(2200);
  await page.screenshot({path:path.join(output,`${device}-${route.replaceAll('/','-')||'accueil'}-viewport.png`),fullPage:false});
  const metrics=await page.evaluate(()=>({title:document.title,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,topbar:document.querySelector('.topbar')?.getBoundingClientRect().top??null,nav:document.querySelector('.nav')?.getBoundingClientRect().top??null}));
  await page.evaluate(()=>scrollTo(0,Math.min(900,document.documentElement.scrollHeight-innerHeight)));
  await page.waitForTimeout(350);
  const after=await page.evaluate(()=>({topbar:document.querySelector('.topbar')?.getBoundingClientRect().top??null,nav:document.querySelector('.nav')?.getBoundingClientRect().top??null}));
  report.push({device,route:`/${route}`,status:response?.status(),...metrics,after,errors});
  await page.close();
 }
 await context.close();
}
await browser.close();
await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
