import {
  areaChart,
  correlogram,
  lineChart,
  parallelCoordinates,
  sankeyDiagram,
  scatterPlot,
  stackedBarPlot
} from "./plots";
import { parseToBoolean, sanitizeNumber } from "./utils";

const defaultWidth = "800";
const defaultHeight = "600";
const areaChartName = "area-chart";
const correlogramName = "correlogram-plot";
const lineChartName = "line-chart";
const parallelCoordinatesName = "parallel-coordinates";
const sankeyName = "sankey-diagram";
const scatterplotName = "scatter-plot";
const stackedBarPlotName = "stacked-bar-plot";

function setupComponent(component: HTMLElement, componentName: string, width: number) {
  const shadow = component.attachShadow({ mode: "closed" });
  const idNumber = document.querySelectorAll(componentName).length + 1;
  component.id = `${componentName}-${idNumber}`;
  component.style = `margin: auto; display: flex; flex-direction:column`;
  const containerId = `${component.id}-container`;
  const container = document.createElement("div");
  container.setAttribute("id", containerId);
  const style = document.createElement("style");
  style.innerHTML = `#${containerId} {margin: auto; width: ${width}px; display: flex; flex-direction: column; }`;
  shadow.append(style);
  shadow.append(container);
  return { shadow: shadow, containerId: containerId };
}

function addNormalize(id: string) {
  const div = document.createElement("div");
  div.setAttribute("id", `${id}-normalize-button-container`);

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", `${id}-normalize-checkbox`);
  checkbox.checked = true;

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
  normalizing: string;
  castWidth: number;
  castHeight: number;
  parsedContent: any;

  static get observedAttributes() {
    return ["content", "width", "height", "x", "y", "z", "normalizing"];
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
    this.normalizing;
  }
  connectedCallback() {
    this.role = "figure";
    const castWidth = sanitizeNumber(this.width);
    const castHeight = sanitizeNumber(this.height);
    const toNormalize = parseToBoolean(this.normalizing);
    const parsedContent = JSON.parse(this.content);
    const xLabel = this.x;
    const yLabel = this.y;
    const zDimension = this.z;

    const setup = setupComponent(this, areaChartName, castWidth);
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
      toNormalize
    );
    container.append(ac);

    if (toNormalize) {
      const normalizeDiv = addNormalize(areaChartId);
      setup.shadow.append(normalizeDiv);

      const normalizeCheckbox = setup.shadow.getElementById(`${areaChartId}-normalize-checkbox`);
      (normalizeCheckbox as HTMLInputElement).addEventListener("click", function () {
        if (normalizeCheckbox.checked) {
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
        } else if (!normalizeCheckbox.checked) {
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
          container.append(acUpdated);
        }
      });
    }
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
    const setup = setupComponent(this, correlogramName, width);
    const domains = this.domains.split(",");
    const dataToRender = JSON.parse(this.content);

    const c = correlogram(this.id, dataToRender, width, height, this.domain, domains);
    const container = setup.shadow.getElementById(setup.containerId);
    container.append(c);
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
    const setup = setupComponent(this, correlogramName, width);
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
    const setup = setupComponent(this, parallelCoordinatesName, width);
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

    const setup = setupComponent(this, sankeyName, width);
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
    const setup = setupComponent(this, scatterplotName, width);
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

    const setup = setupComponent(this, stackedBarPlotName, width);

    const sbp = stackedBarPlot(this.id, dataToRender, width, height, domains, this.x, this.y);
    const container = setup.shadow.getElementById(setup.containerId);
    container.appendChild(sbp);
  }
}

customElements.define(areaChartName, AreaChart);
customElements.define(correlogramName, Correlogram);
customElements.define(lineChartName, LineChart);
customElements.define(parallelCoordinatesName, ParallelCoordinates);
customElements.define(sankeyName, Sankey);
customElements.define(scatterplotName, Scatterplot);
customElements.define(stackedBarPlotName, StackedBarPlot);
