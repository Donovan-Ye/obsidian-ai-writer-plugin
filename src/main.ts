import { Plugin } from 'obsidian'
import { GPT_VIEW, GptView, activateGPTView, generateArticle } from 'src/pages/GptView'
import { DEFAULT_SETTINGS, GPTSettingTab } from './pages/SettingTab'
import type { GPTSettings } from './pages/SettingTab/types'

const universalHint = 'Generate new article 📝'

export default class MyPlugin extends Plugin {
  settings: GPTSettings

  async initSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  // use arrow function to bind this
  getSettings = () => {
    return this.settings
  }

  // use arrow function to bind this
  saveSettings = async (newSettings: GPTSettings) => {
    this.settings = newSettings
    await this.saveData(newSettings)
  }

  async onload() {
    await this.initSettings()

    this.registerView(GPT_VIEW, leaf => new GptView(leaf, this))

    this.addRibbonIcon('message-square', 'Activate GPT view', () => {
      activateGPTView()
    })

    this.registerEvent(
      this.app.workspace.on('file-menu', (menu, file) => {
        menu.addItem((item) => {
          item
            .setTitle(universalHint)
            .onClick(async () => {
              await generateArticle(file)
            })
        })
      }),
    )

    this.registerEvent(
      this.app.workspace.on('editor-menu', (menu, editor, view) => {
        menu.addItem((item) => {
          item
            .setTitle(universalHint)
            .setIcon('document')
            .onClick(async () => {
              await generateArticle(view.file)
            })
        })
      }),
    )

    // This adds a simple command that can be triggered anywhere
    this.addCommand({
      id: 'generate-new-article',
      name: universalHint,
      callback: () => {
        generateArticle(this.app.workspace.getActiveFile())
      },
    })

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new GPTSettingTab(this.app, this))
  }

  onunload() {}
}
