class SessionStorage {
  constructor() {
    this.sessions = {}
  }

  getData(id) {
    return this.sessions[id]
  }

  setData(id, data) {
    this.sessions[id] = data
  }
}

module.exports = SessionStorage
