import { expect, test } from "vitest";
import { createRegionsGeoJSON, hexagonCoordinates, rewind } from "../../src";
import { Region } from "../../src/types/dataviz";
import { Feature, Polygon } from "geojson";

const franceRegions: Region[] = [
  {
    name: "Auvergne-Rhône-Alpes",
    center: [45.5158333333, 4.5380555556],
    surface: 69711,
    population: 8042963
  },
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

test("it creates a valid geoJSON collection of regions as hexagons", () => {
  const geoJSONcollection = createRegionsGeoJSON(regionsHexagonCoordinates);
  expect(geoJSONcollection["features"].length).toEqual(13);
  geoJSONcollection["features"].forEach((feature) => {
    expect(feature["geometry"]["type"]).toBe("Polygon");
    expect(feature["geometry"]["coordinates"][0]!.length).toEqual(7);
  });
});

test("it allows properties to be allocated for each feature in the geoJSON collection", () => {
  const geoJSONcollection = createRegionsGeoJSON(regionsHexagonCoordinates);
  geoJSONcollection["features"].forEach((feature, index) => {
    expect(feature["properties"]["region"]["name"]).toBe(franceRegions[index].name);
    expect(feature["properties"]["region"]["center"]).toBe(franceRegions[index].center);
    expect(feature["properties"]["region"]["hexagonCoordinates"]).toBe(undefined);
  });
});

test("it reverts coordinates from a given feature if coordinates need to be parsed clockwise", () => {
  const counterClockwiseCoordinates = {
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [1, 0],
              [0, 1]
            ]
          ]
        }
      }
    ]
  };
  rewind((counterClockwiseCoordinates.features as Array<Feature<Polygon>>));
  expect(counterClockwiseCoordinates["features"][0]["geometry"]["coordinates"][0]).toStrictEqual([
    [0, 1],
    [1, 0]
  ]);
});
