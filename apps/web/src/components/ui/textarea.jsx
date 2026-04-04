function joinClasses(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={joinClasses('textarea', className)} {...props} />
}
