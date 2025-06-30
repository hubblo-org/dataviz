import { horizontalBarPlot, stackedBarPlot } from "../../src";
import { dcData } from "../data/data";

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

  const groupedData = dcData.map((dc) => {
    const power = dc.power as number;
    const wu = dc.waterUsage as number;

    let normalizedPower: string;
    let normalizedWaterUsage: string;

    if (power < 3) {
      normalizedPower = "low";
    } else if (power > 3 && power < 6) {
      normalizedPower = "average";
    } else {
      normalizedPower = "high";
    }

    if (wu < 5) {
      normalizedWaterUsage = "low";
    } else if (wu > 5 && wu < 10) {
      normalizedWaterUsage = "average";
    } else {
      normalizedWaterUsage = "high";
    }

    return { ...dc, power: normalizedPower, waterUsage: normalizedWaterUsage };
  });
  const domains = [...new Set(groupedData.map((dc) => dc.power))];
  stackedBarPlot(plotId, groupedData, 800, 600, domains, "status", "type", "power");
}
