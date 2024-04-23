function ObsidianButton({ children, className, ...restProps }: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`mod-cta ${className}`}
      {...restProps}
    >
      {children}
    </button>
  )
}

export default ObsidianButton
