import { useEffect, useState } from 'react'
import LLMProvider from 'src/llmProvider'
import type { ArticleProps } from './types'

function Article({ title, content, getSettings }: ArticleProps) {
  const [messages, setMessages] = useState('')

  async function requestGPT() {
    const provider = new LLMProvider(getSettings())

    const stream = await provider.chat(
      {
        messages: [{ role: 'user', content: '你好' }],
        stream: true,
      },
    )
    for await (const chunk of stream)
      setMessages(prevMsg => prevMsg + (chunk?.choices?.[0]?.delta?.content ?? ''))
  }

  useEffect(() => {
    requestGPT()
  }, [])

  return (
    <div>
      <h1>{title}</h1>

      <p>{content}</p>
      <p>{messages}</p>
    </div>
  )
}

export default Article
