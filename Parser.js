const puppeteer = require('puppeteer');

const StartPars = async (text) => {
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
    await page.waitForSelector('.page__inner');
    let picture = await page.$$eval('.media-sidebar__cover', pictures => {
        pictures = pictures.map(el => el.querySelector('img').src)
        return pictures;
    });
    let title = await page.$$eval('.media-name__body', titles => {
        titles = titles.map(el => el.querySelector('.media-name__main').innerText)
        return titles;
    });
    let urls = await page.$$eval('.vue-recycle-scroller__item-view', links => {
        links = links.filter(link => link.querySelector('.media-chapter_new'))
        links = links.map(el => el.querySelector('.media-chapter__name > a').href)
        return links;
    });
    await browser.close();
    console.log("Closing the browser......");
    console.log(urls);
    if (urls.length == 0) {
        return {
            url: false,
            title: title,
        }
    } else {
        return {
            url: urls,
            title: title,
            picture: picture,
        }
    }
} 
const profilePars = async (url) => {
    console.log("Opening the browser for profile......");
    browser = await puppeteer.launch({
        dumpio: false,
        headless: true,
        args: [
            '--disable-setuid-sandbox',
            '--no-sandbox',
        ],
        waitForInitialPage: true,
    });
    let pageProfile = await browser.newPage();
    console.log(`Navigating to ${url}...`);
    await pageProfile.goto(url, {timeout: 0});
    await pageProfile.waitForSelector('.page__inner');
    let urlsManga = await pageProfile.$$eval('.bookmark-item', urls => {
        urls = urls.filter(urls => urls.querySelector('.bookmark-item__name'))
        urls = urls.map(el => el.querySelector('.bookmark-item__info-header > a').href)
        return urls;
    });
    let title = await pageProfile.$$eval('.bookmark-item', titles => {
        titles = titles.map(el => el.querySelector('.bookmark-item__info-header > a > span').innerText)
        return titles;
    });
    await browser.close();
    console.log("Closing the browser......");
    return {
        urlsManga: urlsManga,
        title: title,
    }
}

module.exports = {StartPars, profilePars};