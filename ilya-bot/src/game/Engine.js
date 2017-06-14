class Engine {
  constructor({ SessionStorage, SessionManager, Library }) {
    this.sessionStorage = new SessionStorage()
    this.sessionManager = new SessionManager({
      sessionStorage: this.sessionStorage
    })
    this.library = new Library()
  }

  applyAction(chatId, bookId, index) {
    const book = this.getBook(bookId)
    const session = this.sessionManager.getOrCreateSession(chatId, book)

    session.applyAction(index)

    this.sessionStorage.setData(chatId, session)

    return session
  }

  createSession(chatId, bookId) {
    const book = this.getBook(bookId)
    return this.sessionManager.getOrCreateSession(chatId, book)
  }

  // private

  getBook(bookId) {
    return this.library.getBook(bookId)
  }
}

module.exports = Engine
