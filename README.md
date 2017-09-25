# Administrative-divisions-of-China

[![code style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![dependencies](https://david-dm.org/modood/Administrative-divisions-of-China.svg)](https://david-dm.org/modood/Administrative-divisions-of-China)
[![npm](https://img.shields.io/npm/v/china-division.svg)](https://www.npmjs.com/package/china-division)
[![downloads](https://img.shields.io/github/downloads/modood/Administrative-divisions-of-China/total.svg)](https://github.com/modood/Administrative-divisions-of-China/releases)
[![license](https://img.shields.io/badge/license-WTFPL%20--%20Do%20What%20the%20Fuck%20You%20Want%20to%20Public%20License-green.svg)](https://raw.githubusercontent.com/modood/Administrative-divisions-of-China/master/LICENSE)

中华人民共和国行政区划：省份、城市、区县、乡镇（街道）

*   数据来源（民政部、国家统计局）：
    * [中华人民共和国民政部-中华人民共和国行政区划代码](http://www.mca.gov.cn/article/sj/tjbz/a/)
    * [中华人民共和国国家统计局-行政区划代码](http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/)
    * [中华人民共和国国家统计局-统计用区划和城乡划分代码](http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/)
    * [中华人民共和国国家统计局-统计用区划代码和城乡划分代码编制规则](http://www.stats.gov.cn/tjsj/tjbz/200911/t20091125_8667.html)
*   本项目已更新至：
    * [最新县及县以上行政区划代码（截止时间：2016-07-31，发布时间：2017-03-10）](http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/201703/t20170310_1471429.html)
    * [2016年统计用区划代码和城乡划分代码（截止时间：2016-07-31，发布时间：2017-05-16）](http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2016/index.html)

## JSON

| 文件列表                                     | 下载地址       |
|:---------------------------------------------|:---------------|
| 省份数据                                        | [provinces.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/provinces.json) |
| 城市数据                                        | [cities.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/cities.json) |
| 区县数据                                        | [areas.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/areas.json) |
| 乡镇（街道）数据                                | [streets.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/streets.json) |
| “省份、城市” 二级联动数据                       | [pc.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pc.json) |
| “省份、城市” 二级联动数据（带编码）             | [pc-code.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pc-code.json) |
| “省份、城市、区县” 三级联动数据                 | [pca.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pca.json) |
| “省份、城市、区县” 三级联动数据（带编码）       | [pca-code.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pca-code.json) |
| “省份、城市、区县、乡镇” 四级联动数据           | [pcas.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pcas.json) |
| “省份、城市、区县、乡镇” 四级联动数据（带编码） | [pcas-code.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pcas-code.json) |

> 提示：需要打包下载全部文件，请看 [Releases](https://github.com/modood/Administrative-divisions-of-China/releases)。

## Usage

抓取并导出最新数据

```
$ npm install

$ npm run build
```
```
[1/1] 正在抓取省份、城市和区县数据...
[1/2848] 正在抓取乡镇数据，当前区县： 110105 朝阳区
[2/2848] 正在抓取乡镇数据，当前区县： 110101 东城区
[3/2848] 正在抓取乡镇数据，当前区县： 110106 丰台区
[4/2848] 正在抓取乡镇数据，当前区县： 110109 门头沟区
[5/2848] 正在抓取乡镇数据，当前区县： 110112 通州区
[6/2848] 正在抓取乡镇数据，当前区县： 110102 西城区
[7/2848] 正在抓取乡镇数据，当前区县： 110107 石景山区
[8/2848] 正在抓取乡镇数据，当前区县： 110111 房山区
[9/2848] 正在抓取乡镇数据，当前区县： 110108 海淀区
[10/2848] 正在抓取乡镇数据，当前区县： 110113 顺义区
...
[2841/2848] 正在抓取乡镇数据，当前区县： 659006 铁门关市
[2842/2848] 正在抓取乡镇数据，当前区县： 210522 桓仁满族自治县
[2843/2848] 正在抓取乡镇数据，当前区县： 210881 盖州市
[2844/2848] 正在抓取乡镇数据，当前区县： 130902 新华区
[2845/2848] 正在抓取乡镇数据，当前区县： 150782 牙克石市
[2846/2848] 正在抓取乡镇数据，当前区县： 542421 那曲县
[2847/2848] 正在抓取乡镇数据，当前区县： 610122 蓝田县
[2848/2848] 正在抓取乡镇数据，当前区县： 610322 凤翔县
[1/5] 正在导出 “省份” JSON 数据...
[2/5] 正在导出 “城市” JSON 数据...
[3/5] 正在导出 “区县” JSON 数据...
[4/5] 正在导出 “乡镇” JSON 数据...
[5/5] 数据抓取完成！
[1/4] 正在导出 “省份、城市” 二级联动数据...
[2/4] 正在导出 “省份、城市、区县” 三级联动数据...
[3/4] 正在导出 “省份、城市、区县、乡镇” 四级联动数据...该步骤操作数据较多，比较耗时，请耐心等候...
[4/4] 数据更新完成！
```

>  提示：
>
>  由于抓取乡镇数据为异步操作，每次输出的乡镇数据顺序可能不同
>
>  但是不会影响其它数据的顺序以及所有数据的完整性。

## Testing

```
$ npm test

> eslint . && mocha -t 5000

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

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License

this repo is released under the [WTFPL](http://www.wtfpl.net/) – Do What the Fuck You Want to Public License.
