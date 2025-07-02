import { dcData } from "../data/data";
import { renderPlotDiv } from "./utils";
import { scatterPlot } from "../../src";

export function renderScatterplot() {
  const plotId = "scatterplot-plot";
  renderPlotDiv(plotId);

  const domains = Object.keys(dcData[0]);
  scatterPlot(plotId, dcData, 800, 600, "power", "waterUsage", "type", domains);
}

export function renderCorrelogram() {
  const plotId = "correlogram-plot";
  renderPlotDiv(plotId);
}
