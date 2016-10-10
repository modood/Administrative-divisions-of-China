'use strict'

/**
 * 测试脚本
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
    assert.equal('110000', provinces[0].code)
    assert.equal('北京市', provinces[0].name)
  });

  it('城市数据', function () {
    assert.equal('110100', cities[0].code)
    assert.equal('北京市', cities[0].name)
    assert.equal('110000', cities[0].parent_code)
  });

  it('区县数据', function () {
    assert.equal('110101', areas[0].code)
    assert.equal('东城区', areas[0].name)
    assert.equal('110100', areas[0].parent_code)
  });

  it('乡镇（街道）数据', function () {
    assert.equal('110101001', streets[0].code)
    assert.equal('东华门街道', streets[0].name)
    assert.equal('dong hua men jie dao', streets[0].pinyin)
    assert.equal('110101', streets[0].parent_code)
  });

  it('“省、市” 二级联动数据', function () {
    assert.ok(address2['浙江省'].indexOf('杭州市') !== -1)
  });

  it('“省、市、区” 三级联动数据', function () {
    assert.ok(address3['云南省']['丽江市'].indexOf('古城区') !== -1)
  });

  it('“省、市、区、镇” 四级联动数据', function () {
    assert.ok(address4['广西壮族自治区']['玉林市']['容县'].indexOf('石头镇') !== -1)
  });

  it('“某省、某市、某县、某镇” 不存在', function () {
    assert.throws(() => address4['某省']['某市']['某县'].indexOf('某镇') !== -1)
  });

});

