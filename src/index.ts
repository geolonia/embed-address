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

const fetchReverseGeocode = async (lng: number, lat: number) => {
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
    return data as Geolonia.ReverseGeocodedSmallArea;
  } catch (error) {
    return null;
  }
};

const address = async (targetItem: HTMLElement | string) => {
  let target: HTMLElement;
  if (targetItem instanceof HTMLElement) {
    target = targetItem;
  } else {
    target = document.getElementById(targetItem);
  }
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
      spanErrorMessage,
    },
    prefectures,
  ] = await Promise.all([
    renderForms(target),
    fetchAddresses<Geolonia.Pref>("japan.json"),
  ]);

  if (!prefectures) {
    spanErrorMessage.innerText =
      "何かのエラーです。住所データを取得できませんでした。";
    return;
  }

  buttonGeolocation.addEventListener("click", () => {
    window.navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const data = await fetchReverseGeocode(lng, lat);
        if (!data) {
          spanErrorMessage.innerText =
            "何かのエラーです。現在位置から住所を取得できませんでした。";
          return;
        }

        spanErrorMessage.innerText = "";
        const { PREF, CITY, S_NAME } = data;
        prefCode = PREF;
        cityCode = PREF + CITY;
        const [cities, smallAreas] = await Promise.all([
          fetchAddresses<Geolonia.City>(`japan/${prefCode}.json`),
          fetchAddresses<Geolonia.SmallArea>(
            `japan/${prefCode}/${cityCode}.json`
          ),
        ]);
        if (!cities || !smallAreas) {
          if (!prefectures) {
            spanErrorMessage.innerText =
              "何かのエラーです。住所データを取得できませんでした。";
            return;
          }
        }

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
      },
      (error) => {
        console.error(error);
        spanErrorMessage.innerText = "現在位置から住所を取得できませんでした。";
      }
    );
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

      if (!cities) {
        if (!prefectures) {
          spanErrorMessage.innerText =
            "何かのエラーです。住所データを取得できませんでした。";
          return;
        }
      }

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

      if (!smallAreas) {
        if (!prefectures) {
          spanErrorMessage.innerText =
            "何かのエラーです。住所データを取得できませんでした。";
          return;
        }
      }

      await removeOptions(datalistSmallArea);
      await appendDatalistOptions(
        datalistSmallArea,
        smallAreas,
        "大字町丁目名"
      );
    }
  });
};

// render automatically if #address exists
const entry = document.getElementById("address");
if (entry) {
  address(entry);
}

// make global variables
declare global {
  interface Window {
    geolonia?: {
      address?: (target: HTMLElement | string) => void;
    };
  }
}
if (!window.geolonia) {
  window.geolonia = {};
}
window.geolonia.address = address;
