const {StartPars, profilePars} = require('./Parser')
const token = '5496733880:AAGwnEtwGhfGAEp6PD46XFahIo18XMmprAM'
const telegramApi = require('node-telegram-bot-api');
const bot = new telegramApi(token, {polling: true});

const urlsManga = {}

async function profileParsMain(url) {
    let Mangas = await profilePars(url);
    for (let index = 0; index < Mangas.length; index++) {
        urlsManga[`urlManga${index}`] = Mangas[index];
    }
}

async function Parsing(chatID) {
    for (const params in urlsManga) {
        if (Object.hasOwnProperty.call(urlsManga, params)) {
            let charpet = await StartPars(urlsManga[params]);
            if (charpet) {
                bot.sendPhoto(chatID, `${charpet.picture}`, {caption: `New chapter ${charpet.title}: ${charpet.url}`})
            }
        }
    }
}

async function parsingMain(url, chatID) {
    await profileParsMain(url);
    await Parsing(chatID);
}

bot.on('message', msg => {
    let url = msg.text;
    const https = 'https://mangalib.me/';
    let result = url.match(https);
    const chatID = msg.chat.id;
    if (result) {
        parsingMain(url, chatID)
    } else {
        bot.sendMessage(chatID, `${url} incorrect link`);
    }
})