import { areaChart, correlogram, lineChart, stackedBarPlot } from "./plots";
import { parseToBoolean, sanitizeNumber } from "./utils";

const defaultWidth = "800";
const defaultHeight = "600";
const stackedBarPlotName = "stacked-bar-plot";
const areaChartName = "area-chart";
const correlogramName = "correlogram-plot";
const lineChartName = "line-chart";

function setupComponent(component: HTMLElement, componentName: string, width: number) {
  const shadow = component.attachShadow({ mode: "closed" });
  const idNumber = document.querySelectorAll(componentName).length + 1;
  component.id = `${componentName}-${idNumber}`;
  const containerId = `${component.id}-container`;
  const container = document.createElement("div");
  container.setAttribute("id", containerId);
  const style = document.createElement("style");
  style.innerHTML = `#${containerId} {margin: auto; width: ${width}px; }`;
  shadow.append(style);
  shadow.append(container);
  return { shadow: shadow, containerId: containerId };
}

function addNormalize() {
  const div = document.createElement("div");
  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", "toggle-normalize");
  checkbox.id = "toggle-normalize";
  const label = document.createElement("label");
  label.setAttribute("for", checkbox.id);
  div.append(label);
  div.append(checkbox);

  return div;
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

export class AreaChart extends HTMLElement {
  content: string;
  width: string = defaultWidth;
  height: string = defaultHeight;
  x: string;
  y: string;
  z: string;
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
    this.width;
    this.height;
    this.x;
    this.y;
    this.z;
    this.normalizing;
  }
  connectedCallback() {
    const castWidth = sanitizeNumber(this.width);
    const castHeight = sanitizeNumber(this.height);
    const toNormalize = parseToBoolean(this.normalizing);
    const parsedContent = JSON.parse(this.content);
    const xLabel = this.x;
    const yLabel = this.y;
    const zDimension = this.z;

    const setup = setupComponent(this, areaChartName, castWidth);
    const container = setup.shadow.getElementById(setup.containerId);

    const ac = areaChart(
      this.id,
      parsedContent,
      castWidth,
      castHeight,
      xLabel,
      yLabel,
      zDimension,
      toNormalize
    );
    container.append(ac);
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
    const style = document.createElement("style");
    style.innerHTML = `#${setup.containerId} {margin: auto; width: ${width}px; }`;

    const c = correlogram(this.id, dataToRender, width, height, this.domain, domains);
    const container = setup.shadow.getElementById(setup.containerId);
    container.append(c);
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
customElements.define(stackedBarPlotName, StackedBarPlot);
