import { readFile } from "fs"

type TreeNode = {
  joltage: number
  children: TreeNode[]
}

readFile("10/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const lines = data.split("\n")
  const adapters: number[] = []

  lines.forEach((l) => {
    if (l.length >= 1) {
      adapters.push(parseInt(l, 10))
    }
  })

  adapters.sort((a, b) => a - b)
  const highestJoltage = adapters[adapters.length - 1] + 3

  // add input and output at the beginning/end of the list
  adapters.push(highestJoltage)
  adapters.unshift(0)

  let joltage = adapters[0]

  let differences = [0, 0, 0, 0]

  while (joltage < highestJoltage) {
    const matchingAdapter = adapters.find(
      (adapter) =>
        adapter === joltage + 1 ||
        adapter === joltage + 2 ||
        adapter === joltage + 3
    )
    if (!matchingAdapter) {
      throw new Error(`Found no adapter ${joltage}`)
    }
    differences[matchingAdapter - joltage] += 1
    joltage = matchingAdapter
  }

  console.log("part1 result: ", differences[1] * differences[3])

  const nodeMap = new Map<number, TreeNode>()
  adapters.forEach((joltage) => {
    const treeNode = { joltage, children: [] }
    nodeMap.set(joltage, treeNode)
  })

  adapters.forEach((joltage) => {
    const treeNode = nodeMap.get(joltage)
    const children = getMatchingChildren(joltage, nodeMap)
    treeNode.children = children
  })

  // result cache to prevent deep recusion
  const pathCountCache = new Map<number, number>()

  const pathCount = countPaths(nodeMap.get(0), nodeMap, pathCountCache)
  console.log("part2 result: ", pathCount)
})

const countPaths = (
  currentNode: TreeNode,
  nodeMap: Map<number, TreeNode>,
  pathCountCache: Map<number, number>
): number => {
  if (currentNode.children.length === 0) {
    // leaf node
    return 1
  }
  return currentNode.children.reduce((sum, child) => {
    if (pathCountCache.has(child.joltage)) {
      return sum + pathCountCache.get(child.joltage)
    }
    const childCount = countPaths(child, nodeMap, pathCountCache)
    pathCountCache.set(child.joltage, childCount)
    return sum + childCount
  }, 0)
}

const getMatchingChildren = (
  joltage: number,
  nodeMap: Map<number, TreeNode>
): TreeNode[] => {
  const children: TreeNode[] = []
  ;[1, 2, 3].forEach((joltageOffset) => {
    if (nodeMap.has(joltage + joltageOffset)) {
      children.push(nodeMap.get(joltage + joltageOffset))
    }
  })
  return children
}
