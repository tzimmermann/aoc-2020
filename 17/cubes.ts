import { readFile } from "fs"

type Cube = {
  xIndex: number
  yIndex: number
  zIndex: number
  wIndex: number
  active: boolean
}

const print = (cubes: Cube[]): void => {
  const { minX, maxX, minY, maxY, minZ, maxZ, minW, maxW } = getMinMaxValues(
    cubes
  )
  for (let w = minW; w <= maxW; w++) {
    for (let z = minZ; z <= maxZ; z++) {
      console.log(`z=${z}, w=${w}`)
      for (let y = minY; y <= maxY; y++) {
        const symbols: string[] = []
        for (let x = minX; x <= maxX; x++) {
          const cube = findCube(x, y, z, 0, cubes)
          symbols.push(cube.active ? "#" : ".")
        }
        console.log(symbols.join(""))
      }
      console.log("")
    }
  }
}

readFile("17/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n")

  let activeCubes = initializeGrid(lines)
  for (let cycle = 0; cycle < 6; cycle++) {
    activeCubes = simulateCycle(activeCubes)
  }
  console.log(
    "part 1 result: ",
    activeCubes.filter((cube) => cube.active).length
  )

  activeCubes = initializeGrid(lines)
  for (let cycle = 0; cycle < 6; cycle++) {
    activeCubes = simulate4DCycle(activeCubes)
  }
  console.log(
    "part 2 result: ",
    activeCubes.filter((cube) => cube.active).length
  )
})

const simulateCycle = (activeCubes: Cube[]): Cube[] => {
  const { minX, maxX, minY, maxY, minZ, maxZ } = getMinMaxValues(activeCubes)
  const newActiveCubes: Cube[] = []
  for (let z = minZ - 1; z <= maxZ + 1; z++) {
    for (let y = minY - 1; y <= maxY + 1; y++) {
      for (let x = minX - 1; x <= maxX + 1; x++) {
        const currentCube: Cube = findCube(x, y, z, 0, activeCubes)
        const activeNeighbors = getActiveNeighbors(currentCube, activeCubes)

        let newActive
        if (currentCube.active) {
          newActive =
            activeNeighbors.length === 2 || activeNeighbors.length === 3
        } else {
          newActive = activeNeighbors.length === 3
        }
        if (newActive) {
          newActiveCubes.push({
            ...currentCube,
            active: newActive,
          })
        }
      }
    }
  }
  return newActiveCubes
}

const simulate4DCycle = (activeCubes: Cube[]): Cube[] => {
  const { minX, maxX, minY, maxY, minZ, maxZ, minW, maxW } = getMinMaxValues(
    activeCubes
  )
  const newActiveCubes: Cube[] = []
  for (let w = minW - 1; w <= maxW + 1; w++) {
    for (let z = minZ - 1; z <= maxZ + 1; z++) {
      for (let y = minY - 1; y <= maxY + 1; y++) {
        for (let x = minX - 1; x <= maxX + 1; x++) {
          const currentCube: Cube = findCube(x, y, z, w, activeCubes)
          const activeNeighbors = getActive4DNeighbors(currentCube, activeCubes)

          let newActive
          if (currentCube.active) {
            newActive =
              activeNeighbors.length === 2 || activeNeighbors.length === 3
          } else {
            newActive = activeNeighbors.length === 3
          }
          if (newActive) {
            newActiveCubes.push({
              ...currentCube,
              active: newActive,
            })
          }
        }
      }
    }
  }
  return newActiveCubes
}

const findCube = (
  x: number,
  y: number,
  z: number,
  w: number,
  cubes: Cube[]
): Cube =>
  cubes.find(
    (activeCube) =>
      activeCube.xIndex === x &&
      activeCube.yIndex === y &&
      activeCube.zIndex === z &&
      activeCube.wIndex === w
  ) || {
    xIndex: x,
    yIndex: y,
    zIndex: z,
    wIndex: w,
    active: false,
  }

const getActiveNeighbors = (cube: Cube, activeCubes: Cube[]): Cube[] => {
  const activeNeighbors: Cube[] = []

  neighborOffsets.forEach(([xOffset, yOffset, zOffset]) => {
    const targetZ = cube.zIndex + zOffset
    const targetY = cube.yIndex + yOffset
    const targetX = cube.xIndex + xOffset
    const neighbor = findCube(targetX, targetY, targetZ, 0, activeCubes)
    if (neighbor.active) {
      activeNeighbors.push(neighbor)
    }
  })

  return activeNeighbors
}

