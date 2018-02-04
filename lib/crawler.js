const http = require('http')

const iconv = require('iconv-lite')
const BufferHelper = require('bufferhelper')

/*
 * 命名简写备注
 *
 * 省级（省份，Province）           p
 * 地级（城市，City）               c
 * 县级（区县，Area）               a
 * 乡级（乡镇街道，Street）         s
 * 村级（村委会居委会，Village）    v
 */

const pReg = /<td><a href='(.*?).html'>(.*?)<br\/><\/a><\/td>/g
const casReg = /<tr class='.*?'><td><a href=.*?>(.*?)<\/a><\/td><td><a href=.*?>(.*?)<\/a><\/td><\/tr>/g
const vReg = /<td>(.*?)<\/td><td>.*?<\/td><td>(.*?)<\/td>/g

const host = 'www.stats.gov.cn'
const path = '/tjsj/tjbz/tjyqhdmhcxhfdm/2016/#{route}.html'

/**
 * 抓取数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 19:23
 */
exports.fetch = (host, route, regexp, codeLen) =>
  new Promise((resolve, reject) => http.get({
    host,
    path: path.replace('#{route}', route),
    timeout: 3000
  }, res => {
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
      while ((current = regexp.exec(rawData)) !== null) result[current[1].substr(0, codeLen)] = current[2].trim()

      return resolve(result)
    })
  }).on('error', reject).on('timeout', () => reject(new Error('timeout'))))

/**
 * 抓取省级数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 19:40
 */
exports.fetchProvinces = async () => {
  try {
    return await exports.fetch(host, 'index', pReg, 2)
  } catch (err) {
    if (err.message !== 'timeout') console.log(`抓取省级数据失败（${err}），正在重试...`)
    return exports.fetchProvinces()
  }
}

/**
 * 抓取地级数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 19:51
 */
exports.fetchCities = async (pCode) => {
  try {
    return await exports.fetch(host, pCode, casReg, 4)
  } catch (err) {
    if (err.message !== 'timeout') console.log(`抓取省级（${pCode}）的地级数据失败（${err}），正在重试...`)
    return exports.fetchCities(pCode)
  }
}

/**
 * 抓取县级数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 20:03
 */
exports.fetchAreas = async (cCode) => {
  cCode = cCode.toString()
  const pCode = cCode.substr(0, 2)

  try {
    return await exports.fetch(host, `${pCode}/${cCode}`, casReg, 6)
  } catch (err) {
    if (err.message !== 'timeout') console.log(`抓取地级（${cCode}）的县级数据失败（${err}），正在重试...`)
    return exports.fetchAreas(cCode)
  }
}

/**
 * 抓取乡级数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 20:08
 */
exports.fetchStreets = async (aCode, route) => {
  aCode = aCode.toString()
  const pCode = aCode.substr(0, 2)
  const cCodeSuffix = aCode.substr(2, 2)
  const _route = route || `${pCode}/${cCodeSuffix}/${aCode}`

  try {
    return await exports.fetch(host, _route, casReg, 9)
  } catch (err) {
    if (err.message !== 'timeout') console.log(`抓取县级（${aCode}）的乡级数据失败（${err}），正在重试...`)
    return exports.fetchStreets(aCode, route)
  }
}

/**
 * 抓取村级数据
 * @author modood <https://github.com/modood>
 * @datetime 2018-01-31 20:19
 */
exports.fetchVillages = async (sCode, route) => {
  sCode = sCode.toString()
  const pCode = sCode.substr(0, 2)
  const cCodeSuffix = sCode.substr(2, 2)
  const aCodeSuffix = sCode.substr(4, 2)
  const _route = route || `${pCode}/${cCodeSuffix}/${aCodeSuffix}/${sCode}`

  try {
    return await exports.fetch(host, _route, vReg, 12)
  } catch (err) {
    if (err.message !== 'timeout') console.log(`抓取乡级（${sCode}）的村级数据失败（${err}），正在重试...`)
    return exports.fetchVillages(sCode, route)
  }
}
