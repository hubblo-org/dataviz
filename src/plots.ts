import type { Data, Markish, PlotOptions } from "@observablehq/plot";
import type { SankeyData, SNode, SLink } from "./types/dataviz";
import {
  axisBottom,
  axisLeft,
  BaseType,
  cross,
  extent,
  format,
  range,
  scaleLinear,
  scaleOrdinal,
  schemeCategory10,
  schemeTableau10,
  select,
  Selection,
  symbol,
  symbolsFill
} from "d3";
import { sankey, sankeyJustify, sankeyLinkHorizontal } from "d3-sankey";
import {
  areaY,
  axisFy,
  axisX,
  axisY,
  barX,
  dot,
  frame,
  gridY,
  groupY,
  line,
  lineY,
  plot,
  ruleX,
  ruleY,
  selectFirst,
  selectLast,
  stackY,
  text
} from "@observablehq/plot";

export type ColorFunction = (color: string) => string;
export type SymbolFunction = (symbol: string) => string;

const selectStyle =
  "background: 0 0; position: relative; border: 1px solid hsla(240, 6%, 87%, 1); border-radius: 4px; padding: 0.425em 1em 0.45em; min-height: 1.5rem; font: inherit;";

/** Renders a legend for the plot, with each domain associated to a color.
 *
 * @param nodeId - The DOM element where the plot will be rendered.
 * @param width - The plot width, in pixels.
 * @param domains - The dataset categories identified on the legend.
 * @param color - The function assocating a domain with a color.
 */
export function addLegend(
  nodeId: string,
  width: number,
  domains: string[],
  color: ColorFunction,
  symbol: SymbolFunction
) {
  const legendId = `${nodeId}-legend`;
  const legendWrapperId = `${legendId}-wrapper`;
  const legend = select(`#${nodeId}`)
    .append("div")
    .attr("id", legendId)
    .attr("style", "display: flex; align-items: center; margin: 12px; font-size: 1.10 rem;");

  if (!legend.empty()) {
    legend.selectChildren("span").remove();
    domains.forEach((domain) => {
      const symbolContainerSize = 20;
      const symbolViewBox = [-10, -10, 20, 20];
      legend
        .append("span")
        .attr("class", "swatch")
        .attr(
          "style",
          `display: inline-flex; align-items: center; margin-right: 5px; height: 15px;};`
        )
        .text(domain.toLowerCase())
        .append("svg")
        .attr("width", symbolContainerSize)
        .attr("height", symbolContainerSize)
        .attr("viewBox", symbolViewBox)
        .attr("style", "margin-right: 3px")
        .append("path")
        .attr("d", symbol(domain))
        .attr("fill", color(domain));
    });
  }

  select(legendWrapperId).attr("style", `width: ${width}px; display: flex; margin-bottom: 12px;`);
  return legend;
}

export function addLogo(nodeId: string, logo: string) {
  // When a legend is created with the generated plot, a figure element is added to the selected div.
  // The first child is then the div with the legend elements.
  const logoDiv = select(nodeId).select("figure").select("div").append("div").attr("class", "logo");

  logoDiv.append("img").attr("src", logo);
  logoDiv.append("span").text("Hubblo").attr("class", "logo");
}

/** Normalize all values of the provided properties of a dataset between 0 and 1.
 *
 * Certain data visualisations benefit from value normalization, especially in cases
 * where different properties are represented on the same graph. This method allows
 * to normalize all values of each element, after identifying the minimum and maximum values.
 *
 * @param domains - The different data properties to be normalized.
 * @param data - The source dataset.
 */
export function minMaxScaling<Type>(domains: [keyof Type], data: Type[]): Type[] {
  const scaledData = data.map((element) => {
    let scaledDatum = { ...element };
    domains.forEach((domain) => {
      if (typeof element[domain] === "number") {
        const values: number[] = data.map((element) => element[domain] as number);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const result = (element[domain] - min) / (max - min);
        const rounded = parseFloat((Math.round(result * 100) / 100).toFixed(2));
        (scaledDatum[domain] as number) = rounded;
      }
    });
    return scaledDatum;
  });
  return scaledData;
}

