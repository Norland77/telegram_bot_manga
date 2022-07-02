const puppeteer = require('puppeteer');
var cloudscraper = require('cloudscraper');
const requestModule = require('request');
var options = {
    uri: 'https://mangalib.me/',
    jar: requestModule.jar(), // Custom cookie jar
    headers: {
      // User agent, Cache Control and Accept headers are required
      // User agent is populated by a random UA.
      'User-Agent': 'Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36',
      'Cache-Control': 'private',
      'Accept': 'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5'
    },
    // Cloudscraper automatically parses out timeout required by Cloudflare.
    // Override cloudflareTimeout to adjust it.
    cloudflareTimeout: 5000,
    // Reduce Cloudflare's timeout to cloudflareMaxTimeout if it is excessive
    cloudflareMaxTimeout: 30000,
    // followAllRedirects - follow non-GET HTTP 3xx responses as redirects
    followAllRedirects: true,
    // Support only this max challenges in row. If CF returns more, throw an error
    challengesToSolve: 3,
    // Remove Cloudflare's email protection, replace encoded email with decoded versions
    decodeEmails: false,
    // Support gzip encoded responses (Should be enabled unless using custom headers)
    gzip: true,
    // Removes a few problematic TLSv1.0 ciphers to avoid CAPTCHA
    //agentOptions: { ciphers }
  };

function sleep(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
} 
    const Start = async (text) => {
    console.log("Opening the browser......");
    browser = await puppeteer.launch({
        dumpio: false,
        headless: true,
        args: [
            '--disable-setuid-sandbox',
            '--no-sandbox',
        ],
        waitForInitialPage: true,
    });
    let page = await browser.newPage();
    console.log(`Navigating to ${text}...`);
    await page.goto(text, {timeout: 0});
    cloudscraper(options).then(console.log);
    await page.screenshot({                      
        path: "./screenshot.png",                   
        fullPage: true                     
    });
    await page.waitForSelector('.page__inner');
    //await page.waitForSelector('.main-wrapper');
    let picture = await page.$$eval('.media-sidebar__cover', pictures => {
        pictures = pictures.map(el => el.querySelector('img').src)
        return pictures;
    });
    let title = await page.$$eval('.media-name__body', titles => {
        titles = titles.map(el => el.querySelector('.media-name__alt').innerText)
        return titles;
    });
    /*let title = await page.$$eval('.header > h1', titles => {
        titles = titles.map(el => el.querySelector('span').innerText)
        return titles;
    });*/
    let urls = await page.$$eval('.vue-recycle-scroller__item-view', links => {
        links = links.filter(link => link.querySelector('.media-chapter_new'))
        links = links.map(el => el.querySelector('.media-chapter__name > a').href)
        return links;
    });
    await browser.close();
    console.log("Closing the browser......");
    return {
        url: urls,
        title: title,
        picture: picture,
    }
} 
module.exports = Start;