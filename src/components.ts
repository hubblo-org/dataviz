import {
  areaChart,
  correlogram,
  lineChart,
  parallelCoordinates,
  sankeyDiagram,
  scatterPlot,
  stackedBarPlot
} from "./plots";
import { treemap } from "./treemap";
import { formatForTreemap, normalizeValues, parseToBoolean, sanitizeNumber } from "./utils";

const defaultWidth = "800";
const defaultHeight = "600";
const areaChartName = "area-chart";
const correlogramName = "correlogram-plot";
const lineChartName = "line-chart";
const parallelCoordinatesName = "parallel-coordinates";
const sankeyName = "sankey-diagram";
const scatterplotName = "scatter-plot";
const stackedBarPlotName = "stacked-bar-plot";
const treemapName = "treemap-plot";

function setupComponent(
  component: HTMLElement,
  mode: ShadowRootMode,
  componentName: string,
  width: number,
  style?: string
) {
  const shadow = component.attachShadow({ mode: mode });
  const idNumber = document.querySelectorAll(componentName).length + 1;
  component.id = `${componentName}-${idNumber}`;
  component.style = `margin: auto; display: flex; flex-direction:column`;
  const containerId = `${component.id}-container`;
  const container = document.createElement("div");
  container.setAttribute("id", containerId);
  const styleElement = document.createElement("style");
  if (style) {
    styleElement.innerHTML = `#${containerId} ${style}`;
  } else {
    styleElement.innerHTML = `#${containerId} {margin: auto; width: ${width}px; display: flex; flex-direction: column; }`;
  }
  shadow.append(styleElement);
  shadow.append(container);
  return { shadow: shadow, containerId: containerId };
}

function addNormalize(id: string, width: number) {
  const div = document.createElement("div");
  div.setAttribute("id", `${id}-normalize-button-container`);
  div.style = `width: ${width}px; margin:auto;`;

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", `${id}-normalize-checkbox`);

  const label = document.createElement("label");
  label.setAttribute("for", `${id}-normalize-checkbox`);
  label.textContent = "Normalize values";

  div.append(label);
  div.append(checkbox);

  return div;
}

export class AreaChart extends HTMLElement {
  content: string;
  width: string = defaultWidth;
  height: string = defaultHeight;
  x: string;
  y: string;
  z: string;
  role: string;
  title: string;
  normalized: string = "false";
  castWidth: number;
  castHeight: number;
  normalizing?: string;

  static get observedAttributes() {
    return ["content", "width", "height", "x", "y", "z", "title", "normalized", "normalizing"];
  }

  attributeChangedCallback(property: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    this[property] = newValue;
  }

  constructor() {
    super();
    this.content;
    this.role;
    this.width;
    this.height;
    this.x;
    this.y;
    this.z;
    this.normalized;
    this.normalizing;
  }

  connectedCallback() {
    this.role = "figure";
    const title = this.title;
    const castWidth = sanitizeNumber(this.width);
    const castHeight = sanitizeNumber(this.height);
    let normalized = parseToBoolean(this.normalized);
    const parsedContent = JSON.parse(this.content);
    const xLabel = this.x;
    const yLabel = this.y;
    const zDimension = this.z;

    const setup = setupComponent(this, "closed", areaChartName, castWidth);
    const container = setup.shadow.getElementById(setup.containerId);

    const areaChartId = this.id;

    const ac = areaChart(
      areaChartId,
      parsedContent,
      castWidth,
      castHeight,
      xLabel,
      yLabel,
      zDimension,
      normalized
    );

    this.addFigureCaption(normalized, title, container as HTMLDivElement, ac);

    if (this.normalizing) {
      const normalizeDiv = addNormalize(areaChartId, castWidth);
      setup.shadow.append(normalizeDiv);

      const normalizeCheckbox = setup.shadow.getElementById(`${areaChartId}-normalize-checkbox`);
      normalizeCheckbox.checked = normalized;
      const that = this;
      (normalizeCheckbox as HTMLInputElement).addEventListener("click", function () {
        if (normalizeCheckbox.checked) {
          normalized = true;
          const acUpdated = areaChart(
            areaChartId,
            parsedContent,
            castWidth,
            castHeight,
            xLabel,
            yLabel,
            zDimension,
            true
          );
          container.innerHTML = "";
          container.append(acUpdated);
          that.addFigureCaption(normalized, title, container as HTMLDivElement, acUpdated);
        } else if (!normalizeCheckbox.checked) {
          normalized = false;
          const acUpdated = areaChart(
            areaChartId,
            parsedContent,
            castWidth,
            castHeight,
            xLabel,
            yLabel,
            zDimension,
            false
          );
          container.innerHTML = "";
          that.addFigureCaption(normalized, title, container as HTMLDivElement, acUpdated);
        }
      });
    }
  }
  addFigureCaption(toNormalize: boolean, title: string, container: HTMLDivElement, plot: any) {
    const figCaption = document.createElement("figcaption");
    if (toNormalize) {
      container.appendChild(plot);
      const figure = container.querySelector("figure");
      figCaption.textContent = `${title}, normalized`;
      figure.appendChild(figCaption);
    } else if (!toNormalize) {
      const figure = document.createElement("figure");
      figCaption.textContent = `${title}`;
      figure.appendChild(plot);
      figure.appendChild(figCaption);
      container.appendChild(figure);
    }
    return figCaption;
  }
}

