function joinClasses(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function Input({ className = '', ...props }) {
  return <input className={joinClasses('input', className)} {...props} />
}
