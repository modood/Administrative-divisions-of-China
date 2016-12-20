'use strict'

/**
 * 测试 JSON 文件的完整性
 * @Author   https://github.com/modood
 * @DateTime 2016-10-10 11:24
 */

const assert = require('assert')

const chinaDivision = require('..')

const provinces = chinaDivision.provinces;
const cities    = chinaDivision.cities;
const areas     = chinaDivision.areas;
const streets   = chinaDivision.streets;
const address2  = chinaDivision.address2;
const address3  = chinaDivision.address3;
const address4  = chinaDivision.address4;

describe('中华人民共和国行政区划：', function () {

  it('省份数据', function () {
    var i = findElem(provinces, 'code', '110000')
    assert(i !== -1)
    assert.equal(provinces[i].name, '北京市')
  });

  it('城市数据', function () {
    var i = findElem(cities, 'code', '140100')
    assert(i !== -1)
    assert.equal(cities[i].name, '太原市')
    assert.equal(cities[i].parent_code, '140000')
  });

  it('区县数据', function () {
    var i = findElem(areas, 'code', '120110')
    assert(i !== -1)
    assert.equal(areas[i].name, '东丽区')
    assert.equal(areas[i].parent_code, '120100')
  });

  it('乡镇数据', function () {
    var i = findElem(streets, 'code', '441881124000')
    assert(i !== -1)
    assert.equal(streets[i].name, '波罗镇')
    assert.equal(streets[i].parent_code, '441881')
  });

  it('“省份、城市” 二级联动数据', function () {
    assert.ok(address2['浙江省'].indexOf('杭州市') !== -1)
  });

  it('“省份、城市、区县” 三级联动数据', function () {
    assert.ok(address3['云南省']['丽江市'].indexOf('古城区') !== -1)
  });

  it('“省份、城市、区县、乡镇” 四级联动数据', function () {
    assert.ok(address4['广西壮族自治区']['玉林市']['容县'].indexOf('石头镇') !== -1)
  });

  it('“某省、某市、某县、某镇” 不存在', function () {
    assert.throws(() => address4['某省']['某市']['某县'].indexOf('某镇') !== -1)
  });

});

function findElem (arrayToSearch, attr, val) {
  for (var i = 0; i < arrayToSearch.length; i++) {
    if (arrayToSearch[i][attr] === val) {
      return i
    }
  }
  return -1
}
