import wholeNotePrompt from './templates/wholeNote'

interface PromptParams {
  type: string
  title: string
  content: string
}

function getPromptTemplate(type: string) {
  switch (type) {
    case 'wholeNote':
      return wholeNotePrompt
    default:
      return wholeNotePrompt
  }
}

export function getPrompt({ type, title, content }: PromptParams) {
  const template = getPromptTemplate(type)
  return template
    .replace(/{{title}}/g, title)
    .replace(/{{content}}/g, content)
}
