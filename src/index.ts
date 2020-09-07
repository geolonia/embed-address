import {
  renderForms,
  appendSelectOptions,
  appendDatalistOptions,
  removeOptions,
} from "./ui";
import {
  fetchPrefs,
  fetchCities,
  fetchSmallAreas,
  fetchReverseGeocode,
  sendToGeolonia,
} from "./api";
import { parseAtts, getCurrentPosition, identifyTarget } from "./util";

/**
 * render Forms
 * @param targetItem target container
 */
const main = async (targetIdentifier: HTMLElement | string) => {
  const target = identifyTarget(targetIdentifier);
  const options = parseAtts(target);

  // state for those select element
  let lat: number;
  let lng: number;
  let prefCode: string = "";
  let cityCode: string = "";

  const [elements, prefectures] = await Promise.all([
    renderForms(target, options),
    fetchPrefs(),
  ]);

  const {
    buttonGeolocation,
    selectPrefCode,
    inputPrefName,
    selectCityCode,
    inputCityName,
    inputSmallArea,
    datalistSmallArea,
    inputIsSmallAreaException,
    spanErrorMessage,
    parentalForm,
  } = elements;

  if (!prefectures) {
    spanErrorMessage.innerText =
      "何かのエラーです。住所データを取得できませんでした。";
    return;
  }

  buttonGeolocation.addEventListener("click", async () => {
    try {
      const position = await getCurrentPosition();
      lat = position.lat;
      lng = position.lng;
    } catch (error) {
      console.error(error);
      spanErrorMessage.innerText = "現在位置から住所を取得できませんでした。";
      return;
    }

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

    // onPrefSelect(({ target: { value: prefCode } } as unknown) as Event);

    const [cities, smallAreas] = await Promise.all([
      fetchCities(prefCode),
      fetchSmallAreas(prefCode, cityCode),
    ]);

    if (!cities || !smallAreas) {
      if (!prefectures) {
        spanErrorMessage.innerText =
          "何かのエラーです。住所データを取得できませんでした。";
        return;
      }
    }

    const prefecture = prefectures.find(
      (prefecture) => prefecture.都道府県コード === prefCode
    );
    const city = cities.find((city) => city.市区町村コード === cityCode);
    if (prefecture) {
      inputPrefName.value = prefecture.都道府県名;
    }
    if (city) {
      inputCityName.value = city.市区町村名;
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
  });

  await appendSelectOptions(
    selectPrefCode,
    prefectures,
    "都道府県コード",
    "都道府県名"
  );

  const onPrefSelect = async (event: Event) => {
    if (event.target instanceof HTMLSelectElement) {
      prefCode = event.target.value;
      const cities = await fetchCities(prefCode);

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
    }
  };

  selectPrefCode.addEventListener("change", onPrefSelect);

  selectCityCode.addEventListener("change", async (event) => {
    if (event.target instanceof HTMLSelectElement) {
      cityCode = event.target.value;
      const smallAreas = await fetchSmallAreas(prefCode, cityCode);

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

  // send to Geolonia
  if (parentalForm) {
    parentalForm.addEventListener("submit", (event) => {
      if (event.target instanceof HTMLFormElement && lat && lng) {
        sendToGeolonia(
          { formData: new FormData(event.target), lat, lng },
          options
        );
      }
    });
  }
};

// render automatically if #address exists
const entry = document.getElementById("address");
if (entry) {
  main(entry);
}

// make global variables
declare global {
  interface Window {
    geolonia?: {
      address?: typeof main;
    };
  }
}
if (!window.geolonia) {
  window.geolonia = {};
}
window.geolonia.address = main;
