import { Dir, readFile } from "fs"
import { isDebuggerStatement } from "typescript"

type Instruction = "N" | "S" | "E" | "W" | "L" | "R" | "F"
type Direction = "N" | "S" | "E" | "W"

type Command = {
  instruction: Instruction
  value: number
}

type Position = {
  facing: Direction
  x: number
  y: number
}

type Point = {
  x: number
  y: number
}

readFile("12/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n")
  const commands: Command[] = []

  lines.forEach((l) => {
    if (l.length >= 1) {
      const [, instruction, value] = l.match(/(\w)(\d+)/)
      if (INSTRUCTIONS.includes(instruction)) {
        commands.push({
          instruction: instruction as Instruction,
          value: parseInt(value, 10),
        })
      } else {
        throw new Error(`Unknown instruction ${instruction}`)
      }
    }
  })

  let position = runCommands(commands)
  console.log("part 1 solution: ", Math.abs(position.x) + Math.abs(position.y))

  position = runCommandsWithWaypoints(commands)
  console.log("part 2 solution: ", Math.abs(position.x) + Math.abs(position.y))
})

const runCommandsWithWaypoints = (commands: Command[]): Position => {
  const position: Position = {
    facing: "E",
    x: 0,
    y: 0,
  }
  const waypoint: Point = {
    x: 10,
    y: 1,
  }

  commands.forEach(({ instruction, value }) => {
    switch (instruction) {
      case "N":
      case "E":
      case "S":
      case "W":
        moveWaypoint(waypoint, instruction, value)
        break
      case "L":
      case "R":
        turnWaypoint(waypoint, instruction, value)
        break
      case "F":
        moveToWaypoint(position, waypoint, value)
        break
      default:
        break
    }
  })

  return position
}

const runCommands = (commands: Command[]): Position => {
  const position: Position = {
    facing: "E",
    x: 0,
    y: 0,
  }

  commands.forEach(({ instruction, value }) => {
    switch (instruction) {
      case "N":
      case "E":
      case "S":
      case "W":
        move(position, instruction, value)
        break
      case "L":
      case "R":
        turn(position, instruction, value)
        break
      case "F":
        move(position, position.facing, value)
        break
      default:
        break
    }
  })

  return position
}

const moveToWaypoint = (
  position: Position,
  waypoint: Point,
  value: number
): void => {
  position.x += waypoint.x * value
  position.y += waypoint.y * value
}

const moveWaypoint = (
  waypoint: Point,
  direction: Direction,
  value: number
): void => {
  switch (direction) {
    case "N":
      waypoint.y += value
      break
    case "E":
      waypoint.x += value
      break
    case "S":
      waypoint.y -= value
      break
    case "W":
      waypoint.x -= value
      break
    default:
      break
  }
}

const move = (
  position: Position,
  direction: Direction,
  value: number
): void => {
  switch (direction) {
    case "N":
      position.y += value
      break
    case "E":
      position.x += value
      break
    case "S":
      position.y -= value
      break
    case "W":
      position.x -= value
      break
    default:
      break
  }
}

const DIRECTIONS: Direction[] = ["N", "E", "S", "W"]
const INSTRUCTIONS = ["N", "S", "E", "W", "L", "R", "F"]

const turn = (
  position: Position,
  instruction: Instruction,
  degress: number
): void => {
  const rotateCount = degress / 90
  const oldDirectionIndex = DIRECTIONS.indexOf(position.facing)
  let newDirectionIndex =
    instruction === "R"
      ? oldDirectionIndex + rotateCount
      : oldDirectionIndex - rotateCount
  while (newDirectionIndex < 0) {
    newDirectionIndex += DIRECTIONS.length
  }
  position.facing = DIRECTIONS[newDirectionIndex % DIRECTIONS.length]
}

const turnWaypoint = (
  wayPoint: Point,
  instruction: Instruction,
  degress: number
): void => {
  for (let rotateCount = degress / 90; rotateCount > 0; rotateCount--) {
    const oldWaypointX = wayPoint.x
    wayPoint.x = wayPoint.y
    wayPoint.y = oldWaypointX
    if (instruction === "R") {
      wayPoint.y *= -1
    } else {
      wayPoint.x *= -1
    }
  }
}
