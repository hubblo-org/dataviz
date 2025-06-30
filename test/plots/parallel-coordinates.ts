import { minMaxScaling, parallelCoordinates } from "../../src";
import { DC, dcData } from "../data/data";

export function renderParallelCoordinates() {
  const plotId = "parallel-coordinates-plot";
  const mainDiv = document.getElementById("render-plot");
  const plotDiv = document.createElement("div");
  plotDiv.setAttribute("id", plotId);
  mainDiv?.appendChild(plotDiv);
  const scaleCheckbox = document.createElement("input");
  const scaleLabel = document.createElement("label");
  scaleCheckbox.setAttribute("type", "checkbox");
  scaleCheckbox.setAttribute("id", "min-max-scale");
  scaleLabel.setAttribute("for", "min-max-scale");
  scaleLabel.textContent = "Min-max scale?";
  mainDiv?.appendChild(scaleLabel);
  mainDiv?.appendChild(scaleCheckbox);

  const xLabel = "type";
  const yLabel = "status";
  const isNotAnAxis = (value: string) => {
    if (value === xLabel || value == yLabel) {
      return false;
    }
    return true;
  };

  const dimensions = Object.keys(dcData[0]).filter(isNotAnAxis);
  const domains = [...new Set(dcData.map((element) => element.type))];
  parallelCoordinates(plotId, dcData, 800, 600, dimensions, "type", domains);

  scaleCheckbox.addEventListener("change", function () {
    if (this.checked) {
      const scaledData = minMaxScaling(dimensions as [keyof DC], dcData);
      parallelCoordinates(plotId, scaledData, 800, 600, dimensions, "type", domains, true);
    } else {
      parallelCoordinates(plotId, dcData, 800, 600, dimensions, "type", domains);
    }
  });
}
