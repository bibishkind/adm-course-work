class FloydWarshall {
  #numberNodes; // Приватное поле для хранения количества узлов в графе
  #edges; // Приватное поле для хранения ребер графа
  #distances; // Приватное поле для хранения расстояний между узлами

  constructor(numberNodes) {
    this.#numberNodes = numberNodes; // Инициализация количества узлов
    this.#edges = []; // Инициализация пустого массива для ребер
    this.#distances = {}; // Инициализация пустого объекта для расстояний
  }

  // Метод для добавления ребра в граф
  addEdge(source, target, weight) {
    this.#edges.push({ source, target, weight }); // Добавление нового объекта ребра в массив
  }

  // Метод для запуска алгоритма Флойда-Уоршелла
  runAlgorithm() {
    this.#initializeDistances(); // Инициализация матрицы расстояний

    const distancesHistory = [JSON.parse(JSON.stringify(this.#distances))]; // Массив для хранения истории матриц расстояний

    // Основной цикл алгоритма Флойда-Уоршелла
    for (let k = 1; k <= this.#numberNodes; k++) {
      for (let i = 1; i <= this.#numberNodes; i++) {
        for (let j = 1; j <= this.#numberNodes; j++) {
          // Обновление кратчайшего расстояния между узлами i и j через узел k
          if (this.#distances[i][k] + this.#distances[k][j] < this.#distances[i][j]) {
            this.#distances[i][j] = this.#distances[i][k] + this.#distances[k][j];
          }
        }
      }
      distancesHistory.push(JSON.parse(JSON.stringify(this.#distances))); // Сохранение текущего состояния матрицы расстояний
    }

    return distancesHistory; // Возврат истории матриц расстояний
  }

  // Метод для получения количества узлов
  getNumberNodes() {
    return this.#numberNodes; // Возврат количества узлов в графе
  }

  // Метод для получения ребер графа
  getEdges() {
    return this.#edges; // Возврат ребер графа
  }

  // Приватный метод для инициализации матрицы расстояний
  #initializeDistances() {
    for (let i = 1; i <= this.#numberNodes; i++) {
      this.#distances[i] = {};
      for (let j = 1; j <= this.#numberNodes; j++) {
        // Инициализация расстояний между парами узлов
        this.#distances[i][j] = i === j ? 0 : Infinity;
      }
    }

    // Установка расстояний для ребер на основе предоставленных данных
    for (let edge of this.#edges) {
      this.#distances[edge.source][edge.target] = edge.weight;
    }
  }
}

// Пример использования класса FloydWarshall
const fw = new FloydWarshall(4); // Создание нового экземпляра класса FloydWarshall с 4 узлами

// Добавление ребер в граф
fw.addEdge(1, 3, -2);
fw.addEdge(3, 4, 2);
fw.addEdge(4, 2, -1);
fw.addEdge(2, 1, 4);
fw.addEdge(2, 3, 3);

// Запуск алгоритма Флойда-Уоршелла и получение истории расстояний
const distancesHistory = fw.runAlgorithm();

console.log(distancesHistory); // Вывод истории матриц расстояний
