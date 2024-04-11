import { useEffect, useState } from 'react'
import LLMProvider from 'src/llmProvider'
import { Notice } from 'obsidian'
import { getPrompt } from 'src/prompt'
import CodeMirror from '@uiw/react-codemirror'
import { okaidia } from '@uiw/codemirror-theme-okaidia'
import { Button, Tooltip } from 'antd'
import { RefreshCcw, ReplaceAll } from 'lucide-react'
import type { ArticleProps } from './types'

function Article({
  title,
  content,
  getSettings,
  replaceOriginalNote,
}: ArticleProps) {
  const [articleContent, setArticleContent] = useState('')
  const [generating, setGenerating] = useState(false)

  async function requestLLM() {
    try {
      setArticleContent('')
      setGenerating(true)
      // setArticleContent(JSON.stringify(getSettings()))
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
    finally {
      setGenerating(false)
    }
  }

  useEffect(() => {
    requestLLM()
  }, [title, content])

  return (
    <div id="ai-writer-plugin">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      >
        <h1>{title}</h1>

        <div>
          <Tooltip title="regenerate">
            <button
              className="mod-cta"
              disabled={generating}
              onClick={requestLLM}
            >
              <RefreshCcw size={14} />
            </button>
          </Tooltip>

          <Tooltip title="replace original note">
            <button
              className="mod-cta"
              disabled={generating}
              style={{ marginLeft: '1rem' }}
              onClick={() => {
                replaceOriginalNote(articleContent)
              }}
            >
              <ReplaceAll size={14} />
            </button>
          </Tooltip>
        </div>
      </div>

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
        theme={okaidia}
        onChange={(value) => {
          setArticleContent(value)
        }}
      />
    </div>
  )
}

export default Article
