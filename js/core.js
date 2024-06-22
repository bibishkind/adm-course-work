class FloydWarshall {
  #numberNodes;
  #edges;
  #distances;

  constructor(numberNodes) {
    this.#numberNodes = numberNodes;
    this.#edges = [];
    this.#distances = {};
  }

  addEdge(source, target, weight) {
    this.#edges.push({ source, target, weight });
  }

  runAlgorithm() {
    this.#initializeDistances();

    const distancesHistory = [JSON.parse(JSON.stringify(this.#distances))];

    for (let k = 1; k <= this.#numberNodes; k++) {
      for (let i = 1; i <= this.#numberNodes; i++) {
        for (let j = 1; j <= this.#numberNodes; j++) {
          if (this.#distances[i][k] + this.#distances[k][j] < this.#distances[i][j]) {
            this.#distances[i][j] = this.#distances[i][k] + this.#distances[k][j];
          }
        }
      }
      distancesHistory.push(JSON.parse(JSON.stringify(this.#distances)));
    }

    return distancesHistory;
  }

  getNumberNodes() {
    return this.#numberNodes;
  }

  getEdges() {
    return this.#edges;
  }

  #initializeDistances() {
    for (let i = 1; i <= this.#numberNodes; i++) {
      this.#distances[i] = {};
      for (let j = 1; j <= this.#numberNodes; j++) {
        this.#distances[i][j] = i === j ? 0 : Infinity;
      }
    }

    for (let edge of this.#edges) {
      this.#distances[edge.source][edge.target] = edge.weight;
    }
  }
}

const fw = new FloydWarshall(4);

fw.addEdge(1, 3, -2);
fw.addEdge(3, 4, 2);
fw.addEdge(4, 2, -1);
fw.addEdge(2, 1, 4);
fw.addEdge(2, 3, 3);

const distancesHistory = fw.runAlgorithm();

console.log(distancesHistory);
