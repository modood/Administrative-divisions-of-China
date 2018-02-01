const crawler = require('./crawler')
const { Province, City, Area, Street, Village } = require('./sqlite')

/**
 * 抓取所有省级数据
 * @author   https://github.com/modood
 * @datetime 2018-01-31 22:11
 */
exports.fetchProvinces = async () => {
  const o = await crawler.fetchProvinces()
  for (const code in o) {
    const name = o[code]
    await Province.findOrCreate({
      where: { code },
      defaults: { code, name }
    })
  }
}

/**
 * 抓取所有地级数据
 * @author   https://github.com/modood
 * @datetime 2018-01-31 22:13
 */
exports.fetchCities = async () => {
  await exports.fetchProvinces()

  let hasNext = true
  let after
  const limit = 11
  while (hasNext) {
    const r = await Province.paginate({ limit, after })
    for (let i = 0; i < r.results.length; i++) {
      const { dataValues: { code: provinceCode } } = r.results[i]
      const o = await crawler.fetchCities(provinceCode)
      for (const code in o) {
        const name = o[code]
        await City.findOrCreate({
          where: { code },
          defaults: { code, name, provinceCode }
        })
      }
    }

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

  let hasNext = true
  let after
  const limit = 10
  while (hasNext) {
    const r = await City.paginate({ limit, after })
    for (let i = 0; i < r.results.length; i++) {
      const { dataValues: { code: cityCode, provinceCode } } = r.results[i]
      // 特殊处理：广东省中山市（3320）、广东省东莞市（4419）、海南省儋州市（4604）没有县级
      if (['4420', '4419', '4604'].includes(cityCode)) continue
      const o = await crawler.fetchAreas(cityCode)
      for (const code in o) {
        const name = o[code]
        await Area.findOrCreate({
          where: { code },
          defaults: { code, name, cityCode, provinceCode }
        })
      }
    }

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

  let hasNext = true
  let after
  const limit = 10
  while (hasNext) {
    const r = await Area.paginate({ limit, after })
    for (let i = 0; i < r.results.length; i++) {
      const { dataValues: {
        name: areaName,
        code: areaCode,
        cityCode,
        provinceCode } } = r.results[i]
      // 特殊处理：名为市辖区的县级没有乡级
      // 1. 福建省泉州市金门县（350527）也没有乡级
      // 2. 甘肃省嘉峪关市下仅一个县级名为市辖区（code: 620201），
      //    但是它有乡级，因此也需要特殊处理
      if (areaName === '市辖区' || ['350527'].includes(areaCode)) continue
      const o = await crawler.fetchStreets(areaCode)
      for (const code in o) {
        const name = o[code]
        await Street.findOrCreate({
          where: { code },
          defaults: { code, name, areaCode, cityCode, provinceCode }
        })
      }
    }

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

  let hasNext = true
  let after
  const limit = 10
  while (hasNext) {
    const r = await Street.paginate({ limit, after })
    for (let i = 0; i < r.results.length; i++) {
      const { dataValues: {
        code: streetCode,
        areaCode,
        cityCode,
        provinceCode } } = r.results[i]
      const o = await crawler.fetchVillages(streetCode)
      for (const code in o) {
        const name = o[code]
        await Village.findOrCreate({
          where: { code },
          defaults: { code, name, streetCode, areaCode, cityCode, provinceCode }
        })
      }
    }

    hasNext = r.cursors.hasNext
    after = r.cursors.after
  }
}
