/**
 * 测试 JSON 文件的完整性
 * @Author   https://github.com/modood
 * @DateTime 2016-10-10 11:24
 */
/* eslint no-labels: ["error", { "allowLoop": true }] */

const assert = require('assert')

const chinaDivision = require('..')

const provinces = chinaDivision.provinces
const cities = chinaDivision.cities
const areas = chinaDivision.areas
const streets = chinaDivision.streets
const pc = chinaDivision.pc
const pcC = chinaDivision.pcC
const pca = chinaDivision.pca
const pcaC = chinaDivision.pcaC
const pcas = chinaDivision.pcas
const pcasC = chinaDivision.pcasC

describe('中华人民共和国行政区划：', () => {
  it('省份数据', () => {
    const i = findElem(provinces, 'code', '110000')
    assert(i !== -1)
    assert.equal(provinces[i].name, '北京市')
  })

  it('城市数据', () => {
    const i = findElem(cities, 'code', '140100')
    assert(i !== -1)
    assert.equal(cities[i].name, '太原市')
    assert.equal(cities[i].parent_code, '140000')
  })

  it('区县数据', () => {
    const i = findElem(areas, 'code', '120110')
    assert(i !== -1)
    assert.equal(areas[i].name, '东丽区')
    assert.equal(areas[i].parent_code, '120100')
  })

  it('乡镇数据', () => {
    const i = findElem(streets, 'code', '441881124000')
    assert(i !== -1)
    assert.equal(streets[i].name, '波罗镇')
    assert.equal(streets[i].parent_code, '441881')
  })

  it('“省份、城市” 二级联动数据', () => {
    assert.ok(pc['浙江省'].indexOf('杭州市') !== -1)

    for (const p in pc) {
      if (['台湾省', '香港特别行政区', '澳门特别行政区'].indexOf(p) === -1 &&
        pc[p].length === 0) throw new Error(`数据：pc.json，${p}的城市列表为空！`)
    }

    let ok = false
    const t = [
      { code: '130000', name: '河北省' },
      { code: '130300', name: '秦皇岛市' }
    ]
    loop:
    for (let i = 0; i < pcC.length; i++) {
      const p = pcC[i]
      if (['台湾省', '香港特别行政区', '澳门特别行政区'].indexOf(p.name) === -1 &&
        p.childs.length === 0) throw new Error(`数据：pc-code.json，${p.name}的城市列表为空！`)

      if (p.code === t[0].code && p.name === t[0].name) {
        for (let j = 0; j < p.childs.length; j++) {
          const c = p.childs[j]
          if (c.code === t[1].code && c.name === t[1].name) {
            ok = true
            break loop
          }
        }
      }
    }
    if (!ok) throw new Error(`数据：pc-code.json，${t[0].name}${t[1].name}找不到！`)
  })

  it('“省份、城市、区县” 三级联动数据', () => {
    assert.ok(pca['云南省']['丽江市'].indexOf('古城区') !== -1)
    assert.ok(pca['海南省']['三沙市'].indexOf('南沙群岛') !== -1)

    assert.ok(pca['广东省']['中山市'].indexOf('横栏镇') !== -1)
    assert.ok(pca['广东省']['东莞市'].indexOf('常平镇') !== -1)
    assert.ok(pca['海南省']['儋州市'].indexOf('那大镇') !== -1)
    assert.ok(pca['甘肃省']['嘉峪关市'].indexOf('文殊镇') !== -1)

    for (const p in pca) {
      for (const c in pca[p]) {
        if (pca[p][c].length === 0) throw new Error(`数据：pca.json，${p}${c}的区县列表为空！`)
      }
    }

    let ok = false
    const t = [
      { code: '140000', name: '山西省' },
      { code: '140500', name: '晋城市' },
      { code: '140524', name: '陵川县' }
    ]
    loop:
    for (let i = 0; i < pcaC.length; i++) {
      const p = pcaC[i]

      if (p.code === t[0].code && p.name === t[0].name) {
        for (let j = 0; j < p.childs.length; j++) {
          const c = p.childs[j]
          if (c.childs.length === 0) throw new Error(`数据：pca-code.json，${p.name}${c.name}的区县列表为空！`)
          if (c.code === t[1].code && c.name === t[1].name) {
            for (let k = 0; k < c.childs.length; k++) {
              const a = c.childs[k]
              if (a.code === t[2].code && a.name === t[2].name) {
                ok = true
                break loop
              }
            }
          }
        }
      }
    }
    if (!ok) throw new Error(`数据：pca-code.json，${t[0].anem}${t[1].name}${t[2].name}找不到！`)
  })

  it('“省份、城市、区县、乡镇” 四级联动数据', () => {
    assert.ok(pcas['广西壮族自治区']['玉林市']['容县'].indexOf('石头镇') !== -1)
    assert.ok(pcas['陕西省']['汉中市']['汉台区'].indexOf('七里街道') !== -1)
    assert.ok(pcas['海南省']['三沙市']['南沙群岛'].indexOf('永暑岛') !== -1)

    assert.ok(pcas['广东省']['中山市']['中山市'].indexOf('横栏镇') !== -1)
    assert.ok(pcas['广东省']['东莞市']['东莞市'].indexOf('常平镇') !== -1)
    assert.ok(pcas['海南省']['儋州市']['儋州市'].indexOf('那大镇') !== -1)
    assert.ok(pcas['甘肃省']['嘉峪关市']['嘉峪关市'].indexOf('文殊镇') !== -1)
    assert.ok(pcas['福建省']['泉州市']['金门县'].indexOf('金门县') !== -1)

    for (const p in pcas) {
      for (const c in pcas[p]) {
        for (const a in pcas[p][c]) {
          if (pcas[p][c][a].length === 0) throw new Error(`数据：pcas.json，${p}${c}${a}的乡镇列表为空！`)
        }
      }
    }

    let ok = false
    const t = [
      { code: '210000', name: '辽宁省' },
      { code: '210200', name: '大连市' },
      { code: '210211', name: '甘井子区' },
      { code: '210211007000', name: '泡崖街道' }
    ]

    loop:
    for (let i = 0; i < pcasC.length; i++) {
      const p = pcasC[i]

      if (p.code === t[0].code && p.name === t[0].name) {
        for (let j = 0; j < p.childs.length; j++) {
          const c = p.childs[j]
          if (c.code === t[1].code && c.name === t[1].name) {
            for (let k = 0; k < c.childs.length; k++) {
              const a = c.childs[k]
              if (a.childs.length === 0) throw new Error(`数据：pcas-code.json，${p.name}${c.name}${a.name}的乡镇列表为空！`)
              if (a.code === t[2].code && a.name === t[2].name) {
                for (let l = 0; l < a.childs.length; l++) {
                  const s = a.childs[l]
                  if (s.code === t[3].code && s.name === t[3].name) {
                    ok = true
                    break loop
                  }
                }
              }
            }
          }
        }
      }
    }
    if (!ok) throw new Error(`数据：pcas-code.json，${t[0].anem}${t[1].name}${t[2].name}${t[3].name} 找不到！`)
  })

  it('“某省、某市、某县、某镇” 不存在', () => {
    assert.throws(() => pcas['某省']['某市']['某县'].indexOf('某镇') !== -1)
  })
})

function findElem (arrayToSearch, attr, val) {
  for (let i = 0; i < arrayToSearch.length; i++) {
    if (arrayToSearch[i][attr] === val) {
      return i
    }
  }
  return -1
}