export function checkShadowDom(element: HTMLElement) {
  if (element.shadowRoot != null) {
    return true;
  } else {
    return false;
  }
}

/** Renders an element allowing to select a dataset property to be represented visually.
 *
 * @param nodeId - The DOM element where the element will be rendered.
 * @param data - The data structure represented on the plot.
 * @param xLabel - The data property rendered on the x axis.
 * @param yLabel - The data property rendered on the y axis.
 * @param width - The plot width, in pixels.
 * @param initialOption - The option to be selected after drawing the element.
 */
export function addSelect<Type>(
  nodeId: string,
  data: Type,
  xLabel: string,
  yLabel: string,
  width: number,
  initialOption: string
): string {
  const initialOptionId = `${nodeId}-${initialOption}`;
  const selectContainerId = `${nodeId}-select-container`;
  const selectId = `${nodeId}-select`;
  const container = document.getElementById(nodeId);
  const isInTheShadowDom = checkShadowDom(container);
  const divForSelect = document.getElementById(selectContainerId);

  if (!divForSelect) {
    let parent;
    const container = document.getElementById(nodeId);
    if (isInTheShadowDom) {
      parent = container.shadowRoot.getElementById(`${nodeId}-container`);
    } else {
      parent = document.getElementById(nodeId).parentElement.nodeName;
    }
    const divForSelect = select(parent).append("div").attr("id", selectContainerId);
    center(selectContainerId, width);

    const isNotAnAxis = (value: string) => {
      if (value === xLabel || value == yLabel) {
        return false;
      }
      return true;
    };

    divForSelect
      .append("label")
      .attr("for", selectId)
      .text("Select a property for value distribution: ");

    divForSelect.append("select").attr("id", selectId).attr("style", selectStyle);

    const options = Object.keys(data[0]).filter(isNotAnAxis);
    options.forEach((option) =>
      select(parent)
        .select(`#${selectId}`)
        .append("option")
        .attr("value", option)
        .attr("id", `${nodeId}-${option}`)
        .text(option)
    );

    if (isInTheShadowDom) {
      const selection = container.shadowRoot.getElementById(initialOptionId);
      (selection as HTMLOptionElement).selected = true;
    } else {
      const selection = document.getElementById(initialOptionId);
      (selection as HTMLOptionElement).selected = true;
    }
  }
  return selectId;
}

/** Renders a stacked area chart.
 *
 * @remarks
 *
 * One can use a stacked area chart when wanting to show the distribution of distinct
 * groups among a whole. It is not so useful when one wants to show the individual evolution
 * of each group {@link https://www.data-to-viz.com/graph/stackedarea.html}. A multi-line chart
 * or a group of individual line chart / area chart can be an alternative in that case. Therefore,
 * when not normalized, each data group will be its distinct area chart.
 *
 * @param nodeId - The DOM element where the plot will be rendered.
 * @param data - The data structure to be rendered on the chart.
 * @param width - The plot width, in pixels.
 * @param height - The plot height, in pixels.
 * @param xLabel - The data property to be rendered on the x axis.
 * @param yLabel - The data property to be rendered on the y axis.
 * @param zDimension - The third data property allowing the grouping of data on the chart.
 * @param normalize - If true, data is normalized and the chart is stacked.
 *
 */
