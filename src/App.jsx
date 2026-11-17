
import { useState, useEffect } from "react";
import FloorMap from "./components/FloorMap";
import { findPath } from "./algorithms/astar";
import { generateInstructions } from "./utils/navigationInstructions";
import "./App.css";

const METERS_PER_CELL = 1;
const MOVE_INTERVAL = 1000;

function App() {
  // Start and destination
  const [startPoint, setStartPoint] = useState({
    row: 3,
    col: 2,
  });

  const [destinationPoint, setDestinationPoint] = useState({
    row: 4,
    col: 6,
  });

  // Map selection mode
  const [selectionMode, setSelectionMode] = useState("start");

  // Route and robot states
  const [path, setPath] = useState([]);
  const [robotIndex, setRobotIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  // Select start or destination by clicking map
  function handleCellClick(row, col) {
    const selectedPoint = { row, col };

    if (selectionMode === "start") {
      setStartPoint(selectedPoint);
    } else {
      setDestinationPoint(selectedPoint);
    }

    setPath([]);
    setRobotIndex(0);
    setIsMoving(false);
  }

  // Calculate route using A*
  function handleFindPath() {
    if (
      startPoint.row === destinationPoint.row &&
      startPoint.col === destinationPoint.col
    ) {
      alert("Start and destination cannot be the same!");
      return;
    }

    const result = findPath(startPoint, destinationPoint);

    setIsMoving(false);
    setRobotIndex(0);
    setPath(result);

    if (result.length === 0) {
      alert("No valid path found!");
    }
  }

  // Reset everything
  function handleReset() {
    setPath([]);
    setRobotIndex(0);
    setIsMoving(false);

    setStartPoint({ row: 3, col: 2 });
    setDestinationPoint({ row: 4, col: 6 });
    setSelectionMode("start");
  }

  // Start robot movement
  function handleStart() {
    if (path.length < 2) {
      alert("Please find a valid path first!");
      return;
    }

    if (robotIndex >= path.length - 1) {
      setRobotIndex(0);
    }

    setIsMoving(true);
  }

  // Pause robot movement
  function handlePause() {
    setIsMoving(false);
  }

  // Robot movement simulation
  useEffect(() => {
    if (!isMoving || path.length < 2) {
      return;
    }

    const interval = setInterval(() => {
      setRobotIndex((currentIndex) => {
        if (currentIndex >= path.length - 1) {
          setIsMoving(false);
          return currentIndex;
        }

        const nextIndex = currentIndex + 1;

        if (nextIndex >= path.length - 1) {
          setIsMoving(false);
        }

        return nextIndex;
      });
    }, MOVE_INTERVAL);

    return () => clearInterval(interval);
  }, [isMoving, path]);

  // Current robot position
  const robotPosition =
    path.length > 0
      ? path[Math.min(robotIndex, path.length - 1)]
      : null;

  // Navigation calculations
  const totalDistance = Math.max(0, path.length - 1) * METERS_PER_CELL;

  const travelledDistance =
    Math.min(robotIndex, Math.max(0, path.length - 1)) *
    METERS_PER_CELL;

  const remainingDistance = totalDistance - travelledDistance;

  const progress =
    totalDistance > 0
      ? Math.round((travelledDistance / totalDistance) * 100)
      : 0;

  // Generate turn-by-turn instructions
  const instructions = generateInstructions(path, "RIGHT");

  return (
    <div className="app-container">
      <h1>Indoor Robot Navigation System</h1>

      <p className="subtitle">
        Navigate a robot through a predefined indoor floor map.
      </p>

      {/* Map selection controls */}
      <div className="controls">
        <h3>1. Select Locations</h3>

        <button
          className={selectionMode === "start" ? "active" : ""}
          onClick={() => setSelectionMode("start")}
        >
          Select Start Point
        </button>

        <button
          className={selectionMode === "destination" ? "active" : ""}
          onClick={() => setSelectionMode("destination")}
        >
          Select Destination
        </button>

        <p>
          Current selection: <strong>{selectionMode}</strong>
        </p>

        <p>
          Start: Row {startPoint.row}, Column {startPoint.col}
        </p>

        <p>
          Destination: Row {destinationPoint.row}, Column{" "}
          {destinationPoint.col}
        </p>

        <button onClick={handleFindPath}>
          Find Shortest Path
        </button>

        <button onClick={handleReset}>
          Reset Map
        </button>
      </div>

      {/* Floor map */}
      <div className="section">
        <h3>2. Indoor Floor Map</h3>

        <FloorMap
          startPoint={startPoint}
          destinationPoint={destinationPoint}
          path={path}
          robotPosition={robotPosition}
          onCellClick={handleCellClick}
        />

        <p>
          Green = Start | Red = Destination | Blue = Route |
          Orange = Robot | Dark = Obstacle
        </p>
      </div>

      {/* Robot movement controls */}
      {path.length > 0 && (
        <div className="section">
          <h3>3. Robot Movement</h3>

          <button onClick={handleStart} disabled={isMoving}>
            Start Robot
          </button>

          <button onClick={handlePause} disabled={!isMoving}>
            Pause Robot
          </button>

          <button
            onClick={() => {
              setIsMoving(false);
              setRobotIndex(0);
            }}
          >
            Restart Robot
          </button>

          <p>
            Robot status:{" "}
            <strong>
              {isMoving
                ? "Moving"
                : robotIndex >= path.length - 1
                ? "Destination Reached"
                : "Stopped"}
            </strong>
          </p>

          {robotPosition && (
            <p>
              Current position: Row {robotPosition.row}, Column{" "}
              {robotPosition.col}
            </p>
          )}
        </div>
      )}

      {/* Live navigation dashboard */}
      {path.length > 0 && (
        <div className="dashboard">
          <h3>4. Live Navigation Dashboard</h3>

          <div className="dashboard-cards">
            <div className="card">
              <h4>Total Distance</h4>
              <p>{totalDistance} metres</p>
            </div>

            <div className="card">
              <h4>Travelled Distance</h4>
              <p>{travelledDistance} metres</p>
            </div>

            <div className="card">
              <h4>Remaining Distance</h4>
              <p>{remainingDistance} metres</p>
            </div>

            <div className="card">
              <h4>Progress</h4>
              <p>{progress}%</p>
            </div>
          </div>

          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Turn-by-turn instructions */}
      {path.length > 0 && (
        <div className="instructions">
          <h3>5. Turn-by-Turn Navigation</h3>

          <ol>
            {instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default App;
