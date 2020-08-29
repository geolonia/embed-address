declare global {
  interface Window {
    geolonia: {};
  }
}

import { renderSelect } from "./ui";

const APIBase = "https://cdn.geolonia.com/address";

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
  try {
    selectPref = renderSelect();
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

  selectPref.addEventListener("change", async (event) => {
    if (event.target instanceof HTMLSelectElement) {
      const prefCode = event.target.value;
      const cities = [];
      try {
        const body = await fetchAPI<Geolonia.City[]>(`japan/${prefCode}.json`);
        cities.push(...body);
      } catch (error) {
        showError(error.message);
        return;
      }
      let selectCity: HTMLSelectElement;
      try {
        selectCity = renderSelect();
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
    }
  });
};

main();

// // TODO
// // 1. 都道府県を fetch
// // 1. 1つ目の都道府県 select を render
// // 1. ユーザーが select する
// // 1. 市区町村を fetch
// // 1. 2つ目の市区町村 select を render
// // 1. ユーザーが 市区町村を select

// // $(document).ready(() => {
// //   const $button = $("#geolocate");
// //   const $geolocationLoader = $("#geolocation-loader");
// //   const $otherAddressesLoader = $("#other-addresses-loader");
// //   const $prefectureSelect = $("#prefecture");
// //   const $citySelect = $("#city");
// //   const $smallAreaSelect = $("#small-area");
// //   const $otherAddressesInput = $("#other-addresses");

// //   $('[data-toggle="tooltip"]').tooltip();

// //   const initPrefecture = () => {
// //     $prefectureSelect.empty();
// //     $prefectureSelect.append('<option value=""></option>');
// //   };
// //   const initCity = () => {
// //     $citySelect.empty();
// //     $citySelect.append('<option value=""></option>');
// //   };
// //   const initSmallArea = () => {
// //     $smallAreaSelect.empty();
// //     $smallAreaSelect.append('<option value=""></option>');
// //   };

// //   const fetchCities = (prefCode) => {
// //     initCity();
// //     return fetch(`./data/cities/${prefCode}.json`)
// //       .then((res) => res.json())
// //       .then((items) => {
// //         items.forEach((item) => {
// //           $citySelect.append(
// //             `<option value="${item.cityCode}">${item.name}</option>`
// //           );
// //         });
// //       });
// //   };
// //   const fetchSmallAreas = (cityCode) => {
// //     initSmallArea();
// //     return fetch(`./data/smallAreas/${cityCode}.json`)
// //       .then((res) => res.json())
// //       .then((items) => {
// //         const names = items.map((item) => item.name);
// //         const uniqueAreas = names.reduce((prev, name, index) => {
// //           if (names.indexOf(name) === index) {
// //             prev.push(items[index]);
// //           }
// //           return prev;
// //         }, []);
// //         uniqueAreas.forEach((item) => {
// //           $smallAreaSelect.append(
// //             `<option value="${item.smallAreaCode}">${item.name}</option>`
// //           );
// //         });
// //       });
// //   };

// //   initPrefecture();
// //   initCity();
// //   initSmallArea();

// //   fetch("./data/prefectures.json")
// //     .then((res) => res.json())
// //     .then((items) => {
// //       items.forEach((item) => {
// //         $prefectureSelect.append(
// //           `<option value="${item.prefCode}">${item.name}</option>`
// //         );
// //       });
// //     });

// //   $prefectureSelect.on("change", (event) => {
// //     const prefCode = event.target.value;
// //     if (prefCode) {
// //       fetchCities(prefCode);
// //     }
// //   });

// //   $citySelect.on("change", (event) => {
// //     const cityCode = event.target.value;
// //     if (cityCode) {
// //       fetchSmallAreas(cityCode);
// //     }
// //   });

// //   $button.on("click", () => {
// //     $prefectureSelect.val("");
// //     $citySelect.val("");
// //     $smallAreaSelect.val("");
// //     $geolocationLoader.css("display", "inline-block");
// //     window.navigator.geolocation.getCurrentPosition(
// //       (position) => {
// //         // const latitude = position.coords.latitude;
// //         // const longitude = position.coords.longitude;
// //         Promise.all([fetchCities("25"), fetchSmallAreas("25214")]).then(() => {
// //           $prefectureSelect.val("25");
// //           $citySelect.val("25214");
// //           $smallAreaSelect.val("37000010");
// //           $otherAddressesInput.focus();
// //           $geolocationLoader.css("display", "none");
// //         });
// //       },
// //       () => {}
// //     );
// //   });

// //   let prevValue = "";
// //   $otherAddressesInput.on("change", () => {
// //     $otherAddressesLoader.css("display", "none");
// //   });
// //   $otherAddressesInput.on("blur", (event) => {
// //     const value = event.target.value;
// //     if (value && prevValue !== value) {
// //       prevValue = value;
// //       $otherAddressesLoader.css("display", "inline-block");
// //       setTimeout(() => {
// //         $otherAddressesLoader.css("display", "none");
// //       }, 2000);
// //     }
// //   });
// // });