export function areaChart<Type>(
  nodeId: string,
  data: Type,
  width: number,
  height: number,
  xLabel: string,
  yLabel: string,
  zDimension: string,
  normalize?: boolean
) {
  const plotOptions: PlotOptions = {
    width: width,
    height: height,
    marginLeft: 0,
    style: "overflow:visible;"
  };

  if (normalize) {
    center(nodeId, width);
    plotOptions.color = { legend: true };
    plotOptions.round = true;
    plotOptions.x = { label: null, insetLeft: 36, type: "time", ticks: "year" };
    plotOptions.y = { label: "↑ Share (%)", percent: true };
    plotOptions.marks = [
      areaY(
        data as Data,
        stackY(
          { offset: "normalize", order: zDimension, reverse: true },
          { x: xLabel, y: yLabel, fill: zDimension, order: "group" }
        )
      ),
      ruleY([0, 1])
    ];
  } else {
    plotOptions.y = { grid: true, label: null };
    plotOptions.marks = [
      axisFy({ label: null, text: null }),
      areaY(data as Data, {
        x: (d) => new Date(d[xLabel]),
        y: yLabel,
        fy: zDimension,
        fill: zDimension
      }),
      text(
        data as Data,
        selectFirst({ text: zDimension, fy: zDimension, frameAnchor: "top-left", dx: 6, dy: 6 })
      ),
      frame()
    ];
  }
  const div = document.getElementById(nodeId);
  if (div) {
    div.innerHTML = "";
    const areaChart = plot(plotOptions);
    div.append(areaChart);
    return areaChart;
  }
}

function center(nodeId: string, width: number) {
  select(`#${nodeId}`).attr("style", `margin:auto; width: ${width}px`);
}

/** Renders a correlogram for the provided data.
 *
 * @remarks
 *
 * A correlogram can also be called a scatterplot matrix. For all provided numerical properties
 * for the data structure, a scatterplot is produced allowing to explore possible correlations
 * between two properties. All the scatterplots are then distributed on the final plot
 * This is mostly useful as a tool to explore data than for data visualization
 * in the proper sense of the word ; correlations have to be identified by external methods.
 *
 * @param nodeId - The DOM element where the plot will be rendered.
 * @param data - The data structure to be rendered as a plot.
 * @param width - The plot width, in pixels.
 * @param height - The plot height, in pixels.
 * @param domain - The property identifying the categories of the dataset.
 * @param domains - The properties of the dataset.
 */
