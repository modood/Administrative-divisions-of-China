const crawler = require('./crawler')
const Sequelize = require('sequelize')
const { Province, City, Area, Street, Village } = require('./sqlite')

// 每抓取 100 个页面再批量写入数据库
const limit = 100

/**
 * 抓取所有省级数据
 * @author   https://github.com/modood
 * @datetime 2018-01-31 22:11
 */
exports.fetchProvinces = async () => {
  const count = await Province.count()
  if (count !== 0) {
    return
  }

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

  const fetchedProvinceCode = await City.aggregate('provinceCode', 'DISTINCT', { plain: false }).map(o => o.DISTINCT)
  const where = { code: { [Sequelize.Op.notIn]: fetchedProvinceCode } }
  const count = await Province.count({ where })

  if (count === 0) {
    return
  }

  let index = 0
  let hasNext = true
  let after
  while (hasNext) {
    const r = await Province.paginate({ where, limit, after })
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

  const fetchedCityCode = await Area.aggregate('cityCode', 'DISTINCT', { plain: false }).map(o => o.DISTINCT)
  const where = { code: { [Sequelize.Op.notIn]: fetchedCityCode } }
  const count = await City.count({ where })

  if (count === 0) {
    return
  }

  let index = 0
  let hasNext = true
  let after
  while (hasNext) {
    const r = await City.paginate({ where, limit, after })
    const rows = []
    for (let i = 0; i < r.results.length; i++) {
      const { dataValues: {
        name: cityName,
        code: cityCode,
        provinceCode } } = r.results[i]
      index++
      console.log(`[${index}/${count}]正在抓取县级数据，当前地级：${cityCode} ${cityName}`)

      // 特殊处理：广东省中山市（3320）、广东省东莞市（4419）、海南省儋州市（4604）没有县级。
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

  // 特殊处理：广东省中山市（3320）、广东省东莞市（4419）、海南省儋州市（4604）没有县级，
  // 需要手动插入。
  await Area.bulkCreate([
    { code: '441900', name: '东莞市', cityCode: '4419', provinceCode: '44' },
    { code: '442000', name: '中山市', cityCode: '4420', provinceCode: '44' },
    { code: '460400', name: '儋州市', cityCode: '4604', provinceCode: '46' }
  ], { ignoreDuplicates: true })

  // 特殊处理：甘肃省嘉峪关市下仅一个县级名为市辖区（code: 620201），重命名。
  await Area.update({ name: '嘉峪关市' }, { where: { code: '620201' } })
}

/**
 * 获取所有乡级数据
 * @author   https://github.com/modood
 * @datetime 2018-02-01 09:28
 */
exports.fetchStreets = async () => {
  await exports.fetchAreas()

  const fetchedAreaCode = await Street.aggregate('areaCode', 'DISTINCT', { plain: false }).map(o => o.DISTINCT)
  const where = { code: { [Sequelize.Op.notIn]: fetchedAreaCode } }
  const count = await Area.count({ where })

  if (count === 0) {
    return
  }

  let index = 0
  let hasNext = true
  let after
  while (hasNext) {
    const r = await Area.paginate({ where, limit, after })
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
      // 2. 甘肃省嘉峪关市下一个县级名为市辖区（code: 620201），
      //    海南省三亚市下一个县级名为市辖区（code: 460201），
      //    但是它们有乡级，因此不可略过。
      if ((areaName === '市辖区' && !['620201', '460201'].includes(areaCode)) ||
        ['350527'].includes(areaCode)) continue

      // 特殊处理：广东省中山市（3320）、广东省东莞市（4419）、海南省儋州市（4604）的乡级
      // 页面的路由比较特别，需要手动拼接。
      let route
      if (['4420', '4419', '4604'].includes(cityCode)) route = `${provinceCode}/${cityCode}`

      const o = await crawler.fetchStreets(areaCode, route)
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

  const fetchedStreetCode = await Village.aggregate('streetCode', 'DISTINCT', { plain: false }).map(o => o.DISTINCT)
  const where = { code: { [Sequelize.Op.notIn]: fetchedStreetCode } }
  const count = await Street.count({ where })

  if (count === 0) {
    return
  }

  let index = 0
  let hasNext = true
  let after
  while (hasNext) {
    const r = await Street.paginate({ where, limit, after })
    const rows = []
    for (let i = 0; i < r.results.length; i++) {
      const { dataValues: {
        name: streetName,
        code: streetCode,
        areaCode,
        cityCode,
        provinceCode } } = r.results[i]
      index++
      if (['350527'].includes(areaCode)) {
        console.log(`[${index}/${count}]跳过例外村级数据，当前乡级：${streetCode} ${streetName}`)
        continue
      }
      console.log(`[${index}/${count}]正在抓取村级数据，当前乡级：${streetCode} ${streetName}`)

      // 特殊处理：广东省中山市（3320）、广东省东莞市（4419）、海南省儋州市（4604）的村级
      // 页面的路由比较特别，需要手动拼接。
      let route
      const cCodeSuffix = cityCode.substr(2, 2)
      if (['4420', '4419', '4604'].includes(cityCode)) route = `${provinceCode}/${cCodeSuffix}/${streetCode}`

      const o = await crawler.fetchVillages(streetCode, route)
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

/**
 * 补漏
 * @author   https://github.com/modood
 * @datetime 2018-02-02 13:39
 */
exports.patch = async () => {
  // 特殊处理：福建省泉州市金门县（350527）没有乡级导致没有匹配上爬取县级的正则表达式。
  // 手动插入县级、乡级、村级
  const areas = [
    { code: '350527', name: '金门县', cityCode: '3505', provinceCode: '35' }
  ]
  const streets = [
    { code: '350527000', name: '金门县', areaCode: '350527', cityCode: '3505', provinceCode: '35' }
  ]
  const villages = [
    { code: '350527000000', name: '金门县', streetCode: '350527000', areaCode: '350527', cityCode: '3505', provinceCode: '35' }
  ]

  await Area.bulkCreate(areas, { ignoreDuplicates: true })
  await Street.bulkCreate(streets, { ignoreDuplicates: true })
  await Village.bulkCreate(villages, { ignoreDuplicates: true })
}
