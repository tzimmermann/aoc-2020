import { readFile } from "fs"

type Interval = {
  from: number
  to: number
}

type Rule = {
  name: string
  validIntervals: Interval[]
  fieldIndex: number
}

type Ticket = {
  numbers: number[]
}

type Field = {
  index: number
  values: number[]
  candidateRules: Rule[]
}

type ErrorRate = {
  hasErrors: boolean
  invalidSum: number
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
  const [myTicket] = parseTickets(myTicketDefinition)
  const nearbyTickets = parseTickets(nearbyTicketDefinitions)

  const { invalidSum } = computeErrorRate(rules, nearbyTickets)
  console.log("part 1 result", invalidSum)

  const fields = initializeFields(nearbyTickets, rules)
  mapRulesToFields(fields)
  const departureSum = getDepartureTotal(myTicket, rules)
  console.log("part 2 result:", departureSum)
})

const getDepartureTotal = (ticket: Ticket, rules: Rule[]): number => {
  const fieldIndices = rules
    .filter((rule) => rule.name.startsWith("departure"))
    .map((rule) => rule.fieldIndex)

  let departureTotal = 1
  return fieldIndices.reduce(
    (total, fieldIndex) => total * ticket.numbers[fieldIndex],
    departureTotal
  )
}

const mapRulesToFields = (fields: Field[]) => {
  fields.sort(
    (field1, field2) =>
      field1.candidateRules.length - field2.candidateRules.length
  )

  let appliedRules: Rule[] = []
  fields.forEach((field) => {
    field.candidateRules = field.candidateRules.filter(
      (candidate) => !appliedRules.includes(candidate)
    )
    if (field.candidateRules.length > 1) {
      throw new Error("Ambiguous rule found")
    }
    const rule = field.candidateRules[0]
    rule.fieldIndex = field.index
    appliedRules.push(rule)
  })
}

const initializeFields = (tickets: Ticket[], rules: Rule[]): Field[] => {
  const validTickets = getValidTickets(rules, tickets)
  const fieldCount = validTickets[0].numbers.length
  const fields: Field[] = []
  for (let fieldIndex = 0; fieldIndex < fieldCount; fieldIndex++) {
    const field = {
      index: fieldIndex,
      values: validTickets.map((ticket) => ticket.numbers[fieldIndex]),
      candidateRules: [],
    }
    field.candidateRules = getCandidatesForField(field, rules)
    fields.push(field)
  }
  return fields
}

const getCandidatesForField = (field: Field, rules: Rule[]): Rule[] => {
  return rules.filter((rule) =>
    field.values.every((fieldValue) =>
      rule.validIntervals.some(
        (interval) => interval.from <= fieldValue && fieldValue <= interval.to
      )
    )
  )
}

const getInvalidNumberSum = (ticket: Ticket, rules: Rule[]): ErrorRate => {
  let invalidSum = 0
  let hasErrors = false
  ticket.numbers.forEach((ticketNumber) => {
    const matchesAnyRule = rules.some((rule) =>
      rule.validIntervals.some(
        (interval) =>
          interval.from <= ticketNumber && ticketNumber <= interval.to
      )
    )
    if (!matchesAnyRule) {
      hasErrors = true
      invalidSum += ticketNumber
    }
  })
  return { hasErrors, invalidSum }
}

const getValidTickets = (rules: Rule[], tickets: Ticket[]): Ticket[] => {
  return tickets.filter((ticket) => {
    const { hasErrors } = computeErrorRate(rules, [ticket])
    return !hasErrors
  })
}

const computeErrorRate = (rules: Rule[], tickets: Ticket[]): ErrorRate => {
  let totalInvalidSum = 0
  let hasAnyErrors = false
  tickets.forEach((ticket) => {
    const { hasErrors, invalidSum } = getInvalidNumberSum(ticket, rules)
    hasAnyErrors = hasAnyErrors || hasErrors
    totalInvalidSum += invalidSum
  })
  return { hasErrors: hasAnyErrors, invalidSum: totalInvalidSum }
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
        fieldIndex: null,
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
