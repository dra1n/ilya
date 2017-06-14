/* eslint no-process-env: 0 */

const TelegramBot = require('node-telegram-bot-api')
const startBot = require('./src/clientBot')
const Game = require('./src/game')
const levels = require('./src/levels')

const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramBot(token, { polling: true })
const game = new Game({levels})

startBot({ bot, game })
