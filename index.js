'use strict'

var fs = require('fs')
var path = require('path')

var spider = require('./spider')

/**
 * 输出 JSON 数据
 * @Author   https://github.com/modood
 * @DateTime 2016-10-08 17:16
 */
module.exports = {
  outputJSON: outputJSON,
  provinces: require(path.resolve(__dirname, 'dist/provinces.json')),
  cities: require(path.resolve(__dirname, 'dist/cities.json')),
  areas: require(path.resolve(__dirname, 'dist/areas.json')),
  streets: require(path.resolve(__dirname, 'dist/streets.json')),
  address2: require(path.resolve(__dirname, 'dist/address2.json')),
  address3: require(path.resolve(__dirname, 'dist/address3.json')),
  address4: require(path.resolve(__dirname, 'dist/address4.json'))
}

/**
 * 输出 JSON 数据到 dist 目录下
 * @author modood <https://github.com/modood>
 * @datetime 2016-12-19 16:45
 */
function outputJSON () {
  spider.getData(function (err, result) {
    if (err) return console.log(err)

    var provinces = result.provinces
    var cities = result.cities
    var areas = result.areas
    var streets = result.streets

    console.log('[1/3] 正在生成 “省份、城市” 二级联动数据...')
    var pc = getAddressPC(provinces, cities)
    console.log('[2/3] 正在生成 “省份、城市、区县” 三级联动数据...')
    var pca = getAddressPCA(provinces, cities, areas)
    console.log('[3/3] 正在生成 “省份、城市、区县、乡镇” 四级联动数据...')
    var pcas = getAddressPCAS(provinces, cities, areas, streets)

    console.log('[1/7] 正在导出 “省份” JSON 数据...')
    outputFile('provinces', provinces)
    console.log('[2/7] 正在导出 “城市” JSON 数据...')
    outputFile('cities', cities)
    console.log('[3/7] 正在导出 “区县” JSON 数据...')
    outputFile('areas', areas)
    console.log('[4/7] 正在导出 “乡镇” JSON 数据...')
    outputFile('streets', streets)
    console.log('[5/7] 正在导出 “省份、城市”二级联动 JSON 数据...')
    outputFile('address2', pc)
    console.log('[6/7] 正在导出 “省份、城市、区县”三级联动 JSON 数据...')
    outputFile('address3', pca)
    console.log('[7/7] 正在导出 “省份、城市、区县、乡镇” 四级联动 JSON 数据...')
    outputFile('address4', pcas)

    console.log('数据更新完成！')
  })
}

/**
 * 获取省市二级联动数据
 * @Author   https://github.com/modood
 * @DateTime 2016-10-09 15:25
 */
function getAddressPC (provinces, cities) {
  var doc = {}

  // 过滤三级联动时才有效的名称
  var filterName = ['市辖区', '县', '省直辖县级行政区划', '自治区直辖县级行政区划'];

  provinces.forEach(function (p) {
    doc[p.name] = cities.filter(function (c) {
      return p.code === c.parent_code && filterName.every(function(filterName) {
        return c.name != filterName;
      })
    }).map(function (c) {
      return c.name
    })
  })

  return doc
}

/**
 * 获取省市区三级联动数据
 * @Author   https://github.com/modood
 * @DateTime 2016-10-09 16:00
 */
function getAddressPCA (provinces, cities, areas) {
  var doc = {}

  provinces.forEach(function (p) {
    doc[p.name] = {}

    cities.filter(function (c) {
      return p.code === c.parent_code
    }).forEach(function (c) {
      doc[p.name][c.name] = areas.filter(function (a) {
        return c.code === a.parent_code
      }).map(function (a) {
        return a.name
      })
    })
  })

  return doc
}

/**
 * 获取省市区镇四级联动数据
 * @Author   https://github.com/modood
 * @DateTime 2016-10-09 16:09
 */
function getAddressPCAS (provinces, cities, areas, streets) {
  var doc = {}

  provinces.forEach(function (p) {
    doc[p.name] = {}

    cities.filter(function (c) {
      return p.code === c.parent_code
    }).forEach(function (c) {
      doc[p.name][c.name] = {}

      areas.filter(function (a) {
        return c.code === a.parent_code
      }).forEach(function (a) {
        doc[p.name][c.name][a.name] = streets.filter(function (s) {
          return a.code === s.parent_code
        }).map(function (s) {
          return s.name
        })
      })
    })
  })

  return doc
}

/**
 * 输出 JSON 文件
 * @Author   https://github.com/modood
 * @DateTime 2016-10-08 17:16
 */
function outputFile (name, data) {
  var fileName = 'dist/' + name + '.json'

  fs.writeFileSync(path.resolve(__dirname, fileName), JSON.stringify(data))
}
