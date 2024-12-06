import java.util.*;

class Station {
    private final String name;
    private final Map<Station, Integer> neighbors;

    // Constructor
    public Station(String name) {
        this.name = name;
        this.neighbors = new HashMap<>();
    }

    // Getters
    public String getName() {
        return name;
    }

    public Map<Station, Integer> getNeighbors() {
        return neighbors;
    }

    // Add a neighbor (connected station) and distance
    public void addNeighbor(Station station, int distance) {
        neighbors.put(station, distance);
    }

    // Get distance to a specific neighbor
    public int getDistance() {
        return 0;  // This will be used for the priority queue comparison in Dijkstra's
    }
}
