import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources'
import type { ChatConfig, Provider, ProviderConfig } from '../types'

class OpenAIProvider implements Provider {
  openai: OpenAI

  constructor(public config: ProviderConfig) {
    this.openai = new OpenAI({
      baseURL: config.baseUrl,
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true,
    })
  }

  async chat({ messages, model, stream }: ChatConfig) {
    return await this.openai.chat.completions.create({
      messages: messages as ChatCompletionMessageParam[],
      model: model ?? this.config.model,
      stream,
    })
  }
}

export default OpenAIProvider
