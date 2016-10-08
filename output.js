'use strict'

const fs = require('fs')
const path = require('path')

const getProvinces = require('.').getProvinces

/**
 * 输出 JSON 文件
 * @Author   https://github.com/modood
 * @DateTime 2016-10-08 17:16
 */
function outputJSON () {
  fs.writeFileSync(path.resolve(__dirname, 'dist/provinces.json'), JSON.stringify(getProvinces()))
  console.log('It\'s saved!')
}

outputJSON()

