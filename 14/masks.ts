import { readFile } from "fs"

type Command = {
  command: string
  value: string
}

readFile("14/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n")
  const commands: Command[] = []
  lines.forEach((l) => {
    if (l.length >= 1) {
      const [command, value] = l.split(" = ")
      commands.push({
        command,
        value,
      })
    }
  })

  const memTask1 = {}
  const memTask2 = {}
  let currentMask: string = null
  commands.forEach(({ command, value }) => {
    if (command === "mask") {
      currentMask = value
    } else {
      const [, memAddress] = command.match(/mem\[(\d+)\]/)
      const decimalValue = parseInt(value, 10)
      applyMask(memTask1, parseInt(memAddress, 10), currentMask, decimalValue)
      applyMaskWithAddressDecoder(
        memTask2,
        parseInt(memAddress, 10),
        currentMask,
        decimalValue
      )
    }
  })

  let sumTask1 = 0
  for (let address in memTask1) {
    sumTask1 += memTask1[address]
  }
  console.log("part 1 result: ", sumTask1)

  let sumTask2 = 0
  for (let address in memTask2) {
    sumTask2 += memTask2[address]
  }
  console.log("part 2 result: ", sumTask2)
})

const applyMaskWithAddressDecoder = (
  memory: object,
  memAddress: number,
  bitmask: string,
  targetValue: number
): void => {
  const memAddressValue = memAddress.toString(2).padStart(36, "0")
  const resultParts = []
  for (let i = 0; i < bitmask.length; i++) {
    const maskDigit = bitmask.charAt(i)
    const memAddressDigit = memAddressValue.charAt(i)
    switch (maskDigit) {
      case "0":
        resultParts.push(memAddressDigit)
        break
      case "1":
        resultParts.push("1")
        break
      case "X":
        resultParts.push("F")
        break
    }
  }
  const newMemAddress = resultParts.join("")
  const addresses = generateFloatingAddresses(newMemAddress)
  addresses.forEach((address) => {
    memory[address] = targetValue
  })
}

const generateFloatingAddresses = (memAddress: string): number[] => {
  const addresses: number[] = []
  const floatingIndices = memAddress
    .split("")
    .map((x, index) => (x === "F" ? index : null))
  const floatingCount = floatingIndices.filter((x) => x !== null).length
  const permutationCount = Math.pow(2, floatingCount)
  const permutations: string[] = []
  for (let permutation = 0; permutation < permutationCount; permutation++) {
    permutations.push(permutation.toString(2))
  }
  permutations.forEach((permutation) => {
    let newMemAddress = memAddress
    const permutationPadded = permutation.padStart(floatingCount, "0")
    permutationPadded.split("").forEach((permutationBit) => {
      newMemAddress = newMemAddress.replace("F", permutationBit)
    })
    addresses.push(parseInt(newMemAddress, 2))
  })
  return addresses
}

const applyMask = (
  memory: object,
  memAddress: number,
  bitmask: string,
  targetValue: number
): void => {
  const binaryValue = targetValue.toString(2).padStart(36, "0")
  const resultParts = []
  for (let i = 0; i < bitmask.length; i++) {
    const maskDigit = bitmask.charAt(i)
    const valueDigit = binaryValue.charAt(i)
    if (maskDigit === "X") {
      resultParts.push(valueDigit)
    } else {
      resultParts.push(maskDigit)
    }
  }
  memory[memAddress] = parseInt(resultParts.join(""), 2)
}
