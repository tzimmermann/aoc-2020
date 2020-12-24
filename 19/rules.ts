import { readFile } from "fs"

type Rule = {
  text: string
  token?: "a" | "b"
  matchRules: ([string] | [string, string] | [string, string, string])[]
}

type RuleMap = {
  [key: string]: Rule
}

const terminalRuleRegEx = /^"(a|b)"$/
const plainRuleRegEx = /^(\d+) (\d+)$/
const plainTripleRuleRegEx = /^(\d+) (\d+) (\d+)$/
const plainSingleRuleRegEx = /^(\d+)$/
const alternativeSingleRuleRegEx = /^(\d+) \| (\d+)$/
const alternativeRuleRegEx = /^(\d+) (\d+) \| (\d+) (\d+)$/

readFile("19/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const [ruleText, messages] = data.split("\n\n")

  const rules: RuleMap = {}
  ruleText.split("\n").forEach((ruleString) => {
    if (ruleString.length === 0) {
      return
    }
    const [ruleNumber, ruleDefinition] = ruleString.split(": ")

    const rule: Rule = {
      text: ruleDefinition.replace(/"/g, ""),
      matchRules: [],
    }

    if (plainRuleRegEx.test(ruleDefinition)) {
      const [match, rule1, rule2] = ruleDefinition.match(plainRuleRegEx)
      rule.matchRules.push([rule1, rule2])
    } else if (plainSingleRuleRegEx.test(ruleDefinition)) {
      const [match, rule1] = ruleDefinition.match(plainSingleRuleRegEx)
      rule.matchRules.push([rule1])
    } else if (plainTripleRuleRegEx.test(ruleDefinition)) {
      const [match, rule1, rule2, rule3] = ruleDefinition.match(
        plainTripleRuleRegEx
      )
      rule.matchRules.push([rule1, rule2, rule3])
    } else if (alternativeRuleRegEx.test(ruleDefinition)) {
      const [
        match,
        firstRule1,
        firstRule2,
        alternativeRule1,
        alternativeRule2,
      ] = ruleDefinition.match(alternativeRuleRegEx)
      rule.matchRules.push([firstRule1, firstRule2])
      rule.matchRules.push([alternativeRule1, alternativeRule2])
    } else if (alternativeSingleRuleRegEx.test(ruleDefinition)) {
      const [match, firstRule1, alternativeRule1] = ruleDefinition.match(
        alternativeSingleRuleRegEx
      )
      rule.matchRules.push([firstRule1])
      rule.matchRules.push([alternativeRule1])
    } else if (terminalRuleRegEx.test(ruleDefinition)) {
      const [match, token] = ruleDefinition.match(terminalRuleRegEx)
      if (token === "a" || token === "b") {
        rule.token = token
      } else {
        throw new Error(`Invalid token: ${token}`)
      }
    } else {
      throw new Error(`Cannot parse rule: ${ruleDefinition}`)
    }

    rules[ruleNumber] = rule
  })

  const resolvedEegExpPart1 = generateRegExpFromRules(rules, false)

  let numMatches = 0
  messages.split("\n").forEach((message) => {
    if (resolvedEegExpPart1.test(message)) {
      numMatches++
    }
  })
  console.log("part 1 result: ", numMatches)

  const resolvedEegExpPart2 = generateRegExpFromRules(rules, true)

  numMatches = 0
  messages.split("\n").forEach((message) => {
    if (resolvedEegExpPart2.test(message)) {
      numMatches++
    }
  })
  console.log("part 2 result: ", numMatches)
})

const generateRegExpFromRules = (
  rules: RuleMap,
  withLoopRules: boolean
): RegExp => {
  let prevRule
  let resolvedRule = `^${rules["0"].text}$`
  do {
    prevRule = resolvedRule
    // replace any rule number with its pattern, removing leading/trailing whitespace.
    resolvedRule = resolvedRule.replace(/ ?(\d+) ?/, (_, ruleNumber) => {
      const rule = rules[ruleNumber]
      if (rule.token) {
        return rule.token
      }
      if (withLoopRules) {
        if (ruleNumber === "8") {
          // loop role: should have meaning 8: 42 | 42 8, so 42+
          return `(42+)`
        }
        if (ruleNumber === "11") {
          // loop role: should have meaning 11: 42 31 | 42 11 31
          // not expressible in a regular language, thus multply out the first several cases
          return `(42 31 | 42 42 31 31 | 42 42 42 31 31 31 | 42 42 42 42 31 31 31 31)`
        }
      }
      const childRule = rule.matchRules
        .map((matchRule) => {
          return `(${matchRule.join(" ")})`
        })
        .join("|")
      return `(${childRule})`
    })
  } while (resolvedRule !== prevRule)

  return new RegExp(resolvedRule)
}
