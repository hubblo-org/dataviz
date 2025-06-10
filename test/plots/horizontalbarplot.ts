import { horizontalBarPlot, stackedBarPlot } from "../../src";

const data = [
  { type: "string", value: 1 },
  { type: "number", value: 1 }
];

export function renderHorizontalBarPlot() {
  const plotId = "horizontal-bar-plot";
  const mainDiv = document.getElementById("render-plot");
  const plotDiv = document.createElement("div");
  plotDiv.setAttribute("id", plotId);
  mainDiv?.appendChild(plotDiv);

  horizontalBarPlot(`#${plotId}`, data, 800, 600, "value", "type", true);
}

const dcData = [
  { type: "colocation", status: "open" },
  { type: "colocation", status: "open" },
  { type: "colocation", status: "open" },
  { type: "colocation", status: "open" },
  { type: "colocation", status: "open" },
  { type: "colocation", status: "open" },
  { type: "colocation", status: "open" },
  { type: "colocation", status: "closed" },
  { type: "colocation", status: "closed" },
  { type: "colocation", status: "closed" },
  { type: "colocation", status: "project" },
  { type: "colocation", status: "project" },
  { type: "colocation", status: "project" },
  { type: "colocation", status: "project" },
  { type: "colocation", status: "project" },
  { type: "colocation", status: "project" },
  { type: "colocation", status: "project" },
  { type: "hyperscaler", status: "open" },
  { type: "hyperscaler", status: "open" },
  { type: "hyperscaler", status: "open" },
  { type: "hyperscaler", status: "open" },
  { type: "hyperscaler", status: "open" },
  { type: "hyperscaler", status: "open" },
  { type: "hyperscaler", status: "open" },
  { type: "hyperscaler", status: "open" },
  { type: "hyperscaler", status: "project" },
  { type: "hyperscaler", status: "project" },
  { type: "hyperscaler", status: "project" },
  { type: "hyperscaler", status: "project" },
  { type: "hyperscaler", status: "project" },
  { type: "hyperscaler", status: "project" },
  { type: "private", status: "project" },
  { type: "private", status: "project" },
  { type: "private", status: "open" },
  { type: "private", status: "closed" },
  { type: "private", status: "project" },
  { type: "hyperscaler", status: "project" },
  { type: "hyperscaler", status: "project" }
];

export function renderStackedBarPlot() {
  const plotId = "stacked-bar-plot";
  const mainDiv = document.getElementById("render-plot");
  const plotDiv = document.createElement("div");
  plotDiv.setAttribute("id", plotId);
  mainDiv?.appendChild(plotDiv);

  const domains = ["open", "closed", "project"];

  stackedBarPlot(`#${plotId}`, dcData, 800, 600, domains, "status", "type");
  document.getElementsByClassName("plot")[0].setAttribute("style", "overflow: visible");
}
