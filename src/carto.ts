import { Region } from "./types/dataviz";
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
// to the specifications of other libraries ordering coordinates as [latitude, longitude].
export function createRegionsGeoJSON(regions: Region[]) {
  const collection = {
    type: "FeatureCollection",
    features: regions.map((region) => {
      region.hexagonCoordinates.forEach((c) => c.reverse());
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

export function hexbinMap(nodeId: string, data: any) {
  const container = d3.select(nodeId);
  const width = 800;
  const height = 600;

  const svg = container
    .append("svg")
    .attr("id", "map-svg")
    .attr("width", width)
    .attr("height", height)
    .attr("style", "background-color: grey");

  const projection = d3.geoMercator().scale(1000).translate([300, 1200]);

  svg
    .append("g")
    .selectAll("path")
    .data(data.features)
    .join("path")
    .attr("opacity", "0.6")
    .attr("fill", "purple")
    .attr("d", d3.geoPath().projection(projection))
    .attr("stroke", "black")
    .append("title").text((d) => `${d["properties"]["region"]}`);
}
