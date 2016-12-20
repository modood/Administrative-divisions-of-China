'use strict'

var http = require('http')

var async = require('async')
var iconv = require('iconv-lite')
var BufferHelper = require('bufferhelper')

var i = 0

/**
 * 从国家统计局（http://www.stats.gov.cn/）抓取县级以及县级以上行政区划数据
 * @author modood <https://github.com/modood>
 * @datetime 2016-12-19 16:32
 */
function fetch (callback) {
  // 数据截止2015年9月30日（发布时间：2016-08-09 11:28）
  http.get('http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/201608/t20160809_1386477.html', function (res) {
    var rawData = ''
    var statusCode = res.statusCode

    console.log('[1/1] 正在抓取省份、城市和区县数据...')

    if (statusCode !== 200) {
      res.resume()
      return callback(new Error('Request Failed. Status Code: ' + statusCode))
    }

    res.setEncoding('utf8')

    res.on('data', function (chunk) {
      rawData += chunk
    })

    res.on('end', function () {
      var current
      var result = {}
      var reg = /<span lang="EN-US">(.*?)<span>&nbsp;&nbsp;&nbsp;&nbsp; <\/span><\/span><span style="font-family: 宋体">(.*?)<\/span>/g

      while ((current = reg.exec(rawData)) !== null) {
        result[current[1]] = current[2].trim()
      }
      return callback(null, result)
    })
  })
  .on('error', callback)
}

/**
 * 从国家统计局（http://www.stats.gov.cn/）抓取城乡行政区划数据
 * @author modood <https://github.com/modood>
 * @datetime 2016-12-19 16:35
 */
function fetchStreets (area, total, callback) {
  var html = ''
  var areaCode = area.code
  var areaName = area.name

  // 两个特殊城市单独处理（中山市和东莞市没有县级行政区划）
  switch (areaCode) {
    case '441900': html = '44/4419.html'; break
    case '442000': html = '44/4420.html'; break
    default: html = areaCode.substr(0, 2) + '/' + areaCode.substr(2, 2) + '/' + areaCode + '.html'
  }

  // 数据截止2015年9月30日（发布时间：2016-07-27）
  http.get('http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2015/' + html, function (res) {
    var bufferHelper = new BufferHelper()
    var statusCode = res.statusCode

    if (['441900', '442000'].indexOf(areaCode) === -1) {
      console.log('[' + ++i + '/' + total + '] 正在抓取乡镇数据，当前区县：', areaCode, areaName)
    }

    if (statusCode !== 200) {
      res.resume()
      return callback(null, {})
    }

    res.on('data', function (chunk) {
      bufferHelper.concat(chunk)
    })

    res.on('end', function () {
      var rawData = iconv.decode(bufferHelper.toBuffer(), 'GBK')
      var current
      var result = {}
      var reg = /<tr class='towntr'><td><a href=.*?>(.*?)<\/a><\/td><td><a href=.*?>(.*?)<\/a><\/td><\/tr>/g

      while ((current = reg.exec(rawData)) !== null) {
        result[current[1]] = current[2].trim()
      }
      return callback(null, result)
    })
  })
  .on('error', function () {
    console.log('连接超时，马上重试...')
    fetchStreets(area, total, callback)
  })
}

/**
 * 提取省份、城市和区县数据
 * @author modood <https://github.com/modood>
 * @datetime 2016-12-20 13:18
 */
function pick (callback) {
  fetch(function (err, data) {
    var provinces = []
    var cities = []
    var areas = []

    if (err) return callback(err)

    for (var k in data) {
      if (k.substr(2, 4) === '0000') {
        // 省份数据
        provinces.push({
          code: k,
          name: data[k]
        })
      } else if (k.substr(4, 2) === '00' && k.substr(2, 4) !== '0000') {
        // 城市数据
        cities.push({
          code: k,
          name: data[k],
          parent_code: k.substr(0, 2) + '0000'
        })
      } else if (k.substr(4, 2) !== '00') {
        // 区县数据
        areas.push({
          code: k,
          name: data[k],
          parent_code: k.substr(0, 4) + '00'
        })
      }
    }

    return callback(null, {
      provinces: provinces,
      cities: cities,
      areas: areas
    })
  })
}

/**
 * 提取乡镇数据
 * @author modood <https://github.com/modood>
 * @datetime 2016-12-20 13:17
 */
function pickStreets (areas, callback) {
  var streets = []

  async.mapLimit(areas, 10, function (item, cb) {
    fetchStreets(item, areas.length, function (err, data) {
      if (err) return cb(err)

      for (var k in data) {
        // 乡镇数据
        streets.push({
          code: k,
          name: data[k],
          parent_code: k.substr(0, 6)
        })
      }
      return cb(null)
    })
  }, function (err) {
    if (err) console.log('getStreets timeout, ignored:\n', err)
    return callback(null, streets)
  })
}

/**
 * 两个特殊城市单独处理（中山市和东莞市没有县级行政区划）
 * @author modood <https://github.com/modood>
 * @datetime 2016-12-20 15:11
 */
function handleSpecialCities (callback) {
  var areas = [
    {
      code: '442000',
      name: '中山市',
      parent_code: '442000'
    },
    {
      code: '441900',
      name: '东莞市',
      parent_code: '441900'
    }
  ]
  var streets = []

  async.each(areas, function (area, cb) {
    fetchStreets(area, areas.length, function (err, data) {
      if (err) return cb(err)

      for (var k in data) {
        streets.push({
          code: k,
          name: data[k],
          parent_code: k.substr(0, 6)
        })
      }
      return cb(null)
    })
  }, function (err, result) {
    if (err) return callback(err)

    return callback(null, {
      areas: areas,
      streets: streets
    })
  })
}

/**
 * 对抓取到的数据进行处理，提取出“省份”、“城市”、“区县”和“乡镇”四种数据
 * @author modood <https://github.com/modood>
 * @datetime 2016-12-19 16:37
 */
exports.getData = function (callback) {
  async.auto({
    pca: function (cb) {
      pick(cb)
    },
    streets: ['pca', function (result, cb) {
      var areas = result.pca.areas
      pickStreets(areas, cb)
    }]
  }, function (err, result) {
    if (err) return callback(err)

    handleSpecialCities(function (err, r) {
      if (err) return callback(err)

      var areas = result.pca.areas.concat(r.areas)
      var streets = result.streets.concat(r.streets)

      return callback(null, {
        provinces: result.pca.provinces,
        cities: result.pca.cities,
        areas: areas,
        streets: streets
      })
    })
  })
}
