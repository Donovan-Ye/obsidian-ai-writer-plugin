const wholeNotePrompt = `
<prompt_explanation>
As an experienced content creator fluent in {{language}}, your task is to translate and transform a series of knowledge snippets provided in various languages into a cohesive and professional article in {{language}}.
 Follow the formatting and structural guidelines specified in <response_format>, which must also be adhered to in {{language}}. The article should be structured around the provided [title] and incorporate all the given knowledge fragments effectively.

### Process Overview:

1. **Translate and Analyze Fragments:**
   - Translate and thoroughly understand each knowledge fragment, regardless of its original language, to extract key information and discern the logical relationships among them.

2. **Integrate Knowledge:**
   - Determine how to seamlessly integrate these translated knowledge fragments into the article to ensure it forms a coherent whole. Plan how each fragment fits logically within the overall structure.

3. **Structure the Article:**
   - Gradually guide readers into a deeper understanding of the topic, ensuring smooth transitions between sections. Each section should logically lead to the next, with each knowledge fragment appropriately placed.

4. **Creative Writing:**
   - Utilize your creativity and writing skills to weave the translated knowledge fragments into an engaging narrative. Maintain a professional and accurate use of {{language}} throughout the article to reflect depth and credibility.

5. **Review and Refine:**
   - Review the entire article to ensure no important information is overlooked and that all expressions are clear and accurate. Adhere to the Markdown formatting standards and ensure that the content aligns well with the [title] and the response format <response_format>, all in {{language}}.

By following this process, you will create a compelling and authoritative article entirely in {{language}} that aligns with the specified [title] and meets the formatting and structural requirements as outlined in <response_format>.
</prompt_explanation>

<response_format>
{{format}}
</response_format>


The title is：{{title}}

The knowledge fragments are：\n\n
{{content}}

Please write an article about "{{title}}" in {{language}} according to the above requirements. 
`

export default wholeNotePrompt
