# 住所簡単入力 API

住所簡単入力 API は、プルダウンで簡単に住所を入力できるフォームパーツです。

## 使い方

1. form 要素の内部など、簡単入力フォームを配置したい場所に `#address` という ID 属性を持つ要素を配置し、API を読み込むだけで動作します。

```html
<body>
  <form>
    <div id="address" />
    <button type="submit">送信</button>
  </form>
  <script src="https://api.geolonia.com/address-input?geolonia-api-key=YOUR-API-KEY"></script>
</body>
```

2. (オプション) 別の要素 ID を利用したい場合は、API を読み込んだ後に `window.geolonia.address` という関数をコールしてください。

```html
<form>
  <div id="my-address-element" />
  <button type="submit">送信</button>
</form>
<script src="https://api.geolonia.com/address-input?geolonia-api-key=YOUR-API-KEY"></script>
<script>
  window.geolonia.address("my-address-element");
</script>
```
