# Administrative-divisions-of-China

中华人民共和国行政区划：省份、城市、区县、乡镇（街道）

[![Deps](https://david-dm.org/modood/Administrative-divisions-of-China.svg)](https://david-dm.org/modood/Administrative-divisions-of-China)
[![npm](https://img.shields.io/npm/v/china-division.svg)](https://www.npmjs.com/package/china-division)
[![npm](https://img.shields.io/npm/dt/china-division.svg)](https://www.npmjs.com/package/china-division)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/modood/Administrative-divisions-of-China/master/LICENSE)

## JSON

| 文件列表                                     | 格式化         | 压缩版      |
|:---------------------------------------------|:---------------| :-----------|
| 省份数据                                     | [provinces.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/provinces.json) | [provinces.min.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/provinces.min.json) |
| 城市数据                                     | [cities.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/cities.json) | [cities.min.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/cities.min.json) |
| 区县数据                                     | [areas.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/areas.json) | [areas.min.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/areas.min.json) |
| 乡镇（街道）数据                             | [streets.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/streets.json) | [streets.min.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/streets.min.json) |
| “省、市” 二级联动数据                        | [address2.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/address2.json) | [address2.min.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/address2.min.json) |
| “省、市、区” 三级联动数据                    | [address3.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/address3.json) | [address3.min.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/address3.min.json) |
| “省、市、区、镇” 四级联动数据                | [address4.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/address4.json) | [address4.min.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/address4.min.json) |

## TEST

```
$ npm test

> mocha -t 5000

  中华人民共和国行政区划：
    ✓ 省份数据
    ✓ 城市数据
    ✓ 区县数据
    ✓ 乡镇（街道）数据
    ✓ “省、市” 二级联动数据
    ✓ “省、市、区” 三级联动数据
    ✓ “省、市、区、镇” 四级联动数据
    ✓ “某省、某市、某县、某镇” 不存在

  8 passing (12ms)
```

## NPM(不建议)

> 注意：

> 由于获取数据为同步操作，出于性能考虑，不建议使用 Node 模块这种方式。

> 建议 [下载 JSON 文件](https://github.com/modood/Administrative-divisions-of-China#json)
> 然后在代码里使用 require 引入，原因参考 [Node.js Modules](https://nodejs.org/dist/latest-v4.x/docs/api/modules.html)。

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

