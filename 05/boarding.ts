import { readFile } from "fs"

type Seat = {
  row: number
  column: number
  seatId: number
}

type Range = {
  from: number
  to: number
}

const cutInHalf = (range: Range, isUpper: boolean): Range => {
  const numItems = range.to - range.from + 1
  const half = numItems / 2 // *Should* always be integer
  return {
    from: isUpper ? range.from + half : range.from,
    to: isUpper ? range.to : range.to - half,
  }
}

const getRowNumber = (rowChars: string): number => {
  let rowRange = {
    from: 0,
    to: 127,
  }

  for (let rowChar of rowChars) {
    if (rowChar === "F") {
      rowRange = cutInHalf(rowRange, false)
    } else if (rowChar === "B") {
      rowRange = cutInHalf(rowRange, true)
    } else {
      throw new Error(`Unexpected char: ${rowChar}`)
    }
  }

  return rowRange.from
}

const getColumnNumber = (columnChars: string): number => {
  let columnRange = {
    from: 0,
    to: 7,
  }

  for (let columnChar of columnChars) {
    if (columnChar === "L") {
      columnRange = cutInHalf(columnRange, false)
    } else if (columnChar === "R") {
      columnRange = cutInHalf(columnRange, true)
    } else {
      throw new Error(`Unexpected char: ${columnChar}`)
    }
  }

  return columnRange.from
}

const getSeat = (seatInput: string): Seat => {
  const rowChars = seatInput.substring(0, 7)
  const columnChars = seatInput.substring(7)

  const rowNumber = getRowNumber(rowChars)
  const columnNumber = getColumnNumber(columnChars)

  return {
    row: rowNumber,
    column: columnNumber,
    seatId: rowNumber * 8 + columnNumber,
  }
}

readFile("05/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const boardingPasses = data.split("\n")

  const seats: Seat[] = []
  boardingPasses.forEach((pass) => {
    if (pass.length === 10) {
      seats.push(getSeat(pass))
    }
  })

  seats.sort((seatA, seatB) => {
    return seatA.seatId - seatB.seatId
  })

  // Highest ID at the start
  seats.reverse()
  const seatIds = seats.map((seat) => seat.seatId)
  const highesSeatId = seatIds[0]

  console.log("Highest seat ID: ", highesSeatId)

  seatIds.forEach((seatId, index) => {
    if (highesSeatId - index !== seatId) {
      throw new Error(`missing seat ID ${highesSeatId - index}`)
    }
  })
})
