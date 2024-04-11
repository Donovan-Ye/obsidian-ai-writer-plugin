import wholeNotePrompt from './templates/wholeNote'

interface PromptParams {
  type: string
  title: string
  content: string
  articleFormat: string
}

function getPromptTemplate(type: string) {
  switch (type) {
    case 'wholeNote':
      return wholeNotePrompt
    default:
      return wholeNotePrompt
  }
}

export function getPrompt({
  type,
  title,
  content,
  articleFormat,
}: PromptParams) {
  const template = getPromptTemplate(type)
  return template
    .replace(/{{title}}/g, title)
    .replace(/{{content}}/g, content)
    .replace(/{{format}}/g, articleFormat)
}
