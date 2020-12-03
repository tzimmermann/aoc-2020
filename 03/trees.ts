import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants"
import { readFile } from "fs"

const countTrees = (
  slope: { DOWN: number; RIGHT: number },
  lines: string[]
) => {
  const position = { row: 0, column: 0 }
  let treeCount = 0

  while (position.row < lines.length) {
    const line = lines[position.row]
    if (line.charAt(position.column % line.length) === "#") {
      treeCount++
    }
    position.row += slope.DOWN
    position.column += slope.RIGHT
  }

  return treeCount
}

readFile("03/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n")
  const SLOPES = [
    { RIGHT: 1, DOWN: 1 },
    { RIGHT: 3, DOWN: 1 },
    { RIGHT: 5, DOWN: 1 },
    { RIGHT: 7, DOWN: 1 },
    { RIGHT: 1, DOWN: 2 },
  ]

  const result = SLOPES.reduce((totalCount, SLOPE) => {
    return totalCount * countTrees(SLOPE, lines)
  }, 1)

  console.log(result)
})
