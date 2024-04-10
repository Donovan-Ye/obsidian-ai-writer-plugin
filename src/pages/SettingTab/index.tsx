import type { App } from 'obsidian'
import { PluginSettingTab, Setting } from 'obsidian'
import LLMProvider from 'src/llmProvider'
import type MyPlugin from 'src/main'
import type { GPTSettings } from './types'

export class GPTSettingTab extends PluginSettingTab {
  plugin: MyPlugin

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  async display() {
    let generateSettingTab = () => {}
    const saveChange = async (
      key: keyof GPTSettings,
      value: string,
      refresh: boolean = false,
    ) => {
      this.plugin.settings[key] = value
      await this.plugin.saveData(this.plugin.settings)
      if (refresh)
        generateSettingTab()
    }

    generateSettingTab = async () => {
      const { containerEl } = this
      containerEl.empty()

      const { providerType, model } = this.plugin.settings
      const providerOptions: Record<string, string> = {}
      for (const key of LLMProvider.PROVIDER_TYPE_MAP.keys())
        providerOptions[key] = key
      const modelOptions: Record<string, string> = {}
      const modelList = await LLMProvider.getModelList(providerType)
      for (const key of modelList)
        modelOptions[key] = key

      new Setting(containerEl)
        .setName('Default service provider')
        .addDropdown((dropdown) => {
          dropdown
            .addOptions(providerOptions)
            .setValue(providerType)
            .onChange(value => saveChange('providerType', value, true))
        })

      new Setting(containerEl)
        .setName('Model')
        .addDropdown((dropdown) => {
          dropdown
            .addOptions(modelOptions)
            .setValue(model)
            .onChange(value => saveChange('model', value))
        })

      new Setting(containerEl)
        .setName('API Key')
        .addText((text) => {
          text
            .setPlaceholder('API Key')
            .setValue(this.plugin.settings.apiKey)
            .onChange(value => saveChange('apiKey', value))
        })

      new Setting(containerEl)
        .setName('Base URL')
        .addText((text) => {
          text
            .setPlaceholder('Base URL')
            .setValue(this.plugin.settings.baseUrl)
            .onChange(value => saveChange('baseUrl', value))
        }).addButton((button) => {
          button
            .setButtonText('Reset')
            .onClick(async () => {
              await saveChange('baseUrl', 'https://api.openai.com', true)
            })
        })
    }

    generateSettingTab()
  }
}
