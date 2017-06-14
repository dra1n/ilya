module.exports = ({bot, game}) => {
  const start = chatId => {
    game.createSession(chatId)
    bot.sendMessage(chatId, 'started')
  }

  bot.onText(/^\/start$/, msg => start(msg.chat.id))

  bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
    };
    let text;

    if (action === "1") {
      text = 'You hit button 1';
    }

    bot.editMessageText(text, opts);
  });
}

