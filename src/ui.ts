export const renderSelect = () => {
  const target = document.getElementById("address");
  if (!target) {
    throw new Error("no target found.");
  }
  const select = document.createElement("select");
  const option = document.createElement("option");
  option.selected = true;
  option.disabled = true;
  option.innerText = "-";
  select.appendChild(option);
  target.appendChild(select);
  return select;
};
