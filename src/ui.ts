type FormRenderOptions = {
  geolocationButtonLabel: String;
  prefectureLabel: String;
  cityLabel: String;
  smallAreaLabel: String;
  otherAddressLabel: String;
};

type RenderedForms = {
  buttonGeolocation: HTMLButtonElement;
  selectPrefCode: HTMLSelectElement;
  selectCityCode: HTMLSelectElement;
  inputSmallArea: HTMLInputElement;
  datalistSmallArea: HTMLDataListElement;
  inputIsSmallAreaException: HTMLInputElement;
  spanErrorMessage: HTMLSpanElement;
};

const defaultFormRenderOptions: FormRenderOptions = {
  geolocationButtonLabel: "現在地から住所を入力",
  prefectureLabel: "都道府県",
  cityLabel: "市区町村",
  smallAreaLabel: "大字町丁目",
  otherAddressLabel: "その他の住所",
};

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
      if (option.innerHTML !== "-") {
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
  _options: Partial<FormRenderOptions> = defaultFormRenderOptions
) => {
  return new Promise<RenderedForms>((resolve) => {
    const options = { ...defaultFormRenderOptions, ..._options };

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

    target.innerHTML += `
    <button type="button" id="${button_geolocation_id}">${options.geolocationButtonLabel}</button>
    <div class="geolonia_pref">
      <label class="geolonia_pref_label" for="${select_pref_code_id}">${options.prefectureLabel}</label>
      <select class="geolonia_pref_select" id="${select_pref_code_id}" disabled>
        <option selected disabled>-</option>
      </select>
      <input type="hidden" id="${input_pref_name_id}" name="prefecture" />
    </div>

    <div class="geolonia_city">
      <label class="geolonia_city_label" for="${select_city_code_id}">${options.cityLabel}</label>
      <select class="geolonia_city_select" id="${select_city_code_id}" disabled>
            <option selected disabled>-</option>
      </select>
      <input type="hidden" id="${input_city_name_id}" name="city" />
    </div>

    <div class="geolonia_small_area">
      <label class="geolonia_small_area_label" for="${input_small_area_id}">${options.smallAreaLabel}</label>
      <input class="geolonia_small_area_input" type="text" id="${input_small_area_id}" list="${datalist_small_area_id}" name="small-area"></select>
      <datalist id="${datalist_small_area_id}"></datalist>
      <input type="hidden" id=${input_is_exception_id} name="is-exception" />
    </div>

    <div class="geolonia_other_address">
      <label class="geolonia_other_address_label" for="${input_other_address_id}">${options.otherAddressLabel}</label>
      <input class="geolonia_ither_address_input" type="text" id="${input_other_address_id}" name="other-address"></select>
    </div>

    <div class="geolonia_error"><span id="${span_error_message_id}" /></div>
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

    resolve({
      buttonGeolocation,
      selectPrefCode,
      selectCityCode,
      inputSmallArea,
      datalistSmallArea,
      inputIsSmallAreaException,
      spanErrorMessage,
    });
  });
};
