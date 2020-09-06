import {
  renderForms,
  appendSelectOptions,
  appendDatalistOptions,
  removeOptions,
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

const main = async (targetElementId: string = "address") => {
  const target = document.getElementById(targetElementId);
  if (!target) {
    throw new Error("no target found.");
  }

  let prefCode: string = "";
  let cityCode: string = "";

  const [
    { selectPrefCode, selectCityCode, inputSmallArea, datalistSmallArea },
    prefectures,
  ] = await Promise.all([
    renderForms(target),
    fetchItems<Geolonia.Pref>("japan.json"),
  ]);

  appendSelectOptions(
    selectPrefCode,
    prefectures,
    "都道府県コード",
    "都道府県名"
  );

  selectPrefCode.addEventListener("change", async (event) => {
    if (event.target instanceof HTMLSelectElement) {
      prefCode = event.target.value;
      const cities = await fetchItems<Geolonia.City>(`japan/${prefCode}.json`);
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
      const smallAreas = await fetchItems<Geolonia.SmallArea>(
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
