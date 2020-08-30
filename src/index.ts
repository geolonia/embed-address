import { renderHiddenInput, renderSelect, removeSelect } from "./ui";

declare global {
  interface Window {
    geolonia?: {
      address?: () => void;
    };
  }
}

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
  const hiddenInput = renderHiddenInput();

  const prefs: Geolonia.Pref[] = [];
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
    selectPref = renderSelect("pref_code", "都道府県");
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
        selectCity = renderSelect("city_code", "市区町村");
      } catch (error) {
        showError(error.message);
        return;
      }
      const prefCode = event.target.value;
      const pref = prefs.find((pref) => pref.都道府県コード === prefCode);
      if (pref) {
        hiddenInput.value = pref.都道府県名;
      }

      const cities: Geolonia.City[] = [];
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
            selectSmallArea = renderSelect("small_area_code", "大字町丁目");
          } catch (error) {
            showError(error.message);
            return;
          }
          const cityCode = event.target.value;
          const city = cities.find((city) => city.市区町村コード === cityCode);
          if (city) {
            hiddenInput.value = pref.都道府県名 + city.市区町村名;
          }

          const smallAreas: Geolonia.SmallArea[] = [];
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

if (!window.geolonia) {
  window.geolonia = {};
}
window.geolonia.address = main;
