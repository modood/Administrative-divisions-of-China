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
 * 获取省市区三级联动数据
 * @Author   https://github.com/modood
 * @DateTime 2016-10-09 16:00
 */
function getAddressPCA () {
  const doc = {}
  const provinces = getProvinces()
  const cities = getCities()
  const areas = getAreas()

  provinces.forEach(p => {
    doc[p.name] = {}
    cities.filter(c => p.code === c.parent_code).forEach(c => {
      doc[p.name][c.name] = areas.filter(a => c.code === a.parent_code).map(a => a.name)
    })
  })
  return doc
}

/**
 * 获取省市区镇四级联动数据
 * @Author   https://github.com/modood
 * @DateTime 2016-10-09 16:09
 */
function getAddressPCAS () {
  const doc = {}
  const provinces = getProvinces()
  const cities = getCities()
  const areas = getAreas()
  const streets = getStreets()

  provinces.forEach(p => {
    doc[p.name] = {}
    cities.filter(c => p.code === c.parent_code).forEach(c => {
      doc[p.name][c.name] = {}
      areas.filter(a => c.code === a.parent_code).forEach(a => {
        doc[p.name][c.name][a.name] = streets.filter(s => a.code === s.parent_code).map(s => s.name)
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
function outputJSON () {
  fs.writeFileSync(path.resolve(__dirname, 'dist/provinces.min.json'),        JSON.stringify(getProvinces()))
  fs.writeFileSync(path.resolve(__dirname, 'dist/cities.min.json'),           JSON.stringify(getCities()))
  fs.writeFileSync(path.resolve(__dirname, 'dist/areas.min.json'),            JSON.stringify(getAreas()))
  fs.writeFileSync(path.resolve(__dirname, 'dist/streets.min.json'),          JSON.stringify(getStreets()))
  fs.writeFileSync(path.resolve(__dirname, 'dist/address2.min.json'),         JSON.stringify(getAddressPC()))
  fs.writeFileSync(path.resolve(__dirname, 'dist/address3.min.json'),         JSON.stringify(getAddressPCA()))
  fs.writeFileSync(path.resolve(__dirname, 'dist/address4.min.json'),         JSON.stringify(getAddressPCAS()))
  console.log('It\'s saved!')
}

module.exports = {
  outputJSON,
  provinces: require(path.resolve(__dirname, 'dist/provinces.min.json')),
  cities:    require(path.resolve(__dirname, 'dist/cities.min.json')),
  areas:     require(path.resolve(__dirname, 'dist/areas.min.json')),
  streets:   require(path.resolve(__dirname, 'dist/streets.min.json')),
  address2:  require(path.resolve(__dirname, 'dist/address2.min.json')),
  address3:  require(path.resolve(__dirname, 'dist/address3.min.json')),
  address4:  require(path.resolve(__dirname, 'dist/address4.min.json')),
}

