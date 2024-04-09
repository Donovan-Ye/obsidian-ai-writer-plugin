import type { App, TAbstractFile, WorkspaceLeaf } from 'obsidian'
import { ItemView, Notice } from 'obsidian'
import { StrictMode } from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import type { ArticleProps } from './types'
import Article from './Artilcle'

export const GPT_VIEW = 'gpt-view'

export class GptView extends ItemView {
  root: Root | null = null

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
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

  async generateArticle(title: ArticleProps['title'], content: ArticleProps['content']) {
    this.root?.render(
      <StrictMode>
        <Article title={title} content={content} />
      </StrictMode>,
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
}

export async function generateArticle(file: TAbstractFile | null) {
  if (!file)
    return

  const title = file.name === 'Untitled.md' ? null : file.name.split('.')[0]
  const content = await file.vault.adapter.read(file.path)
  if (!content) {
    new Notice('No content found in the file')
    return
  }

  await activateGPTView()

  const leaf = await getOrCreateGPTView()

  if (leaf) {
    const view = leaf.view as GptView
    view.generateArticle(title, content)
  }
}
