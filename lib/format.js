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
  const res = await Province.findAll({
    include: [{ model: City,
      include: [{ model: Area }] }] })

  const count = res.length
  let index = 0

  // 特殊处理：出于实用性考虑，过滤没有太大用处的二级名称，
  // 并使用其第三级（县级）补进
  const f = ['市辖区', '县', '省直辖县级行政区划', '自治区直辖县级行政区划']

  const r = {}
  const rC = _.map(res, p => {
    index++
    const pd = p.dataValues
    const { code, name } = pd
    log(index, count, code, name, 2)
    const arr = []
    pd.children = _.map(_.filter(p.cities, c => {
      const { dataValues: { name }, areas } = c
      if (f.includes(name)) {
        arr.push(..._.map(areas, a => _.pick(a.dataValues, cField)))
        return false
      }
      return true
    }), c => _.pick(c.dataValues, cField))
    pd.children.push(...arr)

    r[pd.name] = pd.children.map(c => c.name)
    return _.pick(pd, fField)
  })
  return [r, rC]
}

/**
 * 获取省市区三级联动数据
 * @author   https://github.com/modood
 * @datetime 2018-02-01 22:13
 */
exports.getAddressPCA = async () => {
  const res = await Province.findAll({
    include: [{ model: City,
      include: [{ model: Area }] }] })

  // 特殊处理：中山市、东莞市、儋州市和嘉峪关市没有第三级（县级），
  // 嘉峪关市有第三级，但是有且只有一个（市辖区：620201），
  // 出于实用性考虑，使用第四级（乡级）补进
  const f = ['4419', '4420', '4604', '6202']
  const streets = await Promise.all(
    _.map(f, cityCode => Street.findAll({ where: { cityCode } })))

  const count = res.length
  let index = 0

  const r = {}
  const rC = _.map(res, p => {
    index++
    const pd = p.dataValues
    const { code, name } = pd
    r[pd.name] = {}
    log(index, count, code, name, 3)
    pd.children = _.map(p.cities, c => {
      const cd = c.dataValues
      const { code, name } = cd
      log(index, count, code, name, 3)

      const idx = f.indexOf(code)
      if (idx !== -1) {
        cd.children = _.map(streets[idx], s => {
          // 特殊处理：第四级（乡级）过滤掉“办事处”后缀
          const sd = s.dataValues
          sd.name = sd.name.replace('办事处', '')
          return _.pick(sd, cField)
        })
      } else {
        cd.children = _.map(c.areas, a =>
          _.pick(a.dataValues, cField))
      }

      r[pd.name][cd.name] = _.map(cd.children, i => i.name)
      return _.pick(cd, fField)
    })
    return _.pick(pd, fField)
  })
  return [r, rC]
}

/**
 * 获取省市区镇四级联动数据
 * @author   https://github.com/modood
 * @datetime 2018-02-02 09:51
 */
exports.getAddressPCAS = async () => {
  const res = await Province.findAll({
    include: [{ model: City,
      include: [{ model: Area,
        include: [{ model: Street }] }] }] })

  const count = res.length
  let index = 0

  const r = {}
  const rC = _.map(res, p => {
    index++
    const pd = p.dataValues
    const { code, name } = pd
    r[pd.name] = {}
    log(index, count, code, name, 4)
    pd.children = _.map(p.cities, c => {
      const cd = c.dataValues
      const { code, name } = cd
      r[pd.name][cd.name] = {}
      log(index, count, code, name, 4)
      cd.children = _.map(c.areas, a => {
        const ad = a.dataValues
        const { code, name } = ad
        log(index, count, code, name, 4)
        ad.children = _.map(a.streets, s => {
          // 特殊处理：第四级（乡级）过滤掉“办事处”后缀
          const sd = s.dataValues
          sd.name = sd.name.replace('办事处', '')
          return _.pick(sd, cField)
        })
        r[pd.name][cd.name][ad.name] = _.map(ad.children, s => s.name)
        return _.pick(ad, fField)
      })
      return _.pick(cd, fField)
    })
    return _.pick(pd, fField)
  })
  return [r, rC]
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