export function correlogram<Type>(
  nodeId: string,
  data: Type[],
  width: number,
  height: number,
  domain: string,
  domains: string[]
) {
  const padding = 28;
  const size = (width - (domains.length + 1) * padding) / domains.length + padding;
  const svgStyle = "circle.hidden {fill: #000; fill-opacity: 1; r: 1px; } ";

  const xScales = domains.map((domain) =>
    scaleLinear()
      .domain(extent(data, (d) => d[domain]))
      .rangeRound([padding / 2, size - padding / 2])
  );

  const yScales = xScales.map((xScales) => xScales.copy().range([size - padding / 2, padding / 2]));

  const color = scaleOrdinal()
    .domain(data.map((d) => d[domain]))
    .range(schemeCategory10);

  const symbolize = scaleOrdinal(
    data.map((d) => d[domain]),
    symbolsFill.map((s) => symbol().type(s)())
  );

  const legend = addLegend(
    nodeId,
    width,
    color.domain(),
    color as ColorFunction,
    symbolize as SymbolFunction
  );

  const svg = select(`#${nodeId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-padding, 0, width, height]);

  const bottomAxis = axisBottom()
    .ticks(6)
    .tickSize(size * domains.length);

  const xAxis = (g: Selection<SVGGElement, BaseType, any, any>) =>
    g
      .selectAll("g")
      .data(xScales)
      .join("g")
      .attr("transform", (d, index) => `translate(${index * size}, 0)`)
      .each(function (d) {
        const scale = select(this).call(bottomAxis.scale(d));
        return scale;
      })
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").attr("stroke", "#ddd"));

  const leftAxis = axisLeft()
    .ticks(6)
    .tickSize(-size * domains.length);

  const yAxis = (g: Selection<SVGGElement, BaseType, any, any>) =>
    g
      .selectAll("g")
      .data(yScales)
      .join("g")
      .attr("transform", (d, index) => `translate(0, ${index * size})`)
      .each(function (d) {
        return select(this).call(leftAxis.scale(d));
      })
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").attr("stroke", "#ddd"));
  svg.append("style").text(svgStyle);
  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);

  const cell = svg
    .append("g")
    .selectAll("g")
    .data(cross(range(domains.length), range(domains.length)))
    .join("g")
    .attr("transform", ([i, j]) => `translate(${i * size}, ${j * size})`);

  cell
    .append("rect")
    .attr("fill", "none")
    .attr("stroke", "#aaa")
    .attr("x", padding / 2 + 0.5)
    .attr("y", padding / 2 + 0.5)
    .attr("width", size - padding)
    .attr("height", size - padding);

  cell.each(function ([i, j]) {
    select(this)
      .selectAll("path")
      .data(data.filter((d) => !isNaN(d[domains[i]]) && !isNaN(d[domains[j]])))
      .join("path")
      .attr("r", 3.5)
      .attr("fill-opacity", 0.7)
      .attr("fill", (d) => color(d[domain]) as string)
      .attr("d", (d) => symbolize(d[domain] as string))
      .attr(
        "transform",
        (d) => `translate(${xScales[i](d[domains[i]])}, ${yScales[j](d[domains[j]])})`
      );
  });

  svg
    .append("g")
    .style("font", "bold 10px sans-serif")
    .style("pointer-events", "none")
    .selectAll("text")
    .data(domains)
    .join("text")
    .attr("transform", (d, index) => `translate(${index * size}, ${index * size})`)
    .attr("x", padding)
    .attr("y", padding)
    .attr("dy", ".71em")
    .text((d) => d);

  return { legend: legend.node(), svg: svg.node() };
}

function highlightEvent(
  parent: HTMLSelectElement,
  selector: HTMLElement,
  className: string,
  initialSelection: string,
  color: ColorFunction
) {
  const selectedProperty: string = parent.value;
  select(selector)
    .select("svg")
    .select(`.${className}`)
    .selectAll("path")
    .each(function () {
      const line = select(this);
      const title = line.select("title");

      if (title.text() === selectedProperty || selectedProperty === initialSelection) {
        line.attr("stroke", color(title.text()));
      } else if (title.text() !== selectedProperty && selectedProperty !== initialSelection) {
        line.attr("stroke", "lightgrey");
      }
    });
}
/** Renders a select element allowing to hightlight the selected data group.
 *
 * For a given parent SVG path, select all children SVG paths and modify their stroke color
 * in order to highlight them.
 *
 * @param className - The class name of the parent SVG path of all elements to modify.
 * @param domains - The different data groups.
 * @param color - The color function, associating a domain with a color.
 */
export function highlight(
  nodeId: string,
  className: string,
  domains: string[],
  color: ColorFunction
) {
  const highlightElement = document.createElement("select");
  const highlightLabel = document.createElement("label");
  const initialSelection = "none";
  highlightLabel.setAttribute("for", "highlight-category");
  highlightLabel.textContent = "Select a category to highlight: ";
  highlightElement.setAttribute("id", "highlight-category");
  highlightElement.setAttribute("style", selectStyle);

  const component = document.getElementById(nodeId);
  const isInTheShadowDom = checkShadowDom(component);

  const options = domains;
  if (!options.includes(initialSelection)) {
    options.push(initialSelection);
  }

  const optionsElements: HTMLOptionElement[] = options.map((option: string) => {
    const optionNode = document.createElement("option");
    optionNode.setAttribute("value", option);
    optionNode.setAttribute("id", option);
    optionNode.textContent = option;
    if (option === initialSelection) {
      optionNode.selected = true;
    }
    return optionNode;
  });
  optionsElements.forEach((element) => highlightElement.append(element));

  if (isInTheShadowDom) {
    const divInShadowDom = component.shadowRoot.getElementById(`${component.id}-container`);
    highlightElement.addEventListener("change", function () {
      highlightEvent(this, divInShadowDom, className, initialSelection, color);
    });
    const containerForSelect = document.createElement("div");
    containerForSelect.appendChild(highlightLabel);
    containerForSelect.appendChild(highlightElement);

    divInShadowDom.append(containerForSelect);
  } else {
    const divInDom = document.getElementById(nodeId);
    highlightElement.addEventListener("change", function () {
      highlightEvent(this, divInDom, className, initialSelection, color);
    });
    divInDom.append(highlightLabel);
    divInDom.append(highlightElement);
  }
}

/** Renders a bar plot, with each bar aligned horizontally.
 *
 * @param nodeId - The DOM element where the plot will be rendered.
 * @param data - The data structure to be rendered as a plot.
 * @param width - The plot width, in pixels.
 * @param height - The plot height, in pixels.
 * @param xLabel - The data property to be rendered on the x axis.
 * @param yLabel - The data property to be rendered on the y axis.
 * @param lollipop - If true, the rendered bar will be a {@link https://www.data-to-viz.com/graph/lollipop.html | lollipop}
 */
export function horizontalBarPlot<Type>(
  nodeId: string,
  data: Type,
  width: number,
  height: number,
  xLabel: string,
  yLabel: string,
  lollipop: boolean
) {
  let div = document.getElementById(nodeId);
  div.innerHTML = "";

  if (div) {
    const lollipopMarks = [
      ruleX([0]),
      axisX({ tickSpacing: 100 }),
      ruleY(data as Data, {
        x: xLabel,
        y: yLabel,
        stroke: xLabel,
        tip: { format: { y: (d) => `${d.replace("\n", " ")}` }, lineWidth: 100 },
        strokeWidth: 5,
        sort: { y: "x", order: "descending" }
      }),
      dot(data as Data, { x: xLabel, y: yLabel, fill: xLabel, r: 10 })
    ];

    const barMarks = [
      ruleX([0]),
      axisX({ tickSpacing: 100 }),
      barX(data as Data, {
        x: xLabel,
        y: yLabel,
        fill: xLabel,
        tip: { format: { y: (d) => `${d.replace("\n", " ")}` }, lineWidth: 100 },
        sort: { y: "x", order: "descending" }
      })
    ];
    const barPlot = plot({
      width: width,
      height: height,
      y: { grid: true },
      marks: lollipop ? lollipopMarks : barMarks
    });
    div.append(barPlot);
  }
}

/** Renders a line or multi-line chart.
 *
 * @param nodeId - The DOM element where the plot will be rendered.
 * @param data - The data structure to be rendered on the chart.
 * @param width - The plot width, in pixels.
 * @param height - The plot height, in pixels.
 * @param xLabel - The data property to be rendered on the x axis.
 * @param yLabel - The data property to be rendered on the y axis.
 * @param zDimension - The third data property allowing the grouping of data and rendering multiple lines.
 *
 */
export function lineChart<Type>(
  nodeId: string,
  data: Type,
  width: number,
  height: number,
  xLabel: string,
  yLabel: string,
  zDimension?: string
) {
  let div = document.getElementById(nodeId);
  div.innerHTML = "";

  const lineMarks = [
    gridY({ strokeDasharray: "0.75,2", strokeOpacity: 1 }),
    axisY({
      tickSize: 0,
      dx: 38,
      dy: -6,
      labelOffset: -36,
      lineAnchor: "bottom"
    }),
    ruleY([0]),
    line(data as Data, {
      x: xLabel,
      y: yLabel,
      z: zDimension,
      markerEnd: "dot",
      stroke: zDimension
    })
  ];

  const multiLineMarks = lineMarks.concat([
    text(
      data as Data,
      selectLast({
        x: xLabel,
        y: yLabel,
        z: zDimension,
        text: zDimension,
        textAnchor: "start",
        dx: 3
      })
    )
  ]);

  if (div) {
    const lineChart = plot({
      height: height,
      marginLeft: 0,
      round: true,
      style: "overflow:visible",
      width: width,
      x: { label: null, insetLeft: 36, type: "time", ticks: "year" },
      marks: zDimension ? multiLineMarks : lineMarks
    });

    div.append(lineChart);
    return lineChart;
  }
}

/** Renders a parallel coordinates plot.
 *
 * A parallel coordinates plot distribute all elements of a dataset, drawing
 * a scale for each property and putting the value for an element as a point on
 * that scale. This allows to have an immediate visual distribution of all absolute
 * values for each property of an element.
 * All elements of the dataset are grouped by a given category (a "domain"), allowing to create
 * sub-groups of data and to highlight each of them when needed. For example, a whole dataset
 * of animals can be grouped between "cats", "dogs", and "birds", which represent the "domains" of
 * the dataset. And each individual item of the whole dataset has a set of properties, common to
 * all items, which represent their "dimensions".
 *
 * @param nodeId - The DOM element where the plot will be rendered.
 * @param data - The data structure to be rendered on the plot.
 * @param width - The plot width, in pixels.
 * @param height - The plot height, in pixels.
 * @param dimensions - The properties of each element in the dataset.
 * @param domains - The categories of the dataset.
 * @param domain - The property identifying the categories of the dataset.
 *
 */
export function parallelCoordinates<Type>(
  nodeId: string,
  data: Type[],
  width: number,
  height: number,
  dimensions: string[],
  domain: string,
  domains: string[],
  minMaxScale?: boolean
) {
  let div = document.getElementById(nodeId);
  div.innerHTML = "";
  center(nodeId, width);

  const color = scaleOrdinal().domain(domains).range(schemeTableau10);

  const points = dimensions.flatMap((dimension) =>
    data.map((object, index) => {
      const result = { index, dimension, value: object[dimension] };
      return result;
    })
  );

  const scales = new Map(
    dimensions.map((dimension) => [
      dimension,
      scaleLinear().domain(extent(data, (d) => d[dimension]))
    ])
  );

  const ticks = dimensions.flatMap((dimension) => {
    return scales
      .get(dimension)
      .ticks(dimensions.length)
      .map((value) => ({ dimension, value }));
  });

  const lineClassName = "line";

  const marks: Markish[] = [
    ruleX(dimensions),
    lineY(points as Data, {
      className: lineClassName,
      y: ({ dimension, value }) => scales.get(dimension)(value),
      x: "dimension",
      z: "index",
      stroke: ({ index }) => color(data[index][domain]),
      strokeWidth: 2,
      strokeOpacity: 1,
      title: ({ index }) => data[index][domain]
    })
  ];
  const textForScales = text(ticks, {
    y: ({ dimension, value }) => scales.get(dimension)(value),
    x: "dimension",
    fontSize: 14,
    text: "value",
    fill: "black",
    stroke: "white",
    strokeWidth: 5
  });
  const normalizedScale = axisY({ anchor: "left", interval: 0.1 });

  if (!minMaxScale) {
    marks.push(textForScales);
  } else {
    marks.push(normalizedScale);
  }

  const parallelCoordinates = plot({
    width: width,
    height: height,
    style: "overflow:visible",
    y: { axis: null, grid: true },
    x: { label: null, domain: dimensions },
    marks: marks
  });

  div.append(parallelCoordinates);
  highlight(nodeId, lineClassName, domains, color as ColorFunction);
  return parallelCoordinates;
}

/** Renders a sankey diagram for the provided data.
 *
 * @remarks
 *
 * A sankey diagram is a useful representation for showing an evolution, or relationships
 * between different elements and their proportions. The data to be rendered on such a
 * diagram need to include `nodes` (the individual elements) and `links` (the relationship
 * between two elements, and the numerical value associated with it).
 *
 * @param nodeId - The DOM element where the diagram will be rendered.
 * @param data - The data structure to be rendered on the diagram.
 * @param width - The diagram width, in pixels.
 * @param height - The diagram height, in pixels
 * @param unit - If provided, the unit used for each link value.
 */
export function sankeyDiagram(
  nodeId: string,
  data: SankeyData,
  width: number,
  height: number,
  unit: string = ""
) {
  const formatting = format(",.0f");
  const style = "max-width: 100%, height: auto; font: 10px sans-serif;";
  const source = `#${nodeId}`;

  const svg = select(source)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", style);

  const skey = sankey()
    .nodeId((d: SNode) => d.name)
    .nodeAlign(sankeyJustify)
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [1, 5],
      [width - 1, height - 5]
    ]);

  // Assign new objects to avoid side effects on original state
  const { nodes, links } = skey({
    nodes: data.nodes.map((d: SNode) => {
      return { ...d };
    }),
    links: data.links.map((d: SLink) => {
      return { ...d };
    })
  });

  const color = scaleOrdinal(schemeCategory10);
  const rect = svg
    .append("g")
    .attr("stroke", "#000")
    .selectAll()
    .data(nodes)
    .join("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", (d) => color(d["category"]));

  rect.append("title").text((d: SNode) => `${d.name}\n${formatting(d.value)} ${unit}`);

  const link = svg
    .append("g")
    .attr("class", "g-link")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll()
    .data(links)
    .join("g")
    .attr("id", (d) => `g-${d.index}`)
    .style("mix-blend-mode", "multiply");

  link.each((l: SNode, index) => {
    const linkId = `g-${index}`;
    const gradientId = `gradient-${index}`;
    const referenceForStrokeColor = `url(#${gradientId})`;

    const selectedLink = select(`#${linkId}`);

    const gradient = selectedLink
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", l.source.x1)
      .attr("x2", l.target.x0);
    gradient.append("stop").attr("offset", "0%").attr("stop-color", color(l.source.category));
    gradient.append("stop").attr("offset", "100%").attr("stop-color", color(l.target.category));

    selectedLink
      .append("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", referenceForStrokeColor)
      .attr("stroke-width", Math.max(1, l.width));
    selectedLink
      .append("title")
      .text(`${l.source.name} -> ${l.target.name}\n${formatting(l.value)} ${unit}`);
  });

  svg
    .append("g")
    .selectAll()
    .data(nodes)
    .join("text")
    .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
    .text((d: SNode) => d.name);

  return svg.node();
}

