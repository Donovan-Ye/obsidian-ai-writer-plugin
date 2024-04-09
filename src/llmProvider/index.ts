import OpenAIProvider from './providers/OpenAIProvider'
import type { ChatConfig, Provider, ProviderConfig } from './types'

function createProvider(config: ProviderConfig): Provider {
  switch (config.providerType) {
    case 'openai':
      return new OpenAIProvider(config)
    default:
      throw new Error('Invalid provider type')
  }
}

/**
 * LLMProvider is a class that provides a common interface for different LLM providers.
 */
class LLMProvider {
  provider: Provider

  constructor(
    public config: ProviderConfig,
  ) {
    this.provider = createProvider(config)
  }

  async chat(chatConfig: ChatConfig) {
    return await this.provider.chat(chatConfig)
  }
}

export default LLMProvider