export class Correlogram extends HTMLElement {
  content: string;
  domain: string;
  domains: string;
  height: string = "800";
  width: string = defaultWidth;

  static get observedAttributes() {
    return ["content", "domains", "width", "height", "domain"];
  }
  constructor() {
    super();
    this.content;
    this.domain;
    this.domains;
    this.height;
    this.width;
  }
  attributeChangedCallback(property: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    this[property] = newValue;
  }
  connectedCallback() {
    const width = sanitizeNumber(this.width);
    const height = sanitizeNumber(this.height);
    const setup = setupComponent(this, "closed", correlogramName, width);
    const domains = this.domains.split(",");
    const dataToRender = JSON.parse(this.content);

    const c = correlogram(this.id, dataToRender, width, height, this.domain, domains);
    const container = setup.shadow.getElementById(setup.containerId);
    container.append(c.legend);
    container.append(c.svg);
  }
}

export class LineChart extends HTMLElement {
  content: string;
  width: string = defaultWidth;
  height: string = defaultHeight;
  x: string;
  y: string;
  z?: string;

  static get observedAttributes() {
    return ["content", "width", "height", "x", "y", "z"];
  }
  attributeChangedCallback(property: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    this[property] = newValue;
  }
  constructor() {
    super();
    this.content;
    this.width;
    this.height;
    this.x;
    this.y;
    this.z;
  }
  connectedCallback() {
    const width = sanitizeNumber(this.width);
    const height = sanitizeNumber(this.height);
    const dataToRender = JSON.parse(this.content);
    const setup = setupComponent(this, "closed", correlogramName, width);
    const container = setup.shadow.getElementById(setup.containerId);
    if (this.z) {
      const lc = lineChart(this.id, dataToRender, width, height, this.x, this.y, this.z);
      container.append(lc);
    } else {
      const lc = lineChart(this.id, dataToRender, width, height, this.x, this.y);
      container.append(lc);
    }
  }
}

export class ParallelCoordinates extends HTMLElement {
  content: string;
  width: string = defaultWidth;
  height: string = defaultHeight;
  dimensions: string;
  domain: string;
  domains: string;

  static get observedAttributes() {
    return ["content", "width", "height", "dimensions", "domain", "domains"];
  }
  attributeChangedCallback(property: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    this[property] = newValue;
  }
  constructor() {
    super();
    this.content;
    this.width;
    this.height;
    this.dimensions;
    this.domain;
    this.domains;
  }
  connectedCallback() {
    const width = sanitizeNumber(this.width);
    const height = sanitizeNumber(this.height);
    const dataToRender = JSON.parse(this.content);
    const dimensions = this.dimensions.split(",");
    const domains = this.domains.split(",");
    const customStyle = `{margin: auto; width: ${width}px; display: flex; flex-direction: column-reverse; }`;
    const setup = setupComponent(this, "open", parallelCoordinatesName, width, customStyle);
    const container = setup.shadow.getElementById(setup.containerId);

    const pc = parallelCoordinates(
      this.id,
      dataToRender,
      width,
      height,
      dimensions,
      this.domain,
      domains
    );
    container.append(pc);
  }
}

export class Sankey extends HTMLElement {
  content: string;
  width: string = defaultWidth;
  height: string = defaultHeight;
  unit: string;

  static get observedAttributes() {
    return ["content", "width", "height", "unit"];
  }
  attributeChangedCallback(property: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    this[property] = newValue;
  }
  constructor() {
    super();
    this.content;
    this.width;
    this.height;
    this.unit;
  }
  connectedCallback() {
    const width = sanitizeNumber(this.width);
    const height = sanitizeNumber(this.height);

    const setup = setupComponent(this, "closed", sankeyName, width);
    const container = setup.shadow.getElementById(setup.containerId);

    const dataToRender = JSON.parse(this.content);
    const skd = sankeyDiagram(this.id, dataToRender, width, height, this.unit);
    container.append(skd);
  }
}

