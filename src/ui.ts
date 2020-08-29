const target = document.getElementById("address");

export const renderSelect = (name: string, title: string) => {
  if (!target) {
    throw new Error("no target found.");
  }
  const id = `geolonia_${name}`;
  const label = document.createElement("label");
  label.innerText = title;
  label.htmlFor = id;
  const select = document.createElement("select");
  select.name = name;
  select.id = id;
  select.disabled = true;
  const option = document.createElement("option");
  option.selected = true;
  option.disabled = true;
  option.innerText = "-";
  select.appendChild(option);
  target.appendChild(label);
  target.appendChild(select);
  return select;
};

export const removeSelect = (
  selectElement: HTMLSelectElement,
  removeLabel: boolean = true
) => {
  if (removeLabel) {
    const id = selectElement.id;
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) {
      label.remove();
    }
  }
  selectElement.remove();
};
