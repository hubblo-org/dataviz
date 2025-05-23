import L, { LatLngExpression, LatLngTuple } from "leaflet";
import { createRegionsGeoJSON, getPointAtDistance, hexagonCoordinates } from "../../src";
import { Region } from "../../src/types/dataviz";
import { hexbinMap } from "../../src/carto";
import data from "./regions.geojson.json";

const franceRegions: Region[] = [
  { name: "Auvergne-Rhône-Alpes", center: [45.1922222222, 4.5380555556] },
  { name: "Bourgogne-Franche-Comté", center: [47.3, 4.8091666667] },
  { name: "Bretagne", center: [48.1797222222, -2.8386111111] },
  { name: "Centre-Val-de-Loire", center: [47.3, 1.3] },
  { name: "Corse", center: [42.1497222222, 9.1052777778] },
  { name: "Grand Est", center: [48.6891666667, 5.6194444444] },
  { name: "Hauts-de-France", center: [49.9661111111, 2.7752777778] },
  { name: "Île-de-France", center: [48.7091666667, 2.5047222222] },
  { name: "Normandie", center: [49.1211111111, 0.1066666667] },
  { name: "Nouvelle-Aquitaine", center: [45.1922222222, 0.1977777778] },
  { name: "Occitanie", center: [43.7022222222, 2.1372222222] },
  { name: "Pays de la Loire", center: [47.3, -0.8238888889] },
  { name: "Provence-Alpes-Côte d'Azur", center: [43.7022222222, 6.0533333333] }
];

export function leafletMap() {
  const franceCenterLat = 46.227638;
  const franceCenterLng = 2.213749;

  const bretagne = franceRegions.filter((region) => region.name === "Bretagne")[0];
  const corse = franceRegions.filter((region) => region.name === "Corse")[0];
  const hdf = franceRegions.filter((region) => region.name === "Hauts-de-France")[0];
  const pdl = franceRegions.filter((region) => region.name === "Pays de la Loire")[0];
  const cvdl = franceRegions.filter((region) => region.name === "Centre-Val-de-Loire")[0];
  const bfc = franceRegions.filter((region) => region.name === "Bourgogne-Franche-Comté")[0];
  const na = franceRegions.filter((region) => region.name === "Nouvelle-Aquitaine")[0];
  const occitanie = franceRegions.filter((region) => region.name === "Occitanie")[0];
  const ara = franceRegions.filter((region) => region.name === "Auvergne-Rhône-Alpes")[0];
  const paca = franceRegions.filter((region) => region.name === "Provence-Alpes-Côte d'Azur")[0];
  const relevantRegions = [bretagne, corse, hdf, pdl, cvdl, bfc, na, occitanie, ara, paca];
  const container = document.getElementById("map-container");
  const map = document.createElement("div");
  map.setAttribute("id", "map");
  container?.append(map);

  const options: L.MapOptions = {
    center: L.latLng(franceCenterLat, franceCenterLng),
    zoom: 6
  };

  const westernCoordinatesFromBretagne = [bretagne.center[0], corse.center[1]];

  const myMap = L.map("map", options);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(myMap);
  relevantRegions.forEach((region) => L.marker(region.center as LatLngExpression).addTo(myMap));
  L.marker(westernCoordinatesFromBretagne as LatLngExpression).addTo(myMap);
  L.polyline(
    [bretagne.center as LatLngExpression, westernCoordinatesFromBretagne as LatLngExpression],
    { color: "red" }
  ).addTo(myMap);
  L.polyline([bretagne.center as LatLngExpression, hdf.center as LatLngExpression], {
    color: "red"
  }).addTo(myMap);

  const distanceBretagneHdf = myMap.distance(
    bretagne.center as LatLngExpression,
    hdf.center as LatLngExpression
  );
  const normandieCenter = getPointAtDistance(
    bretagne.center[0],
    bretagne.center[1],
    (distanceBretagneHdf / 2) * 0.001,
    63
  );
  L.marker(normandieCenter as LatLngExpression).addTo(myMap);

  const grandEstCenter = getPointAtDistance(
    hdf.center[0],
    hdf.center[1],
    (distanceBretagneHdf / 2) * 0.001,
    114
  );

  L.marker(grandEstCenter as LatLngExpression).addTo(myMap);

  const idfCenter = [bretagne.center[0], hdf.center[1]];
  L.marker(idfCenter as LatLngExpression).addTo(myMap);
  const normandie: Region = { name: "Normandie", center: normandieCenter };
  const grandEst: Region = { name: "Grand Est", center: grandEstCenter };
  const idf: Region = { name: "Île-de-France", center: idfCenter };
  relevantRegions.push(normandie);
  relevantRegions.push(grandEst);
  relevantRegions.push(idf);
  const hexCoords = relevantRegions.map((region) => {
    const hexagon = hexagonCoordinates(region.center[0], region.center[1], 0.9);
    region.hexagonCoordinates = hexagon;
    return region;
  });
  hexCoords.forEach((coords) =>
    L.polygon(coords.hexagonCoordinates, { color: "red" }).addTo(myMap)
  );
  const geoJSONcollection = createRegionsGeoJSON(hexCoords);
  hexbinMap("#map-container", geoJSONcollection);
}

export function franceHexbinMap() {
  const regionsHexagonCoordinates = franceRegions.map((region) => {
    const hexagon = hexagonCoordinates(region.center[0], region.center[1], 0.8);
    region.hexagonCoordinates = hexagon;
    return region;
  });
  const geoJSONcollection = createRegionsGeoJSON(regionsHexagonCoordinates);
  hexbinMap("#map-container", geoJSONcollection);
}
