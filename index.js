'use strict'

const division = require('./data/division.json')
const street = require('./data/street.json')

/**
 * 获取省份数据
 * @Author   https://github.com/modood
 * @DateTime 2016-10-08 15:50
 */
exports.getProvinces = function () {
  return division.filter(a => a[4] === '000000').map(a => { return { code: a[0], name: a[1] } })
}


/**
 * 获取城市数据
 * @Author   https://github.com/modood
 * @DateTime 2016-10-08 17:58
 */
exports.getCities = function () {
  return division.filter(a => a[2]).map(a => { return { code: a[0], name: a[2], parent_code: a[4] } })
}

