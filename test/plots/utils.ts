export function renderPlotDiv(id: string) {
  const mainDiv = document.getElementById("render-plot");
  const plotDiv = document.createElement("div");
  plotDiv.setAttribute("id", id);
  mainDiv?.appendChild(plotDiv);
}
