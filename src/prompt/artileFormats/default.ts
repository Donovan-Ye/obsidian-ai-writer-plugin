import { getObsidianLanguageCode } from 'src/i18n'

const zh = `## 引言（如果有必要）

从一个能够抓住读者注意力的开头开始。提供与{{标题}}相关的背景信息，并为文章的其余部分设定语境。引言部分以论点陈述结束，概述将在文章中讨论的主要点或论据。

## 与内容相关的小标题1

- 要点1
- 要点2
- 要点3

在这一部分包含任何相关的数据、引用或外部参考资料，以支持本节中所提出的观点。您还可以使用Markdown的功能，比如用**粗体**来强调重点或用*斜体*来表示作品的标题或重要术语。

### 子部分（如果有必要）

讨论与主要内容1的子部分相关的具体细节，提供更深入的见解或具体实例。

## 与内容相关的小标题2

这里省略了部分内容，逻辑和[## 与内容相关的小标题1]类似

## 总结（如果有必要）

总结文章中讨论的主要观点。强调这些点如何支持引言中提出的论点陈述。以一个总结性思考或行动号召结束，促使读者更深入地思考该主题或采取某些与{{标题}}相关的行动。

## 参考资料（如果有对应的链接出处）

- [参考文献1](链接1)
- [参考文献2](链接2)
`

const en = `## Introduction (If necessary)

Begin with a compelling opening that captures the reader's attention. Provide background information related to {{title}} and set the context for the rest of the article. The introduction should conclude with a thesis statement outlining the main points or arguments that will be discussed in the article.

## Subheading 1 Related to Content

- Point 1
- Point 2
- Point 3

Include any relevant data, quotes, or external references in this section to support the points made in this section. You can also utilize Markdown features such as **bold** to emphasize key points or *italics* to denote titles of works or important terms.

### Subsection (If necessary)

Discuss specific details related to Subheading 1, providing further insights or specific examples.

## Subheading 2 Related to Content

Some content is omitted here, the logic is similar to [## Subheading 1 Related to Content]

## Conclusion (If necessary)

Summarize the main points discussed in the article. Emphasize how these points support the thesis statement presented in the introduction. End with a concluding thought or call to action that prompts readers to think more deeply about the topic or take some action related to {{title}}.

## References (if corresponding links are available)

- [Reference 1](Link1)
- [Reference 2](Link2)
`

const defaultArticleFormatMap = new Map([
  ['en', en],
  ['zh', zh],
])

export function defaultArticleFormat(languageCode: string = getObsidianLanguageCode()) {
  return defaultArticleFormatMap.get(languageCode) ?? en
}
