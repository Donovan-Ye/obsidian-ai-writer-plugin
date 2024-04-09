import { useEffect, useState } from 'react'
import type { GPTSettings, SettingsProps } from './types'

function Settings({
  getSettings,
  saveSettings,
}: SettingsProps) {
  const [settings, setSettings] = useState(getSettings())

  const updateSettings = async (newSettings: GPTSettings) => {
    await saveSettings(newSettings)
    setSettings(getSettings())
  }

  return (
    <div>
      <h1>Settings</h1>
      <p>{JSON.stringify(settings)}</p>

      <button
        onClick={() => {
          updateSettings({
            providerType: 'openai',
            model: 'gpt-3.5-turbo',
            baseUrl: 'xxx',
            apiKey: 'key',
          })
        }}
      />
    </div>
  )
}

export default Settings
