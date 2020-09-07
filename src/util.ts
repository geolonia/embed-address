export const defaultAtts = {
  geolocationButtonLabel: "現在地から住所を入力",
  prefectureLabel: "都道府県",
  cityLabel: "市区町村",
  smallAreaLabel: "大字町丁目",
  otherAddressLabel: "その他の住所",
  prefectureName: "prefecture",
  cityName: "city",
  smallAreaName: "small-area",
  otherAddressName: "other-address",
};

export const parseAtts = (container: HTMLElement): Geolonia.Options => {
  const dataset = container.dataset || {};

  const keys = Object.keys(dataset);
  const escapedDataset = keys.reduce<{ [key: string]: string }>((prev, key) => {
    prev[key] = escape(dataset[key]);
    return prev;
  }, {});

  return {
    ...defaultAtts,
    ...escapedDataset,
  };
};
