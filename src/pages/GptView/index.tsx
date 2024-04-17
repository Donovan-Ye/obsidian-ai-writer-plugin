import type { App, TAbstractFile, WorkspaceLeaf } from 'obsidian'
import { ItemView, Notice } from 'obsidian'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import type AIWriterPlugin from 'src/main'
import { t } from 'i18next'
import Article from './Artilcle'

export const GPT_VIEW = 'gpt-view'

export class GptView extends ItemView {
  root: Root | null = null
  plugin: AIWriterPlugin

  constructor(leaf: WorkspaceLeaf, plugin: AIWriterPlugin) {
    super(leaf)
    this.plugin = plugin
  }

  getViewType() {
    return GPT_VIEW
  }

  getDisplayText() {
    return 'GPT view'
  }

  async onOpen() {
    this.root = createRoot(this.containerEl.children[1])
  }

  async generateArticle(file: TAbstractFile) {
    this.root?.render(
      <Article
        file={file}
        key={Math.random()} // force re-render to re-generate article
        getSettings={this.plugin.getSettings}
        openModifyArticleFormatModal={this.plugin.openModifyArticleFormatModal}
        replaceOriginalNote={async (newContent: string) => {
          try {
            await this.app.vault.adapter.write(file.path, newContent)
            new Notice(t('Replace successfully'))
          }
          catch (err) {
            new Notice(t('Replace failed'))
          }
        }}
      />,
    )
  }

  async onClose() {
    this.root?.unmount()
  }
}

export async function getOrCreateGPTView() {
  const { workspace } = this.app as App

  let leaf: WorkspaceLeaf | null = null
  const leaves = workspace.getLeavesOfType(GPT_VIEW)

  if (leaves.length > 0) {
    // A leaf with our view already exists, use that
    leaf = leaves[0]
  }
  else {
    // Our view could not be found in the workspace, create a new leaf
    // in the right sidebar for it
    leaf = workspace.getRightLeaf(false)
    await leaf?.setViewState({ type: GPT_VIEW, active: true })
  }

  return leaf
}

export async function activateGPTView() {
  const { workspace } = this.app as App

  const leaf = await getOrCreateGPTView()
  // "Reveal" the leaf in case it is in a collapsed sidebar
  if (leaf)
    workspace.revealLeaf(leaf)

  return leaf
}

export async function generateArticle(file: TAbstractFile | null) {
  if (!file) {
    new Notice(t('No file'))
    return
  }

  const content = await file.vault.adapter.read(file.path)
  if (!content) {
    new Notice(t('No content'))
    return
  }

  const leaf = await activateGPTView()

  if (leaf) {
    const view = leaf.view as GptView
    view.generateArticle(file)
  }
}
