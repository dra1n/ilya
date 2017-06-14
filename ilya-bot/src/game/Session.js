class Session {
  constructor({ title, state, currentPage, pages }) {
    this.title = title
    this.state = state
    this.currentPage = currentPage
    this.pages = pages
  }

  get currentPageStory() {
    return this.pages[this.currentPage].story
  }

  get currentPageActions() {
    return this.pages[this.currentPage].actions
  }

  applyAction(i) {
    const action = this.currentPageActions[i]
    this.currentPage = action.link
  }

  serialize() {
    return {
      title: this.title,
      state: this.state,
      currentPage: this.currentPage,
      pages: this.pages
    }
  }
}

module.exports = Session
