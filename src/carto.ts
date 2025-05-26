import { Feature, Geometry, Polygon } from "geojson";
import { Region, RegionProperties } from "./types/dataviz";
import * as d3 from "d3";

// Generate the hexagon coordinates relative to a given position.
export function hexagonCoordinates(
  latitude: number,
  longitude: number,
  radius: number = 1 / Math.sin(Math.PI / 3)
): number[][] {
  const sides = 6;
  const baseAngle = Math.floor(360 / sides);
  const iterableSides = [...Array(sides).keys()];
  const coordinates = iterableSides.map((side) => {
    const relativeAngle = (baseAngle * side + Math.floor(baseAngle / 2)) * (Math.PI / 180);
    const c = [
      latitude + radius * Math.cos(relativeAngle),
      longitude + radius * Math.sin(relativeAngle)
    ];
    return c;
  });
  return coordinates;
}

export function getPointAtDistance(
  latitude: number,
  longitude: number,
  distance: number,
  bearing: number
) {
  // Average Earth radius
  const radius = 6371;

  const latRadians = latitude * (Math.PI / 180);
  const lngRadians = longitude * (Math.PI / 180);
  const angle = bearing * (Math.PI / 180);

  const newPointLat = Math.asin(
    Math.sin(latRadians) * Math.cos(distance / radius) +
      Math.cos(latRadians) * Math.sin(distance / radius) * Math.cos(angle)
  );
  const newPointLng =
    lngRadians +
    Math.atan2(
      Math.sin(angle) * Math.sin(distance / radius) * Math.cos(latRadians),
      Math.cos(distance / radius) - Math.sin(latRadians) * Math.sin(newPointLat)
    );

  const newPointLatDegrees = newPointLat * (180 / Math.PI);
  const newPointLngDegrees = newPointLng * (180 / Math.PI);

  const newCoordinates = [newPointLatDegrees, newPointLngDegrees];
  return newCoordinates;
}

// Creates a valid GeoJSON object.
//
// RFC 7946 specifies that coordinates have to be ordered as [longitude, latitude], which can be contrary
// to the implementations of other libraries using coordinates as [latitude, longitude].
// Other specification rules to follow: the first and last coordinates for a Polygon have to be the same
// in order to be drawn on a projection ; the right-hand rule must be respected, i. e. the coordinates for an exterior ring
// must be ordered counterclockwise.
export function createRegionsGeoJSON(regions: Region[]) {
  const collection = {
    type: "FeatureCollection",
    features: regions.map((region) => {
      region.hexagonCoordinates.forEach((c) => c.reverse());
      region.hexagonCoordinates.reverse();
      const firstNode = region.hexagonCoordinates[0];
      const feature = {
        type: "Feature",
        geometry: { type: "Polygon", coordinates: [region.hexagonCoordinates] },
        properties: { region: region.name }
      };
      feature.geometry.coordinates[0].push(firstNode);
      return feature;
    })
  };
  return collection;
}

// d3 winding order for polygon coordinates is the opposite of the winding convention for GeoJSON.
// In GeoJSON, polygon coordinates are ordered counter-clockwise for internal rings, clockwise for external
// rings.
function rewind(features: Array<Feature>) {
  features.forEach((feature: Feature<Polygon>) => feature.geometry.coordinates[0].reverse());
  return features;
}

export function franceRegionsHexbinMap(
  nodeId: string,
  data: GeoJSON.FeatureCollection<Polygon, RegionProperties>,
  scaleFactor: number,
  translationOffset: [number, number]
) {
  const container = d3.select(nodeId);
  const width = 800;
  const height = 600;

  const rewoundFeatures = rewind(data.features);

  const svg = container
    .append("svg")
    .attr("id", "map-svg")
    .attr("width", width)
    .attr("height", height);

  const projection = d3.geoMercator().scale(scaleFactor).translate(translationOffset);

  let path = d3.geoPath().projection(projection);

  svg
    .append("g")
    .selectAll("path")
    .data(rewoundFeatures)
    .join("path")
    .attr("d", path)
    .attr("fill", "white")
    .attr("stroke", "black")
    .append("title")
    .text((d) => d.properties.region);
}
