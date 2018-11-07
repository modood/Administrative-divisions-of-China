import { Instance, Model } from "sequelize";

/**
 * 初始化sqlite数据库
 */
export function init(): Promise<void>;

/**
 * 省
 */
export const Province: models.MProvince;

/**
 * 市
 */
export const City: models.MCity;

/**
 * 区
 */
export const Area: models.MArea;

/**
 * 街道
 */
export const Street: models.MStreet;

/**
 * 村
 */
export const Village: models.MVillage;

/**
 * 数据模型定义
 */
declare namespace models {
  type MProvince = Model<IProvince, Province>;
  type MCity = Model<ICity, City>;
  type MArea = Model<IArea, Area>;
  type MStreet = Model<IStreet, Street>;
  type MVillage = Model<IVillage, Village>;

  type IProvince = Instance<Province> & Province;
  type ICity = Instance<City> & City;
  type IArea = Instance<Area> & Area;
  type IStreet = Instance<Street> & Street;
  type IVillage = Instance<Village> & Village;

  abstract class BaseModel {
    /**
     * 行政区划码
     */
    code: string;

    /**
     * 行政区名称
     */
    name: string;
  }

  class Province extends BaseModel {
    cities?: ICity[];
  }

  class City extends BaseModel {
    provinceCode: string;

    province?: IProvince;

    areas?: IArea[];
  }

  class Area extends BaseModel {
    provinceCode: string;
    cityCode: string;

    province?: IProvince;
    city?: ICity;

    streets?: IStreet[];
  }

  class Street extends BaseModel {
    provinceCode: string;
    cityCode: string;
    areaCode: string;

    province?: IProvince;
    city?: ICity;
    area?: IArea;

    villages?: IVillage[];
  }

  class Village extends BaseModel {
    provinceCode: string;
    cityCode: string;
    areaCode: string;
    streetCode: string;

    province?: IProvince;
    city?: ICity;
    area?: IArea;
    street?: IStreet;
  }
}
