import type { ProviderConfig } from 'src/llmProvider/types'

export type GPTSettings = ProviderConfig

export interface SettingsProps {
  getSettings: () => GPTSettings
  saveSettings: (newSettings: GPTSettings) => Promise<void>
}
