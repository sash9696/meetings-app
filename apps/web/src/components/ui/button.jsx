const variantClass = {
  default: 'btn',
  secondary: 'btn btn--secondary',
  ghost: 'btn btn--ghost',
}

function joinClasses(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function Button({
  className = '',
  variant = 'default',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={joinClasses(variantClass[variant] || variantClass.default, className)}
      {...props}
    />
  )
}
