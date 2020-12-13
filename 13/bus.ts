import { time, timeStamp } from "console"
import { readFile } from "fs"

type BusSchedule = {
  busId: number
  difference: number
}

readFile("13/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n")
  const numbers: number[] = []

  const arrivalTimestamp = parseInt(lines[0], 10)
  const busses = lines[1]

  const ruleMatcher = /\d+/g
  let ruleMatch
  const busIds: number[] = []
  while ((ruleMatch = ruleMatcher.exec(busses)) !== null) {
    const [busId] = ruleMatch
    busIds.push(parseInt(busId, 10))
  }

  const differences = busIds.map((busId) => {
    const x = Math.ceil(arrivalTimestamp / busId)
    const difference = busId * x - arrivalTimestamp
    return {
      busId,
      difference,
    }
  })

  differences.sort((diff1, diff2) => diff1.difference - diff2.difference)

  const part1Result = differences[0].busId * differences[0].difference
  console.log("part 1 result: ", part1Result)

  let schedules: BusSchedule[] = busses.split(",").map((busId, index) => ({
    difference: index,
    busId: busId === "x" ? null : parseInt(busId, 10),
  }))

  schedules = schedules.filter(({ busId }) => busId !== null)
  // schedules
  // .sort(({ busId: busId1 }, { busId: busId2 }) => busId1 - busId2)
  // .reverse()

  let foundMatch = false
  const firstBusId = schedules[0].busId
  // const biggesBusDifference = schedules[0].difference
  let timestamp = 100000000000000
  while (!foundMatch) {
    // console.log("timestamp", timestamp)

    // let foundNewTimestamp = false
    // const newTimestamp = schedules.reduce(
    //   (newTimestamp, { difference, busId }) => {
    //     if (timestamp === 753780) {
    //       console.log("difference", difference)
    //       console.log("busId", busId)
    //     }
    //     if (foundNewTimestamp) {
    //       return newTimestamp
    //     }

    //     const busMissedBy = (timestamp + difference) % busId

    //     if (timestamp === 753780) {
    //       console.log("busMissedBy", busMissedBy)
    //     }

    //     if (busMissedBy > 0) {
    //       foundNewTimestamp = true
    //       if (timestamp === 753780) {
    //         console.log(
    //           "newTimestamp",
    //           timestamp + difference + (busId - busMissedBy)
    //         )
    //       }
    //       return timestamp + difference + (busId - busMissedBy)
    //     }
    //     return newTimestamp
    //   },
    //   timestamp
    // )

    // if (timestamp >= 754018) {
    //   console.log("exit", timestamp)
    //   break
    // }

    // if (foundNewTimestamp) {
    //   timestamp = newTimestamp
    //   continue
    // } else {
    //   console.log("Found match at ", timestamp)
    //   break
    // }

    foundMatch = schedules.every(({ busId, difference }) => {
      // console.log("timestamp", timestamp)
      // console.log("busId", busId)
      // console.log("difference", difference)
      // console.log(
      //   "(timestamp + difference) % busId",
      //   (timestamp + difference) % busId
      // )
      return busId === null || (timestamp + difference) % busId === 0
    })
    if (foundMatch) {
      break
    }
    timestamp += firstBusId
    if (timestamp % 1000000000 === 0) {
      console.log("got ", timestamp)
    }
  }

  console.log("part 2 result ", timestamp)
})
