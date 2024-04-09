import type { App } from 'obsidian'
import { PluginSettingTab } from 'obsidian'
import { StrictMode } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type MyPlugin from 'src/main'
import Settings from './Settings'

export class GPTSettingTab extends PluginSettingTab {
  root: Root | null = null
  plugin: MyPlugin

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    this.root = createRoot(this.containerEl)

    this.root.render(
      <StrictMode>
        <Settings
          getSettings={this.plugin.getSettings}
          saveSettings={this.plugin.saveSettings}
        />
      </StrictMode>,
    )
  }

  hide() {
    this.root?.unmount()
  }
}
