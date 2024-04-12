import { Plugin } from 'obsidian'
import { GPT_VIEW, GptView, generateArticle } from 'src/pages/GptView'
import { t } from 'i18next'
import { DEFAULT_SETTINGS, GPTSettingTab } from './pages/SettingTab'
import type { GPTSettings } from './pages/SettingTab/types'
import { ArticleFormatModal } from './pages/ArticleFormatModal'
// internationalization
import './i18n'

const generateArticleHint = t('Generate new article')

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

  openModifyArticleFormatModal = () => {
    new ArticleFormatModal(this.app, this).open()
  }

  async onload() {
    await this.initSettings()

    this.registerView(GPT_VIEW, leaf => new GptView(leaf, this))

    this.registerEvent(
      this.app.workspace.on('file-menu', (menu, file) => {
        menu.addItem((item) => {
          item
            .setTitle(generateArticleHint)
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
            .setTitle(generateArticleHint)
            .setIcon('document')
            .onClick(async () => {
              await generateArticle(view.file)
            })
        })
      }),
    )

    this.addCommand({
      id: 'generate-new-article',
      name: generateArticleHint,
      callback: () => {
        generateArticle(this.app.workspace.getActiveFile())
      },
    })

    this.addCommand({
      id: 'modify-article-format',
      name: t('Modify article template'),
      callback: () => {
        this.openModifyArticleFormatModal()
      },
    })

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new GPTSettingTab(this.app, this))
  }

  onunload() {}
}
