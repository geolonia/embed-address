export const defaultAtts: Geolonia.FormRenderOptions = {
  geolocationButtonLabel: "現在地から住所を入力",
  geolocatingLabel: "ロード中...",
  prefectureLabel: "都道府県",
  cityLabel: "市区町村",
  smallAreaLabel: "大字町丁目",
  otherAddressLabel: "その他の住所",
  prefectureName: "prefecture",
  prefCodeName: "pref-code",
  cityName: "city",
  cityCodeName: "city-code",
  smallAreaName: "small-area",
  isSmallAreaExceptionName: "is-exception",
  otherAddressName: "other-address",
};

export const parseAtts = (
  container: HTMLElement
): Geolonia.FormRenderOptions => {
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

export const getCurrentPosition = () => {
  return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
    window.navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        resolve({ lat, lng });
      },
      (error) => reject(error)
    );
  });
};

export const identifyTarget = (targetIdentifier: HTMLElement | string) => {
  let target: HTMLElement;
  if (targetIdentifier instanceof HTMLElement) {
    target = targetIdentifier;
  } else {
    target = document.getElementById(targetIdentifier);
  }
  if (!target) {
    throw new Error("no target found.");
  }
  return target;
};
