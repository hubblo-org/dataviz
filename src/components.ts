import { stackedBarPlot } from "./plots";
import { sanitizeNumber } from "./utils";

export class StackedBarPlot extends HTMLElement {
  content: string;
  domains: string;
  width: string;
  height: string;
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
    const idNumber = document.querySelectorAll("stacked-bar-plot").length + 1;
    this.id = `sbarplot-${idNumber}`;
    this.innerHTML = `<style> #${this.id}{margin: auto; overflow:visible; } </style>`;
    const width = sanitizeNumber(this.width);
    const height = sanitizeNumber(this.height);
    const domains = this.domains.split(",");
    const dataToRender = JSON.parse(this.content);

    if (this.fill) {
      stackedBarPlot(this.id, dataToRender, width, height, domains, this.x, this.y, this.fill);
    } else {
    stackedBarPlot(this.id, dataToRender, width, height, domains, this.x, this.y);
    }
  }
}

customElements.define("stacked-bar-plot", StackedBarPlot);
