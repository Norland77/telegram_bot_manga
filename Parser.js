const puppeteer = require('puppeteer');

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
    await page.waitForSelector('.page__inner');
    let picture = await page.$$eval('.media-sidebar__cover', pictures => {
        pictures = pictures.map(el => el.querySelector('img').src)
        return pictures;
    });
    let title = await page.$$eval('.media-name__body', titles => {
        titles = titles.map(el => el.querySelector('.media-name__alt').innerText)
        return titles;
    });
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