import { readFile } from "fs"

readFile("02/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n")
  const numbers: number[] = []
  let invalidCount = 0
  let validCount = 0
  lines.forEach((l) => {
    if (l.length >= 1) {
      const [, firstIndex, secondIndex, targetLetter, password] = l.match(
        /(\d+)-(\d+) ([a-z]): ([a-z]+)/
      )
      // console.log("lowerBound", lowerBound)
      // console.log("upperBound", upperBound)
      // console.log("targetLetter", targetLetter)
      // console.log("password", password)
      const targetChars = [
        password.charAt(parseInt(firstIndex, 10) - 1),
        password.charAt(parseInt(secondIndex, 10) - 1),
      ]

      if (
        (targetChars[0] === targetLetter && targetChars[1] !== targetLetter) ||
        (targetChars[1] === targetLetter && targetChars[0] !== targetLetter)
      ) {
        validCount++
      } else {
        invalidCount++
      }
      // console.log("targetMatches", targetMatches)
    }
  })

  console.log("invalid count: ", invalidCount)
  console.log("valid count: ", validCount)
})
