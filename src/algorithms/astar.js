import { floorMap } from "../data/floorMap";

// Calculate Manhattan distance
function heuristic(a, b) {
  return (
    Math.abs(a.row - b.row) +
    Math.abs(a.col - b.col)
  );
}

// Check whether a cell is valid
function isValid(row, col) {
  return (
    row >= 0 &&
    row < floorMap.length &&
    col >= 0 &&
    col < floorMap[0].length &&
    floorMap[row][col] === 0
  );
}

export function findPath(start, destination) {

  const openList = [start];
  const closedList = [];

  const gScore = {};
  const fScore = {};

  const cameFrom = {};

  function getKey(point) {
    return `${point.row},${point.col}`;
  }

  const startKey = getKey(start);

  gScore[startKey] = 0;

  fScore[startKey] = heuristic(start, destination);

  while (openList.length > 0) {

    // Find cell with lowest fScore
    openList.sort((a, b) => {
      return (
        fScore[getKey(a)] - fScore[getKey(b)]
      );
    });

    const current = openList.shift();

    const currentKey = getKey(current);

    // Destination reached
    if (
      current.row === destination.row &&
      current.col === destination.col
    ) {

      const path = [current];

      let key = currentKey;

      while (cameFrom[key]) {
        key = cameFrom[key];
        const [row, col] = key.split(",").map(Number);

        path.unshift({ row, col });
      }

      return path;
    }

    closedList.push(currentKey);

    // Four possible directions
    const directions = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 }
    ];

    for (const direction of directions) {

      const neighbor = {
        row: current.row + direction.row,
        col: current.col + direction.col
      };

      if (!isValid(neighbor.row, neighbor.col)) {
        continue;
      }

      const neighborKey = getKey(neighbor);

      if (closedList.includes(neighborKey)) {
        continue;
      }

      const tentativeGScore =
        gScore[currentKey] + 1;

      if (
        !gScore[neighborKey] ||
        tentativeGScore < gScore[neighborKey]
      ) {

        cameFrom[neighborKey] = currentKey;

        gScore[neighborKey] = tentativeGScore;

        fScore[neighborKey] =
          tentativeGScore +
          heuristic(neighbor, destination);

        if (
          !openList.some(
            point => getKey(point) === neighborKey
          )
        ) {
          openList.push(neighbor);
        }
      }
    }
  }

  return [];
}