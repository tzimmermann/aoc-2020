import { readFile } from "fs"

type Place = "." | "#" | "L"
type Grid = Place[][]

readFile("11/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n")
  const numbers: number[] = []

  let grid = initializeGrid(lines)

  console.log(`part 1 result: ${simulateUntilEquilibrium(grid, false)}`)

  grid = initializeGrid(lines)
  console.log(`part 2 result: ${simulateUntilEquilibrium(grid, true)}`)
})

const printGrid = (grid: Grid) => {
  grid.forEach((row) => {
    console.log(row.join(""))
  })
}

const initializeGrid = (lines: string[]) => {
  let grid: Grid = []
  lines.forEach((l, rowIndex) => {
    grid[rowIndex] = []
    if (l.length >= 1) {
      l.split("").forEach((character, columnIndex) => {
        if (character === "." || character === "#" || character === "L") {
          grid[rowIndex][columnIndex] = character
        } else {
          throw new Error(`Unknown character: ${character}`)
        }
      })
    }
  })
  return grid
}

const simulateUntilEquilibrium = (
  grid: Grid,
  useAdvancedRules: boolean
): number => {
  while (true) {
    const { grid: newGrid, hasChanged } = simulateOneRound(
      grid,
      useAdvancedRules
    )
    grid = newGrid
    if (!hasChanged) {
      break
    }
  }
  return countOccupied(grid)
}

const countOccupied = (grid: Grid): number => {
  let occupiedCount = 0
  grid.forEach((row, rowIndex) => {
    row.forEach((place, colIndex) => {
      if (grid[rowIndex][colIndex] === "#") {
        occupiedCount++
      }
    })
  })
  return occupiedCount
}

const simulateOneRound = (
  grid: Grid,
  advancedRules: boolean
): { grid: Grid; hasChanged: boolean } => {
  const newGrid: Grid = []
  let hasChanged = false
  const rule1Function = advancedRules
    ? hasNoOccupiedSeatsAroundInSight
    : hasNoOccupiedSeatsAround
  const rule2Function = advancedRules
    ? hasMoreThanFiveOccupiedSeatsInSight
    : hasMoreThanFourOccupiedSeatsAround
  grid.forEach((row, rowIndex) => {
    newGrid[rowIndex] = []
    row.forEach((place, colIndex) => {
      let newPlace = place
      if (place === "L") {
        newPlace = rule1Function({ rowIndex, colIndex, grid }) ? "#" : "L"
      } else if (place === "#") {
        newPlace = rule2Function({
          rowIndex,
          colIndex,
          grid,
        })
          ? "L"
          : "#"
      }
      newGrid[rowIndex][colIndex] = newPlace
      if (newPlace !== place) {
        hasChanged = true
      }
    })
  })

  return { grid: newGrid, hasChanged }
}

const neighborOffsets = [
  [-1, -1],
  [-1, 0],
  [-1, +1],
  [0, -1],
  [0, +1],
  [+1, -1],
  [+1, 0],
  [+1, +1],
]

// TASK 1 Methods
const hasNoOccupiedSeatsAround = ({ rowIndex, colIndex, grid }): boolean =>
  neighborOffsets.every(([rowOffset, colOffset]) => {
    const otherPlaceRowIndex = rowIndex + rowOffset
    const otherPlaceColIndex = colIndex + colOffset

    if (otherPlaceRowIndex < 0 || otherPlaceRowIndex >= grid.length) {
      return true
    }
    if (otherPlaceColIndex < 0 || otherPlaceColIndex >= grid[0].length) {
      return true
    }
    return grid[otherPlaceRowIndex][otherPlaceColIndex] !== "#"
  })

const hasMoreThanFourOccupiedSeatsAround = ({
  rowIndex,
  colIndex,
  grid,
}): boolean =>
  neighborOffsets.filter(([rowOffset, colOffset]) => {
    const otherPlaceRowIndex = rowIndex + rowOffset
    const otherPlaceColIndex = colIndex + colOffset

    if (otherPlaceRowIndex < 0 || otherPlaceRowIndex >= grid.length) {
      return false
    }
    if (otherPlaceColIndex < 0 || otherPlaceColIndex >= grid[0].length) {
      return false
    }
    return grid[otherPlaceRowIndex][otherPlaceColIndex] === "#"
  }).length >= 4

// TASK 2 methods
const getFirstVisiblePlace = (
  [rowOffset, colOffset],
  [rowIndex, colIndex],
  grid
): Place => {
  let currentPlace: Place
  let extensionCount = 1
  while (currentPlace !== "#" && currentPlace !== "L") {
    // extend line of sight one step further
    const otherPlaceRowIndex = rowIndex + rowOffset * extensionCount
    const otherPlaceColIndex = colIndex + colOffset * extensionCount

    // check if of out of bounds
    if (otherPlaceRowIndex < 0 || otherPlaceRowIndex >= grid.length) {
      break
    }
    if (otherPlaceColIndex < 0 || otherPlaceColIndex >= grid[0].length) {
      break
    }

    currentPlace = grid[otherPlaceRowIndex][otherPlaceColIndex]
    extensionCount++
  }
  return currentPlace
}

const hasNoOccupiedSeatsAroundInSight = ({
  rowIndex,
  colIndex,
  grid,
}): boolean =>
  neighborOffsets.every(([rowOffset, colOffset]) => {
    const otherPlace = getFirstVisiblePlace(
      [rowOffset, colOffset],
      [rowIndex, colIndex],
      grid
    )
    return otherPlace !== "#"
  })

const hasMoreThanFiveOccupiedSeatsInSight = ({
  rowIndex,
  colIndex,
  grid,
}): boolean =>
  neighborOffsets.filter(([rowOffset, colOffset]) => {
    const otherPlace = getFirstVisiblePlace(
      [rowOffset, colOffset],
      [rowIndex, colIndex],
      grid
    )
    return otherPlace === "#"
  }).length >= 5
