const Mustache = require('mustache')

/**
 * Rewrite escapedValue() function to not delete undefined variables
 */
Mustache.Writer.prototype.escapedValue = function escapedValue (token, context, config) {
  const value = context.lookup(token[1]) || `{{${token[1]}}}`
  return String(value)
}

function replacePostmanVariables (collectionData, additionalVars = {}) {
  const postmanJson = Object.getPrototypeOf(collectionData) === Object.prototype ? collectionData : JSON.parse(collectionData)
  const { variable = [] } = postmanJson
  const formatVars = variable.reduce((obj, { key, value }) => {
    obj[key] = value
    return obj
  }, {})
  // Merge collection vars with additional vars
  const context = { ...formatVars, ...additionalVars }
  return Mustache.render(JSON.stringify(postmanJson), context)
}

module.exports = replacePostmanVariables
