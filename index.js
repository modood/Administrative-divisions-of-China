'use strict'

const fs = require('fs')
const path = require('path')

const division = require('./data/division.json')
const street = require('./data/street.json')

/**
 * 获取省份数据
 * @Author   https://github.com/modood
 * @DateTime 2016-10-08 15:50
 */
function getProvinces () {
  return division.filter(a => a[4] === '000000').map(a => { return { code: a[0], name: a[1] } })
}

/**
 * 获取城市数据
 * @Author   https://github.com/modood
 * @DateTime 2016-10-08 17:58
 */
function getCities () {
  return division.filter(a => a[2]).map(a => { return { code: a[0], name: a[2], parent_code: a[4] } })
}

/**
 * 获取区县数据
 * @Author   https://github.com/modood
 * @DateTime 2016-10-08 18:10
 */
function getAreas () {
  return division.filter(a => a[3]).map(a => { return { code: a[0], name: a[3], parent_code: a[4] } })
}

/**
 * 获取乡镇（街道）数据
 * @Author   https://github.com/modood
 * @DateTime 2016-10-09 15:08
 */
function getStreets () {
  return street.map(a => { return { code: a[0], name: a[1], pinyin: a[3], parent_code: a[2]} })
}

/**
 * 获取省市二级联动数据
 * @Author   https://github.com/modood
 * @DateTime 2016-10-09 15:25
 */
function getAddressPC () {
  const doc = {}
  const provinces = getProvinces()
  const cities = getCities()

  provinces.forEach(p => doc[p.name] = cities.filter(c => p.code === c.parent_code).map(c => c.name))

  return doc
}

/**
 * 输出 JSON 文件
 * @Author   https://github.com/modood
 * @DateTime 2016-10-08 17:16
 */
function outputJSON () {
  fs.writeFileSync(path.resolve(__dirname, 'dist/provinces.json'), JSON.stringify(getProvinces()))
  fs.writeFileSync(path.resolve(__dirname, 'dist/cities.json'),    JSON.stringify(getCities()))
  fs.writeFileSync(path.resolve(__dirname, 'dist/areas.json'),     JSON.stringify(getAreas()))
  fs.writeFileSync(path.resolve(__dirname, 'dist/streets.json'),   JSON.stringify(getStreets()))
  console.log('It\'s saved!')
}

module.exports = {
  getProvinces,
  getCities,
  getAreas,
  getStreets,
  outputJSON,
}

