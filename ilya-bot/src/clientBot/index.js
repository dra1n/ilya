module.exports = ({ bot, game }) => {
  const nextScreen = ({ session, chatId }) => {
    const inlineKeyboard = session.currentPageActions ?
      session.currentPageActions.map((action, i) => ([{
        text: action.description,
        callback_data: i.toString()
      }])) : []

    bot.sendMessage(chatId, session.currentPageStory, {
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    })
  }

  const start = chatId => {
    const session = game.createSession(chatId, 'ilya')
    nextScreen({ session, chatId })
  }

  const applyAction = (chatId, messageId, data) => {
    const session = game.applyAction(chatId, 'ilya', parseInt(data, 10))
    nextScreen({ session, chatId })
  }

  bot.onText(/^\/start$/, msg => start(msg.chat.id))
  bot.on('callback_query', msg => {
    applyAction(msg.from.id, msg.message.message_id, msg.data)
  })
}
