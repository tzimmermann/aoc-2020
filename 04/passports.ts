import { readFile } from "fs"

type PassportField = { type: string; value: string }

const parseFields = (passport: string): PassportField[] => {
  const fields = passport.match(/[a-z]{3}:[^ \n]+/gm)
  return fields.map((field) => {
    const fieldParts = field.split(":")
    if (fieldParts.length !== 2) {
      throw new Error(`Found invalid field: ${field}`)
    }
    return {
      type: fieldParts[0],
      value: fieldParts[1],
    }
  })
}

const REQUIRED_FIELDS = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]

const hasAllRequiredFields = (fields: PassportField[]): boolean => {
  return REQUIRED_FIELDS.every((requiredField) =>
    fields.some((field) => field.type === requiredField)
  )
}

const HEX_COLOR = /^#[0-9a-f]{6}$/
const PASSPORT_ID = /^\d{9}$/

const VALIDATIONS = {
  byr: (year: string) => {
    const yearNumber = parseInt(year, 10)
    return yearNumber >= 1920 && yearNumber <= 2002
  },
  iyr: (year: string) => {
    const yearNumber = parseInt(year, 10)
    return yearNumber >= 2010 && yearNumber <= 2020
  },
  eyr: (year: string) => {
    const yearNumber = parseInt(year, 10)
    return yearNumber >= 2020 && yearNumber <= 2030
  },
  hgt: (heightField: string) => {
    const [, height, heightUnit] = heightField.match(/(\d+)(\w+)/)
    const heightNumber = parseInt(height, 10)
    if (heightUnit === "cm") {
      return heightNumber >= 150 && heightNumber <= 193
    }
    if (heightUnit === "in") {
      return heightNumber >= 59 && heightNumber <= 76
    }
    return false
  },
  hcl: (hairColorField: string) => HEX_COLOR.test(hairColorField),
  ecl: (eyeColorField: string) =>
    ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(eyeColorField),
  pid: (passPortIDField: string) => PASSPORT_ID.test(passPortIDField),
  cid: () => true,
}

const allFieldsAreValid = (fields: PassportField[]): boolean => {
  return fields.every((field) => {
    const validFn = VALIDATIONS[field.type]
    // console.log(`value ${field.value} was valid: ${validFn(field.value)}`)
    return validFn(field.value)
  })
}

readFile("04/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const passports = data.split("\n\n")

  let validCount = 0
  passports.forEach((passport) => {
    const fields = parseFields(passport)
    if (hasAllRequiredFields(fields) && allFieldsAreValid(fields)) {
      validCount++
    }
  })

  console.log(validCount)
})
