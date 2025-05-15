import * as plots from "./plots";

const plotSelection = document.getElementById("plot-selection");
plotSelection?.addEventListener("change", renderPlot);
const plotsOptions = Object.keys(plots);

plotsOptions.forEach((plot) => {
  const option = document.createElement("option");
  option.value = plot;
  option.textContent = plot;
  plotSelection?.append(option);
});

function renderPlot() {
  const selectedPlot = (plotSelection as HTMLSelectElement).value;
  document.getElementById("render-plot")?.getElementsByTagName("div")[0]?.remove();
  plots[selectedPlot]();
}

renderPlot();
