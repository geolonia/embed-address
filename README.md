# 住所簡単入力 API

住所簡単入力 API は、プルダウンで簡単に住所を入力できるフォームパーツです。

## 使い方

form 要素の内部など、簡単入力フォームを配置したい場所に `#address` という `id` 属性を持つ要素を配置し、API を読み込むことでフォームパーツを配置できます。

```html
<body>
  <form>
    <div id="address"></div>
    <button type="submit">送信</button>
  </form>
  <script src="https://api.geolonia.com/address-input?geolonia-api-key=YOUR-API-KEY"></script>
</body>
```

デフォルトの設定では次のフォームデータがユーザーのサーバーに POST されます。

- `prefecture`: 都道府県名
- `city`: 市区町村名
- `small-area`: 大字町丁目名
- `other-address`: 上記以外の住所
- `is-exception`: 大字町丁目名がプルダウンの候補に存在しない場合は `"true"`、存在する場合は `"false"`

`window.geolonia.address` をコールすることで `id="address"` 以外の `id` を持つ要素に対して簡単入力フォームを配置できます。

```html
<body>
  <form>
    <div id="my-custom-address"></div>
    <button type="submit">送信</button>
  </form>
  <script src="https://api.geolonia.com/address-input?geolonia-api-key=YOUR-API-KEY"></script>
  <script>
    window.geolonia.address("my-custom-address");
  </script>
</body>
```

### カスタマイズ

`placeholder` 属性のテキストやフォームの `name` 属性をカスタマイズできます。

```html
<div
  id="address"
  data-geolocation-button-label="現在位置から住所を入力"
  data-prefecture-label="都道府県"
  data-city-label="市区町村"
  data-small-area-label="大字町丁目"
  data-other-address-label="その他の住所"
  data-prefecture-name="prefecture"
  data-city-name="city"
  data-small-area-name="small-area"
  data-is-small-area-exception-name="is-exception"
  data-other-address-name="other-address"
></div>
```
