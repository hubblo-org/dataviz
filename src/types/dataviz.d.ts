import type { GeoJsonProperties } from "geojson";

export declare type Node = {
  name: string;
  children?: Node[] | Leaf[];
};

export declare type Leaf = {
  name: string;
  category: string;
  value: number;
};

export declare type Region = {
  name: string;
  center: number[];
  surface?: number;
  population?: number;
  hexagonCoordinates?: number[][];
};

export declare interface RegionProperties extends GeoJsonProperties {
  region: Omit<Region, "hexagonCoordinates">;
}
