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
} from 'obsidian'
import { GPT_VIEW, GptView } from 'src/views/GptView'

interface MyPluginSettings {
  mySetting: string
}

const DEFAULT_SETTINGS: Partial<MyPluginSettings> = {
  mySetting: 'default',
}

const ALL_EMOJIS: Record<string, string> = {
  ':+1:': '👍',
  ':sunglasses:': '😎',
  ':smile:': '😄',
}

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings

  async activateView() {
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

      //   const file = this.app.vault.getFileByPath("example.md")
      //   if (file) {
      //     await leaf?.openFile(file)
      //   }
    }

    // "Reveal" the leaf in case it is in a collapsed sidebar
    if (leaf)
      workspace.revealLeaf(leaf)
  }

  async onload() {
    this.registerMarkdownPostProcessor((element) => {
      const codeblocks = element.findAll('code')

      for (const codeblock of codeblocks) {
        const text = codeblock.textContent?.trim() ?? ''
        if (text[0] === ':' && text[text.length - 1] === ':') {
          const emojiEl = codeblock.createSpan({
            text: ALL_EMOJIS[text] ?? text,
          })
          codeblock.replaceWith(emojiEl)
        }
      }
    })

    this.registerView(GPT_VIEW, leaf => new GptView(leaf))

    this.addRibbonIcon('dice', 'Activate view', () => {
      this.activateView()
    })

    this.registerEvent(
      this.app.workspace.on('file-menu', (menu, file) => {
        menu.addItem((item) => {
          item
            .setTitle('Print file path 👈')
            .setIcon('document')
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
            .setTitle('Print file path 👈')
            .setIcon('document')
            .onClick(async () => {
              new Notice(view.file?.path ?? 'No file path')
            })
        })
      }),
    )

    this.addRibbonIcon('dice', 'Open menu', (event) => {
      const menu = new Menu()

      menu.addItem(item =>
        item
          .setTitle('Copy')
          .setIcon('documents')
          .onClick(() => {
            new Notice('Copied')
          }),
      )

      menu.addItem(item =>
        item
          .setTitle('Paste')
          .setIcon('paste')
          .onClick(() => {
            new Notice('Pasted')
          }),
      )

      menu.showAtMouseEvent(event)
    })

    await this.loadSettings()

    // This creates an icon in the left ribbon.
    const ribbonIconEl = this.addRibbonIcon(
      'dice',
      'Sample Plugin',
      () => {
        // Called when the user clicks the icon.
        new Notice('This is a notice!')
      },
    )
    // Perform additional things with the ribbon
    ribbonIconEl.addClass('my-plugin-ribbon-class')

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const statusBarItemEl = this.addStatusBarItem()
    statusBarItemEl.setText('Status Bar Text')

    // This adds a simple command that can be triggered anywhere
    this.addCommand({
      id: 'open-sample-modal-simple',
      name: 'Open sample modal (simple)',
      callback: () => {
        new SampleModal(this.app).open()
      },
    })
    // This adds an editor command that can perform some operation on the current editor instance
    this.addCommand({
      id: 'sample-editor-command',
      name: 'Sample editor command',
      editorCallback: (editor: Editor) => {
        editor.replaceSelection('Sample Editor Command')
      },
    })
    // This adds a complex command that can check whether the current state of the app allows execution of the command
    this.addCommand({
      id: 'open-sample-modal-complex',
      name: 'Open sample modal (complex)',
      checkCallback: (checking: boolean) => {
        // Conditions to check
        const markdownView
          = this.app.workspace.getActiveViewOfType(MarkdownView)
        if (markdownView) {
          // If checking is true, we're simply "checking" if the command can be run.
          // If checking is false, then we want to actually perform the operation.
          if (!checking)
            new SampleModal(this.app).open()

          // This command will only show up in Command Palette when the check function returns true
          return true
        }
      },
    })

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SampleSettingTab(this.app, this))

    // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
    // Using this function will automatically remove the event listener when this plugin is disabled.
    this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
      // eslint-disable-next-line no-console
      console.log('click', evt)
    })

    // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
    this.registerInterval(
      // eslint-disable-next-line no-console
      window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000),
    )
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}

class SampleModal extends Modal {
  constructor(app: App) {
    super(app)
  }

  onOpen() {
    const { contentEl } = this
    contentEl.setText('Woah!')
  }

  onClose() {
    const { contentEl } = this
    contentEl.empty()
  }
}

class SampleSettingTab extends PluginSettingTab {
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
