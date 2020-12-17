import { readFile } from "fs"

type Interval = {
  from: number
  to: number
}

type Rule = {
  name: string
  validIntervals: Interval[]
}

type Ticket = {
  numbers: number[]
}

readFile("16/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const [
    ruleDefinitons,
    myTicketDefinition,
    nearbyTicketDefinitions,
  ] = data.split("\n\n")
  const rules = parseRules(ruleDefinitons)
  const myTicket = parseTickets(myTicketDefinition)
  const nearbyTickets = parseTickets(nearbyTicketDefinitions)

  const nearbyErrorRate = computeErrorRate(rules, nearbyTickets)
  // console.log("nearbyTickets", nearbyTickets)
  console.log("part 1 result", nearbyErrorRate)

  const validTickets = getValidTickets(rules, nearbyTickets)

  const fieldCount = validTickets[0].numbers.length

  const fields: number[][] = []
  for (let fieldIndex = 0; fieldIndex < fieldCount; fieldIndex++) {
    fields.push(validTickets.map((ticket) => ticket.numbers[fieldIndex]))
  }

  const fieldOrder: string[] = getFieldOrder(fields, rules)

  console.log("fieldOrder:", fieldOrder)
})

const getFieldOrder = (fields: number[][], rules: Rule[]): string[] => {
  const remainingRules = [...rules]
  const orderedRuleNames: string[] = []
  fields.forEach((field) => {
    const matchingRule = remainingRules.find((rule) =>
      field.every((fieldValue) =>
        rule.validIntervals.some(
          (interval) => interval.from <= fieldValue && fieldValue <= interval.to
        )
      )
    )
    if (matchingRule) {
      console.log("matched", matchingRule)
      remainingRules.splice(remainingRules.indexOf(matchingRule), 1)
      orderedRuleNames.push(matchingRule.name)
    } else {
      console.log("No matching rule for field", field)
    }
  })
  return orderedRuleNames
}

const getInvalidNumberSum = (ticket: Ticket, rules: Rule[]): number => {
  const invalidSum = 0
  return ticket.numbers.reduce((totalInvalid, ticketNumber) => {
    const matchesAnyRule = rules.some((rule) =>
      rule.validIntervals.some(
        (interval) =>
          interval.from <= ticketNumber && ticketNumber <= interval.to
      )
    )
    return matchesAnyRule ? totalInvalid : totalInvalid + ticketNumber
  }, invalidSum)
}

const getValidTickets = (rules: Rule[], tickets: Ticket[]): Ticket[] => {
  return tickets.filter((ticket) => {
    const errorRate = computeErrorRate(rules, [ticket])
    return errorRate === 0
  })
}

const computeErrorRate = (rules: Rule[], tickets: Ticket[]): number => {
  let errorRate = 0
  return tickets.reduce(
    (totalErrors, ticket) => totalErrors + getInvalidNumberSum(ticket, rules),
    errorRate
  )
}

const parseTickets = (ticketDefinitions: string): Ticket[] => {
  const tickets = ticketDefinitions
    .split("\n")
    .filter(
      (definition) =>
        definition !== "" &&
        definition !== "your ticket:" &&
        definition !== "nearby tickets:"
    )

  const allTickets: Ticket[] = tickets.map((oneTicket) => {
    const ticketNumbers = oneTicket.split(",")
    const allNumbers: number[] = []
    return {
      numbers: ticketNumbers.reduce((allNumbers, ticketNumber) => {
        allNumbers.push(parseInt(ticketNumber, 10))
        return allNumbers
      }, allNumbers),
    }
  })

  return allTickets
}

const parseRules = (ruleDefinitons: string): Rule[] => {
  const rules: Rule[] = []
  ruleDefinitons.split("\n").forEach((ruleText) => {
    if (ruleText.length >= 1) {
      const [, name, from1, to1, from2, to2] = ruleText.match(
        /([\w ]+): (\d+)-(\d+) or (\d+)-(\d+)/
      )
      rules.push({
        name,
        validIntervals: [
          {
            from: parseInt(from1, 10),
            to: parseInt(to1, 10),
          },
          {
            from: parseInt(from2, 10),
            to: parseInt(to2, 10),
          },
        ],
      })
    }
  })
  return rules
}
