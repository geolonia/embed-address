declare namespace Geolonia {
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
}
