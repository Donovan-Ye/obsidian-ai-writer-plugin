import type { ProviderConfig } from 'llm-provider'

export type GPTSettings = ProviderConfig & {
  baseUrl: string
  articleFormat: string
  articleLanguage: string
}

export interface SettingsProps {
  getSettings: () => GPTSettings
  saveSettings: (newSettings: GPTSettings) => Promise<void>
}
