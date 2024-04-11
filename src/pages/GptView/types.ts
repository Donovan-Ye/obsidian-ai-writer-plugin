import type { TAbstractFile } from 'obsidian'
import type { GPTSettings } from '../SettingTab/types'

export interface ArticleProps {
  file: TAbstractFile
  getSettings: () => GPTSettings
  replaceOriginalNote: (newContent: string) => void
}
