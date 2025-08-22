import { renderPlotDiv } from "./utils";
import { horizontalBarPlot, stackedBarPlot } from "../../src";
import { dcData } from "../data/data";

const data = [
  { type: "string", value: 1 },
  { type: "number", value: 1 }
];

export function renderHorizontalBarPlot() {
  const plotId = "horizontal-bar-plot";
  renderPlotDiv(plotId);

  horizontalBarPlot(`#${plotId}`, data, 800, 600, "value", "type", true);
}

export function renderStackedBarPlot() {
  const plotId = "stacked-bar-plot";
  renderPlotDiv(plotId);

  const domains = ["open", "closed", "project"];

  stackedBarPlot(plotId, dcData, 800, 600, domains, "status", "type");
}

export function renderStackedBarPlotWithFillLabel() {
  const plotId = "stacked-bar-plot";
  renderPlotDiv(plotId);

  const groupedData = dcData.map((dc) => {
    const power = dc.power as number;
    const wu = dc.waterUsage as number;
    const surface = dc.surface as number;

    let normalizedPower: string;
    let normalizedWaterUsage: string;
    let normalizedSurface: string;

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

    if (surface < 100) {
      normalizedSurface = "low";
    } else if (surface > 100 && surface < 300) {
      normalizedSurface = "average";
    } else {
      normalizedSurface = "high";
    }

    return {
      ...dc,
      power: normalizedPower,
      waterUsage: normalizedWaterUsage,
      surface: normalizedSurface
    };
  });
  const domains = [...new Set(groupedData.map((dc) => dc.power))];
  stackedBarPlot(plotId, groupedData, 800, 600, domains, "status", "type", "power");
}
