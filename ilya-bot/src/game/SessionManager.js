const cloneDeep = require('clone-deep')
const Session = require('./Session')

class SessionManager {
  constructor({ sessionStorage }) {
    this.sessionStorage = sessionStorage
    this.sessions = {}
  }

  getOrCreateSession(id, book) {
    if (this.sessions[id]) {
      return this.sessions[id]
    } else if (this.sessionStorage.getData[id]) {
      const session = new Session()
      session.deserialize(this.sessionStorage.getData(id))
      this.sessions[id] = session
      return session
    }

    const session = new Session(this.createSessionData(book))

    this.sessions[id] = session
    this.sessionStorage.setData(id, session.serialize())

    return session
  }

  // private

  createSessionData(book) {
    return {
      title: book.title,
      initialState: cloneDeep(book.initialState),
      state: cloneDeep(book.initialState),
      startPage: book.startPage,
      currentPage: book.startPage,
      pages: book.pages
    }
  }
}

module.exports = SessionManager
