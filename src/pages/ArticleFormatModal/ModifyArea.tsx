import { Notice } from 'obsidian'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ObsidianButton from 'src/components/ObsidianButton'
import RefactorCodeMirror from 'src/components/RefactorCodeMirror'
import type MyPlugin from 'src/main'
import { defaultArticleFormat } from 'src/prompt/artileFormats/default'

interface ModifyAreaProps {
  closeModel: () => void
  plugin: MyPlugin
}

function ModifyArea({ closeModel, plugin }: ModifyAreaProps) {
  const { t } = useTranslation()
  const [articleFormat, setArticleFormat] = useState(plugin?.getSettings()?.articleFormat ?? '')

  const saveArticleFormat = async () => {
    try {
      await plugin?.saveSettings({ ...plugin?.getSettings(), articleFormat })
      new Notice(t('Save successfully'))
      closeModel()
    }
    catch (err) {
      new Notice(t('Save failed'))
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{t('Modify article template')}</h1>

      <RefactorCodeMirror
        value={articleFormat}
        maxHeight="40rem"
        onChange={(value) => {
          setArticleFormat(value)
        }}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '1rem',
      }}
      >
        <ObsidianButton onClick={closeModel}>
          {t('Cancel')}
        </ObsidianButton>

        <ObsidianButton
          style={{ marginLeft: '1rem' }}
          onClick={() => {
            setArticleFormat(defaultArticleFormat)
          }}
        >
          {t('Reset')}
        </ObsidianButton>

        <ObsidianButton
          style={{ marginLeft: '1rem' }}
          onClick={saveArticleFormat}
        >
          {t('Save')}
        </ObsidianButton>
      </div>
    </div>
  )
}

export default ModifyArea
