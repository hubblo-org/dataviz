import type { Data, PlotOptions } from "@observablehq/plot";
import { extent, scaleLinear, scaleOrdinal, schemeTableau10, select } from "d3";
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

const selectStyle =
  "background: 0 0; position: relative; border: 1px solid hsla(240, 6%, 87%, 1); border-radius: 4px; padding: 0.425em 1em 0.45em; min-height: 1.5rem; font: inherit;";

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
 * @param dimensions - The different data properties to be normalized.
 * @param data - The source dataset.
 */
export function minMaxScaling<Type>(dimensions: [keyof Type], data: Type[]): Type[] {
  const scaledData = data.map((element) => {
    let scaledDatum = { ...element };
    dimensions.forEach((dimension) => {
      if (typeof element[dimension] === "number") {
        const values: number[] = data.map((element) => element[dimension] as number);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const result = (element[dimension] - min) / (max - min);
        const rounded = parseFloat((Math.round(result * 100) / 100).toFixed(2));
        (scaledDatum[dimension] as number) = rounded;
      }
    });
    return scaledDatum;
  });
  return scaledData;
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
  const selectContainerId = `${nodeId}-select-container`;
  const selectId = `${nodeId}-select`;
  const divForSelect = document.querySelector(`#${selectContainerId}`);

  if (!divForSelect) {
    const parent = document.getElementById(nodeId).parentElement.nodeName;
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
      select(`#${selectId}`).append("option").attr("value", option).attr("id", option).text(option)
    );

    const selection = document.getElementById(`${initialOption}`);
    (selection as HTMLOptionElement).selected = true;
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
  const div = document.querySelector(`#${nodeId}`);
  div.innerHTML = "";
  if (div) {
    const areaChart = plot(plotOptions);
    div.append(areaChart);
  }
}

function center(nodeId: string, width: number) {
  select(`#${nodeId}`).attr("style", `margin:auto; width: ${width}px`);
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
  className: string,
  domains: string[],
  color: ColorFunction
): {
  label: HTMLLabelElement;
  select: HTMLSelectElement;
} {
  const highlightElement = document.createElement("select");
  const highlightLabel = document.createElement("label");
  const initialSelection = "none";
  highlightLabel.setAttribute("for", "highlight-category");
  highlightLabel.textContent = "Select a category to highlight: ";
  highlightElement.setAttribute("id", "highlight-category");
  highlightElement.setAttribute("style", selectStyle);

  highlightElement.addEventListener("change", function () {
    const selectedProperty: string = this.value;
    select(`.${className}`)
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
  });

  const options = domains;
  options.push(initialSelection);
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

  return { label: highlightLabel, select: highlightElement };
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
  let div = document.querySelector(nodeId);
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
  let div = document.querySelector(nodeId);
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
  domains: string[]
) {
  let div = document.querySelector(`#${nodeId}`);
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

  const parallelCoordinates = plot({
    width: width,
    height: height,
    style: "overflow:visible",
    y: { axis: null },
    x: { label: null, domain: dimensions },
    marks: [
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
      }),
      text(ticks, {
        y: ({ dimension, value }) => scales.get(dimension)(value),
        x: "dimension",
        text: "value",
        fill: "black",
        stroke: "white",
        strokeWidth: 3
      })
    ]
  });

  const highlightElements = highlight(lineClassName, domains, color as ColorFunction);
  div.append(parallelCoordinates);
  div.append(highlightElements.label);
  div.append(highlightElements.select);
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
  let div = document.querySelector(`#${nodeId}`);
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

    const selectElement: HTMLSelectElement = document.querySelector(`#${selectId}`);
    selectElement.addEventListener("change", function () {
      const selectedProperty = this.value;
      selectElement.value = selectedProperty;
      const option = document.getElementById(selectedProperty);
      (option as HTMLOptionElement).selected = true;

      const fieldDomains = [...new Set(data.map((element: Type) => element[selectedProperty]))];
      stackedBarPlot(nodeId, data, width, height, fieldDomains, xLabel, yLabel, selectedProperty);
    });
  }
}
