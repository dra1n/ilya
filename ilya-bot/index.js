/* eslint no-process-env: 0 */

const TelegramBot = require('node-telegram-bot-api')
const startBot = require('./src/clientBot')

const GameEngine = require('./src/game').Engine
const SessionStorage = require('./src/game').SessionStorage
const SessionManager = require('./src/game').SessionManager
const ScriptRunner = require('./src/game').ScriptRunner
const TemplateEngine = require('./src/game').TemplateEngine

const Library = require('./src/library').Library

const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramBot(token, { polling: true })
const game = new GameEngine({
  SessionStorage,
  Library,
  SessionManager,
  ScriptRunner,
  TemplateEngine
})

startBot({ bot, game })
