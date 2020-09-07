import { defaultAtts } from "./util";

const AddressAPIBase = "https://cdn.geolonia.com/address";
const reverseGeocodeAPIBase = "https://api.geolonia.com/dev/reverseGeocode";
const geoloniaEndpoint = "./"; // TODO: fix me

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

export const fetchReverseGeocode = async (lng: number, lat: number) => {
  try {
    const data = await fetch(
      `${reverseGeocodeAPIBase}?lng=${lng}&lat=${lat}`
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
  { formData, lat, lng }: { formData: FormData; lat: number; lng: number },
  options: Geolonia.FormRenderOptions
) => {
  const newFormData = new FormData();
  newFormData.set(defaultAtts.prefCodeName, formData.get(options.prefCodeName));
  newFormData.set(
    defaultAtts.prefectureName,
    formData.get(options.prefectureName)
  );
  newFormData.set(defaultAtts.cityName, formData.get(options.cityName));
  newFormData.set(defaultAtts.cityCodeName, formData.get(options.cityCodeName));

  newFormData.set(
    defaultAtts.smallAreaName,
    formData.get(options.smallAreaName)
  );
  newFormData.set(
    defaultAtts.otherAddressName,
    formData.get(options.otherAddressName)
  );
  newFormData.set(
    defaultAtts.isSmallAreaExceptionName,
    formData.get(options.isSmallAreaExceptionName)
  );
  newFormData.set("lat", lat.toString());
  newFormData.set("lng", lng.toString());

  fetch(geoloniaEndpoint, { method: "POST", body: newFormData });
};
