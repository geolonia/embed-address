declare namespace Geolonia {
  export namespace API {
    export type Pref = {
      都道府県コード: string;
      都道府県名: string;
      都道府県名カナ: string;
      都道府県名ローマ字: string;
    };
    export type City = {
      市区町村コード: string;
      市区町村名: string;
      市区町村名カナ: string;
      市区町村名ローマ字: string;
      都道府県コード: string;
      都道府県名: string;
      都道府県名カナ: string;
      都道府県名ローマ字: string;
    };
    export type SmallArea = {
      大字町丁目コード: string;
      大字町丁目名: string;
      市区町村コード: string;
      市区町村名: string;
      市区町村名カナ: string;
      市区町村名ローマ字: string;
      経度: number;
      緯度: number;
      都道府県コード: string;
      都道府県名: string;
      都道府県名カナ: string;
      都道府県名ローマ字: string;
    };
    export type ReverseGeocodedSmallArea = {
      PREF: string;
      PREF_NAME: string;
      CITY: string;
      CITY_NAME: string;
      S_NAME: string | null;
    };
  }
  export type FormRenderLabelOptions = {
    geolocationButtonLabel: string;
    geolocatingLabel: string;
    prefectureLabel: string;
    cityLabel: string;
    smallAreaLabel: string;
    otherAddressLabel: string;
  };
  export type FormRenderNameOptions = {
    prefectureName: string;
    prefCodeName: string;
    cityName: string;
    cityCodeName: string;
    smallAreaName: string;
    isSmallAreaExceptionName: string;
    otherAddressName: string;
  };
  export type FormRenderOptions = FormRenderLabelOptions &
    FormRenderNameOptions;

  // Parsed Form Data
  // [NOTE] The key value is duplicated with `utils.defaultAtts`
  export interface SendingData {
    prefecture: string;
    "pref-code": string;
    city: string;
    "city-code": string;
    "small-area": string;
    "is-exception"?: boolean;
    "other-address": string;
    lat: number;
    lng: number;
  }
}
