import OpenAIProvider from './providers/OpenAIProvider'
import type { ChatConfig, Provider, ProviderConfig } from './types'

/**
 * LLMProvider is a class that provides a common interface for different LLM providers.
 */
class LLMProvider {
  provider: Provider

  constructor(
    public config: ProviderConfig,
  ) {
    this.provider = LLMProvider.createProvider(config)
  }

  static get PROVIDER_TYPE_MAP() {
    return new Map([
      ['openai', OpenAIProvider],
    ])
  }

  private static getProviderClass(providerType: string) {
    const ProviderClass = LLMProvider.PROVIDER_TYPE_MAP.get(providerType)
    if (!ProviderClass)
      throw new Error(`Provider type ${providerType} is not supported`)

    return ProviderClass
  }

  static createProvider(config: ProviderConfig): Provider {
    const ProviderClass = LLMProvider.getProviderClass(config.providerType)

    return new ProviderClass(config)
  }

  static getModelList(providerType: string) {
    const ProviderClass = LLMProvider.getProviderClass(providerType)

    return ProviderClass.getModelList()
  }

  async chat(chatConfig: ChatConfig) {
    return await this.provider.chat(chatConfig)
  }
}

export default LLMProvider
