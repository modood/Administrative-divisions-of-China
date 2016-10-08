'use strict'

const division = require('./data/division.json')
const street = require('./data/street.json')

/**
 * 获取省份数据
 * @Author   https://github.com/modood
 * @DateTime 2016-10-08 15:50
 */
exports.getProvinces = function () {
  return division.filter(a => { if (a[4] === '000000') return true }).map(a => { return { code: a[0], name: a[1] } })
}

