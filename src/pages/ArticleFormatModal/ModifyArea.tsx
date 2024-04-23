import { Notice } from 'obsidian'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ObsidianButton from 'src/components/ObsidianButton'
import RefactorCodeMirror from 'src/components/RefactorCodeMirror'
import type AIWriterPlugin from 'src/main'
import { defaultArticleFormat } from 'src/prompt/artileFormats/default'

interface ModifyAreaProps {
  closeModel: () => void
  plugin: AIWriterPlugin
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
      <h1 className="plg-aw-mt-0">{t('Modify article template')}</h1>

      <RefactorCodeMirror
        value={articleFormat}
        maxHeight="35rem"
        onChange={(value) => {
          setArticleFormat(value)
        }}
      />

      <div className=" plg-aw-flex plg-aw-justify-end plg-aw-mt-4">
        <ObsidianButton onClick={closeModel}>
          {t('Cancel')}
        </ObsidianButton>

        <ObsidianButton
          className=" plg-aw-ml-4"
          onClick={() => {
            setArticleFormat(defaultArticleFormat(plugin.settings.articleLanguage))
          }}
        >
          {t('Reset')}
        </ObsidianButton>

        <ObsidianButton
          className=" plg-aw-ml-4"
          onClick={saveArticleFormat}
        >
          {t('Save')}
        </ObsidianButton>
      </div>
    </div>
  )
}

export default ModifyArea
