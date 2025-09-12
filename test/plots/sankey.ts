import { sankeyDiagram } from "../../src";
import { sourcesTargets } from "../data/data";
import { renderPlotDiv } from "./utils";

export function renderSankey() {
  const plotId = "sankey-plot";
  renderPlotDiv(plotId);

  const links = sourcesTargets;
  const nodes = [
    { name: "Nuclear", category: "Energy" },
    { name: "Renewable", category: "Energy" },
    { name: "Gas", category: "Energy" },
    { name: "Water", category: "Cooling" },
    { name: "Refrigerant", category: "Cooling" },
    { name: "Data centers", category: "IT" },
    { name: "Industry", category: "Industry" },
    { name: "Domestic appliances", category: "Domestic" }
  ];
  const data = { nodes, links };

  sankeyDiagram(plotId, data, 800, 600, "Twh");
}
