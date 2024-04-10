export interface ProviderConfig {
  providerType: string
  model: string
  apiKey: string
  baseUrl: string
}

export type ChatConfig = {
  messages: { role: string, content: string }[]
  stream: boolean
} & Partial<{ model: string }>

export interface Provider {
  chat: (config: ChatConfig) => Promise<any>
}
