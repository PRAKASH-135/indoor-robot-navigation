import { floorMap, CELL_SIZE } from "../data/floorMap";
import "./FloorMap.css";

function FloorMap({
  startPoint,
  destinationPoint,
  path,
  onCellClick
}) {
  function isPathCell(row, col) {
    return path.some(
      point => point.row === row && point.col === col
    );
  }

  return (
    <div className="map-container">
      <svg
        width={floorMap[0].length * CELL_SIZE}
        height={floorMap.length * CELL_SIZE}
      >
        {floorMap.map((row, rowIndex) =>
          row.map((cell, colIndex) => {

            const isStart =
              startPoint?.row === rowIndex &&
              startPoint?.col === colIndex;

            const isDestination =
              destinationPoint?.row === rowIndex &&
              destinationPoint?.col === colIndex;

            const isPath = isPathCell(rowIndex, colIndex);

            return (
              <g key={`${rowIndex}-${colIndex}`}>
                <rect
                  x={colIndex * CELL_SIZE}
                  y={rowIndex * CELL_SIZE}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  className={
                    cell === 1
                      ? "obstacle"
                      : isPath
                      ? "path-cell"
                      : "walkable"
                  }
                  onClick={() => {
                    if (cell === 0) {
                      onCellClick(rowIndex, colIndex);
                    }
                  }}
                />

                {isStart && (
                  <circle
                    cx={colIndex * CELL_SIZE + CELL_SIZE / 2}
                    cy={rowIndex * CELL_SIZE + CELL_SIZE / 2}
                    r="13"
                    className="start-marker"
                  />
                )}

                {isDestination && (
                  <circle
                    cx={colIndex * CELL_SIZE + CELL_SIZE / 2}
                    cy={rowIndex * CELL_SIZE + CELL_SIZE / 2}
                    r="13"
                    className="destination-marker"
                  />
                )}
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}

export default FloorMap;