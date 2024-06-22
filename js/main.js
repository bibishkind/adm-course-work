// Глобальная переменная для хранения экземпляра алгоритма Флойда-Уоршелла
let floydWarshall = null;

// Настройка обработчиков событий
setupEventListeners();

function setupEventListeners() {
  // Добавление обработчика для кнопки добавления вершин
  document.querySelector("#add-vertices-button").addEventListener("click", addVertices);

  // Добавление обработчика для кнопки добавления рёбер
  document.querySelector("#add-edge-button").addEventListener("click", addEdge);

  // Добавление обработчика для кнопки запуска алгоритма
  document.querySelector("#run-algorithm-button").addEventListener("click", runAlgorithm);
}

// Функция добавления вершин
function addVertices() {
  // Получаем количество вершин из ввода
  const numberNodes = parseInt(document.getElementById("number-nodes-input").value);

  // Проверка на валидность введённого числа вершин
  if (isNaN(numberNodes) || numberNodes <= 0) {
    alert("Невалидное количество вершин.");
    return;
  }

  // Создание экземпляра алгоритма Флойда-Уоршелла
  floydWarshall = new FloydWarshall(numberNodes);

  // Обновление отображения на холсте
  updateCanvas();
}

// Функция добавления рёбер
function addEdge() {
  // Получаем вершину-источник, вершину-назначение и вес ребра из ввода
  const source = parseInt(document.getElementById("source-input").value);
  const target = parseInt(document.getElementById("target-input").value);
  const weight = parseInt(document.getElementById("weight-input").value);

  // Проверка на валидность введённых значений ребра
  if (isNaN(source) || isNaN(target) || isNaN(weight)) {
    alert("Невалидное значение ребра.");
    return;
  }

  // Добавление ребра в экземпляр алгоритма Флойда-Уоршелла
  floydWarshall.addEdge(source, target, weight);

  // Обновление отображения на холсте
  updateCanvas();
}

// Функция запуска алгоритма Флойда-Уоршелла
function runAlgorithm() {
  // Проверка наличия валидного экземпляра алгоритма
  if (!floydWarshall) {
    alert("Невалидные количество вершин или значения ребер.");
    return;
  }

  // Запуск алгоритма и отображение результатов
  displayDistances(floydWarshall.runAlgorithm());
}

// Функция обновления холста с отрисовкой вершин и рёбер
function updateCanvas() {
  // Если экземпляр алгоритма не существует, выходим
  if (!floydWarshall) return;

  // Получаем элемент canvas
  const canvas = document.getElementById("canvas");

  // Получаем контекст рисования
  const context = canvas.getContext("2d");

  // Устанавливаем размеры canvas
  canvas.width = 2400;
  canvas.height = 1800;

  // Настройка стилей рисования
  context.font = "25px Arial";
  context.lineWidth = 2.5;

  // Очистка canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Получаем количество вершин
  const numberNodes = floydWarshall.getNumberNodes();

  // Расчёт координат для отрисовки вершин в круге
  const radius = 100;
  const margin = 100;
  const positions = {};

  // Отрисовка вершин и рёбер
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

  // Отрисовка рёбер между вершинами
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

// Функция отображения матрицы расстояний на странице
function displayDistances(distancesHistory) {
  // Получаем контейнер, в котором будут отображаться матрицы
  const distancesContainer = document.getElementById("distances-container");

  // Очищаем предыдущее содержимое контейнера
  distancesContainer.innerHTML = "";

  // Для каждого шага алгоритма создаём и добавляем таблицу с матрицей расстояний
  distancesHistory.forEach((distances, index) => {
    const matrixContainer = document.createElement("div");
    matrixContainer.className = "matrix-container";

    // Заголовок шага алгоритма
    const h3 = document.createElement("h3");
    h3.textContent = `Шаг ${index}`;

    // Добавляем заголовок в разметку
    matrixContainer.appendChild(h3);

    // Создание таблицы для отображения матрицы расстояний
    const table = document.createElement("table");

    for (let i = 1; i <= floydWarshall.getNumberNodes(); i++) {
      const tr = document.createElement("tr");

      for (let j = 1; j <= floydWarshall.getNumberNodes(); j++) {
        const td = document.createElement("td");

        // Выводим значение расстояния или символ "∞" для бесконечности
        td.textContent = distances[i][j] === null ? "∞" : distances[i][j];

        // Добавляем клетку в таблицу
        tr.appendChild(td);
      }

      // Добавляем строку в таблицу
      table.appendChild(tr);
    }

    // Добавляем матрицы в разметку
    matrixContainer.appendChild(table);
    distancesContainer.appendChild(matrixContainer);
  });
}
