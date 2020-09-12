import { defaultAtts } from "./util";

const AddressAPIBase = "https://cdn.geolonia.com/address";
const APIBase = "https://api.geolonia.com";

const fetchAddresses = async <T>(path: string) => {
  try {
    const data = await fetch(`${AddressAPIBase}/${path}`).then((res) => {
      if (res.status > 299) {
        console.error(res);
        throw new Error("request error");
      } else {
        return res.json();
      }
    });
    return data as T[];
  } catch (error) {
    return null;
  }
};

export const fetchPrefs = () => fetchAddresses<Geolonia.API.Pref>("japan.json");
export const fetchCities = (prefCode: string) =>
  fetchAddresses<Geolonia.API.City>(`japan/${prefCode}.json`);
export const fetchSmallAreas = (prefCode: string, cityCode: string) =>
  fetchAddresses<Geolonia.API.SmallArea>(`japan/${prefCode}/${cityCode}.json`);

export const fetchReverseGeocode = async (lng: number, lat: number, stage: string) => {
  try {
    const data = await fetch(
      `${APIBase}/${stage}/reverseGeocode?lng=${lng}&lat=${lat}`
    ).then((res) => {
      if (res.status > 299) {
        console.error(res);
        throw new Error("request error");
      } else {
        return res.json();
      }
    });
    return data as Geolonia.API.ReverseGeocodedSmallArea;
  } catch (error) {
    return null;
  }
};

export const sendToGeolonia = (
  {
    formData,
    lat,
    lng,
    apiKey,
    stage
  }: {
    formData: FormData;
    lat: number;
    lng: number;
    apiKey: string;
    stage: string
  },
  options: Geolonia.FormRenderOptions
) => {
  const body = JSON.stringify({
    [defaultAtts.prefCodeName]: formData.get(options.prefCodeName),
    [defaultAtts.prefectureName]: formData.get(options.prefectureName),
    [defaultAtts.cityName]: formData.get(options.cityName),
    [defaultAtts.cityCodeName]: formData.get(options.cityCodeName),
    [defaultAtts.smallAreaName]: formData.get(options.smallAreaName),
    [defaultAtts.otherAddressName]: formData.get(options.otherAddressName),
    [defaultAtts.isSmallAreaExceptionName]: formData.get(
      options.isSmallAreaExceptionName
    ) === 'true',
    lat,
    lng,
  });

  return fetch(`${APIBase}/${stage}/geocode`, {
    method: "POST",
    headers: {
      "X-Geolonia-Api-Key": apiKey,
    },
    body,
  }).then(res => res.json());
};

