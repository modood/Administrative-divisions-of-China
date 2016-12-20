# Administrative-divisions-of-China

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)
[![Deps](https://david-dm.org/modood/Administrative-divisions-of-China.svg)](https://david-dm.org/modood/Administrative-divisions-of-China)
[![npm](https://img.shields.io/npm/v/china-division.svg)](https://www.npmjs.com/package/china-division)
[![npm](https://img.shields.io/npm/dt/china-division.svg)](https://www.npmjs.com/package/china-division)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/modood/Administrative-divisions-of-China/master/LICENSE)

中华人民共和国行政区划：省份、城市、区县、乡镇（街道）

*   数据来源（国家统计局）：
    * [中华人民共和国国家统计局-行政区划代码](http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/)
    * [中华人民共和国国家统计局-统计用区划和城乡划分代码](http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/)
*   本项目已更新至：
    * [最新县及县以上行政区划代码（截止时间：2015-9-30，发布时间：2016-08-09）](http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/201608/t20160809_1386477.html)
    * [2015年统计用区划代码和城乡划分代码（截止时间：2015-09-30，发布时间：2016-07-27）](http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2015/index.html)

## JSON

| 文件列表                                     | 下载地址       |
|:---------------------------------------------|:---------------|
| 省份数据                                     | [provinces.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/provinces.json) |
| 城市数据                                     | [cities.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/cities.json) |
| 区县数据                                     | [areas.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/areas.json) |
| 乡镇（街道）数据                             | [streets.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/streets.json) |
| “省份、城市” 二级联动数据                    | [address2.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/address2.json) |
| “省份、城市、区县” 三级联动数据              | [address3.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/address3.json) |
| “省份、城市、区县、乡镇” 四级联动数据        | [address4.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/address4.json) |

## TEST

```
$ npm test

> mocha -t 5000

  中华人民共和国行政区划：
    ✓ 省份数据
    ✓ 城市数据
    ✓ 区县数据
    ✓ 乡镇数据
    ✓ “省份、城市” 二级联动数据
    ✓ “省份、城市、区县” 三级联动数据
    ✓ “省份、城市、区县、乡镇” 四级联动数据
    ✓ “某省、某市、某县、某镇” 不存在

  8 passing (12ms)
```

## NPM(不建议)

> 注意：

> 由于 `require` 为同步操作，出于性能考虑，不建议使用 Node 模块这种方式。

> 原因参考 [Node.js Modules](https://nodejs.org/dist/latest-v4.x/docs/api/modules.html)。 因此建议 [下载 JSON 文件](https://github.com/modood/Administrative-divisions-of-China#json)。

安装：

```
$ npm install --save china-division
```

使用：

```js
var chinaDivision = require('china-division');

// 省份数据
var provinces = chinaDivision.provinces;

// 城市数据
var cities = chinaDivision.cities;

// 区县数据
var areas = chinaDivision.areas;

// 乡镇（街道）数据
var streets = chinaDivision.streets;

// “省、市” 二级联动数据
var address2 = chinaDivision.address2;

// “省、市、区” 三级联动数据
var address3 = chinaDivision.address3;

// “省、市、区、镇” 四级联动数据
var address4 = chinaDivision.address4;
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License

this repo is released under the [MIT License](http://www.opensource.org/licenses/MIT).

