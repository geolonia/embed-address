import {
  renderForms,
  appendSelectOptions,
  appendDatalistOptions,
  removeOptions,
} from "./ui";

const AddressAPIBase =
  "https://cdn.geolonia.com/address" &&
  "https://deploy-preview-4--awesome-jepsen-b8a456.netlify.app/address";
const reverseGeocodeAPIBase = "https://api.geolonia.com/dev/reverseGeocode";

/**
 *
 * @param {string} path path for the Address API
 */
const fetchAddresses = async <T>(path: string) => {
  try {
    const data = await fetch(`${AddressAPIBase}/${path}`).then((res) => {
      if (res.status > 299) {
        throw new Error("request error");
      } else {
        return res.json();
      }
    });
    return data as T[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const fetchReverseGeocode = async (lng: number, lat: number) => {
  try {
    const data = await fetch(
      `${reverseGeocodeAPIBase}?lng=${lng}&lat=${lat}`
    ).then((res) => {
      if (res.status > 299) {
        throw new Error("request error");
      } else {
        return res.json();
      }
    });
    return data as Geolonia.ReverseGeocodedSmallArea;
  } catch (error) {
    console.error();
    return null;
  }
};

const main = async (targetElementId: string = "address") => {
  const target = document.getElementById(targetElementId);
  if (!target) {
    throw new Error("no target found.");
  }

  // state for those select element
  let prefCode: string = "";
  let cityCode: string = "";

  const [
    {
      buttonGeolocation,
      selectPrefCode,
      selectCityCode,
      inputSmallArea,
      datalistSmallArea,
      inputIsSmallAreaException,
    },
    prefectures,
  ] = await Promise.all([
    renderForms(target),
    fetchAddresses<Geolonia.Pref>("japan.json"),
  ]);

  buttonGeolocation.addEventListener("click", () => {
    window.navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      const data = await fetchReverseGeocode(lng, lat);
      const { PREF, CITY, S_NAME } = data;
      prefCode = PREF;
      cityCode = PREF + CITY;
      const [cities, smallAreas] = await Promise.all([
        fetchAddresses<Geolonia.City>(`japan/${prefCode}.json`),
        fetchAddresses<Geolonia.SmallArea>(
          `japan/${prefCode}/${cityCode}.json`
        ),
      ]);
      await Promise.all([
        removeOptions(selectCityCode),
        removeOptions(datalistSmallArea),
      ]);
      await Promise.all([
        appendSelectOptions(
          selectCityCode,
          cities,
          "市区町村コード",
          "市区町村名"
        ),
        appendDatalistOptions(datalistSmallArea, smallAreas, "大字町丁目名"),
      ]);
      selectPrefCode.value = prefCode;
      selectCityCode.value = cityCode;
      inputSmallArea.value = S_NAME || "";
      inputIsSmallAreaException.value = !!smallAreas.find(
        (smallArea) => smallArea.大字町丁目名 === S_NAME
      )
        ? "false"
        : "true";
    });
  });

  await appendSelectOptions(
    selectPrefCode,
    prefectures,
    "都道府県コード",
    "都道府県名"
  );
  selectPrefCode.disabled = false;

  selectPrefCode.addEventListener("change", async (event) => {
    if (event.target instanceof HTMLSelectElement) {
      prefCode = event.target.value;
      const cities = await fetchAddresses<Geolonia.City>(
        `japan/${prefCode}.json`
      );
      await Promise.all([
        removeOptions(selectCityCode),
        removeOptions(datalistSmallArea),
      ]);
      await appendSelectOptions(
        selectCityCode,
        cities,
        "市区町村コード",
        "市区町村名"
      );
      selectCityCode.disabled = false;
    }
  });

  selectCityCode.addEventListener("change", async (event) => {
    if (event.target instanceof HTMLSelectElement) {
      cityCode = event.target.value;
      const smallAreas = await fetchAddresses<Geolonia.SmallArea>(
        `japan/${prefCode}/${cityCode}.json`
      );
      await removeOptions(datalistSmallArea);
      await appendDatalistOptions(
        datalistSmallArea,
        smallAreas,
        "大字町丁目名"
      );
    }
  });
};

// make global variables

declare global {
  interface Window {
    geolonia?: {
      address?: () => void;
    };
  }
}

if (!window.geolonia) {
  window.geolonia = {};
}
window.geolonia.address = main;
