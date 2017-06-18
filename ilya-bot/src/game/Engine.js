class Engine {
  constructor({
    SessionStorage,
    SessionManager,
    Library,
    ScriptRunner,
    TemplateEngine
  }) {
    this.sessionStorage = new SessionStorage()
    this.sessionManager = new SessionManager({
      sessionStorage: this.sessionStorage
    })
    this.library = new Library()
    this.scriptRunner = new ScriptRunner()
    this.templateEngine = new TemplateEngine()
  }

  applyAction(chatId, bookId, index) {
    const book = this.getBook(bookId)
    const session = this.sessionManager.getOrCreateSession(chatId, book)
    return this.withPersistence(chatId, session)(s =>
      s.applyAction(index, { scriptRunner: this.scriptRunner })
    )
  }

  currentPageStory(session) {
    return session.currentPageStory({ templateEngine: this.templateEngine })
  }

  createSession(chatId, bookId) {
    const book = this.getBook(bookId)
    return this.sessionManager.getOrCreateSession(chatId, book)
  }

  actionsForDisplay(session) {
    return session.actionsForDisplay({ scriptRunner: this.scriptRunner })
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
