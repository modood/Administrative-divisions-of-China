const fs = require('fs')
const path = require('path')

const sqlite = require('./sqlite')
const format = require('./format')

async function main () {
  await sqlite.init()

  const [pc, pcC] = await format.getAddressPC()
  jsonOut('pc', pc)
  jsonOut('pc-code', pcC)

  const [pca, pcaC] = await format.getAddressPCA()
  jsonOut('pca', pca)
  jsonOut('pca-code', pcaC)

  const [pcas, pcasC] = await format.getAddressPCAS()
  jsonOut('pcas', pcas)
  jsonOut('pcas-code', pcasC)

  console.log('[100%] 数据更新完成！')
}

function jsonOut (name, data) {
  fs.writeFileSync(
    path.resolve(__dirname, `../dist/${name}.json`),
    JSON.stringify(data))
}

main().then(() => process.exit(0)).catch(e => {
  console.log(e)
  process.exit(-1)
})
