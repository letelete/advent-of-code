import { Coords, Line } from './_types';

export const getLineDistance = (line: Line): { x: number; y: number } => ({
  x: line.to.x - line.from.x,
  y: line.to.y - line.from.y,
});

export const getLineIterators = (line: Line): { x: number; y: number } => {
  const distance = getLineDistance(line);
  return {
    x: distance.x ? (distance.x > 0 ? 1 : -1) : 0,
    y: distance.y ? (distance.y > 0 ? 1 : -1) : 0,
  };
};

export const isDiagonal = (line: Line) => {
  const it = getLineIterators(line);
  return it.x && it.y;
};

export const generateLinePath = (line: Line): Coords[] => {
  const it = getLineIterators(line);
  const pos = { x: line.from.x, y: line.from.y } as Coords;
  const coords = [{ ...pos }];
  while (pos.x !== line.to.x || pos.y !== line.to.y) {
    pos.x += it.x;
    pos.y += it.y;
    coords.push({ x: pos.x, y: pos.y } as Coords);
  }
  return coords;
};

export const hashCoords = (coords: Coords) => `${coords.x}#${coords.y}`;

export const countOverlaps = (lines: Line[]): number => {
  const map = new Map<string, number>();
  const updateMap = (key: string) => map.set(key, (map.get(key) || 0) + 1);
  lines.map(generateLinePath).flat().map(hashCoords).forEach(updateMap);
  return [...map.values()].filter((value) => value > 1).length;
};
