'use strict'

/**
 * 测试 JSON 文件的完整性
 * @Author   https://github.com/modood
 * @DateTime 2016-10-10 11:24
 */

var assert = require('assert')

var chinaDivision = require('..')

var provinces = chinaDivision.provinces
var cities = chinaDivision.cities
var areas = chinaDivision.areas
var streets = chinaDivision.streets
var address2 = chinaDivision.address2
var address3 = chinaDivision.address3
var address4 = chinaDivision.address4

describe('中华人民共和国行政区划：', function () {
  it('省份数据', function () {
    var i = findElem(provinces, 'code', '110000')
    assert(i !== -1)
    assert.equal(provinces[i].name, '北京市')
  })

  it('城市数据', function () {
    var i = findElem(cities, 'code', '140100')
    assert(i !== -1)
    assert.equal(cities[i].name, '太原市')
    assert.equal(cities[i].parent_code, '140000')
  })

  it('区县数据', function () {
    var i = findElem(areas, 'code', '120110')
    assert(i !== -1)
    assert.equal(areas[i].name, '东丽区')
    assert.equal(areas[i].parent_code, '120100')
  })

  it('乡镇数据', function () {
    var i = findElem(streets, 'code', '441881124000')
    assert(i !== -1)
    assert.equal(streets[i].name, '波罗镇')
    assert.equal(streets[i].parent_code, '441881')
  })

  it('“省份、城市” 二级联动数据', function () {
    assert.ok(address2['浙江省'].indexOf('杭州市') !== -1)

    for (var p in address2) {
      if (['台湾省', '香港特别行政区', '澳门特别行政区'].indexOf(p) === -1 &&
        address2[p].length === 0) throw new Error(p + '的城市列表为空')
    }
  })

  it('“省份、城市、区县” 三级联动数据', function () {
    assert.ok(address3['云南省']['丽江市'].indexOf('古城区') !== -1)
    assert.ok(address3['海南省']['三沙市'].indexOf('南沙群岛') !== -1)

    assert.ok(address3['广东省']['中山市'].indexOf('横栏镇') !== -1)
    assert.ok(address3['广东省']['东莞市'].indexOf('常平镇') !== -1)
    assert.ok(address3['海南省']['儋州市'].indexOf('那大镇') !== -1)
    assert.ok(address3['甘肃省']['嘉峪关市'].indexOf('文殊镇') !== -1)

    for (var p in address3) {
      for (var c in address3[p]) {
        if (address3[p][c].length === 0) throw new Error(p + c + '的区县列表为空')
      }
    }
  })

  it('“省份、城市、区县、乡镇” 四级联动数据', function () {
    assert.ok(address4['广西壮族自治区']['玉林市']['容县'].indexOf('石头镇') !== -1)
    assert.ok(address4['海南省']['三沙市']['南沙群岛'].indexOf('永暑岛') !== -1)

    assert.ok(address4['广东省']['中山市']['中山市'].indexOf('横栏镇') !== -1)
    assert.ok(address4['广东省']['东莞市']['东莞市'].indexOf('常平镇') !== -1)
    assert.ok(address4['海南省']['儋州市']['儋州市'].indexOf('那大镇') !== -1)
    assert.ok(address4['甘肃省']['嘉峪关市']['嘉峪关市'].indexOf('文殊镇') !== -1)
    assert.ok(address4['福建省']['泉州市']['金门县'].indexOf('金门县') !== -1)

    for (var p in address4) {
      for (var c in address4[p]) {
        for (var a in address4[p][c]) {
          if (address4[p][c][a].length === 0) throw new Error(p + c + a + '的乡镇列表为空')
        }
      }
    }
  })

  it('“某省、某市、某县、某镇” 不存在', function () {
    assert.throws(() => address4['某省']['某市']['某县'].indexOf('某镇') !== -1)
  })
})

function findElem (arrayToSearch, attr, val) {
  for (var i = 0; i < arrayToSearch.length; i++) {
    if (arrayToSearch[i][attr] === val) {
      return i
    }
  }
  return -1
}
