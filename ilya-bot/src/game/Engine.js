class Engine {
  constructor({
    SessionStorage,
    SessionManager,
    Library,
    ScriptRunner
  }) {
    this.sessionStorage = new SessionStorage()
    this.sessionManager = new SessionManager({
      sessionStorage: this.sessionStorage
    })
    this.library = new Library()
    this.scriptRunner = new ScriptRunner()
  }

  applyAction(chatId, bookId, index) {
    const book = this.getBook(bookId)
    const session = this.sessionManager.getOrCreateSession(chatId, book)
    return this.withPersistence(chatId, session)(s =>
      s.applyAction(index, this.scriptRunner)
    )
  }

  createSession(chatId, bookId) {
    const book = this.getBook(bookId)
    return this.sessionManager.getOrCreateSession(chatId, book)
  }

  actionsForDisplay(session) {
    return session.actionsForDisplay(this.scriptRunner)
  }

  // private

  getBook(bookId) {
    return this.library.getBook(bookId)
  }

  withPersistence(chatId, session) {
    return action => {
      action(session)
      this.sessionStorage.setData(chatId, session)
      return session
    }
  }
}

module.exports = Engine
