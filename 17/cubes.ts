import { readFile } from "fs"

type Cube = {
  active: boolean
  neighbors: Cube[]
}

// Indices are [z][y][x]
type Grid = Cube[][][]

type Point = {
  xIndex: number
  yIndex: number
  zIndex: number
}

readFile("17/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n")
  const grid = initializeGrid(lines)

  console.log(grid[0][0][1])
})

const initializeGrid = (lines: string[]): Grid => {
  const grid: Cube[][][] = []
  let zIndex = 0
  grid[zIndex] = []
  lines.forEach((line, yIndex) => {
    if (line.length === 0) {
      return
    }
    grid[zIndex][yIndex] = []
    if (line.length >= 1) {
      line.split("").forEach((symbol) => {
        grid[zIndex][yIndex].push({
          active: symbol === "#",
          neighbors: [],
        })
      })
    }
  })

  initializeNeighbors(grid)

  for (let i = 0; i < 6; i++) {
    simulateCycle(grid)
  }

  return grid
}

const simulateCycle = (grid: Grid): void => {
  grid.forEach((zLayer, zIndex) => {
    zLayer.forEach((row, yIndex) => {
      row.forEach((cube, xIndex) => {
        const activeNeighbors = cube.neighbors.filter(
          (neighbor) => neighbor.active
        ).length
        if (cube.active) {
          cube.active = activeNeighbors === 2 || activeNeighbors === 3
        } else {
          cube.active = activeNeighbors === 3
        }
      })
    })
  })
}

const initializeNeighbors = (grid: Grid): void => {
  grid.forEach((zLayer, zIndex) => {
    zLayer.forEach((row, yIndex) => {
      row.forEach((cube, xIndex) => {
        cube.neighbors = getNeighbors({ xIndex, yIndex, zIndex }, grid)
      })
    })
  })
}

const getNeighbors = (
  { xIndex, yIndex, zIndex }: Point,
  grid: Grid
): Cube[] => {
  const neighbors: Cube[] = []
  neighborOffsets.forEach(([xOffset, yOffset, zOffset]) => {
    const neighbor =
      grid[zIndex + zOffset] &&
      grid[zIndex + zOffset][yIndex + yOffset] &&
      grid[zIndex + zOffset][yIndex + yOffset][xIndex + xOffset]
    if (neighbor) {
      neighbors.push(neighbor)
    }
  })
  return neighbors
}

const neighborOffsets = [
  [-1, 0, 0],
  [0, -1, 0],
  [0, 0, -1],
  [+1, 0, 0],
  [0, +1, 0],
  [0, 0, +1],
  [-1, -1, 0],
  [0, -1, -1],
  [-1, 0, -1],
  [-1, +1, 0],
  [+1, -1, 0],
  [0, +1, -1],
  [0, -1, +1],
  [+1, 0, -1],
  [-1, 0, +1],
  [1, -1, -1],
  [+1, +1, 0],
  [0, +1, +1],
  [+1, 0, +1],
  [+1, +1, +1],
  [+1, +1, -1],
  [+1, -1, +1],
  [+1, -1, -1],
  [-1, +1, +1],
  [-1, +1, -1],
  [-1, -1, -1],
]
