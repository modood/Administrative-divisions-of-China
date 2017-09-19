const path = require('path')

const _ = require('lodash')

const out = require('./out')

const provinces = require(path.resolve(__dirname, '../dist/provinces.json'))
const cities = require(path.resolve(__dirname, '../dist/cities.json'))
const areas = require(path.resolve(__dirname, '../dist/areas.json'))
const streets = require(path.resolve(__dirname, '../dist/streets.json'))

;(function () {
  console.log('[1/4] 正在导出 “省份、城市” 二级联动数据...')
  const [pc, pcC] = getAddressPC(provinces, cities)
  out('pc', pc)
  out('pc-code', pcC)

  console.log('[2/4] 正在导出 “省份、城市、区县” 三级联动数据...')
  const [pca, pcaC] = getAddressPCA(provinces, cities, areas, streets)
  out('pca', pca)
  out('pca-code', pcaC)

  console.log('[3/4] 正在导出 “省份、城市、区县、乡镇” 四级联动数据...该步骤操作数据较多，比较耗时，请耐心等候...')
  const [pcas, pcasC] = getAddressPCAS(provinces, cities, areas, streets)
  out('pcas', pcas)
  out('pcas-code', pcasC)

  console.log('[4/4] 数据更新完成！')
})()

/**
 * 获取省市二级联动数据
 * @Author   https://github.com/modood
 * @DateTime 2017-09-18 15:14
 */
function getAddressPC (provinces, cities) {
  const r = {}
  const rC = _.cloneDeep(provinces)

  // 过滤没有太大用处的二级名称
  const f = ['县', '省直辖县级行政区划', '自治区直辖县级行政区划']

  _.forEach(rC, p => {
    p.childs = _.map(
      _.filter(_.cloneDeep(cities), c => p.code === c.parent_code && _.every(f, n => c.name !== n)),
      c => delete c.parent_code && c
    )

    // 四个直辖市（北京、天津、上海、重庆）仅有一个二级（城市）名为市辖区，
    // 出于实用性考虑，将二级（城市）重命名为第一级（省份）名称
    if (p.childs.length === 1 && p.childs[0].name === '市辖区') p.childs[0].name = p.name

    r[p.name] = p.childs.map(c => c.name)
  })

  return [r, rC]
}

/**
 * 获取省市区三级联动数据
 * @Author   https://github.com/modood
 * @DateTime 2017-09-18 15:27
 */
function getAddressPCA (provinces, cities, areas, streets) {
  const r = {}
  const rC = _.cloneDeep(provinces)
  // 特殊城市处理，中山市、东莞市、儋州市和嘉峪关市没有第三级（区县），
  // 嘉峪关市有第三级，但是有且只有一个（市辖区：620201），
  // 出于实用性考虑，使用第四级（乡镇街道）补进
  const f = ['441900', '442000', '460400', '620200']

  _.forEach(rC, p => {
    r[p.name] = {}
    p.childs = _.map(
      _.filter(_.cloneDeep(cities), c => p.code === c.parent_code),
      c => delete c.parent_code && c
    )
    _.forEach(p.childs, c => {
      const it = _.includes(f, c.code) ? _.cloneDeep(streets) : _.cloneDeep(areas)

      c.childs = _.map(
        // 嘉峪关市比较特殊，二级（嘉峪关市：620200）三级只有一个（市辖区：620201），
        // 因此用第四级数据补进第三级的话，需要处理一下
        _.filter(it, i => (c.code === '620200' ? '620201' : c.code) === i.parent_code),
        i => delete i.parent_code && i
      )
      r[p.name][c.name] = _.map(c.childs, i => i.name)
    })
  })

  return [r, rC]
}

/**
 * 获取省市区镇四级联动数据
 * @Author   https://github.com/modood
 * @DateTime 2017-09-18 17:28
 */
function getAddressPCAS (provinces, cities, areas, streets) {
  const r = {}
  const rC = _.cloneDeep(provinces)

  _.forEach(rC, p => {
    r[p.name] = {}
    p.childs = _.map(
      _.filter(_.cloneDeep(cities), c => p.code === c.parent_code),
      c => delete c.parent_code && c
    )
    _.forEach(p.childs, c => {
      r[p.name][c.name] = {}
      c.childs = _.map(
        _.filter(_.cloneDeep(areas), a => c.code === a.parent_code),
        a => delete a.parent_code && a
      )
      _.forEach(c.childs, a => {
        // 特殊区县单独处理，福建省泉州市金门县没有第四级（乡镇），
        // 出于实用性考虑，使用一个第三级（区县）替代
        if (a.code === '350527') {
          a.childs = [{ name: '金门县', code: '350527000000' }]
          r[p.name][c.name][a.name] = ['金门县']
          return
        }

        a.childs = _.map(
          _.filter(_.cloneDeep(streets), s => a.code === s.parent_code),
          // 第四级（街道）数据过滤掉“办事处”后缀
          s => delete s.parent_code && (s.name = s.name.replace('办事处', '')) && s
        )
        r[p.name][c.name][a.name] = _.map(a.childs, s => s.name)
      })
    })
  })

  return [r, rC]
}
