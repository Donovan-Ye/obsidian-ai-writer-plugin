import type { GPTSettings } from '../SettingTab/types'

export interface ArticleProps {
  title: string | null
  content: string
  getSettings: () => GPTSettings
}
