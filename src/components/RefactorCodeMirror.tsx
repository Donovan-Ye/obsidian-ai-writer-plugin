import CodeMirror from '@uiw/react-codemirror'
import { okaidia } from '@uiw/codemirror-theme-okaidia'

function RefactorCodeMirror(props: React.ComponentProps<typeof CodeMirror>) {
  // Generate a unique id for each CodeMirror instance. Use Date is a simple way XD.
  const wrapperId = `ai-writer-plugin-CM-${Date.now()}`
  return (
    <div id={wrapperId} className="refactored-CM">
      <CodeMirror
        onCreateEditor={() => {
          const cmContent = document.querySelector(`#${wrapperId} .cm-content`)
          if (cmContent) {
            const wrapper = document.createElement('div')

            wrapper.className = 'refactored-CM-wrapper'

            cmContent.parentNode?.insertBefore(wrapper, cmContent)
            wrapper.appendChild(cmContent)
          }
        }}
        theme={okaidia}
        {...props}
      />
    </div>
  )
}

export default RefactorCodeMirror
