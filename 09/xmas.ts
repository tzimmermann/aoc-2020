import { readFile } from "fs"

readFile("09/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n")
  const numbers: number[] = []
  lines.forEach((line) => {
    if (line.length > 0) {
      numbers.push(parseInt(line, 10))
    }
  })

  const WINDOW_SIZE = 25

  let invalidNumber: number
  for (let index = WINDOW_SIZE; index < numbers.length; index++) {
    const sum = numbers[index]
    if (!isSumOfTwoNumbers(sum, numbers.slice(index - WINDOW_SIZE, index))) {
      invalidNumber = sum
      break
    }
  }

  console.log("step1: found invalid number ", invalidNumber)

  let foundWeakness = false
  let weakness: number
  for (let rangeSize = 2; rangeSize < numbers.length; rangeSize++) {
    for (
      let rangeStart = 0;
      rangeStart <= numbers.length - rangeSize;
      rangeStart++
    ) {
      const slidingWindow = numbers.slice(rangeStart, rangeStart + rangeSize)
      if (isSumOfNumbers(invalidNumber, slidingWindow)) {
        slidingWindow.sort((a, b) => a - b)
        weakness = slidingWindow[0] + slidingWindow[slidingWindow.length - 1]
        foundWeakness = true
      }
      if (foundWeakness) {
        break
      }
    }
    if (foundWeakness) {
      break
    }
  }

  console.log("step2: found weakness ", weakness)
})

const isSumOfTwoNumbers = (sum: number, candidates: number[]): boolean => {
  let match = false
  candidates.forEach((candidate1) => {
    candidates.forEach((candidate2) => {
      if (candidate1 + candidate2 === sum && candidate1 !== candidate2) {
        match = true
      }
    })
  })
  return match
}

const isSumOfNumbers = (sum: number, candidates: number[]): boolean => {
  let candidateSum = candidates.reduce(
    (total, candidate) => total + candidate,
    0
  )
  return candidateSum === sum
}
