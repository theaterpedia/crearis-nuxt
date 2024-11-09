/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import consola from 'consola'

function getGqlString(doc) {
  return doc.loc && doc.loc?.source?.body?.replaceAll('\n', '')
}

export default ({ label, message, locations, path, operation }) => {
  const log = { label, message: message, path: path }

  if (locations) {
    log.location = locations?.map((item) => `line: ${item.line} | column: ${item.column}`).join(' ')
  }

  log.query = getGqlString(operation.query)
  log.variables = operation.variables

  consola.error(log)
}