/** Renders a scatterplot for the provided data.
 *
 * @remarks
 *
 * A scatterplot distribute each element in the provided data structure on a graph,
 * their position being determined by their value for the indicated properties. The
 * correlation for both properties is not determined by this method ; one has to
 * determinate if it makes sense to show the relationship between these two properties.
 * For each element, its associated metadata and other values are available by hovering
 * on its position on the graph.
 *
 * @param nodeId - The DOM element where the diagram will be rendered.
 * @param data - The data structure to be rendered on the diagram.
 * @param width - The diagram width, in pixels.
 * @param height - The diagram height, in pixels
 * @param xLabel - The data property to be rendered on the x axis.
 * @param yLabel - The data property to be rendered on the y axis.
 * @param domain - The property identifying the element's category.
 * @param domains - The data properties meant to be visible when hovering on the element.
 *
 */
export function scatterPlot<Type>(
  nodeId: string,
  data: Type[],
  width: number,
  height: number,
  xLabel: string,
  yLabel: string,
  domain: string,
  domains: string[]
) {
  let div = document.getElementById(nodeId);
  div.innerHTML = "";
  center(nodeId, width);

  const channels = domains.reduce((domain, key) => ({ ...domain, [key]: `${key}` }), {});
  const scatterplot = plot({
    grid: true,
    width,
    height,
    x: { label: xLabel },
    y: { label: yLabel },
    symbol: { legend: true },
    marks: [
      dot(data as Data, {
        x: xLabel,
        y: yLabel,
        stroke: domain,
        channels,
        symbol: domain,
        tip: true
      })
    ]
  });

  div.append(scatterplot);
  return scatterplot;
}

