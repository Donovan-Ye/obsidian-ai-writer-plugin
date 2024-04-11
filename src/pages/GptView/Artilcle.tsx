import { useEffect, useState } from 'react'
import LLMProvider from 'src/llmProvider'
import { Notice } from 'obsidian'
import { getPrompt } from 'src/prompt'
import { Tooltip } from 'antd'
import { PenLine, RefreshCcw, ReplaceAll } from 'lucide-react'
import ObsidianButton from 'src/components/ObsidianButton'
import type { TAbstractFile } from 'obsidian'
import RefactorCodeMirror from 'src/components/RefactorCodeMirror'
import { useTranslation } from 'react-i18next'
import type { GPTSettings } from '../SettingTab/types'

interface ArticleProps {
  file: TAbstractFile
  getSettings: () => GPTSettings
  openModifyArticleFormatModal: () => void
  replaceOriginalNote: (newContent: string) => void
}

function Article({
  file,
  getSettings,
  openModifyArticleFormatModal,
  replaceOriginalNote,
}: ArticleProps) {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [_content, setContent] = useState('')
  const [generateContent, setGenerateContent] = useState('')
  const [generating, setGenerating] = useState(false)

  async function requestLLM() {
    try {
      const newTitle = file.name.split('.')[0]
      const newContent = await this.app.vault.read(file)
      const settings = getSettings()
      setTitle(newTitle)
      setContent(newContent)
      setGenerateContent('')
      setGenerating(true)

      const provider = new LLMProvider(settings)
      const prompt = getPrompt({
        type: 'wholeNote',
        title: newTitle ?? '',
        content: newContent ?? '',
        articleFormat: settings?.articleFormat,
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
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      >
        <h1>{title}</h1>

        <div>
          <Tooltip title={t('Regenerate')}>
            <ObsidianButton
              disabled={generating}
              onClick={requestLLM}
            >
              <RefreshCcw size={14} />
            </ObsidianButton>
          </Tooltip>

          <Tooltip title={t('modify article template')}>
            <ObsidianButton
              style={{ marginLeft: '1rem' }}
              onClick={openModifyArticleFormatModal}
            >
              <PenLine size={14} />
            </ObsidianButton>
          </Tooltip>

          <Tooltip title={t('Replace original note')}>
            <ObsidianButton
              disabled={generating}
              style={{ marginLeft: '1rem' }}
              onClick={() => {
                replaceOriginalNote(generateContent)
              }}
            >
              <ReplaceAll size={14} />
            </ObsidianButton>
          </Tooltip>
        </div>
      </div>

      <RefactorCodeMirror
        value={generateContent}
        onChange={(value) => {
          setGenerateContent(value)
        }}
      />
    </>
  )
}

export default Article
