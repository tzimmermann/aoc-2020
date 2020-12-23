import { readFile } from "fs"

type Operation = {
  operand?: number
  operator: "+" | "*" | "(" | ")" | "R"
  level: number
}

const applyAdditions = (term: string): string => {
  let newTerm = term
  let prevTerm: string
  do {
    prevTerm = newTerm
    // Apply simple additions until none are left
    newTerm = prevTerm
      .replace(/(\d+) \+ (\d+)/, (match, group1, group2) => {
        return `${
          parseInt(group1 as string, 10) + parseInt(group2 as string, 10)
        }`
      })
      // Remove superfluous brackets
      .replace(/\((\d+)\)/g, (match, group1, group2) => {
        return group1
      })
  } while (newTerm !== prevTerm)
  return newTerm
}

const applyMultiplicationOnce = (term: string): string =>
  term
    // We are only allowed to apply multiplications:
    // * at the end of a bracket-term
    //   a * b)
    // * when it's not followed by a + (higher precedence)
    //   YES: a * b * c
    //   NO: a * b + c
    .replace(/(\d+) \* (\d+)(\)| [^+]|$)/, (match, group1, group2, group3) => {
      return `${
        parseInt(group1 as string, 10) * parseInt(group2 as string, 10)
      }${group3}`
    })
    // Remove superfluous brackets
    .replace(/\((\d+)\)/g, (match, group1, group2) => {
      return group1
    })

readFile("18/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n")

  let resultSum = 0
  lines.forEach((line) => {
    let lastOperand: number = null
    let lastOperation: Operation = null
    const operationStack: Operation[] = []
    if (line.length === 0) {
      return
    }
    line.split("").forEach((symbol) => {
      if (symbol === " ") {
        return
      }
      if (/\d/.test(symbol)) {
        lastOperand = parseInt(symbol, 10)
        if (lastOperation) {
          lastOperand = calculate(lastOperation, lastOperand)
        }
      } else if (symbol === "+" || symbol === "*") {
        lastOperation = {
          operand: lastOperand,
          operator: symbol,
          level: 1,
        }
      } else if (symbol === "(") {
        operationStack.push(lastOperation)
        lastOperation = null
      } else if (symbol === ")") {
        lastOperation = operationStack.pop()
        if (lastOperation) {
          lastOperand = calculate(lastOperation, lastOperand)
        }
      } else {
        throw new Error(`Unknown symbol ${symbol}`)
      }
    })
    resultSum += lastOperand
  })

  console.log("part 1 result: ", resultSum)

  resultSum = 0
  lines.forEach((line) => {
    if (line.length === 0) {
      return
    }
    let lineAfter = line
    let prevLine: string
    do {
      prevLine = lineAfter
      // First need to apply all additions w/ two number operands as they have higher precedence
      lineAfter = applyAdditions(lineAfter)
      // Then apply **one** multiplication only (as it might result in new additions being available)
      lineAfter = applyMultiplicationOnce(lineAfter)
    } while (lineAfter !== prevLine)

    resultSum += parseInt(lineAfter, 10)
  })

  console.log("part 2 result:", resultSum)
})

const applyOperation = (operations: Operation[], lastOperand: number) => {
  let operation: Operation
  const newOperations: Operation[] = []
  let currentOperand = lastOperand
  for (let i = operations.length - 1; i >= 0; i--) {
    operation = operations[i]
    switch (operation.operator) {
      case "+":
        currentOperand += operation.operand
        operations.pop()

        break
      case "*":
        break
      case ")":
      case "(":
      default:
        // do nothing except removing from stack
        operations.pop()
    }
  }
}

const calculate = (operation: Operation, otherOperand: number): number =>
  operation.operator === "+"
    ? otherOperand + operation.operand
    : otherOperand * operation.operand
