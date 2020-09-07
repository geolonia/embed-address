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
