const METERS_PER_CELL = 1;

// Find movement direction
function getDirection(current, next) {
  if (next.row < current.row) return "UP";
  if (next.row > current.row) return "DOWN";
  if (next.col < current.col) return "LEFT";
  if (next.col > current.col) return "RIGHT";
}

// Find turn direction
function getTurn(previous, current) {
  const directions = ["UP", "RIGHT", "DOWN", "LEFT"];

  const prevIndex = directions.indexOf(previous);
  const currIndex = directions.indexOf(current);

  const difference = (currIndex - prevIndex + 4) % 4;

  if (difference === 1) return "right";
  if (difference === 3) return "left";
  if (difference === 2) return "around";

  return "straight";
}

// Generate navigation instructions
export function generateInstructions(path, initialDirection = "RIGHT") {

  if (!path || path.length < 2) {
    return ["You have reached your destination."];
  }

  const instructions = [];

  let previousDirection = initialDirection;
  let currentDirection = getDirection(path[0], path[1]);

  let distance = 1;

  for (let i = 2; i < path.length; i++) {

    const nextDirection = getDirection(path[i - 1], path[i]);

    if (nextDirection === currentDirection) {
      distance++;
    } else {

      const turn = getTurn(previousDirection, currentDirection);

      if (turn !== "straight") {
        instructions.push(`Turn ${turn}.`);
      }

      instructions.push(
        `Move straight for ${distance * METERS_PER_CELL} metres.`
      );

      previousDirection = currentDirection;
      currentDirection = nextDirection;
      distance = 1;
    }
  }

  const finalTurn = getTurn(previousDirection, currentDirection);

  if (finalTurn !== "straight") {
    instructions.push(`Turn ${finalTurn}.`);
  }

  instructions.push(
    `Move straight for ${distance * METERS_PER_CELL} metres.`
  );

  instructions.push("Destination reached!");

  return instructions;
}