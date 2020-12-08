import { readFile } from "fs"

type Instruction = {
  operator: string
  operand: number
  hasRan: boolean
}

readFile("08/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n").filter((line) => line.length > 0)
  const instructions: Instruction[] = lines.map((line) => {
    const [operator, operand] = line.split(" ")
    console.log("line", line)
    return {
      operator,
      operand: parseInt(operand, 10),
      hasRan: false,
    }
  })

  let accumulator = 0
  let instructionPointer = 0
  while (true) {
    const currentInstuction = instructions[instructionPointer]
    if (currentInstuction.hasRan) {
      break
    } else {
      currentInstuction.hasRan = true
    }
    if (currentInstuction.operator === "nop") {
      instructionPointer++
    } else if (currentInstuction.operator === "acc") {
      accumulator += currentInstuction.operand
      instructionPointer++
    } else if (currentInstuction.operator === "jmp") {
      instructionPointer += currentInstuction.operand
    }
  }

  console.log("accumulator", accumulator)
})
