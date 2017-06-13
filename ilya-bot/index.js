/* eslint no-process-env: 0 */

const TelegramBot = require('node-telegram-bot-api')

const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramBot(token, { polling: true })

bot.on('message', msg => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, "inline kbd", {
    reply_markup: {
      inline_keyboard: [[{
        text: "A button",
        url: "example.com",
      }]],
    },
  }).then(function() {
    console.log('message sent');
  }).catch(console.error);
})
