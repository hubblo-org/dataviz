export function sanitizeNumber(x: string) {
  const maybeNumber = parseInt(x);
  if (isNaN(maybeNumber)) {
    throw new Error("Provided string cannot be cast as number!");
  }
  return maybeNumber;
}

export function parseToBoolean(s: string) {
  switch (s.toLowerCase()) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      throw new Error("Provided string cannot be parsed as a boolean");
  }
}
/** Normalizes all numeric values for a given array of elements.
 *
 * The normalization is relative to identified values inside the array for each property.
 * Each numeric value is associated either to `high`, `average` or `low`.
 * This allows for a quicker data preparation, but will not be accurate in its present state:  allowing
 * for an absolute normalization (for example, identifying that a given value is indeed high for a given unit and
 * not just relative to other values in the array) will require more mork.
 *
 *
 */
export function normalizeValues(data: object[]) {
  interface RecordValues {
    max: number;
    min: number;
    avg: number;
  }

  let minAvgMax: Record<string, RecordValues> = {};

  const keys = Object.keys(data[0]);
  keys.forEach((k) => {
    const values = data.map((d) => d[k]);
    if (typeof values[0] != "number") {
      return;
    } else {
      const max = Math.max(...values);
      const min = Math.min(...values);
      const avg = max / 2;
      const result = { max: max, min: min, avg: avg };
      minAvgMax[k] = result;
    }
  });

  const normalizedData = data.map((element) => {
    let normalizedElement = { ...element };
    keys.forEach((k) => {
      const valueToNormalize = normalizedElement[k];
      if (typeof valueToNormalize != "number") {
        return;
      }
      const valuesForProperty = minAvgMax[k];
      const minAvg = (valuesForProperty.min + valuesForProperty.avg) / 2;
      const maxAvg = (valuesForProperty.max + valuesForProperty.avg) / 2;
      if (valueToNormalize < minAvg) {
        normalizedElement[k] = "low";
      } else if (valueToNormalize > maxAvg) {
        normalizedElement[k] = "high";
      } else if (valueToNormalize >= minAvg && valueToNormalize <= maxAvg) {
        normalizedElement[k] = "average";
      }
    });
    return normalizedElement;
  });
  return normalizedData;
}
