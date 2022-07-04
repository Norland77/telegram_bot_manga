const {StartPars, profilePars} = require('./Parser')
const token = '5496733880:AAGwnEtwGhfGAEp6PD46XFahIo18XMmprAM'
const telegramApi = require('node-telegram-bot-api');
const bot = new telegramApi(token, {polling: true});
const fs = require('fs');
const jsonData = require('./urlsChapter.json');
const urlsMangaFile = require('./urlsManga.json');


let urlsManga = {}
let urlsChapter = {}

async function profileParsMain(url) {
    if (isEmptyObject(urlsMangaFile)) {
        let Mangas = await profilePars(url);
        for (let index = 0; index < Mangas.urlsManga.length; index++) {
            urlsManga[`Manga${index}`] = new Object();
            urlsManga[`Manga${index}`]["title"] = Mangas.title[index];
            urlsManga[`Manga${index}`]["link"] = Mangas.urlsManga[index];
        }
        let data = JSON.stringify(urlsManga);
        fs.writeFileSync('urlsManga.json', data);
    } else {
        urlsManga = urlsMangaFile;
    }
}

function isEmptyObject(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

async function Parsing(chatID) {
    for (const params in urlsManga) {
        if (Object.hasOwnProperty.call(urlsManga, params)) {
            let charpet = await StartPars(urlsManga[params].link);
            if (isEmptyObject(jsonData)) {
                if (charpet.url == false) {
                    urlsChapter[`${urlsManga[params].title}`] = new Object();
                    urlsChapter[`${urlsManga[params].title}`]["title"] = charpet.title;
                    urlsChapter[`${urlsManga[params].title}`]["link"] = "";
                } else {
                    urlsChapter[`${urlsManga[params].title}`] = new Object();
                    urlsChapter[`${urlsManga[params].title}`]["title"] = charpet.title;
                    urlsChapter[`${urlsManga[params].title}`]["link"] = charpet.url;
                    bot.sendPhoto(chatID, `${charpet.picture}`, {caption: `New chapter ${charpet.title}: ${charpet.url}`})
                }
            } else {
                urlsChapter = jsonData;
                if (charpet.url == false) {
                    urlsChapter[`${urlsManga[params].title}`]["link"] = "";
                } else {
                    for (const key in jsonData) {
                        if (Object.hasOwnProperty.call(jsonData, key)) {
                            if (urlsManga[params].title == `${jsonData[key].title}`) {
                                if (charpet.url != `${jsonData[key].link}`) {
                                    urlsChapter[urlsManga[params].title].link = charpet.url;
                                    bot.sendPhoto(chatID, `${charpet.picture}`, {caption: `New chapter ${charpet.title}: ${charpet.url}`})
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    let data = JSON.stringify(urlsChapter);
    fs.writeFileSync('urlsChapter.json', data);
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