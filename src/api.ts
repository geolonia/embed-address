import { defaultAtts } from "./util";

const AddressAPIBase = "https://cdn.geolonia.com/address";
const reverseGeocodeAPIBase = "https://api.geolonia.com/dev/reverseGeocode";

export const fetchAddresses = async <T>(path: string) => {
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
  options: Geolonia.Options
) => {
  const newFormData = new FormData();
  newFormData.set(
    defaultAtts.prefectureName,
    formData.get(options.prefectureName)
  );
  newFormData.set(defaultAtts.cityName, formData.get(options.cityName));
  newFormData.set(
    defaultAtts.smallAreaName,
    formData.get(options.smallAreaName)
  );
  newFormData.set(
    defaultAtts.otherAddressName,
    formData.get(options.otherAddressName)
  );
  newFormData.set("is-exception", formData.get("is-exception"));
  newFormData.set("lat", lat.toString());
  newFormData.set("lng", lng.toString());

  fetch("path/to/geolonia/server", {
    method: "POST",
    body: newFormData,
  });
};
