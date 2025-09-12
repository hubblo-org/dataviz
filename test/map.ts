import * as maps from "./carto";

const mapSelection = document.getElementById("map-selection");
mapSelection?.addEventListener("change", renderMap);
const mapsOptions = Object.keys(maps);

mapsOptions.forEach((map) => {
  const option = document.createElement("option");
  option.value = map;
  option.textContent = map;
  mapSelection?.append(option);
});

function renderMap() {
  const selectedMap = (mapSelection as HTMLSelectElement).value;
  document.getElementById("map-container")!.innerHTML = "";
  maps[selectedMap]();
}

renderMap();
