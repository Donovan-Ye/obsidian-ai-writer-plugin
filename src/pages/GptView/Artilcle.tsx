import { useEffect, useState } from 'react'
import LLMProvider from 'src/llmProvider'
import { Notice } from 'obsidian'
import { getPrompt } from 'src/prompt'
import CodeMirror from '@uiw/react-codemirror'
import { okaidia } from '@uiw/codemirror-theme-okaidia'
import { Tooltip } from 'antd'
import { RefreshCcw, ReplaceAll } from 'lucide-react'
import type { ArticleProps } from './types'

function Article({
  file,
  getSettings,
  replaceOriginalNote,
}: ArticleProps) {
  const [title, setTitle] = useState('')
  const [_content, setContent] = useState('')
  const [generateContent, setGenerateContent] = useState('')
  const [generating, setGenerating] = useState(false)

  async function requestLLM() {
    try {
      const newTitle = file.name.split('.')[0]
      const newContent = await this.app.vault.read(file)
      setTitle(newTitle)
      setContent(newContent)
      setGenerateContent('')
      setGenerating(true)

      const provider = new LLMProvider(getSettings())
      const prompt = getPrompt({
        type: 'wholeNote',
        title: newTitle ?? '',
        content: newContent ?? '',
      })

      const stream = await provider.chat(
        {
          messages: [{ role: 'user', content: prompt }],
          stream: true,
        },
      )
      for await (const chunk of stream)
        setGenerateContent(prevMsg => prevMsg + (chunk?.choices?.[0]?.delta?.content ?? ''))
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
  }, [])

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
                replaceOriginalNote(generateContent)
              }}
            >
              <ReplaceAll size={14} />
            </button>
          </Tooltip>
        </div>
      </div>

      <CodeMirror
        value={generateContent}
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
          setGenerateContent(value)
        }}
      />
    </div>
  )
}

export default Article