/** Renders a bar plot, with each bar with stacked values.
 *
 * @remarks
 *
 * This bar plot allow showing parts of a whole in each rectangular bar.
 * Renders a bat plot with stacked values, with keys provided as arguments (`yLabel` and `xLabel`).
 * Observable can count and stack values, allowing to get part of a whole represented as a share of the
 * rendered stacked bar. `fillLabel` is not to be provided in that case.
 * In other cases, one might want to fill each bar with stacked values computed from another data field,
 * to fill each share of the rendered bar with. `fillLabel` indicates that field.
 *
 * @param nodeId - The DOM element where the plot will be rendered.
 * @param data - The data structure to be rendered as a plot.
 * @param width - The plot width, in pixels.
 * @param height - The plot height, in pixels.
 * @param domains - The different categories representing parts of a whole.
 * @param xLabel - The data property to be rendered on the x axis.
 * @param yLabel - The data property to be rendered on the y axis.
 * @param fillLabel - The third data property, representing part of a whole.
 *
 */
export function stackedBarPlot<Type>(
  nodeId: string,
  data: Type[],
  width: number,
  height: number,
  domains: (string | number)[],
  xLabel: string,
  yLabel: string,
  fillLabel?: string
) {
  let div = document.getElementById(nodeId);
  div.innerHTML = "";
  center(nodeId, width);

  const countOptions = [
    axisY({ fontSize: 12, label: null, marginLeft: 60 }),
    axisX({ marginBottom: 48 }),
    barX(
      data as Data,
      groupY(
        { x: "count" },
        {
          fill: xLabel,
          y: yLabel,
          sort: { y: "x", reverse: true, color: "width" },
          tip: true,
          offset: "normalize"
        }
      )
    )
  ];

  const fillOptions = [
    axisY({ fontSize: 12, label: null, marginLeft: 60 }),
    axisX({ marginBottom: 48 }),
    barX(
      data as Data,
      groupY(
        { x: "count" },
        {
          fill: fillLabel,
          y: yLabel,
          sort: { y: "x", reverse: true, color: "width" },
          tip: true,
          offset: "normalize"
        }
      )
    )
  ];
  const barPlot = plot({
    width: width,
    height: height,
    style: "overflow:visible",
    className: "plot",
    color: { legend: true, domain: domains },
    x: { percent: true },
    marks: fillLabel ? fillOptions : countOptions
  });

  div.append(barPlot);

  if (fillLabel) {
    const selectId = addSelect(nodeId, data, xLabel, yLabel, width, fillLabel);
    let selectElement: HTMLSelectElement;
    const container = document.getElementById(nodeId);
    const isInTheShadowDom = checkShadowDom(container);

    if (isInTheShadowDom) {
      selectElement = container.shadowRoot.getElementById(selectId) as HTMLSelectElement;
    } else {
      selectElement = document.getElementById(selectId) as HTMLSelectElement;
    }
    selectElement.addEventListener("change", function () {
      const selectedProperty = this.value;
      const fieldDomains = [...new Set(data.map((element: Type) => element[selectedProperty]))];
      const containerId = `${nodeId}-container`;
      const propertyId = `${nodeId}-${selectedProperty}`;
      selectElement.value = selectedProperty;
      if (isInTheShadowDom) {
        const option = container.shadowRoot.getElementById(propertyId);
        container.shadowRoot.getElementById(containerId).innerHTML = "";
        const sbp = stackedBarPlot(
          nodeId,
          data,
          width,
          height,
          fieldDomains,
          xLabel,
          yLabel,
          selectedProperty
        );

        container.shadowRoot.getElementById(containerId).appendChild(sbp);
        (option as HTMLOptionElement).selected = true;
      } else {
        const option = document.getElementById(propertyId);
        (option as HTMLOptionElement).selected = true;
        stackedBarPlot(nodeId, data, width, height, fieldDomains, xLabel, yLabel, selectedProperty);
      }
    });
  }
  return barPlot;
}
