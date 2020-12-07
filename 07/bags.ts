import { readFile } from "fs"

type QuantitativeBag = {
  bag: Bag
  quantity: number
}

type Bag = {
  color: string
  contains?: QuantitativeBag[]
}

const ruleMatcher = /(\d+) ([a-z ]+) bags?/g

const parseBagRule = (
  ruleColor: string,
  ruleString: string,
  knownBags: Bag[]
) => {
  let ruleMatch
  const bag = knownBags.find(({ color }) => color === ruleColor)

  while ((ruleMatch = ruleMatcher.exec(ruleString)) !== null) {
    const [, quantity, matchColor] = ruleMatch
    if (typeof quantity === "string" && typeof matchColor === "string") {
      bag.contains.push({
        bag: knownBags.find(({ color }) => color === matchColor),
        quantity: parseInt(quantity, 10),
      })
    }
  }
}

readFile("07/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n")

  const knownBags: Bag[] = []
  lines.forEach((line) => {
    if (line.length >= 1) {
      const [color] = line.split(" bags contain ")
      knownBags.push({
        color,
        contains: [],
      })
    }
  })

  lines.forEach((line) => {
    const [color, ruleString] = line.split(" bags contain ")
    parseBagRule(color, ruleString, knownBags)
  })

  const TARGET_COLOR = "shiny gold"

  const contaningTarget = knownBags.reduce((count, bag) => {
    if (bag.color === TARGET_COLOR) {
      // target bag cannot contain itself
      return count
    }
    return count + canContainColor(bag, TARGET_COLOR)
  }, 0)

  console.log(`bags containing ${TARGET_COLOR}:`, contaningTarget)

  // PART 2
  const targetBag = knownBags.find(({ color }) => color === TARGET_COLOR)

  // Off-by-one b/c we start with total = 1 (for mathematical reasons)
  const totalTargetBagCount = countChildBags(targetBag, 1) - 1
  console.log(
    `total required bags containing ${TARGET_COLOR}:`,
    totalTargetBagCount
  )
})

const canContainColor = (bag: Bag, color: string) => {
  if (bag.color === color) {
    return 1
  }
  if (bag.contains.length === 0) {
    return 0
  }
  return bag.contains.reduce(
    (containFlag, { bag: childBag }) =>
      Math.max(containFlag, canContainColor(childBag, color)),
    0
  )
}

const countChildBags = (bag: Bag, total: number) => {
  if (bag.contains.length === 0) {
    return total
  }

  return (
    total +
    bag.contains.reduce(
      (containSum, { bag: childBag, quantity }) =>
        containSum + countChildBags(childBag, quantity * total),
      0
    )
  )
}
