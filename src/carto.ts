import { Feature, FeatureCollection, Polygon } from "geojson";
import { Region, RegionProperties } from "./types/dataviz";
import * as d3 from "d3";

/** Generates the hexagon coordinates relative to a given position.
 *
 * @param latitude - The latitude coordinate for the given position.
 * @param longitude - The longitude coordinate for the given position.
 * @param [radius=1 / Math.sin(Math.PI / 3)] - The radius for the circle to be drawn around the given position.
 *
 */
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

/** Generates the coordinates of a point located at the provided distance from another point.
 *
 * @param latitude - The latitude coordinate for the starting position.
 * @param longitude - The longitude coordinate for the starting position.
 * @param distance - The distance in meters from the starting point to the ending point. 
 * @param bearing - The direction angle towards the ending point.
 *
 * @returns The generated coordinates for the queried point.
 */
export function getPointAtDistance(
  latitude: number,
  longitude: number,
  distance: number,
  bearing: number
): number[] {
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

/** Creates a valid GeoJSON object.
*
* @remarks 
* RFC 7946 specifies that coordinates have to be ordered as [longitude, latitude], which can be contrary
* to the implementations of other libraries using coordinates as [latitude, longitude].
* Other specification rules to follow: the first and last coordinates for a Polygon have to be the same
* in order to be drawn on a projection ; the right-hand rule must be respected, i. e. the coordinates for an exterior ring
* must be ordered counterclockwise.
* All region properties can be useful and added to the feature properties, except the hexagon coordinates, which would be redundant.
*
* @param regions - The input regions to create the GeoJSON collection from.
* @returns A GeoJSON collection of Polygons with each region metadata as properties.
*/
export function createRegionsGeoJSON(
  regions: Region[]
): GeoJSON.FeatureCollection<Polygon, RegionProperties> {
  const collection: FeatureCollection<Polygon, RegionProperties> = {
    type: "FeatureCollection",
    features: regions.map((region) => {
      if (!region.hexagonCoordinates) {
        throw new Error("Region hexagon coordinates are missing. These are needed for rendering the polygon geometry on a projection.");
      }
      region.hexagonCoordinates.forEach((c) => c.reverse());
      region.hexagonCoordinates.reverse();
      const { hexagonCoordinates, ...regionProperties } = region;
      const firstNode = region.hexagonCoordinates[0];
      const feature: Feature<Polygon, RegionProperties> = {
        type: "Feature",
        geometry: { type: "Polygon", coordinates: [region.hexagonCoordinates] },
        properties: { region: regionProperties }
      };
      feature.geometry.coordinates[0].push(firstNode);
      return feature;
    })
  };
  return collection;
}

/*
* Rewinds each set of coordinates.
*
* @remarks 
*
* d3 winding order for polygon coordinates is the opposite of the winding convention for GeoJSON.
* In GeoJSON, polygon coordinates are ordered counter-clockwise for internal rings, clockwise for external
* rings.
* Checking the winding order of coordinates can be necessary, especially when dealing with state ; if coordinates
* were already rewound, one might not want to rewind them again as this would create the common problem of the whole projection
* being designated as the polygon to be drawn, except for the internal polygon.
* More information here: {@link https://observablehq.com/@d3/winding-order}
*
* @param features - The array of feature containing the set of polygon coordinates.
*
*/
export function rewind(features: Array<Feature<Polygon>>): Array<Feature<Polygon>> {
  features.forEach((feature: Feature<Polygon>) => {
    if (feature.geometry.coordinates[0][0][0] < feature.geometry.coordinates[0][1][0]) {
      return;
    } else {
      feature.geometry.coordinates[0].reverse();
    }
  });
  return features;
}

/** 
 * Renders a map of France regions as hexagons, each region colored according to the value of the provided
 * criteria.
 *
 * @remarks
 * For data visualisation, using a realistic map of a geographical entities and associating
 * data to each entity can create a cognitive bias depending on their size (for example, a value
 * associated to a larger region relative to other regions). Using a map of hexagons with identical
 * sizes removes that bias, provided this map reminds of the larger entity to which each region is
 * related to.
 *
 * @param nodeId - The DOM element inside which the SVG map will be rendered.
 * @param regions - The GeoJSON collection containing the regions of France.
 * @param domain - The range of values for the provided criteria. 
 * @param criteria - The criteria selected to color each region with.
 * @param [scaleFactor=1200] - The scale factor to be set on the map projection.
 * @param [translationOffset=[400, 1400]] - The pixel coordinates for the projection's center.
 *
 */
export function franceRegionsHexbinMap(
  nodeId: string,
  regions: FeatureCollection<Polygon, RegionProperties>,
  domain: number[],
  criteria: keyof RegionProperties,
  scaleFactor: number = 1200,
  translationOffset: [number, number] = [400, 1400]
) {
  const container = d3.select(nodeId);
  const width = 800;
  const height = 600;

  const colorScale = d3.scaleQuantile().domain(domain).range(d3.schemeReds[7]);
  const rewoundFeatures = rewind(regions.features);

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
    .attr("stroke", "black")
    .attr("fill", function (d) {
      return colorScale(d.properties!.region[criteria]);
    })
    .append("title")
    .text((d) => {
      return `Region: ${d.properties!.region.name}\n Value: ${d.properties!.region[criteria]}`;
    });
}
