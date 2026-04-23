const puppeteer = require('puppeteer');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to app...');
  await page.goto('http://localhost:5175', { waitUntil: 'networkidle0', timeout: 30000 });

  console.log('Adding nodes via click fallback...');
  const sidebarItems = await page.$$('.cursor-grab');
  
  if (sidebarItems.length > 0) {
     await sidebarItems[0].click();
     await delay(300);
     
     if (sidebarItems.length > 1) {
        await sidebarItems[1].click();
        await delay(300);
     }
     
     if (sidebarItems.length > 2) {
        await sidebarItems[2].click();
        await delay(300);
     }

     console.log('Arranging nodes and selecting one...');
     const nodes = await page.$$('.react-flow__node');
     if (nodes.length > 0) {
        await nodes[0].click();
        await delay(500); 
     }
  }

  console.log('Taking screenshot...');
  await delay(1000);
  await page.screenshot({ path: 'screenshot.png', fullPage: false });

  await browser.close();
  console.log('Screenshot saved as screenshot.png');
})();