const getActive4DNeighbors = (cube: Cube, activeCubes: Cube[]): Cube[] => {
  const activeNeighbors: Cube[] = []

  neighbor4DOffsets.forEach(([xOffset, yOffset, zOffset, wOffset]) => {
    const targetZ = cube.zIndex + zOffset
    const targetY = cube.yIndex + yOffset
    const targetX = cube.xIndex + xOffset
    const targetW = cube.wIndex + wOffset
    const neighbor = findCube(targetX, targetY, targetZ, targetW, activeCubes)
    if (neighbor.active) {
      activeNeighbors.push(neighbor)
    }
  })

  return activeNeighbors
}

const getMinMaxValues = (cubes: Cube[]) => {
  let minX = Number.MAX_SAFE_INTEGER
  let maxX = 0
  let minY = Number.MAX_SAFE_INTEGER
  let maxY = 0
  let minZ = Number.MAX_SAFE_INTEGER
  let maxZ = 0
  let minW = Number.MAX_SAFE_INTEGER
  let maxW = 0
  cubes.forEach((cube) => {
    minX = Math.min(minX, cube.xIndex)
    minY = Math.min(minY, cube.yIndex)
    minZ = Math.min(minZ, cube.zIndex)
    minW = Math.min(minW, cube.wIndex)
    maxX = Math.max(maxX, cube.xIndex)
    maxY = Math.max(maxY, cube.yIndex)
    maxZ = Math.max(maxZ, cube.zIndex)
    maxW = Math.max(maxW, cube.wIndex)
  })
  return {
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
    minW,
    maxW,
  }
}

const initializeGrid = (lines: string[]): Cube[] => {
  const activeCubes: Cube[] = []
  let zIndex = 0
  let wIndex = 0
  lines.forEach((line, yIndex) => {
    if (line.length === 0) {
      return
    }
    if (line.length >= 1) {
      line.split("").forEach((symbol, xIndex) => {
        if (symbol === "#") {
          activeCubes.push({
            xIndex,
            yIndex,
            zIndex,
            wIndex,
            active: true,
          })
        }
      })
    }
  })

  return activeCubes
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
  [-1, -1, +1],
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

const neighbor4DOffsets = [
  [0, 0, 0, -1],
  [0, 0, 0, +1],
  [0, 0, -1, 0],
  [0, 0, -1, -1],
  [0, 0, -1, +1],
  [0, 0, +1, 0],
  [0, 0, +1, -1],
  [0, 0, +1, +1],
  [0, -1, 0, 0],
  [0, -1, 0, -1],
  [0, -1, 0, +1],
  [0, -1, -1, 0],
  [0, -1, -1, -1],
  [0, -1, -1, +1],
  [0, -1, +1, 0],
  [0, -1, +1, -1],
  [0, -1, +1, +1],
  [0, +1, 0, 0],
  [0, +1, 0, -1],
  [0, +1, 0, +1],
  [0, +1, -1, 0],
  [0, +1, -1, -1],
  [0, +1, -1, +1],
  [0, +1, +1, 0],
  [0, +1, +1, -1],
  [0, +1, +1, +1],
  [-1, 0, 0, 0],
  [-1, 0, 0, -1],
  [-1, 0, 0, +1],
  [-1, 0, -1, 0],
  [-1, 0, -1, -1],
  [-1, 0, -1, +1],
  [-1, 0, +1, 0],
  [-1, 0, +1, -1],
  [-1, 0, +1, +1],
  [-1, -1, 0, 0],
  [-1, -1, 0, -1],
  [-1, -1, 0, +1],
  [-1, -1, -1, 0],
  [-1, -1, -1, -1],
  [-1, -1, -1, +1],
  [-1, -1, +1, 0],
  [-1, -1, +1, -1],
  [-1, -1, +1, +1],
  [-1, +1, 0, 0],
  [-1, +1, 0, -1],
  [-1, +1, 0, +1],
  [-1, +1, -1, 0],
  [-1, +1, -1, -1],
  [-1, +1, -1, +1],
  [-1, +1, +1, 0],
  [-1, +1, +1, -1],
  [-1, +1, +1, +1],
  [+1, 0, 0, 0],
  [+1, 0, 0, -1],
  [+1, 0, 0, +1],
  [+1, 0, -1, 0],
  [+1, 0, -1, -1],
  [+1, 0, -1, +1],
  [+1, 0, +1, 0],
  [+1, 0, +1, -1],
  [+1, 0, +1, +1],
  [+1, -1, 0, 0],
  [+1, -1, 0, -1],
  [+1, -1, 0, +1],
  [+1, -1, -1, 0],
  [+1, -1, -1, -1],
  [+1, -1, -1, +1],
  [+1, -1, +1, 0],
  [+1, -1, +1, -1],
  [+1, -1, +1, +1],
  [+1, +1, 0, 0],
  [+1, +1, 0, -1],
  [+1, +1, 0, +1],
  [+1, +1, -1, 0],
  [+1, +1, -1, -1],
  [+1, +1, -1, +1],
  [+1, +1, +1, 0],
  [+1, +1, +1, -1],
  [+1, +1, +1, +1],
]
