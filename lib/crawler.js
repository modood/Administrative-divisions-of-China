const http = require('http')

const iconv = require('iconv-lite')
const BufferHelper = require('bufferhelper')

/*
 * 备注：命名简写描述
 * 省份（Province）           p
 * 城市（City）               c
 * 区县（Area）               a
 * 乡镇街道（Street）         s
 * 村（居）委会（Village）    v
 */

const host = 'www.stats.gov.cn'
const links = [
  {
    path: '/tjsj/tjbz/tjyqhdmhcxhfdm/2016/index.html',
    regexp: /<td><a href='(.*?).html'>(.*?)<br\/><\/a><\/td>/g
  },
  {
    path: '/tjsj/tjbz/tjyqhdmhcxhfdm/2016/#{pCode}.html',
    regexp: /<tr class='.*?'><td><a href=.*?>(.*?)<\/a><\/td><td><a href=.*?>(.*?)<\/a><\/td><\/tr>/g
  },
  {
    path: '/tjsj/tjbz/tjyqhdmhcxhfdm/2016/#{pCode}/#{cCode}.html',
    regexp: /<tr class='.*?'><td><a href=.*?>(.*?)<\/a><\/td><td><a href=.*?>(.*?)<\/a><\/td><\/tr>/g
  },
  {
    path: '/tjsj/tjbz/tjyqhdmhcxhfdm/2016/#{pCode}/#{cCodeSuffix}/#{aCode}.html',
    regexp: /<tr class='.*?'><td><a href=.*?>(.*?)<\/a><\/td><td><a href=.*?>(.*?)<\/a><\/td><\/tr>/g
  },
  {
    path: '/tjsj/tjbz/tjyqhdmhcxhfdm/2016/#{pCode}/#{cCodeSuffix}/#{aCodeSuffix}/#{sCode}.html',
    regexp: /<td>(.*?)<\/td><td>.*?<\/td><td>(.*?)<\/td>/g
  }
]

/**
 * 抓取数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 19:23
 */
exports.fetch = (host, path, regexp) =>
  new Promise((resolve, reject) => http.get({ host, path, timeout: 1000 }, res => {
    const bufferHelper = new BufferHelper()
    const statusCode = res.statusCode

    if (statusCode !== 200) {
      res.resume()
      return reject(new Error('Request Failed. Status Code: ' + statusCode))
    }

    res.on('data', chunk => bufferHelper.concat(chunk))

    res.on('end', () => {
      const rawData = iconv.decode(bufferHelper.toBuffer(), 'GBK')

      const result = {}
      let current
      while ((current = regexp.exec(rawData)) !== null) result[current[1]] = current[2].trim()

      return resolve(result)
    })
  }).on('error', reject).on('timeout', () => reject(new Error('timeout'))))

/**
 * 抓取省份数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 19:40
 */
exports.fetchProvinces = async () => {
  try {
    return await exports.fetch(host, links[0].path, links[0].regexp)
  } catch (err) {
    console.error(err)
    process.exit(-1)
  }
}

/**
 * 抓取城市数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 19:51
 */
exports.fetchCities = async (pCode) => {
  const path = links[1].path.replace('#{pCode}', pCode)

  try {
    return await exports.fetch(host, path, links[1].regexp)
  } catch (err) {
    console.log(`抓取省份（${pCode}）的城市数据失败（${err}），正在重试...`)
    return this.fetchCities(pCode)
  }
}

/**
 * 抓取区县数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 20:03
 */
exports.fetchAreas = async (cCode) => {
  cCode = cCode.toString()
  const pCode = cCode.substr(0, 2)
  const path = links[2].path
    .replace('#{pCode}', pCode)
    .replace('#{cCode}', cCode)

  try {
    return await exports.fetch(host, path, links[2].regexp)
  } catch (err) {
    console.log(`抓取城市（${cCode}）的区县数据失败（${err}），正在重试...`)
    return this.fetchAreas(cCode)
  }
}

/**
 * 抓取街道数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 20:08
 */
exports.fetchStreets = async (aCode) => {
  aCode = aCode.toString()
  const pCode = aCode.substr(0, 2)
  const cCodeSuffix = aCode.substr(2, 2)
  const path = links[3].path
    .replace('#{pCode}', pCode)
    .replace('#{cCodeSuffix}', cCodeSuffix)
    .replace('#{aCode}', aCode)

  try {
    return await exports.fetch(host, path, links[3].regexp)
  } catch (err) {
    console.log(`抓取区县（${aCode}）的乡镇街道数据失败（${err}），正在重试...`)
    return this.fetchStreets(aCode)
  }
}

/**
 * 抓取村（居）委会数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 20:19
 */
exports.fetchVillages = async (sCode) => {
  sCode = sCode.toString()
  const pCode = sCode.substr(0, 2)
  const cCodeSuffix = sCode.substr(2, 2)
  const aCodeSuffix = sCode.substr(4, 2)
  const path = links[4].path
    .replace('#{pCode}', pCode)
    .replace('#{cCodeSuffix}', cCodeSuffix)
    .replace('#{aCodeSuffix}', aCodeSuffix)
    .replace('#{sCode}', sCode)

  try {
    return await exports.fetch(host, path, links[4].regexp)
  } catch (err) {
    console.log(`抓取乡镇街道（${sCode}）的村（居）委会数据失败（${err}），正在重试...`)
    return this.fetchVillages(sCode)
  }
}
