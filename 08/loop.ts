import { readFile } from "fs"

type Instruction = {
  operator: string
  operand: number
  hasRan: boolean
}

type ProgramResult = {
  terminated: boolean
  accumulator: number
}

const runProgram = (instructions: Instruction[]): ProgramResult => {
  let accumulator = 0
  let instructionPointer = 0
  let terminated = false
  while (true) {
    if (instructionPointer === instructions.length) {
      // behind the last instruction -> program run successfully
      terminated = true
      break
    }
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
  return {
    terminated,
    accumulator,
  }
}

const initializeInstructions = (lines: string[]) =>
  lines.map((line) => {
    const [operator, operand] = line.split(" ")
    return {
      operator,
      operand: parseInt(operand, 10),
      hasRan: false,
    }
  })

readFile("08/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n").filter((line) => line.length > 0)

  let instructions: Instruction[] = initializeInstructions(lines)

  const { accumulator } = runProgram(instructions)

  console.log("result part 1", accumulator)

  let terminatedAccumulator: number
  for (
    let instructionIndex = 0;
    instructionIndex < instructions.length;
    instructionIndex++
  ) {
    const swapInstruction = instructions[instructionIndex]
    if (swapInstruction.operator === "acc") {
      // do not swap 'acc' operators, only 'jmp' and 'nop
      continue
    }
    swapInstruction.operator =
      swapInstruction.operator === "jmp" ? "nop" : "jmp"

    const { terminated, accumulator } = runProgram(instructions)

    if (terminated) {
      terminatedAccumulator = accumulator
      break
    }

    instructions = initializeInstructions(lines)
  }

  console.log(
    `result part 2: accumulator at termination was ${terminatedAccumulator}`
  )
})
