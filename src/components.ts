import { areaChart, stackedBarPlot } from "./plots";
import { parseToBoolean, sanitizeNumber } from "./utils";

const defaultWidth = "800";
const defaultHeight = "600";
const stackedBarPlotName = "stacked-bar-plot";
const areaChartName = "area-chart";

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
    const shadow = this.attachShadow({ mode: "closed" });

    const idNumber = document.querySelectorAll(stackedBarPlotName).length + 1;
    this.id = `${stackedBarPlotName}-${idNumber}`;
    const containerId = `${this.id}-container`;

    const div = document.createElement("div");
    div.setAttribute("id", containerId);

    const width = sanitizeNumber(this.width);
    const height = sanitizeNumber(this.height);
    const domains = this.domains.split(",");
    const dataToRender = JSON.parse(this.content);

    const style = document.createElement("style");
    style.innerHTML = `#${containerId} {margin: auto; width: ${width}px; }`;

    const sbp = stackedBarPlot(this.id, dataToRender, width, height, domains, this.x, this.y);
    shadow.append(div);
    shadow.append(style);
    div.append(sbp);
  }
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
    const shadow = this.attachShadow({ mode: "closed" });

    const idNumber = document.querySelectorAll(areaChartName).length + 1;
    const div = document.createElement("div");
    this.id = `${areaChartName}-${idNumber}`;
    const containerId = `${this.id}-container`;
    div.setAttribute("id", containerId);

    const castWidth = sanitizeNumber(this.width);
    const castHeight = sanitizeNumber(this.height);
    const toNormalize = parseToBoolean(this.normalizing);
    const parsedContent = JSON.parse(this.content);
    const xLabel = this.x;
    const yLabel = this.y;
    const zDimension = this.z;
    const acId = this.id;

    const style = document.createElement("style");
    style.innerHTML = `#${containerId} {margin: auto; width: ${castWidth}px; }`;

    const ac = areaChart(
      acId,
      parsedContent,
      castWidth,
      castHeight,
      xLabel,
      yLabel,
      zDimension,
      toNormalize
    );
    shadow.append(div);
    shadow.append(style);
    div.append(ac);
  }
}

customElements.define(stackedBarPlotName, StackedBarPlot);
customElements.define(areaChartName, AreaChart);
