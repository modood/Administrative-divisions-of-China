const crawler = require('./crawler')
const { Province, City, Area, Street, Village } = require('./sqlite')

const limit = 100

/**
 * 抓取所有省级数据
 * @author   https://github.com/modood
 * @datetime 2018-01-31 22:11
 */
exports.fetchProvinces = async () => {
  console.log('[1/1]正在抓取省级数据...')
  const o = await crawler.fetchProvinces()
  const rows = []
  for (const code in o) {
    const name = o[code]
    rows.push({ code, name })
  }
  await Province.bulkCreate(rows, { ignoreDuplicates: true })
}

/**
 * 抓取所有地级数据
 * @author   https://github.com/modood
 * @datetime 2018-01-31 22:13
 */
exports.fetchCities = async () => {
  await exports.fetchProvinces()

  const count = await Province.count()
  let index = 0
  let hasNext = true
  let after
  while (hasNext) {
    const r = await Province.paginate({ limit, after })
    const rows = []
    for (let i = 0; i < r.results.length; i++) {
      const { dataValues: {
        name: provinceName,
        code: provinceCode } } = r.results[i]
      index++
      console.log(`[${index}/${count}]正在抓取地级数据，当前省级：${provinceCode} ${provinceName}`)
      const o = await crawler.fetchCities(provinceCode)
      for (const code in o) {
        const name = o[code]
        rows.push({ code, name, provinceCode })
      }
    }
    await City.bulkCreate(rows, { ignoreDuplicates: true })

    hasNext = r.cursors.hasNext
    after = r.cursors.after
  }
}

/**
 * 获取所有县级数据
 * @author   https://github.com/modood
 * @datetime 2018-02-01 09:12
 */
exports.fetchAreas = async () => {
  await exports.fetchCities()

  const count = await City.count()
  let index = 0
  let hasNext = true
  let after
  while (hasNext) {
    const r = await City.paginate({ limit, after })
    const rows = []
    for (let i = 0; i < r.results.length; i++) {
      const { dataValues: {
        name: cityName,
        code: cityCode,
        provinceCode } } = r.results[i]
      index++
      console.log(`[${index}/${count}]正在抓取县级数据，当前地级：${cityCode} ${cityName}`)
      // 特殊处理：广东省中山市（3320）、广东省东莞市（4419）、海南省儋州市（4604）没有县级
      if (['4420', '4419', '4604'].includes(cityCode)) continue
      const o = await crawler.fetchAreas(cityCode)
      for (const code in o) {
        const name = o[code]
        rows.push({ code, name, cityCode, provinceCode })
      }
    }
    await Area.bulkCreate(rows, { ignoreDuplicates: true })

    hasNext = r.cursors.hasNext
    after = r.cursors.after
  }
}

/**
 * 获取所有乡级数据
 * @author   https://github.com/modood
 * @datetime 2018-02-01 09:28
 */
exports.fetchStreets = async () => {
  await exports.fetchAreas()

  const count = await Area.count()
  let index = 0
  let hasNext = true
  let after
  while (hasNext) {
    const r = await Area.paginate({ limit, after })
    const rows = []
    for (let i = 0; i < r.results.length; i++) {
      const { dataValues: {
        name: areaName,
        code: areaCode,
        cityCode,
        provinceCode } } = r.results[i]
      index++
      console.log(`[${index}/${count}]正在抓取乡级数据，当前县级：${areaCode} ${areaName}`)
      // 特殊处理：名为市辖区的县级没有乡级
      // 1. 福建省泉州市金门县（350527）也没有乡级
      // 2. 甘肃省嘉峪关市下仅一个县级名为市辖区（code: 620201），
      //    但是它有乡级，因此也需要特殊处理
      if (areaName === '市辖区' || ['350527'].includes(areaCode)) continue
      const o = await crawler.fetchStreets(areaCode)
      for (const code in o) {
        const name = o[code]
        rows.push({ code, name, areaCode, cityCode, provinceCode })
      }
    }
    await Street.bulkCreate(rows, { ignoreDuplicates: true })

    hasNext = r.cursors.hasNext
    after = r.cursors.after
  }
}

/**
 * 抓取所有村级数据
 * @author   https://github.com/modood
 * @datetime 2018-02-01 09:47
 */
exports.fetchVillages = async () => {
  await exports.fetchStreets()

  const count = await Street.count()
  let index = 0
  let hasNext = true
  let after
  while (hasNext) {
    const r = await Street.paginate({ limit, after })
    const rows = []
    for (let i = 0; i < r.results.length; i++) {
      const { dataValues: {
        name: streetName,
        code: streetCode,
        areaCode,
        cityCode,
        provinceCode } } = r.results[i]
      index++
      console.log(`[${index}/${count}]正在抓取村级数据，当前乡级：${streetCode} ${streetName}`)
      const o = await crawler.fetchVillages(streetCode)
      for (const code in o) {
        const name = o[code]
        rows.push({ code, name, streetCode, areaCode, cityCode, provinceCode })
      }
    }
    await Village.bulkCreate(rows, { ignoreDuplicates: true })

    hasNext = r.cursors.hasNext
    after = r.cursors.after
  }
}
