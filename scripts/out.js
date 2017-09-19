const fs = require('fs')
const path = require('path')

module.exports = function (name, data) {
  fs.writeFileSync(path.resolve(__dirname, `../dist/${name}.json`), JSON.stringify(data))
}
