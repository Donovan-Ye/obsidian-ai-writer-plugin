import CodeMirror from '@uiw/react-codemirror'
import { okaidia } from '@uiw/codemirror-theme-okaidia'

function RefactorCodeMirror(props: React.ComponentProps<typeof CodeMirror>) {
  return (
    <div id="ai-writer-plugin">
      <CodeMirror
        maxHeight="87vh"
        onCreateEditor={
          () => {
            const cmContent = document.querySelector('#ai-writer-plugin .cm-content')
            if (cmContent) {
              (cmContent as HTMLElement).style.whiteSpace = 'break-spaces';
              (cmContent as HTMLElement).style.wordBreak = 'break-word';
              (cmContent as HTMLElement).style.overflowWrap = 'anywhere'

              const wrapper = document.createElement('div')
              wrapper.style.display = 'flex'
              wrapper.style.flexDirection = 'column'
              wrapper.style.alignItems = 'stretch'
              wrapper.style.width = '100%'
              wrapper.style.minHeight = '100%'

              cmContent.parentNode?.insertBefore(wrapper, cmContent)
              wrapper.appendChild(cmContent)
            }
          }
        }
        theme={okaidia}
        {...props}
      />
    </div>
  )
}

export default RefactorCodeMirror
