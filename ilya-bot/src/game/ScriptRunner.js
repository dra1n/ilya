const vm = require('vm')

class ScriptRunner {
  run(script, sandbox) {
    const s = new vm.Script(script)
    const context = new vm.createContext(sandbox)
    s.runInContext(context)
    return sandbox
  }
}

module.exports = ScriptRunner
