# Administrative-divisions-of-China

[![code style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![dependencies](https://david-dm.org/modood/Administrative-divisions-of-China.svg)](https://david-dm.org/modood/Administrative-divisions-of-China)
[![npm](https://img.shields.io/npm/v/china-division.svg)](https://www.npmjs.com/package/china-division)
[![downloads](https://img.shields.io/npm/dt/china-division.svg)](https://www.npmjs.com/package/china-division)
[![license](https://img.shields.io/badge/license-WTFPL%20--%20Do%20What%20the%20Fuck%20You%20Want%20to%20Public%20License-green.svg)](https://raw.githubusercontent.com/modood/Administrative-divisions-of-China/master/LICENSE)

中华人民共和国行政区划（五级）：省级、地级、县级、乡级和村级。

## 数据来源

*   民政部、国家统计局：
    * [中华人民共和国民政部-中华人民共和国行政区划代码](http://www.mca.gov.cn/article/sj/xzqh/)
    * [中华人民共和国国家统计局-统计用区划和城乡划分代码](http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/)
    * [中华人民共和国国家统计局-统计用区划代码和城乡划分代码编制规则](http://www.stats.gov.cn/tjsj/tjbz/200911/t20091125_8667.html)
*   本项目已更新至：
    * [2017年统计用区划代码和城乡划分代码（截止时间：2017-10-31，发布时间：2018-06-20）](http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/index.html)

## 数据下载

| 文件列表                     | JSON | CSV |
|:-----------------------------|:-----|:----|
| 省级（省份、直辖市、自治区） | [provinces.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/provinces.json) | [provinces.csv](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/provinces.csv) |
| 地级（城市）                 | [cities.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/cities.json) | [cities.csv](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/cities.csv) |
| 县级（区县）                 | [areas.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/areas.json) | [areas.csv](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/areas.csv) |
| 乡级（乡镇、街道）           | [streets.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/streets.json) | [streets.csv](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/streets.csv) |
| 村级（村委会、居委会）       | [villages.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/villages.json) | [villages.csv](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/villages.csv) |

| 文件列表                                    | 普通 | 带编码 |
|:--------------------------------------------|:-----|:-------|
| “省份、城市” 二级联动数据                   | [pc.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pc.json) | [pc-code.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pc-code.json) |
| “省份、城市、区县” 三级联动数据             | [pca.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pca.json) | [pca-code.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pca-code.json) |
| “省份、城市、区县、乡镇” 四级联动数据       | [pcas.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pcas.json) | [pcas-code.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pcas-code.json) |
| “省份、城市、区县、乡镇、村庄” 五级联动数据 | - | - |

> 提示：需要打包下载全部文件，请看 [Releases](https://github.com/modood/Administrative-divisions-of-China/releases)。

## 数据更新

```
$ yarn
$ npm run fetch
```
```
[1/1]正在抓取省级数据...

[1/31]正在抓取地级数据，当前省级：11 北京市
[2/31]正在抓取地级数据，当前省级：12 天津市
[3/31]正在抓取地级数据，当前省级：13 河北省
[4/31]正在抓取地级数据，当前省级：14 山西省
...
[29/31]正在抓取地级数据，当前省级：63 青海省
[30/31]正在抓取地级数据，当前省级：64 宁夏回族自治区
[31/31]正在抓取地级数据，当前省级：65 新疆维吾尔自治区

[1/344]正在抓取县级数据，当前地级：1101 市辖区
[2/344]正在抓取县级数据，当前地级：1201 市辖区
[3/344]正在抓取县级数据，当前地级：1301 石家庄市
[4/344]正在抓取县级数据，当前地级：1302 唐山市
...
[342/344]正在抓取县级数据，当前地级：6542 塔城地区
[343/344]正在抓取县级数据，当前地级：6543 阿勒泰地区
[344/344]正在抓取县级数据，当前地级：6590 自治区直辖县级行政区划

[1/2856]正在抓取乡级数据，当前县级：110101 东城区
[2/2856]正在抓取乡级数据，当前县级：110102 西城区
[3/2856]正在抓取乡级数据，当前县级：110105 朝阳区
[4/2856]正在抓取乡级数据，当前县级：110106 丰台区
...
[2854/2856]正在抓取乡级数据，当前县级：659003 图木舒克市
[2855/2856]正在抓取乡级数据，当前县级：659004 五家渠市
[2856/2856]正在抓取乡级数据，当前县级：659006 铁门关市

[1/42951]正在抓取村级数据，当前乡级：110101001 东华门街道办事处
[2/42951]正在抓取村级数据，当前乡级：110101002 景山街道办事处
[3/42951]正在抓取村级数据，当前乡级：110101003 交道口街道办事处
[4/42951]正在抓取村级数据，当前乡级：110101004 安定门街道办事处
...
[42949/42951]正在抓取村级数据，当前乡级：659004502 兵团一零三团
[42950/42951]正在抓取村级数据，当前乡级：659006100 博古其镇
[42951/42951]正在抓取村级数据，当前乡级：659006101 双丰镇
[100%] 数据抓取完成！
```

## 数据校验

```
$ npm test

> eslint . && mocha -t 5000

  中华人民共和国行政区划：
    ✓ “一级” 省级（省份、直辖市、自治区）数据
    ✓ “二级” 地级（城市）数据
    ✓ “三级” 县级（区县）数据
    ✓ “四级” 乡级（乡镇、街道）数据
    ✓ “五级” 村级（村委会、居委会）数据

  联动数据
    ✓ “省份、城市” 二级联动数据
    ✓ “省份、城市、区县” 三级联动数据
    ✓ “省份、城市、区县、乡镇” 四级联动数据
    ✓ “某省、某市、某县、某镇” 不存在

  9 passing (37ms)
```

## 数据库支持

目前本项目抓取的数据保存在 sqlite3，数据文件下载：[data.sqlite](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/data.sqlite)。

可以自己将数据迁移到其他数据库管理系统中（MySQL, Oracle, MSSQL 等）。

**省级数据预览**

| code | name   |
|:-----|:-------|
| 11   | 北京市 |
| 12   | 天津市 |

**地级数据预览**

| code | name     | provinceCode |
|:-----|:---------|:-------------|
| 1301 | 石家庄市 | 13           |
| 1302 | 唐山市   | 13           |
| 1303 | 秦皇岛市 | 13           |

**县级数据预览**

| code   | name     | cityCode | provinceCode |
|:-------|:---------|:---------|:-------------|
| 110105 | 朝阳区   | 1101     | 11           |
| 110106 | 丰台区   | 1101     | 11           |
| 110107 | 石景山区 | 1101     | 11           |

**乡级数据预览**

| code      | name             | areaCode | cityCode | provinceCode |
|:----------|:-----------------|:---------|:---------|:-------------|
| 110101001 | 东华门街道办事处 | 110101   | 1101     | 11           |
| 110101002 | 景山街道办事处   | 110101   | 1101     | 11           |
| 110101003 | 交道口街道办事处 | 110101   | 1101     | 11           |

**村级数据预览**

| code         | name       | streetCode | areaCode | cityCode | provinceCode |
|:-------------|:-----------|:-----------|:---------|:---------|:-------------|
| 620723101213 | 新民村委会 | 620723101  | 620723   | 6207     | 62           |
| 620723102201 | 大寨村委会 | 620723102  | 620723   | 6207     | 62           |
| 620723102202 | 长庄村委会 | 620723102  | 620723   | 6207     | 62           |

## Stargazers over time

[![Stargazers over time](https://starcharts.herokuapp.com/modood/Administrative-divisions-of-China.svg)](https://starcharts.herokuapp.com/modood/Administrative-divisions-of-China)

## Buy me a coffee

![alipay](https://modood.com/images/alipay.jpg)

![wechat](https://modood.com/images/wechat.jpg)

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License

This repo is released under the [WTFPL](http://www.wtfpl.net/) – Do What the Fuck You Want to Public License.
