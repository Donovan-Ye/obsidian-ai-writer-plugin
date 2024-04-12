import type { App } from 'obsidian'
import { PluginSettingTab, Setting } from 'obsidian'
import LLMProvider from 'src/llmProvider'
import type MyPlugin from 'src/main'
import { defaultArticleFormat } from 'src/prompt/artileFormats/default'
import { getObsidianLanguageCode, languageMap } from 'src/i18n'
import { t } from 'i18next'
import type { GPTSettings } from './types'

export const DEFAULT_SETTINGS: GPTSettings = {
  providerType: 'openai',
  model: 'gpt-3.5-turbo',
  apiKey: '',
  baseUrl: 'https://api.openai.com',
  articleFormat: defaultArticleFormat(),
  articleLanguage: getObsidianLanguageCode(),
}

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
      await this.plugin.saveSettings(this.plugin.settings)
      if (refresh)
        generateSettingTab()
    }

    generateSettingTab = async () => {
      const { containerEl } = this
      containerEl.empty()

      const { providerType, model, apiKey, baseUrl, articleLanguage } = this.plugin.settings
      const providerOptions: Record<string, string> = {}
      for (const key of LLMProvider.PROVIDER_TYPE_MAP.keys())
        providerOptions[key] = key

      new Setting(containerEl)
        .setName(t('Default service provider'))
        .addDropdown((dropdown) => {
          dropdown
            .addOptions(providerOptions)
            .setValue(providerType)
            .onChange(value => saveChange('providerType', value, true))
        })

      const modelOptions: Record<string, string> = {}
      const modelList = await LLMProvider.getModelList(providerType)
      for (const key of modelList)
        modelOptions[key] = key

      new Setting(containerEl)
        .setName(t('Model'))
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
            .setValue(apiKey)
            .onChange(value => saveChange('apiKey', value))
        })

      new Setting(containerEl)
        .setName('Base URL')
        .addText((text) => {
          text
            .setPlaceholder('Base URL')
            .setValue(baseUrl)
            .onChange(value => saveChange('baseUrl', value))
        }).addButton((button) => {
          button
            .setButtonText('Reset')
            .onClick(async () => {
              await saveChange('baseUrl', 'https://api.openai.com', true)
            })
        })

      const languageOptions: Record<string, string> = {}
      for (const [key, value] of languageMap)
        languageOptions[key] = value

      new Setting(containerEl)
        .setName(t('Target article language'))
        .addDropdown((dropdown) => {
          dropdown
            .addOptions(languageOptions)
            .setValue(articleLanguage)
            .onChange(value => saveChange('articleLanguage', value))
        })
    }

    generateSettingTab()
  }
}
