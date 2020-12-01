import { readFile } from "fs"

readFile("01a/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n")
  const numbers: number[] = []

  lines.forEach((l) => {
    if (l.length >= 1) {
      numbers.push(parseInt(l, 10))
    }
  })

  numbers.forEach((n) => {
    const missingNumber = 2020 - n
    numbers.forEach((n2) => {
      const innerMissing = missingNumber - n2
      if (numbers.includes(innerMissing)) {
        console.log(
          `Found ${n}, ${n2} and ${innerMissing}, product: ${
            n * n2 * innerMissing
          }, sum: ${n + n2 + innerMissing}`
        )
      }
    })
  })

  // console.log(numbers)
})
