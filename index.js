const puppeteer = require('puppeteer');
const _ = require('lodash');
const fs = require('fs');
const Promise = require('bluebird'); 
const log = console;
const { sizes, url } = require('./config.json');
const dir = './shots';

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function handleResolution(size, browser) {
	const page = await browser.newPage();
	await page.setViewport(size);
 	await page.goto(url);
	// Here you set the selector to wait for the loading 
	await waitForSelector(page, 'div.table-status');
	await page.screenshot({ path:`${dir}/${size.width}X${size.height}.png` });
	await sleep(300);
	await page.close();
}
async function waitForSelector(page, selector) {
	return page.waitForSelector(selector, { timeout: 100000 });
}
async function run() {
	if (!fs.existsSync(dir)){
    		fs.mkdirSync(dir);
        }

	const browser = await puppeteer.launch({ headless: false });
	await Promise.all(_.map(sizes, size => handleResolution(size, browser)));
	await browser.close();
}

run()
	.then(() => log.info('Completed Successfully'))
	.catch(ex => log.error('Completed with Errors ', ex));