# 住所簡単入力 API

住所簡単入力 API は、プルダウンで簡単に住所を入力できるフォームパーツです。

## 使い方

form 要素の内部など、簡単入力フォームを配置したい場所に `#address` という `id` 属性を持つ要素を配置し、API を読み込むことでフォームパーツを配置できます。

```html
<body>
  <form>
    <div id="address" />
    <button type="submit">送信</button>
  </form>
  <script src="https://api.geolonia.com/address-input?geolonia-api-key=YOUR-API-KEY"></script>
</body>
```

### カスタマイズ

`<label>`要素やフォームの `name` 属性をカスタマイズできます。

```
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
  data-other-address-name="other-address"
></div>
```
