import type { GeoJsonProperties } from "geojson";
import { SankeyExtraProperties, SankeyNode, SankeyLink } from "d3-sankey";

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

// d3-sankey type wrappers
type SNode = SankeyNode<SankeyExtraProperties, SankeyExtraProperties>;
type SLink = SankeyLink<SankeyExtraProperties, SankeyExtraProperties>;

type SankeyData = {
  nodes: SNode[];
  links: SLink[];
};

