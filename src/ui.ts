export const appendSelectOptions = (
  target: HTMLSelectElement,
  options: any[],
  valueProp: string,
  labelProp: string
) => {
  return new Promise((resolve) => {
    options.forEach((pref) => {
      const option = document.createElement("option");
      option.value = pref[valueProp];
      option.innerText = pref[labelProp];
      option.className = `geolonia_address_${target.name}`;
      target.appendChild(option);
    });
    target.disabled = false;
    resolve();
  });
};

export const appendDatalistOptions = (
  target: HTMLDataListElement,
  options: any[],
  value: string
) => {
  return new Promise((resolve) => {
    options.forEach((pref) => {
      const option = document.createElement("option");
      option.value = pref[value];
      target.appendChild(option);
    });
    resolve();
  });
};

export const removeOptions = (
  target: HTMLSelectElement | HTMLDataListElement
) => {
  return new Promise((resolve) => {
    [...target.children].forEach((child) => {
      const option = child as HTMLOptionElement;
      if ((option.dataset || {}).isPlaceholder !== "true") {
        option.remove();
      } else {
        option.selected = true;
      }
    });
    resolve();
  });
};

export const renderForms = (
  target: HTMLElement,
  options: Geolonia.FormRenderOptions
) => {
  target.className += (target.className ? " " : "") + "geolonia_address_wrap";
  const button_geolocation_id = "geolonia-reverse-geocode-button";
  const select_pref_code_id = "geolonia-pref-code";
  const input_pref_name_id = "geolonia-prefecture-name";
  const select_city_code_id = "geolonia-city-code";
  const input_city_name_id = "geolonia-city-name";
  const input_small_area_id = "geolonia-small-area";
  const datalist_small_area_id = "geolonia-small-area-datalist";
  const input_is_exception_id = "geolonia-small-area-is-exception";
  const input_other_address_id = "geolonia-other-address";
  const span_error_message_id = "geolonia-error-message";

  // XSS OK for the options
  target.innerHTML += `
    <button
      id="${button_geolocation_id}"
      type="button"
    >${options.geolocationButtonLabel}</button>

    <select
      id="${select_pref_code_id}"
      name="${options.prefCodeName}"
      class="geolonia_pref_select"
      disabled
    >
      <option
        data-is-placeholder="true"
        selected
        disabled
      >${options.prefectureLabel}</option>
    </select>

    <input
      id="${input_pref_name_id}"
      name="${options.prefectureName}"
      type="hidden"
    />

    <select
      id="${select_city_code_id}"
      name="${options.cityCodeName}"
      class="geolonia_city_select"
      disabled
    >
      <option
        data-is-placeholder="true"
        selected
        disabled
      >${options.cityLabel}</option>
    </select>

    <input
      id="${input_city_name_id}"
      name="${options.cityName}"
      type="hidden"
    />

    <input
      id="${input_small_area_id}"
      name="${options.smallAreaName}"
      class="geolonia_small_area_input"
      type="text"
      list="${datalist_small_area_id}"
      placeholder="${options.smallAreaLabel}"
    />

    <datalist id="${datalist_small_area_id}"></datalist>

    <input
      id=${input_is_exception_id}
      name="${options.isSmallAreaExceptionName}"
      type="hidden"
    />

    <input
      id="${input_other_address_id}"
      name="${options.otherAddressName}"
      class="geolonia_ither_address_input"
      type="text"
      placeholder="${options.otherAddressLabel}"
    />

    <div class="geolonia_error">
      <span id="${span_error_message_id}" />
    </div>
  `;

  const buttonGeolocation = document.getElementById(
    button_geolocation_id
  ) as HTMLButtonElement;
  const selectPrefCode = document.querySelector<HTMLSelectElement>(
    `#${select_pref_code_id}`
  );
  const inputPrefName = document.querySelector<HTMLInputElement>(
    `#${input_pref_name_id}`
  );
  const selectCityCode = document.querySelector<HTMLSelectElement>(
    `#${select_city_code_id}`
  );
  const inputCityName = document.querySelector<HTMLInputElement>(
    `#${input_city_name_id}`
  );
  const inputSmallArea = document.querySelector<HTMLInputElement>(
    `#${input_small_area_id}`
  );
  const datalistSmallArea = document.querySelector<HTMLDataListElement>(
    `#${datalist_small_area_id}`
  );
  const inputIsSmallAreaException = document.querySelector<HTMLInputElement>(
    `#${input_is_exception_id}`
  );
  const inputOtherAddress = document.querySelector<HTMLInputElement>(
    `#${input_other_address_id}`
  );
  const spanErrorMessage = document.querySelector<HTMLSpanElement>(
    `#${span_error_message_id}`
  );
  const parentalForm = target.closest("form");

  selectPrefCode.addEventListener("change", (event) => {
    if (event.target instanceof HTMLSelectElement) {
      spanErrorMessage.innerText = "";
      const prefCode = event.target.value;
      const options = [
        ...document.querySelectorAll<HTMLOptionElement>(
          `#${select_pref_code_id} option`
        ),
      ];
      const option = options.find((option) => option.value === prefCode);
      if (option) {
        inputPrefName.value = option.innerText;
      }
    }
  });

  selectCityCode.addEventListener("change", (event) => {
    if (event.target instanceof HTMLSelectElement) {
      spanErrorMessage.innerText = "";
      const cityCode = event.target.value;
      const options = [
        ...document.querySelectorAll<HTMLOptionElement>(
          `#${select_city_code_id} option`
        ),
      ];
      const option = options.find((option) => option.value === cityCode);
      if (option) {
        inputCityName.value = option.innerText;
      }
    }
  });

  inputSmallArea.addEventListener("change", (event) => {
    if (event.target instanceof HTMLInputElement) {
      spanErrorMessage.innerText = "";
      const smallAreaName = event.target.value;
      const options = [
        ...document.querySelectorAll<HTMLOptionElement>(
          `#${datalist_small_area_id} option`
        ),
      ];
      const option = options.find((option) => option.value === smallAreaName);
      inputIsSmallAreaException.value = option ? "false" : "true";
    }
  });

  inputOtherAddress.addEventListener("change", (event) => {
    spanErrorMessage.innerText = "";
  });

  return {
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
  };
};
