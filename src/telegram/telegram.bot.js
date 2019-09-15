const TelegramBot = require('node-telegram-bot-api');
const Main = require('../main')

const token = "766838334:AAG4zULQ1KVEbfc7u1KjVbZngeG1SI_WFHY";
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/mirror (.+)/, (raw, match) => {
    const chatId = raw.chat.id;

    const msg = match[1];
    const args = msg.split(" ");

    if(args.length > 1){
        var repo = args[0];
        var mirror = args[1];
        Main.mirror.initMirror({
            repo: repo,
            mirror: mirror
        })
    }

    bot.sendMessage(chatId, "awa");
});