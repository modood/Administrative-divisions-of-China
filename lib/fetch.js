const sqlite = require('./sqlite')
const worker = require('./worker')

async function main () {
  await sqlite.init()
  await worker.fetchVillages()
  await worker.patch()

  console.log('[100%] 数据抓取完成！')
}

main()
