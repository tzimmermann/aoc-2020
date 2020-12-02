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
      const [, lowerBound, upperBound, targetLetter, password] = l.match(
        /(\d+)-(\d+) ([a-z]): ([a-z]+)/
      )
      // console.log("lowerBound", lowerBound)
      // console.log("upperBound", upperBound)
      // console.log("targetLetter", targetLetter)
      // console.log("password", password)
      const targetMatches = password.match(new RegExp(targetLetter, "g"))
      // console.log("targetMatches", targetMatches)
      if (
        targetMatches &&
        targetMatches.length >= parseInt(lowerBound, 10) &&
        targetMatches.length <= parseInt(upperBound, 10)
      ) {
        // console.log("valid password: ", password)
        validCount++
      } else {
        invalidCount++
        // console.log("INVALID password: ", password)
      }
    }
  })

  console.log("invalid count: ", invalidCount)
  console.log("valid count: ", validCount)
})