export class Scatterplot extends HTMLElement {
  content: string;
  width: string = defaultWidth;
  height: string = defaultHeight;
  x: string;
  y: string;
  domain: string;
  domains: string;

  static get observedAttributes() {
    return ["content", "width", "height", "x", "y", "domain", "domains"];
  }
  constructor() {
    super();
    this.content;
    this.width;
    this.height;
    this.x;
    this.y;
    this.domain;
    this.domains;
  }
  attributeChangedCallback(property: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    this[property] = newValue;
  }
  connectedCallback() {
    const width = sanitizeNumber(this.width);
    const height = sanitizeNumber(this.height);
    const dataToRender = JSON.parse(this.content);
    const domains = this.domains.split(",");
    const setup = setupComponent(this, "closed", scatterplotName, width);
    const container = setup.shadow.getElementById(setup.containerId);
    const sp = scatterPlot(
      this.id,
      dataToRender,
      width,
      height,
      this.x,
      this.y,
      this.domain,
      domains
    );
    container.append(sp);
  }
}

export class StackedBarPlot extends HTMLElement {
  content: string;
  domains: string;
  width: string = defaultWidth;
  height: string = defaultHeight;
  x: string;
  y: string;
  fill?: string;

  static get observedAttributes() {
    return ["content", "domains", "width", "height", "x", "y", "fill"];
  }
  constructor() {
    super();
    this.content;
    this.domains;
    this.width;
    this.height;
    this.x;
    this.y;
    this.fill;
  }
  attributeChangedCallback(property: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    this[property] = newValue;
  }
  connectedCallback() {
    const width = sanitizeNumber(this.width);
    const height = sanitizeNumber(this.height);
    const domains = this.domains.split(",");
    const dataToRender = JSON.parse(this.content);
    const customStyle = `{margin: auto; width: ${width}px; display: flex; flex-direction: column-reverse; }`;

    const setup = setupComponent(this, "open", stackedBarPlotName, width, customStyle);

    if (this.fill) {
      const normalizedData = normalizeValues(dataToRender);
      const domains = [...new Set(normalizedData.map((element) => element[this.fill]))];
      const sbp = stackedBarPlot(
        this.id,
        normalizedData,
        width,
        height,
        domains,
        this.x,
        this.y,
        this.fill
      );
      const container = setup.shadow.getElementById(setup.containerId);
      container.appendChild(sbp);
    } else {
      const sbp = stackedBarPlot(this.id, dataToRender, width, height, domains, this.x, this.y);
      const container = setup.shadow.getElementById(setup.containerId);
      container.appendChild(sbp);
    }
  }
}

export class Treemap extends HTMLElement {
  name: string;
  content: string;
  width: string = defaultWidth;
  height: string = defaultHeight;

  static get observedAttributes() {
    return ["content", "width", "height"];
  }
  constructor() {
    super();
    this.name;
    this.content;
    this.width;
    this.height;
  }
  attributeChangedCallback(property: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    this[property] = newValue;
  }
  connectedCallback() {
    const castWidth = sanitizeNumber(this.width);
    const castHeight = sanitizeNumber(this.height);
    const dataToRender = JSON.parse(this.content);
    const numericCategories = Object.keys(dataToRender[0]).filter(
      (d) => typeof dataToRender[0][d] === "number"
    );
    const formattedData = formatForTreemap(this.name, numericCategories, dataToRender);

    const style = `{margin: auto; width: ${castWidth}px; display: flex; flex-direction: column; } .swatch::before {content: ""; display: inline-block; width: 15px; height: 15px; margin-right: 5px; background: var(--color); }`;
    const setup = setupComponent(this, "open", treemapName, castWidth, style);
    const container = setup.shadow.getElementById(setup.containerId);
    const treemapContainer = document.createElement("div");
    treemapContainer.setAttribute("id", `${this.id}-treemap`);
    const treemapLegendContainer = document.createElement("div");
    treemapLegendContainer.setAttribute("id", `${this.id}-treemap-legend`);
    container.appendChild(treemapContainer);
    container.appendChild(treemapLegendContainer);

    const tmap = treemap(this.id, formattedData, castWidth, castHeight);
    container.append(tmap);
  }
}

customElements.define(areaChartName, AreaChart);
customElements.define(correlogramName, Correlogram);
customElements.define(lineChartName, LineChart);
customElements.define(parallelCoordinatesName, ParallelCoordinates);
customElements.define(sankeyName, Sankey);
customElements.define(scatterplotName, Scatterplot);
customElements.define(stackedBarPlotName, StackedBarPlot);
customElements.define(treemapName, Treemap);
