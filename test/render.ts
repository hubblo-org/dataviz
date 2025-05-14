import * as plots from "./plots";

const plotSelection = document.getElementById("plot-selection");
const plotsOptions = Object.keys(plots);

plotsOptions.forEach((plot) => {
  const option = document.createElement("option");
  option.value = plot;
  option.textContent = plot;
  plotSelection?.append(option);
});

const selectedOption = (plotSelection as HTMLSelectElement).value;
function renderPlot() {
  plots[selectedOption]();
}

plotSelection?.addEventListener("change", renderPlot);

renderPlot();
