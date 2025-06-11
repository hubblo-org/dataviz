import * as d3 from "d3";
import type { Leaf, Node } from "./types/dataviz";

function getFirstDepthParent(
  node: d3.HierarchyRectangularNode<Node>
): d3.HierarchyRectangularNode<Node> {
  return node.depth > 1 ? getFirstDepthParent(node.parent!) : node;
}

export function treemapLogo(fpath: string, legendId: string, logoId: string) {
  const treemapLogo = d3.select(legendId).select(`#${logoId}`);
  if (treemapLogo.empty()) {
    const hubbloLogo = d3.select(legendId).append("div").attr("class", "logo").attr("id", logoId);
    hubbloLogo.append("img").attr("src", fpath);
    hubbloLogo.append("span").text("Hubblo");
  }
}

/** Renders a treemap from the provided data structure.
 *
 * @remarks
 *
 * The data structure to be rendered as a treemap must be modified, if necessary, to be parsed
 * as a tree of nodes (containing leaves) or leaves (containing values).
 * Modified from the example provided in the D3 gallery: {@link https://observablehq.com/@d3/treemap/2}
 *
 * @param source - A string designating the DOM element where the treemap will be rendered.
 * @param tree - The data structure, hierarchized as a tree of nodes or leaves.
 * @param width - The treemap width, in pixels.
 * @param height - The treemap height, in pixels.
 */
export function treemap(source: string, tree: Node, width: number, height: number) {
  const treemapLegendId = `#${source}-treemap-legend`;
  const treemapId = `#${source}-treemap`;
  const treemapLegendWrapperId = `#${source}-treemap-legend-wrapper`;
  const svgTreemapId = `${source}-svg-treemap`;

  const color = d3.scaleOrdinal(
    tree.children!.map((d: Leaf) => d.name),
    d3.schemeTableau10
  );

  const numberFormat = d3.format(",r");
  const tile = d3.treemapSquarify;
  const root = d3.treemap<Node>().tile(tile).size([width, height]).padding(1).round(true)(
    d3
      .hierarchy(tree)
      .sum((d) => (d as d3.HierarchyNode<Node>).value!)
      .sort(
        (a, b) =>
          (b.data as d3.HierarchyPointNode<Node>).value! -
          (a.data as d3.HierarchyPointNode<Node>).value!
      )
  );

  const treemapLegend = d3
    .select(treemapLegendId)
    .attr(
      "style",
      "display: flex; align-items: center; margin-bottom: 12px; margin-left: 15px; font-family: var(--main-font-family), var(--fallback-font-family); font-size: 1.10 rem;"
    );
  if (!treemapLegend.empty()) {
    treemapLegend.selectChildren("span").remove();
    color.domain().forEach((domain) => {
      treemapLegend
        .append("span")
        .attr("class", "swatch")
        .attr("style", `--color: ${color(domain)};`)
        .text(domain.toLowerCase());
    });
  } else {
    console.error("No element to attach the treemap legend to!");
  }

  d3.select(treemapLegendWrapperId).attr(
    "style",
    `width: ${width}px; display: flex; margin-bottom: 12px;`
  );

  const treemap = d3.select(treemapId);
  if (!treemap.empty()) {
    treemap.selectChild("svg").remove();
    const svg = d3
      .select(treemapId)
      .append("svg")
      .attr("id", svgTreemapId)
      .attr("viewbox", `0 0 ${width} ${height}`)
      .attr("width", `${width}`)
      .attr("height", `${height}`)
      .attr("style", "font: 10px sans-serif;");

    root.leaves().forEach((leaf, leafIndex) => {
      const gId = `${source}-g-${leafIndex}`;
      const rectId = `${source}-rect-${leafIndex}`;
      const clipId = `${source}-clip-${leafIndex}`;
      const textId = `${source}-text-${leafIndex}`;
      const nodes = leaf.data.name
        .split(/(?=[A-Z][a-z])|\s+/g)
        .concat(numberFormat((leaf.data as d3.HierarchyPointNode<Node>).value!));

      svg
        .append("g")
        .attr("id", gId)
        .attr("transform", `translate(${leaf.x0}, ${leaf.y0})`)
        .append("title")
        .text(
          `${leaf
            .ancestors()
            .reverse()
            .map((leaf) => leaf.data.name)
            .join(".")}\n${numberFormat(leaf.value!)}`
        );

      const g = d3.select(`#${gId}`);

      g.append("rect")
        .attr("id", rectId)
        .attr("fill", `${color(getFirstDepthParent(leaf).data.name)}`)
        .attr("fill-opacity", 0.6)
        .attr("width", leaf.x1 - leaf.x0)
        .attr("height", leaf.y1 - leaf.y0);

      g.append("clipPath").attr("id", clipId).append("use").attr("href", `#${rectId}`);

      g.append("text").attr("id", textId).attr("clip-path", `url(#${clipId}`);
      const text = d3.select(`#${textId}`);

      nodes.forEach((node, nodeIndex) => {
        text
          .append("tspan")
          .attr("x", 3)
          .attr("y", `${(nodes.length - 1) * 0.3 + 1.1 + nodeIndex * 0.9}em`)
          .text(node)
          .attr("style", "font-size: 1.3em");
      });
    });
  } else {
    console.error("No element to attach the treemap to!");
  }
}
