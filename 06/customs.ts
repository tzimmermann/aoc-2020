import { readFile } from "fs"

const getGroupAnswerCountsAny = (group: string) => {
  const groupMembers = group.split("\n")
  const groupAnswers = new Set<string>()
  groupMembers.forEach((groupMember) => {
    for (let answerLetter of groupMember) {
      groupAnswers.add(answerLetter)
    }
  })
  return groupAnswers.size
}

const getGroupAnswerCountsAll = (group: string) => {
  const groupMembers = group.split("\n")
  const initialCommonAnswers: string[] = null
  const answersByAll = groupMembers.reduce((commonAnswers, groupMember) => {
    const answers: string[] = []
    if (groupMember.length === 0) {
      // empty string after last group in the file
      return commonAnswers
    }
    for (let answerLetter of groupMember) {
      answers.push(answerLetter)
    }
    if (commonAnswers === null) {
      // initialise commonAnswers on first run
      return answers
    }
    return answers.filter((answer) => commonAnswers.includes(answer))
  }, initialCommonAnswers)
  return answersByAll.length
}

readFile("06/input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const groups = data.split("\n\n")

  const sumAny = groups.reduce(
    (totalSum, group) => totalSum + getGroupAnswerCountsAny(group),
    0
  )

  const sumAll = groups.reduce(
    (totalSum, group) => totalSum + getGroupAnswerCountsAll(group),
    0
  )

  console.log(sumAny)
  console.log(sumAll)
})
