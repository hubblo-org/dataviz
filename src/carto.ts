// Generate the hexagon coordinates relative to a given position.
export function hexagonCoordinates(latitude: number, longitude: number) {
  const r = 1 / Math.sin(Math.PI / 3);
  const sides = 6;
  const baseAngle = Math.floor(360 / sides);
  const iterableSides = [...Array(sides).keys()];
  const coordinates = iterableSides.map((side) => {
    const relativeAngle = (baseAngle * side + Math.floor(baseAngle / 2)) * (Math.PI / 180);
    const c = [latitude + r * Math.cos(relativeAngle), longitude + r * Math.sin(relativeAngle)];
    return c;
  });
  return coordinates;
}
