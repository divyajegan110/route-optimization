const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Load station data
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'metro-data.json'), 'utf-8'));

// Endpoint to fetch station names
app.get('/stations', (req, res) => {
  res.json(data.stations);
});

// Function to calculate the shortest distance
function findShortestPath(source, destination) {
  const distances = data.distances;
  let shortestRoute = null;
  let shortestDistance = Infinity;

  distances.forEach(route => {
    // Check if the route matches the source and destination
    if (
      (route.from === source && route.to === destination) ||
      (route.from === destination && route.to === source)
    ) {
      if (route.distance < shortestDistance) {
        shortestDistance = route.distance;
        shortestRoute = route;
      }
    }
  });

  return { shortestRoute, shortestDistance };
}

// Endpoint to calculate the shortest route
app.get('/route', (req, res) => {
  const { source, destination } = req.query;

  if (!source || !destination) {
    return res.json({ error: 'Please provide both source and destination stations.' });
  }

  const { shortestRoute, shortestDistance } = findShortestPath(source, destination);

  if (shortestRoute) {
    res.json({
      message: `The shortest route from ${source} to ${destination} is ${shortestRoute.route}. The distance is ${shortestDistance} kilometers.`,
      distance: shortestDistance,
      route: shortestRoute.route,
    });
  } else {
    res.json({ message: `No direct route found between ${source} and ${destination}.` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:3000`);
});
// Serve the 'images' folder as static
app.use('/images', express.static(path.join(__dirname, 'images')));
