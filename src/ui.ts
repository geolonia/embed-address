import "./style.scss";

export const decorateTarget = (target: HTMLElement) => {
  target.className += " geolonia_address_target";
  const container = document.createElement("div");
  container.className = "container";
  target.appendChild(container);
  return container;
};

export const renderHiddenInput = (target: HTMLElement) => {
  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.name = "address";
  target.appendChild(hiddenInput);
  return hiddenInput;
};

export const renderSelect = (
  target: HTMLElement,
  name: string,
  title: string
) => {
  if (!target) {
    throw new Error("no target found.");
  }
  const wrap_id = `geolonia_${name}`;
  const id = `geolonia_${name}_controls`;
  const wrap = document.createElement("div");
  wrap.id = wrap_id;
  wrap.className = "geolonia_address_field form-group row";
  const label = document.createElement("label");
  label.innerText = title;
  label.htmlFor = id;
  label.className = `geolonia_address_${name} col-sm-2 col-form-label`;
  const select = document.createElement("select");
  select.name = name;
  select.id = id;
  select.className = `geolonia_address_${name} form-control`;
  select.disabled = true;
  const option = document.createElement("option");
  option.selected = true;
  option.disabled = true;
  option.innerText = "-";
  option.className = `geolonia_address_${name}`;

  select.appendChild(option);
  wrap.appendChild(label);
  wrap.appendChild(select);
  target.appendChild(wrap);
  return select;
};

export const removeSelect = (name: string) => {
  const wrap_id = `geolonia_${name}`;
  const target = document.getElementById(wrap_id);
  target.remove();
};

export const appendOptions = (
  target: HTMLSelectElement,
  options: any[],
  valueProp: string,
  labelProp: string
) => {
  options.forEach((pref) => {
    const option = document.createElement("option");
    option.value = pref[valueProp];
    option.innerText = pref[labelProp];
    option.className = `geolonia_address_${target.name}`;
    target.appendChild(option);
  });
  target.disabled = false;
};
