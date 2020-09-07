import {
  renderForms,
  appendSelectOptions,
  appendDatalistOptions,
  removeOptions,
} from "./ui";
import { fetchAddresses, fetchReverseGeocode, sendToGeolonia } from "./api";
import { parseAtts } from "./util";

const getCurrentPosition = () => {
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

/**
 * render Forms
 * @param targetItem target container
 */
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

  const options = parseAtts(target);

  // state for those select element
  let lat: number;
  let lng: number;
  let prefCode: string = "";
  let cityCode: string = "";

  const [
    {
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
    },
    prefectures,
  ] = await Promise.all([
    renderForms(target, options),
    fetchAddresses<Geolonia.API.Pref>("japan.json"),
  ]);

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
    const [cities, smallAreas] = await Promise.all([
      fetchAddresses<Geolonia.API.City>(`japan/${prefCode}.json`),
      fetchAddresses<Geolonia.API.SmallArea>(
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
  selectPrefCode.disabled = false;

  selectPrefCode.addEventListener("change", async (event) => {
    if (event.target instanceof HTMLSelectElement) {
      prefCode = event.target.value;
      const cities = await fetchAddresses<Geolonia.API.City>(
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
      const smallAreas = await fetchAddresses<Geolonia.API.SmallArea>(
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
