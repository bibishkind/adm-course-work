let floydWarshall = null;

setupEventListeners();

function setupEventListeners() {
  document.querySelector("#add-vertices-button").addEventListener("click", addVertices);

  document.querySelector("#add-edge-button").addEventListener("click", addEdge);

  document.querySelector("#run-algorithm-button").addEventListener("click", runAlgorithm);
}

function addVertices() {
  const numberNodes = parseInt(
    document.getElementById("number-nodes-input").value,
  );

  if (isNaN(numberNodes) || numberNodes <= 0) {
    alert("Невалидное количество вершин.");
    return;
  }

  floydWarshall = new FloydWarshall(numberNodes);
  updateCanvas();
}

function addEdge() {
  const source = parseInt(document.getElementById("source-input").value);
  const target = parseInt(document.getElementById("target-input").value);
  const weight = parseInt(document.getElementById("weight-input").value);

  if (isNaN(source) || isNaN(target) || isNaN(weight)) {
    alert("Невалидное значение ребра.");
    return;
  }

  floydWarshall.addEdge(source, target, weight);
  updateCanvas();
}

function runAlgorithm() {
  if (!floydWarshall) {
    alert("Невалидные количество вершин или значения ребер.");
    return;
  }

  displayDistances(floydWarshall.runAlgorithm());
}

function updateCanvas() {
  if (!floydWarshall) return;

  const canvas = document.getElementById("canvas");

  const context = canvas.getContext("2d");

  canvas.width = 2400;
  canvas.height = 1800;

  context.font = "25px Arial";
  context.lineWidth = 2.5;

  context.clearRect(0, 0, canvas.width, canvas.height);

  const numberNodes = floydWarshall.getNumberNodes();

  const radius = 100;
  const margin = 100;

  const positions = {};

  for (let i = 1; i <= numberNodes; i++) {
    const angle = (i / numberNodes) * 2 * Math.PI;

    const x = canvas.width / 2 + (400 + margin) * Math.cos(angle);
    const y = canvas.height / 2 + (400 + margin) * Math.sin(angle);

    positions[i] = { x, y };

    context.beginPath();

    context.arc(x, y, radius, 0, 2 * Math.PI);

    context.fillStyle = "#ffffff";
    context.fill();

    context.stroke();

    context.fillStyle = "#000000";
    context.fillText(i, x - 5, y + 5);
  }

  floydWarshall.getEdges().forEach((edge) => {
    const { source, target, weight } = edge;

    const startX = positions[source].x;
    const startY = positions[source].y;

    const endX = positions[target].x;
    const endY = positions[target].y;

    const dx = endX - startX;
    const dy = endY - startY;

    const angle = Math.atan2(dy, dx);

    const offsetX = Math.cos(angle) * radius;
    const offsetY = Math.sin(angle) * radius;

    context.beginPath();

    context.moveTo(startX + offsetX, startY + offsetY);
    context.lineTo(endX - offsetX, endY - offsetY);

    context.stroke();

    context.beginPath();

    context.moveTo(endX - offsetX, endY - offsetY);
    context.lineTo(
      endX - offsetX - Math.cos(angle - Math.PI / 6) * 10,
      endY - offsetY - Math.sin(angle - Math.PI / 6) * 10,
    );

    context.moveTo(endX - offsetX, endY - offsetY);
    context.lineTo(
      endX - offsetX - Math.cos(angle + Math.PI / 6) * 10,
      endY - offsetY - Math.sin(angle + Math.PI / 6) * 10,
    );

    context.stroke();

    context.fillText(
      weight,
      (startX + endX) / 2 + 10 * Math.cos(angle + Math.PI / 2),
      (startY + endY) / 2 + 10 * Math.sin(angle + Math.PI / 2),
    );
  });
}

function displayDistances(distancesHistory) {
  const distancesContainer = document.getElementById("distances-container");

  distancesContainer.innerHTML = "";

  distancesHistory.forEach((distances, index) => {
    const matrixContainer = document.createElement("div");
    matrixContainer.className = "matrix-container";

    const h3 = document.createElement("h3");
    h3.textContent = `Шаг ${index}`;

    matrixContainer.appendChild(h3);

    const table = document.createElement("table");

    for (let i = 1; i <= floydWarshall.getNumberNodes(); i++) {
      const tr = document.createElement("tr");

      for (let j = 1; j <= floydWarshall.getNumberNodes(); j++) {
        const td = document.createElement("td");
        td.textContent = distances[i][j] === null ? "∞" : distances[i][j];

        tr.appendChild(td);
      }

      table.appendChild(tr);
    }

    matrixContainer.appendChild(table);
    distancesContainer.appendChild(matrixContainer);
  });
}
