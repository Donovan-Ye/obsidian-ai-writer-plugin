import type { WorkspaceLeaf } from 'obsidian'
import { ItemView } from 'obsidian'
import { StrictMode } from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'

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
    this.root.render(
      <StrictMode>
        <div>
          test
          <h1>Head1</h1>
        </div>
      </StrictMode>,
    )
  }

  async onClose() {
    this.root?.unmount()
  }
}
