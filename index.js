const parser = require('./Parser')
const token = '5496733880:AAGUMzcZMRlrznEzpiJIwN1tZufRCCb5X-I'
const telegramApi = require('node-telegram-bot-api');
const bot = new telegramApi(token, {polling: true});

function sleep(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
}

async function Parsing(text, chatID) {
    while(true) {
        let charpet = await parser(text);
        bot.sendPhoto(chatID, `${charpet.picture}`)
        bot.sendMessage(chatID, `New charpet ${charpet.title}: ${charpet.url}`);
        sleep(30000)
    }
}

bot.on('message', msg => {
    let text = msg.text;
    const https = 'https://mangalib.me/';
    let result = text.match(https);
    const chatID = msg.chat.id;
    if (result) {
        Parsing(text, chatID);
    } else {
        bot.sendMessage(chatID, `${text} is dont link`);
    }
})