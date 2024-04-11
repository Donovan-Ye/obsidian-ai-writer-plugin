import { Notice } from 'obsidian'
import { useEffect, useState } from 'react'
import ObsidianButton from 'src/components/ObsidianButton'
import RefactorCodeMirror from 'src/components/RefactorCodeMirror'
import type MyPlugin from 'src/main'

interface ModifyAreaProps {
  closeModel: () => void
  plugin: MyPlugin
}

function ModifyArea({ closeModel, plugin }: ModifyAreaProps) {
  const [articleFormat, setArticleFormat] = useState(plugin?.getSettings()?.articleFormat ?? '')

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Modify article format</h1>

      <RefactorCodeMirror
        value={articleFormat}
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
        <ObsidianButton onClick={closeModel}> Cancel </ObsidianButton>

        <ObsidianButton
          style={{ marginLeft: '1rem' }}
          onClick={async () => {
            try {
              await plugin?.saveSettings({ ...plugin?.getSettings(), articleFormat })
              new Notice('Article format saved')
              closeModel()
            }
            catch (err) {
              new Notice('Failed to save article format')
            }
          }}
        >
          Save
        </ObsidianButton>
      </div>
    </div>
  )
}

export default ModifyArea
