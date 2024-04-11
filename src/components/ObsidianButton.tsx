function ObsidianButton({ children, ...restProps }: React.PropsWithChildren<any>) {
  return (
    <button
      className="mod-cta"
      {...restProps}
    >
      {children}
    </button>
  )
}

export default ObsidianButton
