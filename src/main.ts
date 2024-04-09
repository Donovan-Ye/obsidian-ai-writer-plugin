import type {
  App,
  Editor,
  WorkspaceLeaf,
} from 'obsidian'
import {
  MarkdownView,
  Menu,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  addIcon,
} from 'obsidian'
import { GPT_VIEW, GptView } from 'src/pages/GptView'
import { GPTSettingTab } from './pages/SettingTab'

interface MyPluginSettings {
  mySetting: string
}

const DEFAULT_SETTINGS: Partial<MyPluginSettings> = {
  mySetting: 'default',
}

const universalHint = 'Generate new article 📝'

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }

  async activateGPTView() {
    const { workspace } = this.app

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

    // "Reveal" the leaf in case it is in a collapsed sidebar
    if (leaf)
      workspace.revealLeaf(leaf)
  }

  async onload() {
    await this.loadSettings()

    this.registerView(GPT_VIEW, leaf => new GptView(leaf))

    this.addRibbonIcon('message-square', 'Activate GPT view', () => {
      this.activateGPTView()
    })

    this.registerEvent(
      this.app.workspace.on('file-menu', (menu, file) => {
        menu.addItem((item) => {
          item
            .setTitle(universalHint)
            .onClick(async () => {
              new Notice(file.path)
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
              new Notice(view.file?.path ?? 'No file path')
            })
        })
      }),
    )

    // This adds a simple command that can be triggered anywhere
    this.addCommand({
      id: 'generate-new-article',
      name: universalHint,
      callback: () => { },
    })

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new GPTSettingTab(this.app, this))
  }

  onunload() {}
}
