$(document).ready(() => {
  const $button = $("#geolocate");
  const $postalCodeInput = $("#postal-code");
  const $prefectureSelect = $("#prefecture");
  const $citySelect = $("#city");
  const $smallAreaSelect = $("#small-area");
  const $otherAddressesInput = $("#other-addresses");

  const initPrefecture = () => {
    $prefectureSelect.empty();
    $prefectureSelect.append('<option value=""></option>');
  };
  const initCity = () => {
    $citySelect.empty();
    $citySelect.append('<option value=""></option>');
  };
  const initSmallArea = () => {
    $smallAreaSelect.empty();
    $smallAreaSelect.append('<option value=""></option>');
  };

  const fetchCities = (prefCode) => {
    initCity();
    return fetch(`./data/cities/${prefCode}.json`)
      .then((res) => res.json())
      .then((items) => {
        items.forEach((item) => {
          $citySelect.append(
            `<option value="${item.cityCode}">${item.name}</option>`
          );
        });
      });
  };
  const fetchSmallAreas = (cityCode) => {
    initSmallArea();
    return fetch(`./data/smallAreas/${cityCode}.json`)
      .then((res) => res.json())
      .then((items) => {
        const names = items.map((item) => item.name);
        const uniqueAreas = names.reduce((prev, name, index) => {
          if (names.indexOf(name) === index) {
            prev.push(items[index]);
          }
          return prev;
        }, []);
        uniqueAreas.forEach((item) => {
          $smallAreaSelect.append(
            `<option value="${item.smallAreaCode}">${item.name}</option>`
          );
        });
      });
  };

  initPrefecture();
  initCity();
  initSmallArea();

  fetch("./data/prefectures.json")
    .then((res) => res.json())
    .then((items) => {
      items.forEach((item) => {
        $prefectureSelect.append(
          `<option value="${item.prefCode}">${item.name}</option>`
        );
      });
    });

  $prefectureSelect.on("change", (event) => {
    const prefCode = event.target.value;
    if (prefCode) {
      fetchCities(prefCode);
    }
  });

  $citySelect.on("change", (event) => {
    const cityCode = event.target.value;
    if (cityCode) {
      fetchSmallAreas(cityCode);
    }
  });

  $button.on("click", () => {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        // const latitude = position.coords.latitude;
        // const longitude = position.coords.longitude;
        Promise.all([fetchCities("25"), fetchSmallAreas("25214")]).then(() => {
          $prefectureSelect.val("25");
          $citySelect.val("25214");
          $smallAreaSelect.val("37000010");
          $postalCodeInput.val("521-0307");
          $otherAddressesInput.focus();
        });
      },
      () => {}
    );
  });

  $status = $("<span />");

  $otherAddressesInput.on("focus", (event) => {
    $status.remove();
  });
  $otherAddressesInput.on("blur", (event) => {
    const value = event.target.value;
    if (value) {
      $status.text("送信中");
      $otherAddressesInput.after($status);
      setTimeout(() => {
        $status.text("送信しました");
      }, 2000);
    }
  });
});
