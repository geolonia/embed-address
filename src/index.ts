import {
  decorateTarget,
  renderHiddenInput,
  renderSelect,
  removeSelect,
  appendOptions,
} from "./ui";

const APIBase =
  "https://cdn.geolonia.com/address" &&
  "https://deploy-preview-4--awesome-jepsen-b8a456.netlify.app/address";

/**
 *
 * @param {string} path path for the Address API
 */
const fetchItems = async <T>(path: string) => {
  try {
    const data = await fetch(`${APIBase}/${path}`).then((res) => {
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

const showError = (message: string) => {
  alert(message);
};

const main = async (targetElementId: string = "address") => {
  const target = document.getElementById(targetElementId);
  if (!target) {
    throw new Error("no target found.");
  }

  decorateTarget(target);
  const hiddenInput = renderHiddenInput(target);

  const prefs = await fetchItems<Geolonia.Pref>("japan.json");

  const selectPref = renderSelect(target, "pref_code", "都道府県");
  let selectCity: HTMLSelectElement;
  let selectSmallArea: HTMLSelectElement;

  appendOptions(selectPref, prefs, "都道府県コード", "都道府県名");

  selectPref.addEventListener("change", async (event) => {
    if (event.target instanceof HTMLSelectElement) {
      if (selectCity) {
        removeSelect("city_code");
      }
      if (selectSmallArea) {
        removeSelect("small_area_code");
      }
      selectCity = renderSelect(target, "city_code", "市区町村");

      const prefCode = event.target.value;
      const pref = prefs.find((pref) => pref.都道府県コード === prefCode);
      if (pref) {
        hiddenInput.value = pref.都道府県名;
      }

      const cities = await fetchItems<Geolonia.City>(`japan/${prefCode}.json`);

      appendOptions(selectCity, cities, "市区町村コード", "市区町村名");

      selectCity.addEventListener("change", async (event) => {
        if (event.target instanceof HTMLSelectElement) {
          if (selectSmallArea) {
            removeSelect("small_area_code");
          }
          selectSmallArea = renderSelect(
            target,
            "small_area_code",
            "大字町丁目"
          );

          const cityCode = event.target.value;
          const city = cities.find((city) => city.市区町村コード === cityCode);
          if (city) {
            hiddenInput.value = pref.都道府県名 + city.市区町村名;
          }

          const smallAreas = await fetchItems<Geolonia.SmallArea>(
            `japan/${prefCode}/${cityCode}.json`
          );

          appendOptions(
            selectSmallArea,
            smallAreas,
            "大字町丁目コード",
            "大字町丁目名"
          );

          selectSmallArea.addEventListener("change", (event) => {
            if (event.target instanceof HTMLSelectElement) {
              const smallAreaCode = event.target.value;
              const smallArea = smallAreas.find(
                (smallArea) => smallArea.大字町丁目コード === smallAreaCode
              );
              if (smallArea) {
                hiddenInput.value =
                  pref.都道府県名 + city.市区町村名 + smallArea.大字町丁目名;
              }
            }
          });
        }
      });
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
