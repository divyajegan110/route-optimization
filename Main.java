import java.util.*;

// Class representing an edge in the graph
class Edge {
    int destination, weight;

    Edge(int destination, int weight) {
        this.destination = destination;
        this.weight = weight;
    }
}

// Class representing the graph
class Graph {
    int stations; // Number of metro stations
    List<Edge>[] adjacencyList; // Adjacency list representation of the graph

    // Constructor
    /**
     * @param stations
     */
    @SuppressWarnings("unchecked")
    public Graph(int stations) {
        this.stations = stations;
        adjacencyList = new ArrayList[stations];
        for (int i = 0; i < stations; i++) {
            adjacencyList[i] = new ArrayList<>();
        }
    }

    // Method to add an edge to the graph
    public void addEdge(int source, int destination, int weight) {
        adjacencyList[source].add(new Edge(destination, weight));
        adjacencyList[destination].add(new Edge(source, weight)); // Assuming the graph is undirected
    }

    // Method to find the shortest path using Dijkstra's Algorithm
    public void findShortestPath(int source, int destination) {
        // Initialize distance array with "infinity"
        int[] distances = new int[stations];
        Arrays.fill(distances, Integer.MAX_VALUE);
        distances[source] = 0; // Distance to the source is 0

        // Min-heap priority queue to pick the station with the smallest distance
        PriorityQueue<Edge> pq = new PriorityQueue<>((a, b) -> a.weight - b.weight);
        pq.add(new Edge(source, 0)); // Start from the source

        // Track visited stations
        boolean[] visited = new boolean[stations];

        // Loop until the priority queue is empty
        while (!pq.isEmpty()) {
            // Get the station with the smallest distance
            Edge current = pq.poll();
            int currentStation = current.destination;

            // Skip if this station has already been visited
            if (visited[currentStation]) continue;
            visited[currentStation] = true;

            // Process neighbors
            for (Edge neighbor : adjacencyList[currentStation]) {
                int newDistance = distances[currentStation] + neighbor.weight;

                // If a shorter path is found, update the distance
                if (newDistance < distances[neighbor.destination]) {
                    distances[neighbor.destination] = newDistance;
                    pq.add(new Edge(neighbor.destination, newDistance));
                }
            }
        }

        // Output the shortest distance to the destination
        if (distances[destination] == Integer.MAX_VALUE) {
            System.out.println("No path exists from station " + source + " to station " + destination);
        } else {
            System.out.println("The shortest path from station " + source + " to station " + destination +
                    " is " + distances[destination]);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to the Route Optimization Project!");

        // Create a graph with 5 stations
        Graph metroMap = new Graph(5);

        // Add edges representing metro routes with weights (distances)
        metroMap.addEdge(0, 1, 10);
        metroMap.addEdge(0, 2, 15);
        metroMap.addEdge(1, 3, 12);
        metroMap.addEdge(2, 3, 10);
        metroMap.addEdge(3, 4, 2);

        // Define source and destination stations
        int source = 0;
        int destination = 4;

        System.out.println("Finding shortest path...");
        metroMap.findShortestPath(source, destination); // Find and display the shortest path
    }
}
