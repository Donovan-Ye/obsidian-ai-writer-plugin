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

  static async getModelList() {
    // Get from the type definition of OpenAI
    return [
      'gpt-4-0125-preview',
      'gpt-4-turbo-preview',
      'gpt-4-1106-preview',
      'gpt-4-vision-preview',
      'gpt-4',
      'gpt-4-0314',
      'gpt-4-0613',
      'gpt-4-32k',
      'gpt-4-32k-0314',
      'gpt-4-32k-0613',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k',
      'gpt-3.5-turbo-0301',
      'gpt-3.5-turbo-0613',
      'gpt-3.5-turbo-1106',
      'gpt-3.5-turbo-0125',
      'gpt-3.5-turbo-16k-0613',
    ]
  }
}

export default OpenAIProvider
