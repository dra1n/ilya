const { actionType } = require('../Library')

class Session {
  constructor(options) {
    this.initialize(options)
  }

  initialize({
    title,
    initialState,
    state,
    startPage,
    currentPage,
    pages
  }) {
    this.title = title
    this.initialState = initialState
    this.state = state
    this.startPage = startPage
    this.currentPage = currentPage
    this.pages = pages
  }

  get currentPageActions() {
    return this.pages[this.currentPage].actions || []
  }

  currentPageStory({ templateEngine }) {
    return templateEngine.interpolate(this.pages[this.currentPage].story, this.state)
  }

  applyAction(i, context) {
    const availableActions = this.actionsForDisplay(context)
    const action = availableActions[i]

    this.updateVisitedLocations()
    this.dispatchAndApply(action, context)
  }

  actionsForDisplay({ scriptRunner }) {
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

  dispatchAndApply(action, context) {
    switch(action.type) {
    case actionType.NEXT_LEVEL:
      return this.updateCurrentPage(action, context)
    case actionType.UPDATE_STATE:
      return this.updateGameState(action, context)
    case actionType.RESTART_GAME:
      return this.restartGame()
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

  updateGameState(action, { scriptRunner }) {
    const sandbox = {
      state: this.state,
			link: null
    }

    scriptRunner.run(action.update, sandbox)
    this.currentPage = sandbox.link
  }

  restartGame() {
    this.currentPage = this.startPage
    this.state = this.initialState
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
