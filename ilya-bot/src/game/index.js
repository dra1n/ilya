class Game {
  constructor({levels}) {
    this.levels = levels
    this.gameSessions = {}
  }

  createSession(chatId) {
    this.gameSessions = {}
  }
}

module.exports = Game
