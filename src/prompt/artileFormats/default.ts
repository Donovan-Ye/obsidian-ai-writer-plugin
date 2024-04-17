import { getObsidianLanguageCode } from 'src/i18n'

const zh = `# [自动生成标题]

## [自动生成引言或背景标题]
在这一部分，模型将基于文章的整体内容和目的，生成一个适当的标题，并简要介绍主题。

## [自动生成子标题1]
详细讨论文章的一个关键方面或问题。使用数据、引用或理论支持论点。

### [可选的二级子标题]
深入分析子标题1下的特定细节或相关子主题。

#### [可选的三级子标题]
更详细地探讨二级子标题下的具体问题或数据。

## [自动生成子标题2]
探讨另一重要方面，可能包括对比分析、案例研究或不同的视角。

### [可选的二级子标题]
提供更深入的讨论或额外的案例分析。

## [更多子标题（如有需要）]
根据文章内容的需要，继续添加更多具有自动生成子标题的段落。每个段落都应围绕一个独立的主题或论点展开。

## [自动生成结论标题]
总结文章的主要发现或观点，强调其对读者或领域的重要性。提出可能的未来研究方向或实际应用的建议。

## 参考文献（如使用）
- [引用文献1](引用地址1)
- [引用文献2](引用地址2)
`

const en = `# [Auto-generated Title]

## [Auto-generated Introduction or Background Title]
In this section, the model will create an appropriate title based on the overall content and purpose of the article, and provide a brief introduction to the topic.

## [Auto-generated Subtitle 1]
Discuss a key aspect or issue in detail. Support the arguments with data, citations, or theories.

### [Optional Secondary Subtitle]
Delve deeper into specific details or related subtopics under Subtitle 1.

#### [Optional Tertiary Subtitle]
Explore specific issues or data in more detail under the secondary subtitle.

## [Auto-generated Subtitle 2]
Explore another significant aspect, which may include comparative analyses, case studies, or different perspectives.

### [Optional Secondary Subtitle]
Provide deeper discussions or additional case studies.

## [More Subtitles as Needed]
Continue adding more sections with auto-generated subtitles as required by the content of the article. Each section should revolve around a separate theme or argument.

## [Auto-generated Conclusion Title]
Summarize the main findings or perspectives of the article, emphasizing their importance to the reader or the field. Suggest possible future research directions or practical applications.

## References (if used)
- [Citation 1](Citation URL 1)
- [Citation 2](Citation URL 2)
`

const defaultArticleFormatMap = new Map([
  ['en', en],
  ['zh', zh],
])

export function defaultArticleFormat(languageCode: string = getObsidianLanguageCode()) {
  return defaultArticleFormatMap.get(languageCode) ?? en
}
