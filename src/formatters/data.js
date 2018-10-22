const { inspect } = require('util')
const debug = require('debug')('ipld-explorer-cli:formatters:data')
const CID = require('cids')

const Formatters = {
  'dag-cbor': formatCborData,
  'git-raw': formatCborData
}

module.exports = function formatData (cid, data) {
  return Formatters[cid.codec]
    ? Formatters[cid.codec](data)
    : inspect(data, { colors: true })
}

function formatCborData (data) {
  return inspect(replaceCborLinks(data), { colors: true })
}

function replaceCborLinks (data) {
  if (CID.isCID(data)) {
    return { '/': data.toBaseEncodedString() }
  } else if (Array.isArray(data)) {
    return data.map(replaceCborLinks)
  } else if (typeof data === 'object') {
    return Object.keys(data).reduce((clone, key) => {
      clone[key] = replaceCborLinks(data[key])
      return clone
    }, {})
  }

  return data
}
