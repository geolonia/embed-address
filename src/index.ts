declare global {
  interface Window {
    geolonia: {};
  }
}

import { renderSelect, removeSelect } from "./ui";

const APIBase =
  "https://cdn.geolonia.com/address" &&
  "https://deploy-preview-4--awesome-jepsen-b8a456.netlify.app/address";

/**
 *
 * @param {string} path path for the Address API
 */
const fetchAPI = async <T = any>(path: string) => {
  try {
    const data = await fetch(`${APIBase}/${path}`).then((res) => {
      if (res.status > 299) {
        throw new Error("request error");
      } else {
        return res.json();
      }
    });
    return data as T;
  } catch (error) {
    throw error;
  }
};

const showError = (message: string) => {
  alert(message);
};

const main = async () => {
  const prefs = [];
  try {
    const body = await fetchAPI<Geolonia.Pref[]>("japan.json");
    prefs.push(...body);
  } catch (error) {
    showError(error.message);
    return;
  }

  let selectPref: HTMLSelectElement;
  let selectCity: HTMLSelectElement;
  let selectSmallArea: HTMLSelectElement;

  try {
    selectPref = renderSelect("prefecture", "都道府県");
  } catch (error) {
    showError(error.message);
    return;
  }

  prefs.forEach((pref) => {
    const option = document.createElement("option");
    option.value = pref.都道府県コード;
    option.innerText = pref.都道府県名;
    selectPref.appendChild(option);
  });
  selectPref.disabled = false;

  selectPref.addEventListener("change", async (event) => {
    if (event.target instanceof HTMLSelectElement) {
      if (selectCity) {
        removeSelect(selectCity);
      }
      if (selectSmallArea) {
        removeSelect(selectSmallArea, true);
      }
      try {
        selectCity = renderSelect("city", "市区町村");
      } catch (error) {
        showError(error.message);
        return;
      }
      const prefCode = event.target.value;
      const cities = [];
      try {
        const body = await fetchAPI<Geolonia.City[]>(`japan/${prefCode}.json`);
        cities.push(...body);
      } catch (error) {
        showError(error.message);
        return;
      }

      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.市区町村コード;
        option.innerText = city.市区町村名;
        selectCity.appendChild(option);
      });
      selectCity.disabled = false;

      selectCity.addEventListener("change", async (event) => {
        if (event.target instanceof HTMLSelectElement) {
          if (selectSmallArea) {
            removeSelect(selectSmallArea);
          }
          try {
            selectSmallArea = renderSelect("small-area", "大字町丁目");
          } catch (error) {
            showError(error.message);
            return;
          }
          const cityCode = event.target.value;
          const smallAreas = [];
          try {
            const body = await fetchAPI<Geolonia.SmallArea[]>(
              `japan/${prefCode}/${cityCode}.json`
            );
            smallAreas.push(...body);
          } catch (error) {
            showError(error.message);
            return;
          }

          smallAreas.forEach((smallArea) => {
            const option = document.createElement("option");
            option.value = smallArea.大字町丁目コード;
            option.innerText = smallArea.大字町丁目名;
            selectSmallArea.appendChild(option);
          });
          selectSmallArea.disabled = false;
        }
      });
    }
  });
};

main();
