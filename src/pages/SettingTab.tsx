import type { App } from 'obsidian'
import { PluginSettingTab, Setting } from 'obsidian'
import type MyPlugin from 'src/main'

export class GPTSettingTab extends PluginSettingTab {
  plugin: MyPlugin

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this

    containerEl.empty()

    new Setting(containerEl)
      .setName('Setting #1')
      .setDesc('It\'s a secret')
      .addText(text =>
        text
          .setPlaceholder('Enter your secret')
          .setValue(this.plugin.settings.mySetting)
          .onChange(async (value) => {
            this.plugin.settings.mySetting = value
            await this.plugin.saveSettings()
          }),
      )
  }
}
