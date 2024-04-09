import type { ArticleProps } from './types'

function Article({ title, content }: ArticleProps) {
  return (
    <div>
      <h1>{title}</h1>

      <p>{content}</p>
    </div>
  )
}

export default Article
