const startingNumbers = [13, 0, 10, 12, 1, 5, 8]
// const startingNumbers = [0, 3, 6]

type NumberSpoken = {
  [key: number]: {
    lastSpokenAt: number
    diffToPrevSpoken: number
    spokenCount: number
  }
}

const playGame = (limit: number) => {
  const numbersSpoken: NumberSpoken = {}
  let lastNumberSpoken: number = null
  for (let turnCount = 1; turnCount <= limit; turnCount++) {
    if (turnCount <= startingNumbers.length) {
      // initial starting numbers are just spoken out
      const numberValue = startingNumbers[turnCount - 1]
      sayNumber(numberValue, turnCount, numbersSpoken)
      lastNumberSpoken = numberValue
    } else {
      if (spokenForTheFirstTime(lastNumberSpoken, numbersSpoken)) {
        sayNumber(0, turnCount, numbersSpoken)
        lastNumberSpoken = 0
      } else {
        const turnsApart = getDifferenceFromPreviousSpeak(
          lastNumberSpoken,
          numbersSpoken
        )
        sayNumber(turnsApart, turnCount, numbersSpoken)
        lastNumberSpoken = turnsApart
      }
    }
  }
  return lastNumberSpoken
}

const getDifferenceFromPreviousSpeak = (
  numberToFind: number,
  numbersSpoken: NumberSpoken
): number => {
  const numberSpoken = numbersSpoken[numberToFind]
  if (!numberSpoken) {
    throw new Error(`Expected to find number ${numberSpoken}`)
  }
  return numberSpoken.diffToPrevSpoken
}

const spokenForTheFirstTime = (
  numberToFind: number,
  numbersSpoken: NumberSpoken
): boolean =>
  numbersSpoken[numberToFind] && numbersSpoken[numberToFind].spokenCount === 1

const sayNumber = (
  numberToSay: number,
  turnCount: number,
  numbersSpoken: NumberSpoken
) => {
  const numberSpoken = numbersSpoken[numberToSay]
  if (numberSpoken) {
    numberSpoken.diffToPrevSpoken = turnCount - numberSpoken.lastSpokenAt
    numberSpoken.lastSpokenAt = turnCount
    numberSpoken.spokenCount += 1
  } else {
    numbersSpoken[numberToSay] = {
      lastSpokenAt: turnCount,
      diffToPrevSpoken: 0,
      spokenCount: 1,
    }
  }
}

const result1 = playGame(2020)
console.log("result part 1", result1)

const result2 = playGame(30000000)
console.log("result part 2", result2)
