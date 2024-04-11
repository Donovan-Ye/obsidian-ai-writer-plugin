import type { App } from 'obsidian'
import { Modal } from 'obsidian'
import { type Root, createRoot } from 'react-dom/client'
import type MyPlugin from 'src/main'
import ModifyArea from './ModifyArea'

export class ArticleFormatModal extends Modal {
  root: Root | null = null
  plugin: MyPlugin

  constructor(app: App, plugin: MyPlugin) {
    super(app)
    this.plugin = plugin
  }

  async onOpen() {
    this.root = createRoot(this.containerEl.children[1])

    this.root.render(
      <ModifyArea
        closeModel={() => { this.close() }}
        plugin={this.plugin}
      />,
    )
  }

  async onClose() {
    this.root?.unmount()
  }
}
