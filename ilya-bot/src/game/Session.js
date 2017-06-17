const { actionType } = require('../Library')

class Session {
  constructor(options) {
    this.initialize(options)
  }

  initialize({ title, state, currentPage, pages }) {
    this.title = title
    this.state = state
    this.currentPage = currentPage
    this.pages = pages
  }

  get currentPageStory() {
    return this.pages[this.currentPage].story
  }

  get currentPageActions() {
    return this.pages[this.currentPage].actions || []
  }

  applyAction(i, scriptRunner) {
    const availableActions = this.actionsForDisplay(scriptRunner)
    const action = availableActions[i]

    this.updateVisitedLocations()
    this.dispatchAndApply(action)
  }

  actionsForDisplay(scriptRunner) {
    return this.currentPageActions.filter(this.isVisible.bind(this, scriptRunner))
  }

  serialize() {
    return JSON.stringify({
      title: this.title,
      state: this.state,
      currentPage: this.currentPage,
      pages: this.pages,
      visitedLocations: this.visitedLocations
    })
  }

  deserialize(jsonData) {
    this.initialize(JSON.parse(jsonData))
  }

  // private

  dispatchAndApply(action) {
    switch(action.type) {
    case actionType.NEXT_LEVEL:
      return this.updateCurrentPage(action)
    default:
      return false
    }
  }

  updateVisitedLocations() {
    this.state.visitedLocations = this.state.visitedLocations || []
    this.state.visitedLocations.push(this.currentPage)
  }

  updateCurrentPage(action) {
    this.currentPage = action.link
  }

  isVisible(scriptRunner, action) {
    if (!action.visible) {
      return true
    }

    const sandbox = {
      state: this.state,
      display: true
    }

    scriptRunner.run(action.visible, sandbox)

    return sandbox.display
  }
}

module.exports = Session
