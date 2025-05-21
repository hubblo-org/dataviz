import L, { LatLngTuple } from "leaflet";
import { hexagonCoordinates } from "../../src";
import { createRegionsGeoJSON, hexbinMap } from "../../src/carto";
import { Region } from "../../src/types/dataviz";

export function leafletMap() {
  const franceCenterLat = 46.227638;
  const franceCenterLng = 2.213749;

  const centers = [
    [45.5158333333, 4.5380555556],
    [47.2352777778, 4.8091666667],
    [48.1797222222, -2.8386111111],
    [47.4805555556, 1.6852777778],
    [42.1497222222, 9.1052777778],
    [48.6891666667, 5.6194444444],
    [49.9661111111, 2.7752777778],
    [48.7091666667, 2.5047222222],
    [49.1211111111, 0.1066666667],
    [45.1922222222, 0.1977777778],
    [43.7022222222, 2.1372222222],
    [47.4747222222, -0.8238888889],
    [43.955, 6.0533333333]
  ];
  const container = document.getElementById("map-container");
  const map = document.createElement("div");
  map.setAttribute("id", "map");
  container?.append(map);

  const options: L.MapOptions = {
    center: L.latLng(franceCenterLat, franceCenterLng),
    zoom: 6
  };

  const myMap = L.map("map", options);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(myMap);

  centers.forEach((center) => {
    const centerHexCoords = hexagonCoordinates(center[0], center[1]);
    L.polygon(centerHexCoords, { color: "red" }).addTo(myMap);
  });
}

export function franceHexbinMap() {
  const franceRegions: Region[] = [
    { name: "Auvergne-Rhône-Alpes", center: [45.5158333333, 4.5380555556] },
    { name: "Bourgogne-Franche-Comté", center: [47.2352777778, 4.8091666667] },
    { name: "Bretagne", center: [48.1797222222, -2.8386111111] },
    { name: "Centre-Val-de-Loire", center: [47.4805555556, 1.6852777778] },
    { name: "Corse", center: [42.1497222222, 9.1052777778] },
    { name: "Grand Est", center: [48.6891666667, 5.6194444444] },
    { name: "Hauts-de-France", center: [49.9661111111, 2.7752777778] },
    { name: "Île-de-France", center: [48.7091666667, 2.5047222222] },
    { name: "Normandie", center: [49.1211111111, 0.1066666667] },
    { name: "Nouvelle-Aquitaine", center: [45.1922222222, 0.1977777778] },
    { name: "Occitanie", center: [43.7022222222, 2.1372222222] },
    { name: "Pays de la Loire", center: [47.4747222222, -0.8238888889] },
    { name: "Provence-Alpes-Côte d'Azur", center: [43.955, 6.0533333333] }
  ];

  const regionsHexagonCoordinates = franceRegions.map((region) => {
    const hexagon = hexagonCoordinates(region.center[0], region.center[1]);
    region.hexagonCoordinates = hexagon;
    return region;
  });
  const geoJSONcollection = createRegionsGeoJSON(regionsHexagonCoordinates);
  hexbinMap("#map-container", geoJSONcollection);
}
