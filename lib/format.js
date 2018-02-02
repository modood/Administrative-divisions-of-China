const _ = require('lodash')

const { Province, City, Area, Street } = require('./sqlite')

const cField = ['code', 'name']
const fField = cField.concat('children')

/**
 * 获取省市二级联动数据
 * @author   https://github.com/modood
 * @datetime 2018-02-01 22:08
 */
exports.getAddressPC = async () => {
  const r = await Province.findAll({
    include: [{ model: City }] })

  const count = r.length
  let index = 0

  return _.map(r, p => {
    index++
    const { code, name } = p.dataValues
    log(index, count, code, name, 2)
    p.dataValues.children = _.map(p.cities, c =>
      _.pick(c.dataValues, cField))

    return _.pick(p.dataValues, fField)
  })
}

/**
 * 获取省市区三级联动数据
 * @author   https://github.com/modood
 * @datetime 2018-02-01 22:13
 */
exports.getAddressPCA = async () => {
  const r = await Province.findAll({
    include: [{ model: City,
      include: [{ model: Area }] }] })

  const count = r.length
  let index = 0

  return _.map(r, p => {
    index++
    const { code, name } = p.dataValues
    log(index, count, code, name, 3)
    p.dataValues.children = _.map(p.cities, c => {
      const { code, name } = c.dataValues
      log(index, count, code, name, 3)
      c.dataValues.children = _.map(c.areas, a =>
        _.pick(a.dataValues, cField))

      return _.pick(c.dataValues, fField)
    })
    return _.pick(p.dataValues, fField)
  })
}

/**
 * 获取省市区镇四级联动数据
 * @author   https://github.com/modood
 * @datetime 2018-02-02 09:51
 */
exports.getAddressPCAS = async () => {
  const r = await Province.findAll({
    include: [{ model: City,
      include: [{ model: Area,
        include: [{ model: Street }] }] }] })

  const count = r.length
  let index = 0

  return _.map(r, p => {
    index++
    const { code, name } = p.dataValues
    log(index, count, code, name, 4)
    p.dataValues.children = _.map(p.cities, c => {
      const { code, name } = c.dataValues
      log(index, count, code, name, 4)
      c.dataValues.children = _.map(c.areas, a => {
        const { code, name } = a.dataValues
        log(index, count, code, name, 4)
        a.dataValues.children = _.map(a.streets, s =>
          _.pick(s.dataValues, cField))

        return _.pick(a.dataValues, fField)
      })
      return _.pick(c.dataValues, fField)
    })
    return _.pick(p.dataValues, fField)
  })
}

function log (index, total, code, name, type) {
  if (index >= 0 && index <= 9) index = `0${index}`
  const clen = code.length

  if ((type === 3 && clen === 2) ||
    (type === 4 && clen === 4)) code = `${code}  `
  else if (type === 4 && clen === 2) code = `${code}    `

  let text = ''
  switch (type) {
    case 2:
      text = '正在格式化省市二级联动数据'
      break
    case 3:
      text = '正在格式化省市区三级联动数据，请耐心等候'
      break
    case 4:
      text = '正在格式化省市区镇四级联动数据，该步骤比较耗时，请耐心等候'
      break
  }

  console.log(`[${index}/${total}]${text} ${code} ${name}`)
}
