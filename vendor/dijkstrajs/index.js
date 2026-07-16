// Simple mock of dijkstrajs for QR code generation
module.exports = function dijkstra(graph, source, target) {
  // Simple BFS implementation for QR code encoding
  const distances = {}
  const previous = {}
  const unvisited = new Set()

  for (const node in graph) {
    distances[node] = Infinity
    previous[node] = null
    unvisited.add(node)
  }

  distances[source] = 0

  while (unvisited.size > 0) {
    let current = null
    let minDist = Infinity

    for (const node of unvisited) {
      if (distances[node] < minDist) {
        minDist = distances[node]
        current = node
      }
    }

    if (current === null || distances[current] === Infinity) break
    if (current === target) break

    unvisited.delete(current)

    for (const neighbor in graph[current] || {}) {
      if (!unvisited.has(neighbor)) continue
      const alt = distances[current] + (graph[current][neighbor] || 1)
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt
        previous[neighbor] = current
      }
    }
  }

  const path = []
  let current = target
  while (current !== null) {
    path.unshift(current)
    current = previous[current]
  }

  return {
    distance: distances[target],
    path: distances[target] === Infinity ? [] : path,
  }
}
