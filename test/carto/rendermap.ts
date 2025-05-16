import L from "leaflet";

export function renderMap() {

  const container = document.getElementById("map-container");
  const map = document.createElement("div");
  map.setAttribute("id", "map");
  container?.append(map);

  const options: L.MapOptions = {
    center: L.latLng(40.731253, -73.996139),
    zoom: 12
  };

  const myMap = L.map("map", options);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(myMap);
}
