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
const villages = chinaDivision.villages

const pc = chinaDivision.pc
const pcC = chinaDivision.pcC
const pca = chinaDivision.pca
const pcaC = chinaDivision.pcaC
const pcas = chinaDivision.pcas
const pcasC = chinaDivision.pcasC

describe('中华人民共和国行政区划：', () => {
  it('“一级” 省级（省份、直辖市、自治区）数据', () => {
    const i = findElem(provinces, 'code', '11')
    assert(i !== -1)
    assert.equal(provinces[i].name, '北京市')
  })

  it('“二级” 地级（城市）数据', () => {
    const i = findElem(cities, 'code', '1401')
    assert(i !== -1)
    assert.equal(cities[i].name, '太原市')
    assert.equal(cities[i].provinceCode, '14')
  })

  it('“三级” 县级（区县）数据', () => {
    const i = findElem(areas, 'code', '120110')
    assert(i !== -1)
    assert.equal(areas[i].name, '东丽区')
    assert.equal(areas[i].cityCode, '1201')
    assert.equal(areas[i].provinceCode, '12')
  })

  it('“四级” 乡级（乡镇、街道）数据', () => {
    const i = findElem(streets, 'code', '441881124')
    assert(i !== -1)
    assert.equal(streets[i].name, '波罗镇')
    assert.equal(streets[i].areaCode, '441881')
    assert.equal(streets[i].cityCode, '4418')
    assert.equal(streets[i].provinceCode, '44')
  })

  it('“五级” 村级（村委会、居委会）数据', () => {
    const i = findElem(villages, 'code', '421303101216')
    assert(i !== -1)
    assert.equal(villages[i].name, '高庙村委会')
    assert.equal(villages[i].streetCode, '421303101')
    assert.equal(villages[i].areaCode, '421303')
    assert.equal(villages[i].cityCode, '4213')
    assert.equal(villages[i].provinceCode, '42')
  })
})

describe('联动数据', () => {
  it('“省份、城市” 二级联动数据', () => {
    assert.ok(pc['浙江省'].indexOf('杭州市') !== -1)
    assert.ok(pc['河南省'].indexOf('济源市') !== -1)
    assert.ok(pc['湖北省'].indexOf('仙桃市') !== -1)
    assert.ok(pc['新疆维吾尔自治区'].indexOf('铁门关市') !== -1)

    for (const p in pc) {
      if (['台湾省', '香港特别行政区', '澳门特别行政区'].indexOf(p) === -1 &&
        pc[p].length === 0) throw new Error(`数据：pc.json，${p}的城市列表为空！`)
    }

    let ok = false
    const t = [
      { code: '41', name: '河南省' },
      { code: '419001', name: '济源市' }
    ]
    loop:
    for (let i = 0; i < pcC.length; i++) {
      const p = pcC[i]
      if (['台湾省', '香港特别行政区', '澳门特别行政区'].indexOf(p.name) === -1 &&
        p.children.length === 0) throw new Error(`数据：pc-code.json，${p.name}的城市列表为空！`)

      if (p.code === t[0].code && p.name === t[0].name) {
        for (let j = 0; j < p.children.length; j++) {
          const c = p.children[j]
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
      { code: '14', name: '山西省' },
      { code: '1405', name: '晋城市' },
      { code: '140524', name: '陵川县' }
    ]
    loop:
    for (let i = 0; i < pcaC.length; i++) {
      const p = pcaC[i]

      if (p.code === t[0].code && p.name === t[0].name) {
        for (let j = 0; j < p.children.length; j++) {
          const c = p.children[j]
          if (c.children.length === 0) throw new Error(`数据：pca-code.json，${p.name}${c.name}的区县列表为空！`)
          if (c.code === t[1].code && c.name === t[1].name) {
            for (let k = 0; k < c.children.length; k++) {
              const a = c.children[k]
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
      { code: '21', name: '辽宁省' },
      { code: '2102', name: '大连市' },
      { code: '210211', name: '甘井子区' },
      { code: '210211007', name: '泡崖街道' }
    ]

    loop:
    for (let i = 0; i < pcasC.length; i++) {
      const p = pcasC[i]

      if (p.code === t[0].code && p.name === t[0].name) {
        for (let j = 0; j < p.children.length; j++) {
          const c = p.children[j]
          if (c.code === t[1].code && c.name === t[1].name) {
            for (let k = 0; k < c.children.length; k++) {
              const a = c.children[k]
              if (a.children.length === 0) throw new Error(`数据：pcas-code.json，${p.name}${c.name}${a.name}的乡镇列表为空！`)
              if (a.code === t[2].code && a.name === t[2].name) {
                for (let l = 0; l < a.children.length; l++) {
                  const s = a.children[l]
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
