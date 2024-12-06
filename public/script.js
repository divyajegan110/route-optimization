// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  fetch("metro-data.json")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load metro data.");
      return response.json();
    })
    .then((data) => {
      populateDropdowns(data.stations);
      initializeRouteFinder(data);
    })
    .catch((error) => {
      console.error("Error loading data:", error);
      document.getElementById("result").textContent = "Failed to load data.";
    });
});

// Populate source and destination dropdowns
function populateDropdowns(stations) {
  const sourceDropdown = document.getElementById("source");
  const destinationDropdown = document.getElementById("destination");

  stations.forEach((station) => {
    const option = document.createElement("option");
    option.value = station;
    option.textContent = station;
    sourceDropdown.appendChild(option.cloneNode(true));
    destinationDropdown.appendChild(option);
  });
}

// Initialize route finding logic
function initializeRouteFinder(data) {
  document.getElementById("find-route").addEventListener("click", () => {
    const source = document.getElementById("source").value;
    const destination = document.getElementById("destination").value;

    if (source === destination) {
      document.getElementById("result").textContent = "Source and destination cannot be the same!";
      return;
    }

    const route = findShortestPath(source, destination, data.stations, data.distances);
    displayResult(route);
  });
}

// Dijkstra's algorithm for shortest path
function findShortestPath(source, destination, stations, distances) {
  const graph = {};
  stations.forEach((station) => (graph[station] = {}));
  distances.forEach(({ from, to, distance }) => {
    graph[from][to] = distance;
    graph[to][from] = distance; // Bidirectional graph
  });

  const distancesFromSource = {};
  const previous = {};
  const unvisited = new Set(stations);

  stations.forEach((station) => {
    distancesFromSource[station] = Infinity;
    previous[station] = null;
  });
  distancesFromSource[source] = 0;

  while (unvisited.size) {
    const current = Array.from(unvisited).reduce((a, b) =>
      distancesFromSource[a] < distancesFromSource[b] ? a : b
    );
    unvisited.delete(current);

    if (current === destination) break;

    for (const neighbor in graph[current]) {
      const alt = distancesFromSource[current] + graph[current][neighbor];
      if (alt < distancesFromSource[neighbor]) {
        distancesFromSource[neighbor] = alt;
        previous[neighbor] = current;
      }
    }
  }

  const path = [];
  let step = destination;
  while (step) {
    path.unshift(step);
    step = previous[step];
  }

  return { path: path[0] === source ? path : [], distance: distancesFromSource[destination] };
}

// Display route and distance
function displayResult(route) {
  const resultDiv = document.getElementById("result");
  if (route.path.length > 0) {
    resultDiv.textContent = `Shortest Path: ${route.path.join(" → ")} (${route.distance} km)`;
  } else {
    resultDiv.textContent = "No route found.";
  }
}
