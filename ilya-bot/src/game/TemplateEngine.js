const Handlebars = require('handlebars')

class TemplateEngine {
  interpolate(text, vars) {
    return Handlebars.compile(text)(vars)
  }
}

module.exports = TemplateEngine
