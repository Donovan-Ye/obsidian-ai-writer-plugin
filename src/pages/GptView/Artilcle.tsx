import { useEffect, useState } from 'react'
import LLMProvider from 'src/llmProvider'
import { Notice } from 'obsidian'
import { getPrompt } from 'src/prompt'
import CodeMirror from '@uiw/react-codemirror'
import { okaidia } from '@uiw/codemirror-theme-okaidia'
import type { ArticleProps } from './types'

function Article({
  title,
  content,
  getSettings,
}: ArticleProps) {
  const [articleContent, setArticleContent] = useState('')

  async function requestGPT() {
    try {
      setArticleContent('')
      const provider = new LLMProvider(getSettings())

      const prompt = getPrompt({
        type: 'wholeNote',
        title: title ?? '',
        content,
      })

      const stream = await provider.chat(
        {
          messages: [{ role: 'user', content: prompt }],
          stream: true,
        },
      )
      for await (const chunk of stream)
        setArticleContent(prevMsg => prevMsg + (chunk?.choices?.[0]?.delta?.content ?? ''))
    }
    catch (err) {
      new Notice(err.message)
    }
  }

  useEffect(() => {
    requestGPT()
  }, [title, content])

  return (
    <div id="ai-writer-plugin">
      <h1>{title}</h1>

      <CodeMirror
        value={articleContent}
        onCreateEditor={
          () => {
            const cmContent = document.querySelector('#ai-writer-plugin .cm-content')
            if (cmContent) {
              (cmContent as HTMLElement).style.whiteSpace = 'break-spaces';
              (cmContent as HTMLElement).style.wordBreak = 'break-word';
              (cmContent as HTMLElement).style.overflowWrap = 'anywhere'

              const wrapper = document.createElement('div')
              wrapper.style.display = 'flex'
              wrapper.style.flexDirection = 'column'
              wrapper.style.alignItems = 'stretch'
              wrapper.style.width = '100%'
              wrapper.style.minHeight = '100%'

              cmContent.parentNode?.insertBefore(wrapper, cmContent)
              wrapper.appendChild(cmContent)
            }
          }
        }
        height="100%"
        className="test"
        theme={okaidia}
        onChange={(value) => {
          setArticleContent(value)
        }}
      />
    </div>
  )
}

export default Article
