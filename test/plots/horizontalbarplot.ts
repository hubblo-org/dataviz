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

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const dcData = [
  { type: "colocation", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "closed", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "closed", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "closed", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "colocation", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "private", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "private", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "private", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "private", status: "open", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "private", status: "closed", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) },
  { type: "hyperscaler", status: "project", power: getRandomInt(10), waterUsage: getRandomInt(15) }
];

export function renderStackedBarPlot() {
  const plotId = "stacked-bar-plot";
  const mainDiv = document.getElementById("render-plot");
  const plotDiv = document.createElement("div");
  plotDiv.setAttribute("id", plotId);
  mainDiv?.appendChild(plotDiv);

  const domains = ["open", "closed", "project"];

  stackedBarPlot(plotId, dcData, 800, 600, domains, "status", "type");
}

export function renderStackedBarPlotWithFillLabel() {
  const plotId = "stacked-bar-plot";
  const mainDiv = document.getElementById("render-plot");
  const plotDiv = document.createElement("div");
  plotDiv.setAttribute("id", plotId);
  mainDiv?.appendChild(plotDiv);

  const domains = [...new Set(dcData.map((dc) => dc.power))];

  stackedBarPlot(plotId, dcData, 800, 600, domains, "status", "type", "power");
}
