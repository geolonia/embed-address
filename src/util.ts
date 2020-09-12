import urlParse from "url-parse";
import querystring from "querystring";

export const defaultAtts: Geolonia.FormRenderOptions = {
  geolocationButtonLabel: "現在地から住所を入力",
  geolocatingLabel: "取得中...",
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

  // escape and prevent XSS
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

// convert HTMLElement id to HTMLElement
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

export const parseApiKey = (document: Document = window.document) => {
  const scripts = document.getElementsByTagName("script");
  const params = {
    apiKey: "YOUR-API-KEY",
    stage: "dev",
  };

  for (const script of scripts) {
    const { pathname, query } = urlParse(script.src);
    // NOTE: bug rulParse typping
    const q = querystring.parse(
      ((query as unknown) as string).replace(/^\?/, "")
    );

    if (typeof q["geolonia-api-key"] === "string" && q["geolonia-api-key"]) {
      params.apiKey = q["geolonia-api-key"];

      const res = pathname.match(/^\/(v[0-9.]+)\/embed-address/);
      if (res && res[1] !== "dev") {
        params.stage = res[1];
      }
      break;
    }
  }

  return params;
};
