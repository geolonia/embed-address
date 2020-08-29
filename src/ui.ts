export const renderControls = () => {
  const target = document.getElementById("address");
  if (!target) {
    throw new Error("no target found.");
  }
  return Promise.resolve(true);
};
