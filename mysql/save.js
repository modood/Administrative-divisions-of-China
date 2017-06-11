'use strict'

const fs = require('fs')
const path = require('path')

// 从文件读取区域数据
const readJsonFile = function (fileName) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, fileName), 'utf8'))
}

const provArray = readJsonFile('../dist/provinces.json')
const cityArray = readJsonFile('../dist/cities.json')
const areaArray = readJsonFile('../dist/areas.json')

const database = 'test'
const tablePrefix = 'ps_'
const provTb = tablePrefix + 'province'
const cityTb = tablePrefix + 'city'
const areaTb = tablePrefix + 'area'

const dataCreateSql = `create database IF NOT EXISTS ${database}`
  // 表格创建SQL
const tableCreateSql = `
CREATE TABLE IF NOT EXISTS \`${provTb}\` (
\`code\` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
\`name\` varchar(32) NOT NULL,
PRIMARY KEY(\`code\`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='省份表';`

const tableCreateSql2 = `
CREATE TABLE IF NOT EXISTS \`${cityTb}\` (
\`code\` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
\`name\` varchar(32) NOT NULL,
\`parent_code\` int(11) UNSIGNED NOT NULL,
PRIMARY KEY(\`code\`), KEY(\`parent_code\`)
) ENGINE=InnoDB  AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='城市表';`

const tableCreateSql3 = `
CREATE TABLE IF NOT EXISTS \`${areaTb}\` (
\`code\` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
\`name\` varchar(32) NOT NULL,
\`parent_code\` int(11) UNSIGNED NOT NULL,
PRIMARY KEY(\`code\`), KEY(\`parent_code\`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='地区表';
`

// 省份数据添加
var provDataInsertSql = `INSERT INTO \`${provTb}\` (\`code\`, \`name\`) VALUES `
// 城市数据添加
var cityDataInsertSql = `INSERT INTO \`${cityTb}\` (\`code\`, \`name\`, \`parent_code\`) VALUES `
// 地区数据添加
var areaDataInsertSql = `INSERT INTO \`${areaTb}\` (\`code\`, \`name\`, \`parent_code\`) VALUES `
// 省份数据删除
var provDeleteSql = `DROP TABLE IF EXISTS ${provTb};`
// 城市数据删除
var cityDeleteSql = `DROP TABLE IF EXISTS ${cityTb};`
// 地区数据删除
var areaDeleteSql = `DROP TABLE IF EXISTS ${areaTb};`
 // 省市区数据组装
var values = []
provArray.forEach(function (prov) {
  values.push(`(${prov['code']}, '${prov['name']}')`)
})
provDataInsertSql += values.join(',') + ';'

values = []
cityArray.forEach(function (city) {
  values.push(`(${city['code']}, '${city['name']}', '${city['parent_code']}')`)
})
cityDataInsertSql += values.join(',') + ';'

values = []
areaArray.forEach(function (area) {
  values.push(`(${area['code']}, '${area['name']}', '${area['parent_code']}')`)
})
areaDataInsertSql += values.join(',') + ';'
values = null

async function execute () {
  const mysql = require('mysql2/promise')
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root'
  })

  await connection.query(dataCreateSql)
  await connection.query('use ' + database)

  await connection.query(provDeleteSql)
  await connection.query(cityDeleteSql)
  await connection.query(areaDeleteSql)

  // 执行表格创建
  await connection.query(tableCreateSql)
  await connection.query(tableCreateSql2)
  await connection.query(tableCreateSql3)

  try {
    await connection.beginTransaction()
    await connection.query(provDataInsertSql)
    await connection.query(cityDataInsertSql)
    await connection.query(areaDataInsertSql)
    await connection.commit()
    console.info('导入数据完毕')
  } catch (e) {
    console.log('导入数据失败：' + e.message)
    await connection.rollback()
    process.exit(1)
  }
  process.exit(0)
}

execute()
